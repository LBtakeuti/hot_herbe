const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function setupDatabase() {
  console.log('🔧 データベースのセットアップを開始します...\n')

  try {
    // テーブルの存在を確認
    const { data: tables, error: tablesError } = await supabase
      .from('orders')
      .select('id')
      .limit(1)

    if (tablesError && tablesError.message.includes('relation "public.orders" does not exist')) {
      console.log('📝 テーブルが存在しません。作成を開始します...')
      
      // SQLファイルを読み込み
      const fs = require('fs')
      const path = require('path')
      const sqlContent = fs.readFileSync(
        path.join(__dirname, '..', 'supabase', 'migrations', '001_create_tables.sql'),
        'utf8'
      )

      console.log('⚠️  以下のSQLをSupabaseのSQL Editorで実行してください:\n')
      console.log('1. https://supabase.com/dashboard にアクセス')
      console.log('2. プロジェクトを選択')
      console.log('3. SQL Editor タブを開く')
      console.log('4. 以下のSQLを貼り付けて実行:\n')
      console.log('------- SQL START -------')
      console.log(sqlContent)
      console.log('------- SQL END -------\n')
      
      console.log('✅ SQLを実行したら、管理画面からデータを確認できます')
    } else if (tablesError) {
      console.error('❌ エラー:', tablesError.message)
    } else {
      console.log('✅ テーブルは既に存在します')
      
      // 注文数を確認
      const { count: ordersCount } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
      
      console.log(`📊 現在の注文数: ${ordersCount || 0}件`)
      
      // 顧客数を確認
      const { count: customersCount } = await supabase
        .from('customers')
        .select('*', { count: 'exact', head: true })
      
      console.log(`👥 現在の顧客数: ${customersCount || 0}人`)
      
      // 商品を確認
      const { data: products } = await supabase
        .from('products')
        .select('*')
      
      if (products && products.length > 0) {
        console.log('\n📦 登録済み商品:')
        products.forEach(product => {
          console.log(`  - ${product.name}: ¥${product.price}`)
        })
      }
    }

    console.log('\n🔗 管理画面URL:')
    console.log('  ローカル: http://localhost:3000/admin')
    console.log('  本番環境: https://hotherbe-73309g8kd-land-bridge.vercel.app/admin')
    
    console.log('\n📝 デモアカウント:')
    console.log('  メール: demo@example.com')
    console.log('  パスワード: demo1234')

  } catch (error) {
    console.error('❌ エラーが発生しました:', error.message)
  }
}

setupDatabase()