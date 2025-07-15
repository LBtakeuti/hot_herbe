import Image from 'next/image'
import { useState } from 'react'

interface IngredientCardProps {
  name: string
  image: string
  benefits: string[]
  onClick: () => void
}

export default function IngredientCard({ name, image, benefits, onClick }: IngredientCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div 
      className="relative flex flex-col gap-3 pb-3 cursor-pointer group transition-transform hover:scale-105"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative w-full aspect-square rounded-lg overflow-hidden shadow-md group-hover:shadow-lg transition-shadow">
        <Image
          src={image}
          alt={name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity flex items-center justify-center">
          <span className="text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity bg-hot-herbe-green px-3 py-1 rounded-full">
            詳細を見る
          </span>
        </div>
      </div>
      <p className="text-hot-herbe-dark text-base font-medium leading-normal group-hover:text-hot-herbe-green transition-colors">
        {name}
      </p>
      
      {/* ホバー時の詳細効能 */}
      <div className={`absolute top-0 left-0 right-0 z-20 bg-white border border-gray-200 rounded-lg shadow-xl p-3 transition-all duration-300 ${
        isHovered ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
      }`}>
        <h4 className="text-hot-herbe-dark text-sm font-bold mb-2">{name}の効能</h4>
        <ul className="space-y-1">
          {benefits.map((benefit, index) => (
            <li key={index} className="text-hot-herbe-dark text-xs leading-relaxed flex items-start">
              <span className="text-hot-herbe-green mr-1">•</span>
              <span>{benefit}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}