'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import ChevronLeftIcon from './icons/ChevronLeftIcon'
import ChevronRightIcon from './icons/ChevronRightIcon'

interface SlideData {
  id: number
  image: string
  title: string
  description: string
  buttonText: string
  buttonLink: string
}

interface HeroSliderProps {
  slides: SlideData[]
  autoSlideInterval?: number
}

export default function HeroSlider({ slides, autoSlideInterval = 8000 }: HeroSliderProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  const resetAutoSlide = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setIsAutoPlaying(true)
  }

  const handleUserInteraction = () => {
    setIsAutoPlaying(false)
    resetAutoSlide()
  }

  useEffect(() => {
    if (isAutoPlaying) {
      timeoutRef.current = setTimeout(() => {
        nextSlide()
      }, autoSlideInterval)
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [currentSlide, isAutoPlaying, autoSlideInterval])

  return (
    <div className="@container">
      <div className="@[480px]:p-4">
        <div className="relative h-[480px] md:h-[600px] @[480px]:rounded-lg overflow-hidden">
          {/* スライド画像 */}
          <div className="relative h-full w-full">
            {slides.map((slide, index) => (
              <div
                key={slide.id}
                className={`absolute inset-0 transition-opacity duration-500 ${
                  index === currentSlide ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <div className="relative h-full w-full">
                  <Image
                    src={slide.image}
                    alt={slide.title}
                    fill
                    className="object-cover"
                    priority={index === 0}
                    sizes="100vw"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-20" />
                </div>
                
                {/* コンテンツ */}
                <div className="absolute inset-0 flex flex-col gap-6 @[480px]:gap-8 items-center justify-end p-4 pb-20">
                  <div className="flex flex-col gap-2 text-center">
                    <h1 className="text-white text-3xl font-black leading-tight tracking-[-0.033em] @[480px]:text-4xl @[480px]:font-black @[480px]:leading-tight @[480px]:tracking-[-0.033em]" style={{ fontFamily: 'Times New Roman, serif' }}>
                      {slide.title}
                    </h1>
                    <h2 className="text-white text-sm font-normal leading-normal @[480px]:text-base @[480px]:font-normal @[480px]:leading-normal">
                      {slide.description}
                    </h2>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ナビゲーション矢印 */}
          <button
            onClick={() => {
              handleUserInteraction()
              prevSlide()
            }}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-200 transition-all duration-200"
            aria-label="前のスライド"
          >
            <ChevronLeftIcon />
          </button>
          
          <button
            onClick={() => {
              handleUserInteraction()
              nextSlide()
            }}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-200 transition-all duration-200"
            aria-label="次のスライド"
          >
            <ChevronRightIcon />
          </button>

          {/* インジケーター */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  handleUserInteraction()
                  goToSlide(index)
                }}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  index === currentSlide 
                    ? 'bg-white scale-110' 
                    : 'bg-white bg-opacity-50 hover:bg-opacity-75'
                }`}
                aria-label={`スライド ${index + 1} に移動`}
              />
            ))}
          </div>

        </div>
      </div>
    </div>
  )
}