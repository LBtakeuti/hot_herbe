import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function Privacy() {
  return (
    <div className="relative flex size-full min-h-screen flex-col bg-white justify-between overflow-x-hidden">
      <div>
        <Header />
        
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <h1 className="text-hot-herbe-dark text-3xl font-bold leading-tight tracking-[-0.015em] mb-8 text-center">
            プライバシーポリシー
          </h1>
          
          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <p className="text-hot-herbe-dark text-base leading-relaxed mb-4">
                landbridge株式会社（以下「当社」）は、当社が提供するサービス（以下「本サービス」）における、ユーザーの個人情報の取扱いについて、以下のとおりプライバシーポリシー（以下「本ポリシー」）を定めます。
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-hot-herbe-dark text-xl font-bold mb-4">第1条（個人情報）</h2>
              <p className="text-hot-herbe-dark text-base leading-relaxed mb-4">
                「個人情報」とは、個人情報保護法にいう「個人情報」を指すものとし、生存する個人に関する情報であって、当該情報に含まれる氏名、生年月日、住所、電話番号、連絡先その他の記述等により特定の個人を識別できる情報及び容貌、指紋、声紋にかかるデータ、及び健康保険証の保険者番号などの当該情報単体から特定の個人を識別できる情報（個人識別情報）を指します。
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-hot-herbe-dark text-xl font-bold mb-4">第2条（個人情報の収集方法）</h2>
              <p className="text-hot-herbe-dark text-base leading-relaxed mb-4">
                当社は、ユーザーが利用登録をする際に氏名、生年月日、住所、電話番号、メールアドレス、銀行口座番号、クレジットカード番号、運転免許証番号などの個人情報をお尋ねすることがあります。また、ユーザーと提携先などとの間でなされたユーザーの個人情報を含む取引記録や決済に関する情報を、当社の提携先（情報提供元、広告主、広告配信先などを含みます。以下「提携先」といいます）などから収集することがあります。
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-hot-herbe-dark text-xl font-bold mb-4">第3条（個人情報を収集・利用する目的）</h2>
              <p className="text-hot-herbe-dark text-base leading-relaxed mb-4">
                当社が個人情報を収集・利用する目的は、以下のとおりです。
              </p>
              <ul className="list-disc pl-6 mb-4 text-hot-herbe-dark text-base leading-relaxed">
                <li>当社サービスの提供・運営のため</li>
                <li>ユーザーからのお問い合わせに回答するため（本人確認を行うことを含む）</li>
                <li>ユーザーが利用中のサービスの新機能、更新情報、キャンペーン等及び当社が提供する他のサービスの案内のメールを送付するため</li>
                <li>メンテナンス、重要なお知らせなど必要に応じたご連絡のため</li>
                <li>利用規約に違反したユーザーや、不正・不当な目的でサービスを利用しようとするユーザーの特定をし、ご利用をお断りするため</li>
                <li>ユーザーにご自身の登録情報の閲覧や変更、削除、ご利用状況の閲覧を行っていただくため</li>
                <li>有料サービスにおいて、ユーザーに利用料金を請求するため</li>
                <li>上記の利用目的に付随する目的</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-hot-herbe-dark text-xl font-bold mb-4">第4条（利用目的の変更）</h2>
              <p className="text-hot-herbe-dark text-base leading-relaxed mb-4">
                当社は、利用目的が変更前と関連性を有すると合理的に認められる場合に限り、個人情報の利用目的を変更するものとします。利用目的の変更を行った場合には、変更後の目的について、当社所定の方法により、ユーザーに通知し、または本ウェブサイト上に公表するものとします。
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-hot-herbe-dark text-xl font-bold mb-4">第5条（個人情報の第三者提供）</h2>
              <p className="text-hot-herbe-dark text-base leading-relaxed mb-4">
                当社は、次に掲げる場合を除いて、あらかじめユーザーの同意を得ることなく、第三者に個人情報を提供することはありません。ただし、個人情報保護法その他の法令で認められる場合を除きます。
              </p>
              <ul className="list-disc pl-6 mb-4 text-hot-herbe-dark text-base leading-relaxed">
                <li>人の生命、身体または財産の保護のために必要がある場合であって、本人の同意を得ることが困難であるとき</li>
                <li>公衆衛生の向上または児童の健全な育成の推進のために特に必要がある場合であって、本人の同意を得ることが困難であるとき</li>
                <li>国の機関もしくは地方公共団体またはその委託を受けた者が法令の定める事務を遂行することに対して協力する必要がある場合であって、本人の同意を得ることにより当該事務の遂行に支障を及ぼすおそれがあるとき</li>
                <li>予め次の事項を告知あるいは公表し、かつ当社が個人情報保護委員会に届出をしたとき</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-hot-herbe-dark text-xl font-bold mb-4">第6条（個人情報の開示）</h2>
              <p className="text-hot-herbe-dark text-base leading-relaxed mb-4">
                当社は、本人から個人情報の開示を求められたときは、本人に対し、遅滞なくこれを開示します。ただし、開示することにより次のいずれかに該当する場合は、その全部または一部を開示しないこともあり、開示しない決定をした場合には、その旨を遅滞なく通知します。なお、個人情報の開示に際しては、1件あたり1,000円の手数料を申し受けます。
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-hot-herbe-dark text-xl font-bold mb-4">第7条（個人情報の訂正および削除）</h2>
              <p className="text-hot-herbe-dark text-base leading-relaxed mb-4">
                ユーザーは、当社の保有する自己の個人情報が誤った情報である場合には、当社が定める手続きにより、当社に対して個人情報の訂正、追加または削除（以下「訂正等」といいます）を請求することができます。当社は、ユーザーから前項の請求を受けてその請求に応じる必要があると判断した場合には、遅滞なく、当該個人情報の訂正等を行うものとします。
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-hot-herbe-dark text-xl font-bold mb-4">第8条（個人情報の利用停止等）</h2>
              <p className="text-hot-herbe-dark text-base leading-relaxed mb-4">
                当社は、本人から、個人情報が、利用目的の範囲を超えて取り扱われているという理由、または不正の手段により取得されたものであるという理由により、その利用の停止または消去（以下「利用停止等」といいます）を求められた場合には、遅滞なく必要な調査を行います。
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-hot-herbe-dark text-xl font-bold mb-4">第9条（プライバシーポリシーの変更）</h2>
              <p className="text-hot-herbe-dark text-base leading-relaxed mb-4">
                本ポリシーの内容は、法令その他本ポリシーに別段の定めのある事項を除いて、ユーザーに通知することなく、変更することができるものとします。当社が別途定める場合を除いて、変更後のプライバシーポリシーは、本ウェブサイトに掲載したときから効力を生じるものとします。
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-hot-herbe-dark text-xl font-bold mb-4">第10条（お問い合わせ窓口）</h2>
              <p className="text-hot-herbe-dark text-base leading-relaxed mb-4">
                本ポリシーに関するお問い合わせは、下記の窓口までお願いいたします。
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-hot-herbe-dark text-base leading-relaxed">
                  <strong>landbridge株式会社</strong><br />
                  〒343-0856 埼玉県越谷市川柳町二丁目401<br />
                  代表取締役: 三森一輝
                </p>
              </div>
            </section>

            <section className="text-center mt-12">
              <p className="text-hot-herbe-dark text-sm">
                制定日：2024年1月1日<br />
                最終改訂日：2025年7月15日
              </p>
            </section>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}