import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function Terms() {
  return (
    <div className="relative flex size-full min-h-screen flex-col bg-white justify-between overflow-x-hidden">
      <div>
        <Header />
        
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <h1 className="text-hot-herbe-dark text-3xl font-bold leading-tight tracking-[-0.015em] mb-8 text-center">
            ECサイト利用規約
          </h1>
          
          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-hot-herbe-dark text-xl font-bold mb-4">第1条（基本事項）</h2>
              <p className="text-hot-herbe-dark text-base leading-relaxed mb-4">
                本規約は、当社のECサイト利用に関する条件を定めています。ご利用前に必ずお読みください。
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-hot-herbe-dark text-xl font-bold mb-4">第2条（会員登録）</h2>
              <ul className="list-disc pl-6 mb-4 text-hot-herbe-dark text-base leading-relaxed">
                <li>正確な情報でご登録ください</li>
                <li>虚偽登録や不正利用の場合、アカウントを停止します</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-hot-herbe-dark text-xl font-bold mb-4">第3条（注文・購入）</h2>
              <ul className="list-disc pl-6 mb-4 text-hot-herbe-dark text-base leading-relaxed">
                <li>サイト上で注文手続きを完了すると売買契約が成立します</li>
                <li>注文確認メールをお送りします</li>
                <li>価格は税込価格、送料は別途かかる場合があります</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-hot-herbe-dark text-xl font-bold mb-4">第4条（支払方法）</h2>
              <p className="text-hot-herbe-dark text-base leading-relaxed mb-2">
                以下の方法でお支払いいただけます：
              </p>
              <ul className="list-disc pl-6 mb-4 text-hot-herbe-dark text-base leading-relaxed">
                <li>クレジットカード</li>
                <li>銀行振込</li>
                <li>代金引換</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-hot-herbe-dark text-xl font-bold mb-4">第5条（配送）</h2>
              <ul className="list-disc pl-6 mb-4 text-hot-herbe-dark text-base leading-relaxed">
                <li>注文確定後、3〜7営業日で発送します</li>
                <li>配送は日本国内のみです</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-hot-herbe-dark text-xl font-bold mb-4">第6条（返品・交換）</h2>
              <ul className="list-disc pl-6 mb-4 text-hot-herbe-dark text-base leading-relaxed">
                <li>商品到着後7日以内、未使用品のみ返品可能</li>
                <li>お客様都合の返品は送料お客様負担</li>
                <li>不良品は当社負担で交換いたします</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-hot-herbe-dark text-xl font-bold mb-4">第7条（禁止事項）</h2>
              <p className="text-hot-herbe-dark text-base leading-relaxed mb-2">
                以下の行為は禁止します：
              </p>
              <ul className="list-disc pl-6 mb-4 text-hot-herbe-dark text-base leading-relaxed">
                <li>虚偽情報の登録</li>
                <li>サイトの不正利用</li>
                <li>他のお客様への迷惑行為</li>
                <li>法令違反行為</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-hot-herbe-dark text-xl font-bold mb-4">第8条（個人情報）</h2>
              <p className="text-hot-herbe-dark text-base leading-relaxed mb-4">
                お客様の個人情報は、プライバシーポリシーに従って適切に管理いたします。
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-hot-herbe-dark text-xl font-bold mb-4">第9条（免責事項）</h2>
              <ul className="list-disc pl-6 mb-4 text-hot-herbe-dark text-base leading-relaxed">
                <li>システムメンテナンス等でサービスを一時停止する場合があります</li>
                <li>当社に故意・重過失がない限り、損害の責任は負いません</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-hot-herbe-dark text-xl font-bold mb-4">第10条（規約変更）</h2>
              <p className="text-hot-herbe-dark text-base leading-relaxed mb-4">
                必要に応じて本規約を変更する場合があります。変更時はサイト上でお知らせします。
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-hot-herbe-dark text-xl font-bold mb-4">お問い合わせ</h2>
              <p className="text-hot-herbe-dark text-base leading-relaxed mb-4">
                ご不明な点がございましたら、お気軽にお問い合わせください。
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-hot-herbe-dark text-base leading-relaxed">
                  <strong>HOT HERBE株式会社</strong><br />
                  〒150-0001 東京都渋谷区神宮前1-1-1<br />
                  メール: support@hotherbe.com<br />
                  電話: 03-1234-5678
                </p>
              </div>
            </section>

            <section className="text-center mt-12">
              <p className="text-hot-herbe-dark text-sm">
                制定日：2024年1月1日<br />
                最終改訂日：2025年7月16日
              </p>
            </section>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}