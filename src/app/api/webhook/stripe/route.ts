import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { stripe } from '@/lib/stripe/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import Stripe from 'stripe'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = headers().get('stripe-signature') as string

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (error: any) {
    console.error('Webhook signature verification failed:', error.message)
    return NextResponse.json(
      { error: `Webhook Error: ${error.message}` },
      { status: 400 }
    )
  }

  // Store webhook event
  await supabaseAdmin.from('webhook_events').insert({
    stripe_event_id: event.id,
    event_type: event.type,
    payload: event as any,
    processed: false,
  })

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        
        console.log('Processing checkout.session.completed:', session.id)
        
        // セッション詳細を取得
        const fullSession = await stripe.checkout.sessions.retrieve(session.id, {
          expand: ['line_items', 'customer_details']
        })
        
        // 顧客情報を取得
        const customerDetails = fullSession.customer_details
        const lineItems = fullSession.line_items?.data[0]
        
        // メタデータから商品IDを取得
        const productId = fullSession.metadata?.productId || 'hot_herbe_30days'
        
        // 商品名と価格を取得
        const productName = lineItems?.description || 'HOT HERBE 温感クリーム'
        const quantity = lineItems?.quantity || 1
        const totalAmount = fullSession.amount_total || 0
        
        // 新しい注文を作成
        const { data: newOrder, error: createOrderError } = await supabaseAdmin
          .from('orders')
          .insert({
            stripe_checkout_session_id: session.id,
            stripe_payment_intent_id: session.payment_intent as string,
            customer_email: customerDetails?.email || session.customer_email || '',
            customer_name: customerDetails?.name || '未設定',
            customer_phone: customerDetails?.phone || '',
            shipping_address: customerDetails?.address ? JSON.stringify({
              line1: customerDetails.address.line1,
              line2: customerDetails.address.line2,
              city: customerDetails.address.city,
              state: customerDetails.address.state,
              postal_code: customerDetails.address.postal_code,
              country: customerDetails.address.country
            }) : '{}',
            product_id: productId,
            product_name: productName,
            quantity: quantity,
            unit_price: totalAmount / quantity,
            total_amount: totalAmount / 100, // Stripeは cents で返すので円に変換
            shipping_fee: 0,
            tax_amount: 0,
            status: 'confirmed',
            payment_status: 'paid',
            // payment_method カラムが存在しない場合はコメントアウト
            // payment_method: session.payment_method_types?.[0] || 'card',
            metadata: {
              payment_method: session.payment_method_types?.[0] || 'card',
              stripe_session_id: session.id,
              payment_completed_at: new Date().toISOString(),
            },
          })
          .select()
          .single()
        
        if (createOrderError) {
          console.error('Error creating order:', createOrderError)
          throw createOrderError
        }
        
        console.log('Order created successfully:', newOrder?.id)
        
        // 顧客情報を更新または作成
        if (newOrder && customerDetails?.email) {
          const { data: existingCustomer } = await supabaseAdmin
            .from('customers')
            .select('*')
            .eq('email', customerDetails.email)
            .single()
          
          if (existingCustomer) {
            // 既存顧客の統計を更新
            await supabaseAdmin
              .from('customers')
              .update({
                total_orders: existingCustomer.total_orders + 1,
                total_spent: existingCustomer.total_spent + (totalAmount / 100),
                updated_at: new Date().toISOString()
              })
              .eq('id', existingCustomer.id)
          } else {
            // 新規顧客を作成
            await supabaseAdmin
              .from('customers')
              .insert({
                email: customerDetails.email,
                name: customerDetails.name || '未設定',
                phone: customerDetails.phone || '',
                default_shipping_address: customerDetails.address ? {
                  line1: customerDetails.address.line1,
                  line2: customerDetails.address.line2,
                  city: customerDetails.address.city,
                  state: customerDetails.address.state,
                  postal_code: customerDetails.address.postal_code,
                  country: customerDetails.address.country
                } : null,
                total_orders: 1,
                total_spent: totalAmount / 100
              })
          }
        }

        break
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        
        // Create or update payment intent record
        await supabaseAdmin
          .from('payment_intents')
          .upsert({
            stripe_payment_intent_id: paymentIntent.id,
            amount: paymentIntent.amount / 100, // Convert from cents to yen
            currency: paymentIntent.currency,
            status: paymentIntent.status,
            metadata: paymentIntent.metadata,
          })

        break
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        
        // Update order status
        await supabaseAdmin
          .from('orders')
          .update({
            payment_status: 'failed',
            status: 'failed',
            metadata: {
              failure_reason: paymentIntent.last_payment_error?.message,
              failed_at: new Date().toISOString(),
            },
          })
          .eq('stripe_payment_intent_id', paymentIntent.id)

        break
      }

      case 'charge.refunded': {
        const charge = event.data.object as Stripe.Charge
        
        // Update order status
        await supabaseAdmin
          .from('orders')
          .update({
            payment_status: 'refunded',
            status: 'refunded',
            metadata: {
              refunded_at: new Date().toISOString(),
              refund_amount: charge.amount_refunded / 100,
            },
          })
          .eq('stripe_payment_intent_id', charge.payment_intent as string)

        break
      }

      default:
        console.log(`Unhandled event type ${event.type}`)
    }

    // Mark webhook as processed
    await supabaseAdmin
      .from('webhook_events')
      .update({
        processed: true,
        processed_at: new Date().toISOString(),
      })
      .eq('stripe_event_id', event.id)

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook processing error:', error)
    
    // Mark webhook as failed
    await supabaseAdmin
      .from('webhook_events')
      .update({
        processed: true,
        processed_at: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
      })
      .eq('stripe_event_id', event.id)

    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}