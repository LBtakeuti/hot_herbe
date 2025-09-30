import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function Terms() {
  return (
    <div className="relative flex size-full min-h-screen flex-col bg-white justify-between overflow-x-hidden">
      <div>
        <Header />
        
        <div className="container mx-auto px-4 py-8 max-w-4xl" style={{ fontFamily: '"MS Mincho", "ＭＳ 明朝", serif' }}>
          <h1 className="text-hot-herbe-dark text-3xl font-bold leading-tight tracking-[-0.015em] mb-8 text-center">
            特定商取引法に基づく表記
          </h1>
          
          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-hot-herbe-dark text-xl font-bold mb-4">1. 販売業者の名称</h2>
              <p className="text-hot-herbe-dark text-base mb-4">
                landbridge株式会社
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-hot-herbe-dark text-xl font-bold mb-4">2. 所在地</h2>
              <p className="text-hot-herbe-dark text-base mb-2">
                事業所の住所（登記簿上の住所）
              </p>
              <p className="text-hot-herbe-dark text-base mb-4">
                〒343-0827 埼玉県越谷市川柳町2丁目401
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-hot-herbe-dark text-xl font-bold mb-4">3. 電話番号</h2>
              <p className="text-hot-herbe-dark text-base mb-2">
                070-9134-3208
              </p>
              <p className="text-hot-herbe-dark text-base mb-4">
                受付時間 10:00-18:00（土日祝を除く）
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-hot-herbe-dark text-xl font-bold mb-4">4. メールアドレス</h2>
              <p className="text-hot-herbe-dark text-base mb-4">
                sales@landbridge.co.jp
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-hot-herbe-dark text-xl font-bold mb-4">5. 運営統括責任者</h2>
              <p className="text-hot-herbe-dark text-base mb-4">
                三森　一輝
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-hot-herbe-dark text-xl font-bold mb-4">6. 追加手数料等の追加料金</h2>
              <p className="text-hot-herbe-dark text-base mb-4">
                配送料（一律<span className="font-inter">550円</span>/箱）
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-hot-herbe-dark text-xl font-bold mb-4">7. 交換および返品（返金ポリシー）</h2>
              <p className="text-hot-herbe-dark text-base mb-4">
                発送処理後の商品：未開封の商品は、商品到着後 10 日以内にお客様サポートセンター（電話番号：070-9134-3208 ）にご連絡いただいた場合に限り、お客様の送料負担にて返金又は同様の商品と交換いたします。開封後の商品は、返品・交換はお受けしておりません。<br />
                注文後のキャンセルは致しかねますのでご了承ください。
              </p>
              
              <h3 className="text-hot-herbe-dark text-lg font-bold mb-3">お客様都合の返品・交換の場合</h3>
              
              <p className="text-hot-herbe-dark text-base mb-2">
                <strong>発送処理後の商品：</strong>
              </p>
              <ul className="list-disc pl-6 mb-4 text-hot-herbe-dark text-base">
                <li>未開封の商品は、商品到着後10日以内にお客様サポートセンター（電話番号：070-9134-3208）にご連絡いただいた場合に限り、お客様の送料負担にて返金又は同額以下の商品と交換いたします</li>
                <li>開封後の商品は、返品・交換はお受けしておりません</li>
                <li>注文後のキャンセルは致しかねます。ご了承ください。</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-hot-herbe-dark text-xl font-bold mb-4">8. 引渡時期</h2>
              <p className="text-hot-herbe-dark text-base mb-4">
                注文は１週間以内に処理され、商品は14日以内に到着します / 注文後すぐにご利用いただけます。
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-hot-herbe-dark text-xl font-bold mb-4">9. 受け付け可能な決済手段</h2>
              <p className="text-hot-herbe-dark text-base mb-4">
                クレジットカードまたは国内の銀行振込
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-hot-herbe-dark text-xl font-bold mb-4">10. 決済期間</h2>
              <p className="text-hot-herbe-dark text-base mb-2">
                顧客が商品購入代金を支払う時期
              </p>
              <p className="text-hot-herbe-dark text-base mb-4">
                クレジットカード決済の場合はただちに処理されますが、国内の銀行振込の場合は注文から3日以内にお振り込みいただく必要があります
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-hot-herbe-dark text-xl font-bold mb-4">11. 販売価格</h2>
              <p className="text-hot-herbe-dark text-base mb-2">
                1個<span className="font-inter">6,980円</span>（税込）<br />
                2個セット<span className="font-inter">12,000円</span>（税込）<br />
                3個セット<span className="font-inter">16,000円</span>（税込）
              </p>
            </section>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}