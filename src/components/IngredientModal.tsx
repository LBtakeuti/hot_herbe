'use client'
import { useEffect } from 'react'
import Image from 'next/image'
import CloseIcon from './icons/CloseIcon'

interface IngredientModalProps {
  isOpen: boolean
  onClose: () => void
  ingredient: {
    name: string
    image: string
    benefits: string[]
  } | null
}

export default function IngredientModal({ isOpen, onClose, ingredient }: IngredientModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  if (!isOpen || !ingredient) return null

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold text-hot-herbe-dark">{ingredient.name}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="閉じる"
          >
            <CloseIcon />
          </button>
        </div>
        
        <div className="p-4">
          <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden">
            <Image
              src={ingredient.image}
              alt={ingredient.name}
              fill
              className="object-cover"
            />
          </div>
          
          <h3 className="text-lg font-semibold text-hot-herbe-dark mb-3">効能・効果</h3>
          <ul className="space-y-2">
            {ingredient.benefits.map((benefit, index) => (
              <li key={index} className="flex items-start">
                <span className="text-hot-herbe-green mr-2 mt-1">•</span>
                <span className="text-hot-herbe-dark text-sm leading-relaxed">{benefit}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="p-4 border-t bg-gray-50">
          <p className="text-xs text-gray-600 text-center">
            ※ 効能・効果には個人差があります。使用前にパッチテストを行ってください。
          </p>
        </div>
      </div>
    </div>
  )
}