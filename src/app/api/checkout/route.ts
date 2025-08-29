import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      productId,
      quantity,
      customerEmail,
      customerName,
      customerPhone,
      shippingAddress,
    } = body

    // Get product details from Supabase
    const { data: product, error: productError } = await supabaseAdmin
      .from('products')
      .select('*')
      .eq('id', productId)
      .single()

    if (productError || !product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // Calculate amounts
    const unitPrice = product.price
    const subtotal = unitPrice * quantity
    const shippingFee = 0 // 送料無料
    const taxRate = 0.1 // 10% tax
    const taxAmount = Math.round(subtotal * taxRate)
    const totalAmount = subtotal + shippingFee + taxAmount

    // Create or get customer in database
    const { data: existingCustomer } = await supabaseAdmin
      .from('customers')
      .select('*')
      .eq('email', customerEmail)
      .single()

    let customerId = existingCustomer?.id

    if (!existingCustomer) {
      const { data: newCustomer, error: customerError } = await supabaseAdmin
        .from('customers')
        .insert({
          email: customerEmail,
          name: customerName,
          phone: customerPhone,
          default_shipping_address: shippingAddress,
        })
        .select()
        .single()

      if (customerError) {
        console.error('Error creating customer:', customerError)
        return NextResponse.json(
          { error: 'Failed to create customer' },
          { status: 500 }
        )
      }
      customerId = newCustomer.id
    }

    // Create order in database
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .insert({
        customer_email: customerEmail,
        customer_name: customerName,
        customer_phone: customerPhone,
        shipping_address: shippingAddress,
        product_id: productId,
        product_name: product.name,
        quantity: quantity,
        unit_price: unitPrice,
        total_amount: totalAmount,
        shipping_fee: shippingFee,
        tax_amount: taxAmount,
        status: 'pending',
        payment_status: 'pending',
      })
      .select()
      .single()

    if (orderError) {
      console.error('Error creating order:', orderError)
      return NextResponse.json(
        { error: 'Failed to create order' },
        { status: 500 }
      )
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'jpy',
            product_data: {
              name: product.name,
              description: product.description || '',
            },
            unit_amount: unitPrice,
          },
          quantity: quantity,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/purchase/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/purchase?canceled=true`,
      customer_email: customerEmail,
      metadata: {
        orderId: order.id,
        customerId: customerId,
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: {
              amount: 0,
              currency: 'jpy',
            },
            display_name: '送料無料',
          },
        },
      ],
    })

    // Update order with Stripe session ID
    await supabaseAdmin
      .from('orders')
      .update({
        stripe_checkout_session_id: session.id,
      })
      .eq('id', order.id)

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    })
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}