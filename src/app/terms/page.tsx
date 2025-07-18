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
              <p className="text-hot-herbe-dark text-base mb-2">
                <strong>記入内容：</strong>
              </p>
              <ul className="list-disc pl-6 mb-4 text-hot-herbe-dark text-base">
                <li>企業の場合：登記簿上の商号</li>
                <li>個人事業主の場合：氏名</li>
              </ul>
              <p className="text-hot-herbe-dark text-base mb-4">
                <strong>記入例：</strong> ABC株式会社 / 山本花子
              </p>
              <hr className="my-4" />
            </section>

            <section className="mb-8">
              <h2 className="text-hot-herbe-dark text-xl font-bold mb-4">2. 所在地</h2>
              <p className="text-hot-herbe-dark text-base mb-2">
                <strong>記入内容：</strong> 事業所の住所（登記簿上の住所）<br />
                ※個人事業主の場合は「請求があったら遅滞なく開示します」で省略可
              </p>
              <p className="text-hot-herbe-dark text-base mb-4">
                <strong>記入例：</strong> 〒123-4567 東京都渋谷区○○町○○丁目12-3
              </p>
              <hr className="my-4" />
            </section>

            <section className="mb-8">
              <h2 className="text-hot-herbe-dark text-xl font-bold mb-4">3. 電話番号</h2>
              <p className="text-hot-herbe-dark text-base mb-2">
                <strong>記入内容：</strong> 顧客からの日本語の問い合わせに対応できる電話番号<br />
                ※個人事業主の場合は「請求があったら遅滞なく開示します」で省略可
              </p>
              <p className="text-hot-herbe-dark text-base mb-4">
                <strong>記入例：</strong> 03-1234-5678 受付時間 10:00-18:00（土日祝を除く）
              </p>
              <hr className="my-4" />
            </section>

            <section className="mb-8">
              <h2 className="text-hot-herbe-dark text-xl font-bold mb-4">4. メールアドレス</h2>
              <p className="text-hot-herbe-dark text-base mb-2">
                <strong>記入内容：</strong> 顧客からの問い合わせに対応できるメールアドレス
              </p>
              <p className="text-hot-herbe-dark text-base mb-4">
                <strong>記入例：</strong> contact@example.jp
              </p>
              <hr className="my-4" />
            </section>

            <section className="mb-8">
              <h2 className="text-hot-herbe-dark text-xl font-bold mb-4">5. 運営統括責任者</h2>
              <p className="text-hot-herbe-dark text-base mb-2">
                <strong>記入内容：</strong> 組織またはビジネスの代表、または指定された会社の代表者
              </p>
              <p className="text-hot-herbe-dark text-base mb-4">
                <strong>記入例：</strong> 山田太郎
              </p>
              <hr className="my-4" />
            </section>

            <section className="mb-8">
              <h2 className="text-hot-herbe-dark text-xl font-bold mb-4">6. 追加手数料等の追加料金</h2>
              <p className="text-hot-herbe-dark text-base mb-2">
                <strong>記入内容：</strong> 商品・役務の代金以外に、顧客が負担する可能性のあるすべての料金
              </p>
              <p className="text-hot-herbe-dark text-base mb-2">
                <strong>記入例：</strong>
              </p>
              <ul className="list-disc pl-6 mb-4 text-hot-herbe-dark text-base">
                <li>配送料（一律1,000円/箱）</li>
                <li>手数料（コンビニ決済：100円）</li>
              </ul>
              <hr className="my-4" />
            </section>

            <section className="mb-8">
              <h2 className="text-hot-herbe-dark text-xl font-bold mb-4">7. 交換および返品（返金ポリシー）</h2>
              <p className="text-hot-herbe-dark text-base mb-4">
                <strong>記入内容：</strong> 交換と返品への対応方法。商品に不備がある場合とない場合を明確に分けて記載
              </p>
              
              <h3 className="text-hot-herbe-dark text-lg font-bold mb-2">お客様都合の返品・交換の場合</h3>
              <p className="text-hot-herbe-dark text-base mb-2">
                <strong>発送処理前の商品：</strong>
              </p>
              <ul className="list-disc pl-6 mb-4 text-hot-herbe-dark text-base">
                <li>記入例：ウェブサイトのキャンセルボタンを押すことで注文のキャンセルが可能です</li>
              </ul>
              
              <p className="text-hot-herbe-dark text-base mb-2">
                <strong>発送処理後の商品：</strong>
              </p>
              <ul className="list-disc pl-6 mb-4 text-hot-herbe-dark text-base">
                <li>記入例：未開封の商品は、商品到着後10日以内にお客様サポートセンター（電話番号：○○）にご連絡いただいた場合に限り、お客様の送料負担にて返金又は同額以下の商品と交換いたします</li>
                <li>開封後の商品は、返品・交換はお受けしておりません</li>
              </ul>
              
              <h3 className="text-hot-herbe-dark text-lg font-bold mb-2">商品に不備がある場合</h3>
              <ul className="list-disc pl-6 mb-4 text-hot-herbe-dark text-base">
                <li>記入例：当社の送料負担にて返金又は新しい商品と交換いたします。まずはお客様サポートセンター（電話番号：○○）までご連絡ください</li>
              </ul>
              <hr className="my-4" />
            </section>

            <section className="mb-8">
              <h2 className="text-hot-herbe-dark text-xl font-bold mb-4">8. 引渡時期</h2>
              <p className="text-hot-herbe-dark text-base mb-2">
                <strong>記入内容：</strong> 顧客が注文後、商品が顧客の元に届く時期、もしくはサービスが提供される時期
              </p>
              <p className="text-hot-herbe-dark text-base mb-4">
                <strong>記入例：</strong> 注文は3～5営業日以内に処理され、商品は14日以内に到着します / 注文後すぐにご利用いただけます
              </p>
              <hr className="my-4" />
            </section>

            <section className="mb-8">
              <h2 className="text-hot-herbe-dark text-xl font-bold mb-4">9. 受け付け可能な決済手段</h2>
              <p className="text-hot-herbe-dark text-base mb-2">
                <strong>記入内容：</strong> 代金の決済方法をすべて表示
              </p>
              <p className="text-hot-herbe-dark text-base mb-4">
                <strong>記入例：</strong> クレジットカードまたは国内の銀行振込
              </p>
              <hr className="my-4" />
            </section>

            <section className="mb-8">
              <h2 className="text-hot-herbe-dark text-xl font-bold mb-4">10. 決済期間</h2>
              <p className="text-hot-herbe-dark text-base mb-2">
                <strong>記入内容：</strong> 顧客が商品購入代金を支払う時期
              </p>
              <p className="text-hot-herbe-dark text-base mb-4">
                <strong>記入例：</strong> クレジットカード決済の場合はただちに処理されますが、国内の銀行振込の場合は注文から3日以内にお振り込みいただく必要があります
              </p>
              <hr className="my-4" />
            </section>

            <section className="mb-8">
              <h2 className="text-hot-herbe-dark text-xl font-bold mb-4">11. 販売価格</h2>
              <p className="text-hot-herbe-dark text-base mb-2">
                <strong>記入内容：</strong> 当商品またはサービスの販売価格（消費税込み）
              </p>
              <p className="text-hot-herbe-dark text-base mb-4">
                <strong>記入例：</strong> ¥4,000 各商品ページに記載の金額
              </p>
              <hr className="my-4" />
            </section>

            <section className="mb-8">
              <h2 className="text-hot-herbe-dark text-xl font-bold mb-4">記入時の注意点</h2>
              <ul className="list-disc pl-6 mb-4 text-hot-herbe-dark text-base">
                <li>各項目は法的要件を満たすために正確に記載してください</li>
                <li>個人事業主の場合、一部項目は「請求があったら遅滞なく開示します」で省略可能です</li>
                <li>返品・交換ポリシーは、お客様都合と商品不備の場合を明確に分けて記載してください</li>
                <li>連絡先情報は確実に対応可能なものを記載してください</li>
              </ul>
            </section>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}