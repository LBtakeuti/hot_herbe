import IngredientCard from '@/components/IngredientCard'
import { Ingredient } from '@/types'

interface KeyIngredientsSectionProps {
  ingredients: Ingredient[]
  onIngredientClick: (ingredient: Ingredient) => void
}

export default function KeyIngredientsSection({
  ingredients,
  onIngredientClick
}: KeyIngredientsSectionProps) {
  return (
    <section id="ingredients" className="py-24 bg-white">
      <div className="max-w-5xl mx-auto px-6">
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
        <div className="space-y-6">
          {/* First row - 5 items */}
          <div className="grid grid-cols-3 md:grid-cols-5 gap-6">
            {ingredients.slice(0, 5).map((ingredient, index) => (
              <IngredientCard
                key={index}
                {...ingredient}
                onClick={() => onIngredientClick(ingredient)}
              />
            ))}
          </div>

          {/* Second row - 5 items */}
          <div className="grid grid-cols-3 md:grid-cols-5 gap-6">
            {ingredients.slice(5, 10).map((ingredient, index) => (
              <IngredientCard
                key={index + 5}
                {...ingredient}
                onClick={() => onIngredientClick(ingredient)}
              />
            ))}
          </div>

          {/* Third row - 3 items */}
          <div className="grid grid-cols-3 gap-6 md:max-w-[60%] md:mx-auto">
            {ingredients.slice(10, 13).map((ingredient, index) => (
              <IngredientCard
                key={index + 10}
                {...ingredient}
                onClick={() => onIngredientClick(ingredient)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}