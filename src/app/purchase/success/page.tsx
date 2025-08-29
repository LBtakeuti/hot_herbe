'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function PurchaseSuccessPage() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')

  useEffect(() => {
    // セッションIDを使用して注文の詳細を取得することもできます
    if (sessionId) {
      console.log('Checkout session completed:', sessionId)
    }
  }, [sessionId])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100 mb-4">
            <svg className="h-10 w-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            ご購入ありがとうございます！
          </h2>
          
          <p className="mt-4 text-lg text-gray-600">
            ご注文を承りました。
          </p>
          
          <p className="mt-2 text-gray-600">
            ご登録いただいたメールアドレスに確認メールをお送りしました。
            商品は3〜5営業日以内にお届けいたします。
          </p>

          {sessionId && (
            <p className="mt-4 text-sm text-gray-500">
              注文番号: {sessionId.slice(0, 20)}...
            </p>
          )}

          <div className="mt-8 space-y-3">
            <Link 
              href="/"
              className="block w-full px-4 py-3 bg-hot-herbe-green text-white rounded-lg hover:bg-green-700 transition-colors text-center"
            >
              ホームに戻る
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}