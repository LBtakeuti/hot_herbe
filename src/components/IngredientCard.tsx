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
      className="relative flex flex-col gap-3 pb-3 cursor-pointer group"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 shadow-sm group-hover:shadow-2xl transition-all duration-500 group-hover:scale-[1.02]">
        <Image
          src={image}
          alt={name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Premium overlay effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-transparent to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        {/* Elegant name label */}
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <p className="text-white text-sm font-semibold tracking-wide">{name}</p>
        </div>
      </div>
      
      <div className="flex items-center justify-between px-1">
        <p className="text-gray-800 text-base font-medium tracking-wide">
          {name}
        </p>
        <div className="w-6 h-[1px] bg-gradient-to-r from-transparent via-gray-400 to-transparent group-hover:via-amber-500 transition-colors duration-300"></div>
      </div>
      
      {/* Premium hover tooltip */}
      <div className={`absolute top-0 left-0 right-0 z-30 transition-all duration-500 ${
        isHovered ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-2 pointer-events-none'
      }`}>
        <div className="bg-white/95 backdrop-blur-md border border-gray-200/50 rounded-2xl shadow-2xl p-4 transform">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1 h-8 bg-gradient-to-b from-amber-500 to-orange-500 rounded-full"></div>
            <h4 className="text-gray-900 text-sm font-bold tracking-wide">{name}の効能</h4>
          </div>
          <ul className="space-y-2">
            {benefits.map((benefit, index) => (
              <li key={index} className="text-gray-700 text-xs leading-relaxed flex items-start group/item">
                <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 mt-1.5 mr-2 flex-shrink-0"></div>
                <span className="group-hover/item:text-gray-900 transition-colors">{benefit}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}