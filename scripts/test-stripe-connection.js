const Stripe = require('stripe');
require('dotenv').config({ path: '.env.local' });

async function testStripeConnection() {
  console.log('🔍 Stripeテスト接続を開始...\n');
  
  try {
    const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
    
    // アカウント情報を取得
    const account = await stripe.accounts.retrieve();
    console.log('✅ Stripe接続成功！');
    console.log('アカウントID:', account.id);
    
    // テスト用のチェックアウトセッションを作成
    console.log('\n📝 テストチェックアウトセッションを作成中...');
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'jpy',
          product_data: {
            name: 'テスト商品',
            description: 'これはテスト用の商品です',
          },
          unit_amount: 1000,
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: 'http://localhost:3000/success',
      cancel_url: 'http://localhost:3000/cancel',
    });
    
    console.log('✅ チェックアウトセッション作成成功！');
    console.log('セッションID:', session.id);
    console.log('チェックアウトURL:', session.url);
    
  } catch (error) {
    console.error('\n❌ エラーが発生しました:');
    console.error('エラーメッセージ:', error.message);
    
    if (error.type === 'StripeAuthenticationError') {
      console.error('\n💡 認証エラー: APIキーが無効または間違っています');
      console.error('1. Stripeダッシュボードで新しいテストキーを取得してください');
      console.error('2. .env.localファイルのSTRIPE_SECRET_KEYを更新してください');
    } else if (error.type === 'StripePermissionError') {
      console.error('\n💡 権限エラー: このAPIキーには必要な権限がありません');
    }
  }
}

testStripeConnection();