import Image from 'next/image'
import { useState } from 'react'

interface FeatureCardProps {
  title: string
  description: string
  image: string
  details: string[]
}

export default function FeatureCard({ title, description, image, details }: FeatureCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div className="p-4">
      <div 
        className="relative flex items-stretch justify-between gap-4 rounded-lg transition-all duration-300 hover:bg-gray-50 cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex flex-col gap-1 flex-[2_2_0px] relative">
          <p className="text-hot-herbe-dark text-base font-bold leading-tight">{title}</p>
          <p className="text-hot-herbe-light-green text-sm font-normal leading-normal">{description}</p>
          
          {/* ホバー時の詳細 */}
          <div className={`absolute top-full left-0 right-0 z-10 bg-white border border-gray-200 rounded-lg shadow-lg p-4 mt-2 transition-all duration-300 ${
            isHovered ? 'opacity-100 visible' : 'opacity-0 invisible'
          }`}>
            <h4 className="text-hot-herbe-dark text-sm font-bold mb-2">詳細効能：</h4>
            <ul className="space-y-1">
              {details.map((detail, index) => (
                <li key={index} className="text-hot-herbe-dark text-xs leading-relaxed flex items-start">
                  <span className="text-hot-herbe-green mr-2">•</span>
                  {detail}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="relative w-full aspect-video rounded-lg overflow-hidden flex-1">
          <Image
            src={image}
            alt={title}
            fill
            sizes="(max-width: 768px) 40vw, 25vw"
            className="object-cover"
          />
        </div>
      </div>
    </div>
  )
}