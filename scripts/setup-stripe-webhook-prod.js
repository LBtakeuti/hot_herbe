const Stripe = require('stripe');
require('dotenv').config({ path: '.env.local' });

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

async function setupProductionWebhook() {
  console.log('🔧 本番環境用Stripe Webhookの設定を開始します...\n');

  try {
    const webhookUrl = 'https://hotherbe-73309g8kd-land-bridge.vercel.app/api/webhook/stripe';

    console.log(`📍 Webhook URL: ${webhookUrl}`);
    
    // 既存のWebhookエンドポイントをチェック
    const existingEndpoints = await stripe.webhookEndpoints.list({ limit: 100 });
    
    // 同じURLのエンドポイントが既に存在するか確認
    const existingEndpoint = existingEndpoints.data.find(
      endpoint => endpoint.url === webhookUrl
    );

    if (existingEndpoint) {
      console.log('\n⚠️  既存のWebhookエンドポイントが見つかりました');
      console.log(`   ID: ${existingEndpoint.id}`);
      console.log(`   状態: ${existingEndpoint.status}`);
      
      // 既存のエンドポイントを更新
      const updatedEndpoint = await stripe.webhookEndpoints.update(
        existingEndpoint.id,
        {
          enabled_events: [
            'checkout.session.completed',
            'payment_intent.succeeded',
            'payment_intent.payment_failed',
            'charge.refunded',
            'customer.created',
            'customer.updated'
          ]
        }
      );
      
      console.log('\n✅ Webhookエンドポイントを更新しました');
      console.log(`\n🔑 Webhook Secret: ${existingEndpoint.secret}`);
      console.log('\n⚠️  この値を以下の場所に設定してください:');
      console.log('   1. .env.local の STRIPE_WEBHOOK_SECRET');
      console.log('   2. VercelのEnvironment Variables');
      
      return updatedEndpoint;
    }

    // 新しいWebhookエンドポイントを作成
    console.log('\n📝 新しいWebhookエンドポイントを作成中...');
    
    const endpoint = await stripe.webhookEndpoints.create({
      url: webhookUrl,
      enabled_events: [
        'checkout.session.completed',
        'payment_intent.succeeded',
        'payment_intent.payment_failed', 
        'charge.refunded',
        'customer.created',
        'customer.updated'
      ],
      description: 'HOT Herbe Vercel production webhook'
    });

    console.log('\n✅ Webhookエンドポイントが作成されました！');
    console.log('\n📊 エンドポイント情報:');
    console.log(`   ID: ${endpoint.id}`);
    console.log(`   URL: ${endpoint.url}`);
    console.log(`   状態: ${endpoint.status}`);
    console.log(`   イベント: ${endpoint.enabled_events.join(', ')}`);
    
    console.log('\n🔑 重要: Webhook Secret');
    console.log(`   ${endpoint.secret}`);
    console.log('\n⚠️  この値を以下の場所に設定してください:');
    console.log('   1. .env.local の STRIPE_WEBHOOK_SECRET を更新');
    console.log('   2. Vercelの環境変数を更新:');
    console.log(`      echo "${endpoint.secret}" | npx vercel env add STRIPE_WEBHOOK_SECRET production`);
    
    return endpoint;

  } catch (error) {
    console.error('\n❌ エラーが発生しました:');
    console.error(`   ${error.message}`);
    process.exit(1);
  }
}

// 実行
setupProductionWebhook();