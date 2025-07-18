import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function Terms() {
  return (
    <div className="relative flex size-full min-h-screen flex-col bg-white justify-between overflow-x-hidden">
      <div>
        <Header />
        
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <h1 className="text-hot-herbe-dark text-3xl font-bold leading-tight tracking-[-0.015em] mb-8 text-center">
            特定商取引法に基づく表記
          </h1>
          
          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-hot-herbe-dark text-xl font-bold mb-4">1. 販売業者の名称</h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-hot-herbe-dark text-base leading-relaxed">
                  landbridge株式会社
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-hot-herbe-dark text-xl font-bold mb-4">2. 所在地</h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-hot-herbe-dark text-base leading-relaxed">
                  〒343-0856 埼玉県越谷市川柳町二丁目401
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-hot-herbe-dark text-xl font-bold mb-4">3. 電話番号</h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-hot-herbe-dark text-base leading-relaxed">
                  請求があったら遅滞なく開示します
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-hot-herbe-dark text-xl font-bold mb-4">4. メールアドレス</h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-hot-herbe-dark text-base leading-relaxed">
                  contact@hotherbe.com
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-hot-herbe-dark text-xl font-bold mb-4">5. 運営統括責任者</h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-hot-herbe-dark text-base leading-relaxed">
                  三森一輝
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-hot-herbe-dark text-xl font-bold mb-4">6. 追加手数料等の追加料金</h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-hot-herbe-dark text-base leading-relaxed">
                  配送料：全国一律600円（5,000円以上のご注文で送料無料）<br />
                  代金引換手数料：330円
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-hot-herbe-dark text-xl font-bold mb-4">7. 交換および返品（返金ポリシー）</h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-hot-herbe-dark text-lg font-bold mb-3">お客様都合の返品・交換の場合</h3>
                
                <div className="mb-4">
                  <h4 className="text-hot-herbe-dark text-base font-bold mb-2">発送処理前の商品：</h4>
                  <p className="text-hot-herbe-dark text-base leading-relaxed mb-4">
                    ウェブサイトのキャンセルボタンを押すことで注文のキャンセルが可能です
                  </p>
                </div>
                
                <div className="mb-4">
                  <h4 className="text-hot-herbe-dark text-base font-bold mb-2">発送処理後の商品：</h4>
                  <p className="text-hot-herbe-dark text-base leading-relaxed mb-2">
                    未開封の商品は、商品到着後10日以内にお客様サポートセンターにご連絡いただいた場合に限り、お客様の送料負担にて返金又は同額以下の商品と交換いたします
                  </p>
                  <p className="text-hot-herbe-dark text-base leading-relaxed mb-4">
                    開封後の商品は、返品・交換はお受けしておりません
                  </p>
                </div>
                
                <h3 className="text-hot-herbe-dark text-lg font-bold mb-3">商品に不備がある場合</h3>
                <p className="text-hot-herbe-dark text-base leading-relaxed">
                  当社の送料負担にて返金又は新しい商品と交換いたします。まずはお客様サポートセンターまでご連絡ください
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-hot-herbe-dark text-xl font-bold mb-4">8. 引渡時期</h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-hot-herbe-dark text-base leading-relaxed">
                  注文は3～5営業日以内に処理され、商品は14日以内に到着します
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-hot-herbe-dark text-xl font-bold mb-4">9. 受け付け可能な決済手段</h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-hot-herbe-dark text-base leading-relaxed">
                  クレジットカード（VISA、MasterCard、JCB、AMEX）<br />
                  国内の銀行振込
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-hot-herbe-dark text-xl font-bold mb-4">10. 決済期間</h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-hot-herbe-dark text-base leading-relaxed">
                  クレジットカード決済の場合はただちに処理されます<br />
                  国内の銀行振込の場合は注文から3日以内にお振り込みいただく必要があります
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-hot-herbe-dark text-xl font-bold mb-4">11. 販売価格</h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-hot-herbe-dark text-base leading-relaxed">
                  各商品ページに記載の金額（消費税込み）
                </p>
              </div>
            </section>

            <section className="text-center mt-12">
              <p className="text-hot-herbe-dark text-sm">
                制定日：2024年1月1日<br />
                最終改訂日：2025年7月18日
              </p>
            </section>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}