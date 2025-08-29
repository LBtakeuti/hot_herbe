const Stripe = require('stripe');
require('dotenv').config({ path: '.env.local' });

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

async function setupWebhook() {
  console.log('🔧 Stripe Webhookの設定を開始します...\n');

  try {
    // 本番環境のURLを確認
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const webhookUrl = `${appUrl}/api/webhook/stripe`;

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
      console.log('\n⚠️  この値を .env.local の STRIPE_WEBHOOK_SECRET に設定してください');
      
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
      description: 'HOT Herbe production webhook'
    });

    console.log('\n✅ Webhookエンドポイントが作成されました！');
    console.log('\n📊 エンドポイント情報:');
    console.log(`   ID: ${endpoint.id}`);
    console.log(`   URL: ${endpoint.url}`);
    console.log(`   状態: ${endpoint.status}`);
    console.log(`   イベント: ${endpoint.enabled_events.join(', ')}`);
    
    console.log('\n🔑 重要: Webhook Secret');
    console.log(`   ${endpoint.secret}`);
    console.log('\n⚠️  この値を .env.local ファイルの STRIPE_WEBHOOK_SECRET に設定してください');
    console.log('   例: STRIPE_WEBHOOK_SECRET=' + endpoint.secret);
    
    // .env.local の更新方法を案内
    console.log('\n📝 設定手順:');
    console.log('   1. .env.local ファイルを開く');
    console.log('   2. STRIPE_WEBHOOK_SECRET の値を上記の値に更新');
    console.log('   3. Next.js サーバーを再起動');
    
    return endpoint;

  } catch (error) {
    console.error('\n❌ エラーが発生しました:');
    console.error(`   ${error.message}`);
    
    if (error.type === 'StripePermissionError') {
      console.error('\n💡 権限エラーの解決方法:');
      console.error('   1. Stripeダッシュボードにログイン');
      console.error('   2. APIキーが正しい権限を持っているか確認');
      console.error('   3. 本番環境のキーを使用しているか確認');
    }
    
    process.exit(1);
  }
}

// ローカル環境用のテストWebhook設定
async function setupLocalTestWebhook() {
  console.log('\n🧪 ローカルテスト用の設定情報:');
  console.log('   Stripe CLIを使用してローカル環境でWebhookをテストできます');
  console.log('\n   1. Stripe CLIをインストール:');
  console.log('      brew install stripe/stripe-cli/stripe');
  console.log('\n   2. ログイン:');
  console.log('      stripe login');
  console.log('\n   3. Webhookイベントを転送:');
  console.log('      stripe listen --forward-to localhost:3000/api/webhook/stripe');
  console.log('\n   4. 表示されたWebhook Secretを .env.local に設定');
}

// メイン実行
async function main() {
  // 本番環境のURLが設定されているか確認
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  
  if (!appUrl || appUrl.includes('localhost')) {
    console.log('⚠️  ローカル環境が検出されました');
    console.log('   本番環境のURLを設定するには、.env.localに以下を追加してください:');
    console.log('   NEXT_PUBLIC_APP_URL=https://your-domain.com');
    
    await setupLocalTestWebhook();
    
    console.log('\n❓ 本番環境用のWebhookを設定しますか？ (y/n)');
    
    // プログラムで自動的に進める場合はコメントアウト
    // const readline = require('readline').createInterface({
    //   input: process.stdin,
    //   output: process.stdout
    // });
    
    // readline.question('', async (answer) => {
    //   if (answer.toLowerCase() === 'y') {
    //     await setupWebhook();
    //   }
    //   readline.close();
    // });
    
    // 自動的に設定を進める
    console.log('\n📝 Webhookエンドポイントの作成をスキップしました');
    console.log('   本番環境のURLが設定されたら、再度このスクリプトを実行してください');
    
  } else {
    await setupWebhook();
  }
}

main();