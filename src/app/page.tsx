'use client'
import { useState } from 'react'
import Image from 'next/image'
import Header from '@/components/Header'
import HeroSection from '@/components/HeroSection'
import IngredientCard from '@/components/IngredientCard'
import IngredientModal from '@/components/IngredientModal'
import FeatureCard from '@/components/FeatureCard'
import PricingCard from '@/components/PricingCard'
import FAQItem from '@/components/FAQItem'
import Footer from '@/components/Footer'
import { ingredients, features, pricingOptions, faqs } from '@/data/content'

export default function Home() {
  const [selectedIngredient, setSelectedIngredient] = useState<{
    name: string
    image: string
    benefits: string[]
  } | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)


  const handleIngredientClick = (ingredient: { name: string; image: string; benefits: string[] }) => {
    setSelectedIngredient(ingredient)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedIngredient(null)
  }

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    element?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-white justify-between overflow-x-hidden">
      <div>
        <Header />
        <HeroSection />
        
        {/* Key Ingredients Section */}
        <section id="ingredients" className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <p className="text-sm uppercase tracking-widest text-gray-500 mb-4">KEY INGREDIENTS</p>
              <h2 className="text-4xl font-light text-gray-900 mb-4">
                主要成分
              </h2>
              <div className="w-24 h-0.5 bg-gray-900 mx-auto mb-6"></div>
              <p className="text-gray-600 max-w-2xl mx-auto">
                13種類の天然由来成分が織りなす温感体験
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {ingredients.map((ingredient, index) => (
                <IngredientCard 
                  key={index} 
                  {...ingredient} 
                  onClick={() => handleIngredientClick(ingredient)}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Features & Benefits Section */}
        <section id="features" className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 mb-12">
            <div className="text-center">
              <p className="text-sm uppercase tracking-widest text-gray-500 mb-4">FEATURES</p>
              <h2 className="text-4xl font-light text-gray-900 mb-4">
                HOT HERBEの3つの特徴
              </h2>
              <div className="w-24 h-0.5 bg-gray-900 mx-auto mb-6"></div>
              <p className="text-gray-600 max-w-2xl mx-auto">
                韓国の温活文化から生まれた特別な温感体験
              </p>
            </div>
          </div>
          <div className="space-y-0">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} index={index} />
            ))}
          </div>
        </section>

        {/* Recommended For Section */}
        <section id="recommended-for" className="py-24 bg-gradient-to-b from-white to-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <p className="text-sm uppercase tracking-widest text-gray-500 mb-4">TESTIMONIALS</p>
              <h2 className="text-4xl font-light text-gray-900 mb-4">
                ご愛用者様の声
              </h2>
              <div className="w-24 h-0.5 bg-gray-900 mx-auto mb-6"></div>
              <p className="text-gray-600 max-w-2xl mx-auto">
                韓国で大好評の温感クリーム
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-start gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                    </svg>
                  ))}
                </div>
                <p className="text-gray-700 mb-3">
                  「運動前に使用すると、体がすぐに温まってパフォーマンスが上がります。韓国の友人に勧められて購入しましたが、期待以上でした！」
                </p>
                <p className="text-sm text-gray-500">30代 男性 / スポーツトレーナー</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-start gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                    </svg>
                  ))}
                </div>
                <p className="text-gray-700 mb-3">
                  「デスクワークで肩こりがひどかったのですが、これを使い始めてから楽になりました。じんわり温かくて気持ちいいです。」
                </p>
                <p className="text-sm text-gray-500">40代 女性 / 会社員</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-start gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                    </svg>
                  ))}
                </div>
                <p className="text-gray-700 mb-3">
                  「冷え性で悩んでいましたが、これを塗ると本当に体の芯から温まる感じがします。韓国コスメ好きの私のお気に入りです。」
                </p>
                <p className="text-sm text-gray-500">50代 女性 / 主婦</p>
              </div>
            </div>
          </div>
        </section>

        {/* All Ingredients Section */}
        <section id="all-ingredients" className="py-24 bg-gradient-to-b from-gray-50 to-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <p className="text-sm uppercase tracking-widest text-gray-500 mb-4">INGREDIENTS</p>
              <h2 className="text-4xl font-light text-gray-900 mb-4">
                全成分
              </h2>
              <div className="w-24 h-0.5 bg-gray-900 mx-auto mb-6"></div>
            </div>
            <div className="max-w-3xl mx-auto text-center">
              <p className="text-gray-600 leading-relaxed">
                甘草、ターメリック、ヨモギ、白椿、カンフル、苦参、唐辛子、<br/>
                川芎、当帰、生姜、梔子、ハッカ、丹参<br/>
                その他天然成分配合
              </p>
            </div>
          </div>
        </section>

        {/* Purchase Options Section */}
        <section id="pricing" className="py-24 bg-gradient-to-b from-gray-50 to-white">
          <div className="max-w-7xl mx-auto px-4">
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
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div className="text-center">
                  <p className="text-2xl font-light text-gray-900 mb-1">30日間</p>
                  <p className="text-xs uppercase tracking-wider text-gray-500">返金保証</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-light text-gray-900 mb-1">送料無料</p>
                  <p className="text-xs uppercase tracking-wider text-gray-500">全国一律</p>
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

        {/* FAQ Section */}
        <section id="faq" className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <p className="text-sm uppercase tracking-widest text-gray-500 mb-4">FAQ</p>
              <h2 className="text-4xl font-light text-gray-900 mb-4">
                よくある質問
              </h2>
              <div className="w-24 h-0.5 bg-gray-900 mx-auto"></div>
            </div>
            <div className="max-w-3xl mx-auto space-y-4">
              {faqs.map((faq, index) => (
                <FAQItem key={index} {...faq} defaultOpen={index === 0} />
              ))}
            </div>
          </div>
        </section>

      </div>
      
      <Footer />
      
      <IngredientModal
        isOpen={isModalOpen}
        onClose={closeModal}
        ingredient={selectedIngredient}
      />
    </div>
  )
}