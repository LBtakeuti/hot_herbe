import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe/server'

export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { productId, quantity = 1 } = body
    
    // 入力値検証
    if (!productId || typeof productId !== 'string') {
      return NextResponse.json(
        { error: 'Invalid product ID' },
        { status: 400 }
      )
    }
    
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 10) {
      return NextResponse.json(
        { error: 'Invalid quantity. Must be between 1 and 10.' },
        { status: 400 }
      )
    }
    

    // Define product prices
    const products: Record<string, { name: string; price: number; description: string }> = {
      'hot_herbe_30days': {
        name: 'HOT HERBE 温感クリーム 単品1個',
        price: 6980,
        description: 'HOT HERBE 温感ボディクリーム 1個（30日分）'
      },
      'hot_herbe_90days': {
        name: 'HOT HERBE 温感クリーム 2個セット',
        price: 12000,
        description: 'HOT HERBE 温感ボディクリーム 2個セット（60日分）14%お得'
      },
      'hot_herbe_180days': {
        name: 'HOT HERBE 温感クリーム 3個セット',
        price: 16000,
        description: 'HOT HERBE 温感ボディクリーム 3個セット（90日分）24%お得'
      }
    }

    const product = products[productId]
    if (!product) {
      return NextResponse.json(
        { error: 'Invalid product' },
        { status: 400 }
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
              description: product.description,
              // imagesは一時的にコメントアウト（localhostでは問題を起こす可能性がある）
              // images: [`${process.env.NEXT_PUBLIC_APP_URL}/product-image.webp`],
            },
            unit_amount: product.price,
          },
          quantity: quantity,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/purchase/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}?canceled=true`,
      billing_address_collection: 'required',
      shipping_address_collection: {
        allowed_countries: ['JP'],
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
            delivery_estimate: {
              minimum: {
                unit: 'business_day',
                value: 3,
              },
              maximum: {
                unit: 'business_day',
                value: 5,
              },
            },
          },
        },
      ],
      phone_number_collection: {
        enabled: true,
      },
      metadata: {
        productId: productId,
      },
      locale: 'ja',
    })
    
    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
      }
    })
  } catch (error: any) {
    const errorMessage = error?.message || 'Failed to create checkout session'
    return NextResponse.json(
      { 
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? error?.raw?.message : undefined
      },
      { status: 500 }
    )
  }
}