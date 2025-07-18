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
        <section id="ingredients">
          <h2 className="text-hot-herbe-dark text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
            主要成分
          </h2>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(158px,1fr))] gap-3 p-4">
            {ingredients.map((ingredient, index) => (
              <IngredientCard 
                key={index} 
                {...ingredient} 
                onClick={() => handleIngredientClick(ingredient)}
              />
            ))}
          </div>
        </section>

        {/* Features & Benefits Section */}
        <section id="features">
          <h2 className="text-hot-herbe-dark text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
            特徴・効果
          </h2>
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </section>

        {/* All Ingredients Section */}
        <section id="all-ingredients">
          <h2 className="text-hot-herbe-dark text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
            全成分
          </h2>
          <p className="text-hot-herbe-dark text-base font-normal leading-normal pb-3 pt-1 px-4">
            甘草、ターメリック、ヨモギ、白椿、カンフル、苦参、唐辛子、川芎、当帰、生姜、梔子、ハッカ、丹参
            その他天然成分配合
          </p>
        </section>

        {/* Purchase Options Section */}
        <section id="pricing">
          <h2 className="text-hot-herbe-dark text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
            購入オプション
          </h2>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(228px,1fr))] gap-2.5 px-4 py-3 @3xl:grid-cols-4">
            {pricingOptions.map((option, index) => (
              <PricingCard key={index} {...option} index={index} />
            ))}
          </div>
          <p className="text-hot-herbe-dark text-base font-normal leading-normal pb-3 pt-1 px-4">
            クレジットカード、PayPal対応。
          </p>
        </section>

        {/* FAQ Section */}
        <section id="faq">
          <h2 className="text-hot-herbe-dark text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
            よくある質問
          </h2>
          <div className="flex flex-col p-4 gap-3">
            {faqs.map((faq, index) => (
              <FAQItem key={index} {...faq} defaultOpen={index === 0} />
            ))}
          </div>
        </section>

        {/* Company Information Section */}
        <section id="company-info">
          <h2 className="text-hot-herbe-dark text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
            会社情報
          </h2>
          <p className="text-hot-herbe-dark text-base font-normal leading-normal pb-3 pt-1 px-4">
            landbridge株式会社<br />
            〒343-0856 埼玉県越谷市川柳町二丁目401<br />
            代表取締役: 三森一輝
          </p>
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