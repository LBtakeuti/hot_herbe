'use client'
import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import PurchaseForm from '@/components/PurchaseForm'
import { pricingOptions } from '@/data/content'

export default function PurchasePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const selectedPlan = searchParams.get('plan') || '0'
  const planIndex = parseInt(selectedPlan)
  const selectedOption = pricingOptions[planIndex] || pricingOptions[0]

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-white">
      <Header />
      
      <div className="flex-1 max-w-4xl mx-auto w-full px-4 py-8">
        <div className="mb-6">
          <Link 
            href="/"
            className="inline-flex items-center text-hot-herbe-green hover:text-hot-herbe-dark transition-colors"
          >
            <svg 
              className="w-4 h-4 mr-2" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            商品ページに戻る
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 商品情報 */}
          <div className="bg-white rounded-lg border border-hot-herbe-border p-6">
            <h2 className="text-xl font-bold text-hot-herbe-dark mb-4">ご注文内容</h2>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="w-24 h-24 rounded-lg overflow-hidden">
                <img src="/product-icon.webp" alt="HOT HERBE" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-hot-herbe-dark">HOT HERBE 温感クリーム</h3>
                <p className="text-sm text-hot-herbe-light-green">100ml 天然成分配合</p>
              </div>
            </div>

            <div className="bg-hot-herbe-bg rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-hot-herbe-dark">{selectedOption.title}</span>
                {selectedOption.save && (
                  <span className="text-xs bg-hot-herbe-green text-white px-2 py-1 rounded">
                    {selectedOption.save}
                  </span>
                )}
              </div>
              <div className="text-2xl font-bold text-hot-herbe-dark" style={{ fontFamily: 'Inter, sans-serif' }}>
                {selectedOption.price}
              </div>
            </div>

            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>注意事項:</strong> 使用前にパッチテストを行ってください。
                妊娠中・授乳中の方は使用を控えてください。
              </p>
            </div>
          </div>

          {/* 購入フォーム */}
          <div className="bg-white rounded-lg border border-hot-herbe-border p-6">
            <h2 className="text-xl font-bold text-hot-herbe-dark mb-4">お客様情報</h2>
            <PurchaseForm selectedOption={selectedOption} />
          </div>
        </div>
      </div>
    </div>
  )
}