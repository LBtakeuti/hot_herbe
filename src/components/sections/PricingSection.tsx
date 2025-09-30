import PricingCard from '@/components/PricingCard'
import { PricingOption } from '@/types'

interface PricingSectionProps {
  pricingOptions: PricingOption[]
}

export default function PricingSection({ pricingOptions }: PricingSectionProps) {
  return (
    <section id="pricing" className="py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-5xl mx-auto px-6">
        {/* Elegant Header */}
        <div className="text-center mb-16">
          <p className="text-sm uppercase tracking-widest text-gray-500 mb-4">PRICING</p>
          <h2 className="text-4xl font-light text-gray-900 mb-4">
            ご購入プラン
          </h2>
          <div className="w-24 h-0.5 bg-gray-900 mx-auto mb-6"></div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            韓国で大好評の温感クリーム<br/>
            日本初上陸を記念した特別価格でご提供
          </p>
        </div>

        {/* Premium Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {pricingOptions.map((option, index) => (
            <PricingCard key={index} {...option} index={index} />
          ))}
        </div>

        {/* Elegant Trust Indicators */}
        <div className="border-t border-b border-gray-200 py-8 mb-12">
          <div className="grid grid-cols-3 gap-8">
            <div className="text-center">
              <p className="text-2xl font-light text-gray-900 mb-1">¥550</p>
              <p className="text-xs uppercase tracking-wider text-gray-500">送料全国一律</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-light text-gray-900 mb-1">100%</p>
              <p className="text-xs uppercase tracking-wider text-gray-500">天然由来成分</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-light text-gray-900 mb-1">韓国製</p>
              <p className="text-xs uppercase tracking-wider text-gray-500">正規輸入品</p>
            </div>
          </div>
        </div>

        {/* Subtle Urgency */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            ※ 特別価格は期間限定です。在庫がなくなり次第、通常価格での販売となります。
          </p>
        </div>
      </div>
    </section>
  )
}