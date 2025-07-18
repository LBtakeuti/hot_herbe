'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import CloseIcon from './icons/CloseIcon'

interface FormData {
  name: string
  email: string
  phone: string
  zipCode: string
  prefecture: string
  city: string
  address: string
  building: string
  paymentMethod: 'credit' | 'bank' | 'cod'
  cardNumber: string
  expiryDate: string
  cvv: string
  cardHolder: string
}

interface PurchaseConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  formData: FormData
  selectedOption: {
    title: string
    price: string
    save: string | null
  }
}

export default function PurchaseConfirmModal({ 
  isOpen, 
  onClose, 
  formData, 
  selectedOption 
}: PurchaseConfirmModalProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const router = useRouter()

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

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !isProcessing) {
      onClose()
    }
  }

  const handleConfirmOrder = async () => {
    setIsProcessing(true)
    
    // 注文処理のシミュレーション
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setIsProcessing(false)
    setIsComplete(true)
    
    // 3秒後にトップページに戻る
    setTimeout(() => {
      router.push('/')
    }, 3000)
  }

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case 'credit': return 'クレジットカード'
      case 'bank': return '銀行振込'
      case 'cod': return '代金引換'
      default: return ''
    }
  }

  const maskCardNumber = (cardNumber: string) => {
    return cardNumber.replace(/\d(?=\d{4})/g, '*')
  }

  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {isComplete ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-hot-herbe-green rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-hot-herbe-dark mb-4">ご注文ありがとうございました！</h2>
            <p className="text-hot-herbe-light-green mb-6">
              ご注文を承りました。確認メールを送信いたします。<br />
              商品は3-5営業日以内に発送予定です。
            </p>
            <div className="text-sm text-gray-600">
              3秒後にトップページに戻ります...
            </div>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-bold text-hot-herbe-dark">ご注文内容の確認</h2>
              {!isProcessing && (
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <CloseIcon />
                </button>
              )}
            </div>

            <div className="p-6 space-y-6">
              {/* 商品情報 */}
              <div className="bg-hot-herbe-bg rounded-lg p-4">
                <h3 className="font-semibold text-hot-herbe-dark mb-2">商品情報</h3>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                      <img src="/product-icon.webp" alt="HOT HERBE" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="font-medium">HOT HERBE 温感クリーム ({selectedOption.title})</p>
                      <p className="text-sm text-hot-herbe-light-green">100ml 天然成分配合</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-hot-herbe-dark" style={{ fontFamily: 'Inter, sans-serif' }}>{selectedOption.price}</p>
                    {selectedOption.save && (
                      <p className="text-xs text-hot-herbe-green">{selectedOption.save}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* お客様情報 */}
              <div>
                <h3 className="font-semibold text-hot-herbe-dark mb-3">お客様情報</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">お名前</p>
                    <p className="font-medium">{formData.name}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">メールアドレス</p>
                    <p className="font-medium">{formData.email}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">電話番号</p>
                    <p className="font-medium">{formData.phone}</p>
                  </div>
                </div>
              </div>

              {/* 配送先情報 */}
              <div>
                <h3 className="font-semibold text-hot-herbe-dark mb-3">配送先</h3>
                <div className="text-sm">
                  <p className="font-medium">
                    〒{formData.zipCode} {formData.prefecture}{formData.city}
                  </p>
                  <p className="font-medium">
                    {formData.address} {formData.building}
                  </p>
                </div>
              </div>

              {/* 支払い方法 */}
              <div>
                <h3 className="font-semibold text-hot-herbe-dark mb-3">お支払い方法</h3>
                <p className="text-sm font-medium">{getPaymentMethodLabel(formData.paymentMethod)}</p>
                {formData.paymentMethod === 'credit' && (
                  <div className="text-sm text-gray-600 mt-1">
                    <p>カード番号: {maskCardNumber(formData.cardNumber)}</p>
                    <p>名義人: {formData.cardHolder}</p>
                  </div>
                )}
              </div>

              {/* 注意事項 */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-semibold text-yellow-800 mb-2">ご注文前の確認事項</h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• 商品到着後のキャンセル・返品はお受けできません</li>
                  <li>• 使用前に必ずパッチテストを行ってください</li>
                  <li>• 妊娠中・授乳中の方は使用をお控えください</li>
                  <li>• 異常を感じた場合は直ちに使用を中止してください</li>
                </ul>
              </div>

              {/* 注文ボタン */}
              <div className="flex gap-4">
                <button
                  onClick={onClose}
                  disabled={isProcessing}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 px-6 rounded-md font-semibold hover:bg-gray-300 disabled:opacity-50 transition-colors"
                >
                  修正する
                </button>
                <button
                  onClick={handleConfirmOrder}
                  disabled={isProcessing}
                  className="flex-1 bg-hot-herbe-green text-white py-3 px-6 rounded-md font-semibold hover:bg-hot-herbe-dark disabled:opacity-50 transition-colors flex items-center justify-center"
                >
                  {isProcessing ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      注文処理中...
                    </>
                  ) : (
                    '注文を確定する'
                  )}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}