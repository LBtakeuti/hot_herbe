'use client'
import { useState } from 'react'
import Header from '@/components/Header'
import HeroSection from '@/components/HeroSection'
import IngredientModal from '@/components/IngredientModal'
import Footer from '@/components/Footer'
import KeyIngredientsSection from '@/components/sections/KeyIngredientsSection'
import FeaturesSection from '@/components/sections/FeaturesSection'
import TestimonialsSection from '@/components/sections/TestimonialsSection'
import AllIngredientsSection from '@/components/sections/AllIngredientsSection'
import PricingSection from '@/components/sections/PricingSection'
import FAQSection from '@/components/sections/FAQSection'
import { ingredients, features, pricingOptions, faqs } from '@/data/content'
import { Ingredient } from '@/types'

export default function Home() {
  const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)


  const handleIngredientClick = (ingredient: Ingredient) => {
    setSelectedIngredient(ingredient)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedIngredient(null)
  }

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-white justify-between overflow-x-hidden">
      <div>
        <Header />
        <HeroSection />
        <KeyIngredientsSection
          ingredients={ingredients}
          onIngredientClick={handleIngredientClick}
        />
        <FeaturesSection features={features} />
        <TestimonialsSection />
        <AllIngredientsSection />
        <PricingSection pricingOptions={pricingOptions} />
        <FAQSection faqs={faqs} />
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