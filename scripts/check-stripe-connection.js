const Stripe = require('stripe');

console.log('🔍 Stripe接続チェックを開始します...\n');

// 環境変数のチェック
const requiredEnvVars = [
  'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
  'STRIPE_SECRET_KEY',
  'STRIPE_WEBHOOK_SECRET'
];

let allEnvVarsPresent = true;

console.log('📋 環境変数の確認:');
requiredEnvVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    // 値の一部を隠して表示
    const maskedValue = value.substring(0, 10) + '...' + value.substring(value.length - 4);
    console.log(`  ✅ ${varName}: ${maskedValue}`);
  } else {
    console.log(`  ❌ ${varName}: 未設定`);
    allEnvVarsPresent = false;
  }
});

console.log('\n');

if (!allEnvVarsPresent) {
  console.log('⚠️  必要な環境変数が設定されていません。');
  console.log('   .env.localファイルを確認してください。');
  process.exit(1);
}

// Stripe接続テスト
async function testStripeConnection() {
  try {
    console.log('🔗 Stripe APIへの接続テスト中...');
    
    const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
    
    // アカウント情報の取得を試みる
    const account = await stripe.accounts.retrieve();
    
    console.log('\n✅ Stripe接続成功！');
    console.log('📊 アカウント情報:');
    console.log(`  - アカウントID: ${account.id}`);
    console.log(`  - ビジネス名: ${account.business_profile?.name || '未設定'}`);
    console.log(`  - 国: ${account.country}`);
    console.log(`  - デフォルト通貨: ${account.default_currency}`);
    
    // 最近の支払い意図をチェック（オプション）
    const paymentIntents = await stripe.paymentIntents.list({ limit: 1 });
    console.log(`\n📈 最近の支払い: ${paymentIntents.data.length > 0 ? 'あり' : 'なし'}`);
    
    // Webhookエンドポイントの確認
    try {
      const webhookEndpoints = await stripe.webhookEndpoints.list({ limit: 10 });
      console.log(`\n🔔 Webhookエンドポイント: ${webhookEndpoints.data.length}個設定済み`);
      
      if (webhookEndpoints.data.length > 0) {
        webhookEndpoints.data.forEach(endpoint => {
          console.log(`  - ${endpoint.url}`);
          console.log(`    状態: ${endpoint.status}`);
          console.log(`    イベント: ${endpoint.enabled_events.join(', ').substring(0, 50)}...`);
        });
      }
    } catch (webhookError) {
      console.log('\n⚠️  Webhookエンドポイントの確認に失敗（権限不足の可能性）');
    }
    
    console.log('\n✨ Stripe統合は正常に設定されています！');
    
  } catch (error) {
    console.error('\n❌ Stripe接続エラー:');
    console.error(`   ${error.message}`);
    console.error('\n💡 解決方法:');
    console.error('   1. STRIPE_SECRET_KEYが正しく設定されているか確認');
    console.error('   2. Stripeダッシュボードでキーが有効か確認');
    console.error('   3. インターネット接続を確認');
    process.exit(1);
  }
}

// テスト実行
testStripeConnection();