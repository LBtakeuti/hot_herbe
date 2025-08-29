'use client'
import { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'

interface PricingCardProps {
  title: string
  price: string
  save: string | null
  index: number
}

export default function PricingCard({ title, price, save, index }: PricingCardProps) {
  const [isLoading, setIsLoading] = useState(false)
  
  const handlePurchase = async () => {
    setIsLoading(true)
    
    try {
      // Determine product ID based on index
      let productId = ''
      if (index === 0) productId = 'hot_herbe_30days'
      else if (index === 1) productId = 'hot_herbe_90days'
      else if (index === 2) productId = 'hot_herbe_180days'
      
      // Create checkout session
      const response = await fetch('/api/checkout/create-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
          quantity: 1,
        }),
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        console.error('Checkout error:', data)
        throw new Error(data.error || 'チェックアウトセッションの作成に失敗しました')
      }
      
      if (data.error) {
        throw new Error(data.error)
      }
      
      // Redirect to Stripe Checkout
      const stripeKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
      console.log('Loading Stripe with key:', stripeKey?.substring(0, 20))
      console.log('Session data:', data)
      
      if (!stripeKey) {
        throw new Error('Stripe公開鍵が設定されていません')
      }
      
      const stripe = await loadStripe(stripeKey)
      
      if (!stripe) {
        throw new Error('Stripeの読み込みに失敗しました')
      }
      
      // セッションURLが提供されている場合は直接リダイレクト（より信頼性が高い）
      if (data.url) {
        console.log('Redirecting directly to Stripe checkout:', data.url)
        window.location.href = data.url
        return
      }
      
      // セッションIDを使用してリダイレクト（フォールバック）
      if (data.sessionId) {
        const { error } = await stripe.redirectToCheckout({
          sessionId: data.sessionId,
        })
        if (error) {
          console.error('Stripe redirect error:', error)
          throw error
        }
      }
    } catch (error) {
      console.error('Checkout error:', error)
      alert('エラーが発生しました。もう一度お試しください。')
      setIsLoading(false)
    }
  }
  const isPopular = index === 1 // 2個セットが人気
  
  return (
    <div className={`relative ${isPopular ? 'transform md:scale-105' : ''}`}>
      {isPopular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-6 py-1 text-xs uppercase tracking-wider z-20">
          Recommended
        </div>
      )}
      
      <div className={`bg-white border ${isPopular ? 'border-gray-900 border-2' : 'border-gray-200'} h-full flex flex-col`}>
        <div className="p-8 flex-1 flex flex-col">
          {/* Header */}
          <div className="text-center mb-6">
            <h3 className="text-lg font-light text-gray-900 mb-4">{title}</h3>
            <div className="mb-2">
              <span className="text-4xl font-light text-gray-900 tracking-tight">{price.replace('¥', '').replace(',', ',')}</span>
              <span className="text-sm text-gray-500 ml-1">JPY</span>
            </div>
            {save && (
              <p className="text-sm text-emerald-600 font-medium">{save}</p>
            )}
            {index === 0 && (
              <p className="text-xs text-gray-400 mt-2">1個あたり ¥6,980</p>
            )}
            {index === 1 && (
              <div className="mt-2">
                <p className="text-xs text-gray-400">1個あたり ¥6,000</p>
                <p className="text-xs text-gray-400 line-through">通常 ¥13,960</p>
              </div>
            )}
            {index === 2 && (
              <div className="mt-2">
                <p className="text-xs text-gray-400">1個あたり ¥5,333</p>
                <p className="text-xs text-gray-400 line-through">通常 ¥20,940</p>
              </div>
            )}
          </div>
          
          <div className="flex-1"></div>
          
          {/* Button */}
          <button
            onClick={handlePurchase}
            disabled={isLoading}
            className={`w-full py-4 text-sm uppercase tracking-wider font-medium transition-all duration-300 ${
              isPopular 
                ? 'bg-gray-900 text-white hover:bg-gray-800' 
                : 'bg-white text-gray-900 border border-gray-900 hover:bg-gray-900 hover:text-white'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isLoading ? (
              <svg className="animate-spin h-4 w-4 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <span>Select Plan</span>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}