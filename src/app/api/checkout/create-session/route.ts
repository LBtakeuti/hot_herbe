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
    
    // Mock mode for local verification without Stripe network calls
    if (process.env.STRIPE_MOCK === '1') {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
      return NextResponse.json({
        sessionId: 'cs_test_mocked',
        url: `${baseUrl}/purchase/success?session_id=cs_test_mocked`,
      }, {
        headers: { 'Access-Control-Allow-Origin': '*' }
      })
    }
    
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
    

    // Define product config. Prefer Price IDs; alternatively set Product IDs
    // and the default Price will be resolved at runtime.
    const products: Record<string, { name: string; description: string; priceId?: string; productId?: string }> = {
      'hot_herbe_30days': {
        name: 'HOT HERBE 温感クリーム 単品1個',
        description: 'HOT HERBE 温感ボディクリーム 1個（30日分）',
        priceId: process.env.STRIPE_PRICE_30DAYS,
        productId: process.env.STRIPE_PRODUCT_30DAYS,
      },
      'hot_herbe_90days': {
        name: 'HOT HERBE 温感クリーム 2個セット',
        description: 'HOT HERBE 温感ボディクリーム 2個セット（60日分）14%お得',
        priceId: process.env.STRIPE_PRICE_90DAYS,
        productId: process.env.STRIPE_PRODUCT_90DAYS,
      },
      'hot_herbe_180days': {
        name: 'HOT HERBE 温感クリーム 3個セット',
        description: 'HOT HERBE 温感ボディクリーム 3個セット（90日分）24%お得',
        priceId: process.env.STRIPE_PRICE_180DAYS,
        productId: process.env.STRIPE_PRODUCT_180DAYS,
      },
    }

    const product = products[productId]
    if (!product) {
      return NextResponse.json(
        { error: 'Invalid product' },
        { status: 400 }
      )
    }

    // Resolve Price ID: prefer explicit Price ID; otherwise try product.default_price
    let resolvedPriceId: string | undefined = product.priceId
    if (!resolvedPriceId && product.productId) {
      try {
        const p = await stripe.products.retrieve(product.productId)
        const defaultPrice = p.default_price
        if (typeof defaultPrice === 'string') {
          resolvedPriceId = defaultPrice
        } else if (defaultPrice && typeof defaultPrice === 'object' && 'id' in defaultPrice) {
          resolvedPriceId = (defaultPrice as any).id
        } else {
          // Fallback: pick the first active price for the product
          const prices = await stripe.prices.list({ product: product.productId, active: true, limit: 1 })
          resolvedPriceId = prices.data[0]?.id
        }
      } catch (e) {
        return NextResponse.json(
          { error: 'Failed to resolve price for product' },
          { status: 500 }
        )
      }
    }

    if (!resolvedPriceId) {
      return NextResponse.json(
        { error: 'Missing Stripe Price ID. Set STRIPE_PRICE_* or STRIPE_PRODUCT_* with default price.' },
        { status: 400 }
      )
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: resolvedPriceId,
          quantity,
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
              amount: 550,
              currency: 'jpy',
            },
            display_name: '配送料（全国一律）',
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
        productName: product.name,
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
