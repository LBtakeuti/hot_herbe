import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { stripe } from '@/lib/stripe/server'
import { createClient } from '@supabase/supabase-js'
import Stripe from 'stripe'

// Supabaseクライアントの初期化（サービスロールキーを使用）
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = headers().get('stripe-signature')

  if (!signature) {
    console.error('No stripe signature found')
    return NextResponse.json(
      { error: 'No stripe signature found' },
      { status: 400 }
    )
  }

  let event: Stripe.Event

  try {
    // Webhookの署名を検証
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`)
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    )
  }

  // 重複処理を防ぐため、イベントIDをチェック
  const { data: existingEvent } = await supabase
    .from('webhook_events')
    .select('id')
    .eq('stripe_event_id', event.id)
    .single()

  if (existingEvent) {
    console.log(`Event ${event.id} already processed`)
    return NextResponse.json({ received: true })
  }

  // イベントを記録
  await supabase.from('webhook_events').insert({
    stripe_event_id: event.id,
    event_type: event.type,
    payload: event,
    processed: false
  })

  try {
    // イベントタイプに応じて処理
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        
        // 注文情報を作成
        const orderData = {
          stripe_checkout_session_id: session.id,
          stripe_payment_intent_id: session.payment_intent as string,
          customer_email: session.customer_details?.email || '',
          customer_name: session.customer_details?.name || '',
          customer_phone: session.customer_details?.phone || '',
          shipping_address: session.shipping_details?.address || {},
          product_id: session.metadata?.productId || 'hot_herbe_30days',
          product_name: session.metadata?.productName || 'HOT HERBE',
          quantity: 1,
          unit_price: (session.amount_total || 0) / 100,
          total_amount: (session.amount_total || 0) / 100,
          shipping_fee: 0,
          tax_amount: 0,
          status: 'confirmed',
          payment_status: 'paid',
          shipping_status: 'pending',
          metadata: session.metadata || {}
        }

        // 注文をデータベースに保存
        const { error: orderError } = await supabase
          .from('orders')
          .insert(orderData)

        if (orderError) {
          console.error('Failed to save order:', orderError)
          throw orderError
        }

        // 顧客情報を更新または作成
        const { data: existingCustomer } = await supabase
          .from('customers')
          .select('*')
          .eq('email', session.customer_details?.email)
          .single()

        if (existingCustomer) {
          // 既存顧客の情報を更新
          await supabase
            .from('customers')
            .update({
              total_orders: existingCustomer.total_orders + 1,
              total_spent: Number(existingCustomer.total_spent) + ((session.amount_total || 0) / 100),
              updated_at: new Date().toISOString()
            })
            .eq('email', session.customer_details?.email)
        } else {
          // 新規顧客を作成
          await supabase
            .from('customers')
            .insert({
              email: session.customer_details?.email || '',
              name: session.customer_details?.name || '',
              phone: session.customer_details?.phone || '',
              stripe_customer_id: session.customer as string,
              default_shipping_address: session.shipping_details?.address || {},
              total_orders: 1,
              total_spent: (session.amount_total || 0) / 100
            })
        }

        console.log('Order created successfully for session:', session.id)
        break
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        
        // 支払い成功時の処理
        await supabase
          .from('orders')
          .update({
            payment_status: 'paid',
            updated_at: new Date().toISOString()
          })
          .eq('stripe_payment_intent_id', paymentIntent.id)

        console.log('Payment succeeded for:', paymentIntent.id)
        break
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        
        // 支払い失敗時の処理
        await supabase
          .from('orders')
          .update({
            payment_status: 'failed',
            status: 'cancelled',
            updated_at: new Date().toISOString()
          })
          .eq('stripe_payment_intent_id', paymentIntent.id)

        console.log('Payment failed for:', paymentIntent.id)
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    // イベントを処理済みとしてマーク
    await supabase
      .from('webhook_events')
      .update({
        processed: true,
        processed_at: new Date().toISOString()
      })
      .eq('stripe_event_id', event.id)

  } catch (error: any) {
    console.error('Error processing webhook:', error)
    
    // エラーを記録
    await supabase
      .from('webhook_events')
      .update({
        error: error.message
      })
      .eq('stripe_event_id', event.id)

    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }

  return NextResponse.json({ received: true })
}