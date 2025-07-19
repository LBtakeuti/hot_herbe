'use client'
import { useState } from 'react'
import PurchaseConfirmModal from './PurchaseConfirmModal'

interface PurchaseFormProps {
  selectedOption: {
    title: string
    price: string
    save: string | null
  }
}

interface FormData {
  name: string
  email: string
  phone: string
  zipCode: string
  prefecture: string
  city: string
  address: string
  building: string
  paymentMethod: 'credit' | 'bank'
  cardNumber: string
  expiryDate: string
  cvv: string
  cardHolder: string
}

export default function PurchaseForm({ selectedOption }: PurchaseFormProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    zipCode: '',
    prefecture: '',
    city: '',
    address: '',
    building: '',
    paymentMethod: 'credit',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardHolder: ''
  })

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) newErrors.name = 'お名前を入力してください'
    if (!formData.email.trim()) newErrors.email = 'メールアドレスを入力してください'
    if (!formData.phone.trim()) newErrors.phone = '電話番号を入力してください'
    if (!formData.zipCode.trim()) newErrors.zipCode = '郵便番号を入力してください'
    if (!formData.prefecture.trim()) newErrors.prefecture = '都道府県を選択してください'
    if (!formData.city.trim()) newErrors.city = '市区町村を入力してください'
    if (!formData.address.trim()) newErrors.address = '住所を入力してください'

    if (formData.paymentMethod === 'credit') {
      if (!formData.cardNumber.trim()) newErrors.cardNumber = 'カード番号を入力してください'
      if (!formData.expiryDate.trim()) newErrors.expiryDate = '有効期限を入力してください'
      if (!formData.cvv.trim()) newErrors.cvv = 'セキュリティコードを入力してください'
      if (!formData.cardHolder.trim()) newErrors.cardHolder = 'カード名義人を入力してください'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      setIsConfirmModalOpen(true)
    }
  }

  const prefectures = [
    '北海道', '青森県', '岩手県', '宮城県', '秋田県', '山形県', '福島県',
    '茨城県', '栃木県', '群馬県', '埼玉県', '千葉県', '東京都', '神奈川県',
    '新潟県', '富山県', '石川県', '福井県', '山梨県', '長野県', '岐阜県',
    '静岡県', '愛知県', '三重県', '滋賀県', '京都府', '大阪府', '兵庫県',
    '奈良県', '和歌山県', '鳥取県', '島根県', '岡山県', '広島県', '山口県',
    '徳島県', '香川県', '愛媛県', '高知県', '福岡県', '佐賀県', '長崎県',
    '熊本県', '大分県', '宮崎県', '鹿児島県', '沖縄県'
  ]

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 基本情報 */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-hot-herbe-dark mb-2">
              お名前 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-hot-herbe-green ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="山田 太郎"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-hot-herbe-dark mb-2">
              メールアドレス <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-hot-herbe-green ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="example@email.com"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-hot-herbe-dark mb-2">
              電話番号 <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-hot-herbe-green ${
                errors.phone ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="090-1234-5678"
            />
            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
          </div>
        </div>

        {/* 配送先情報 */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-hot-herbe-dark border-b pb-2">配送先情報</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-hot-herbe-dark mb-2">
                郵便番号 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-hot-herbe-green ${
                  errors.zipCode ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="123-4567"
              />
              {errors.zipCode && <p className="text-red-500 text-sm mt-1">{errors.zipCode}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-hot-herbe-dark mb-2">
                都道府県 <span className="text-red-500">*</span>
              </label>
              <select
                name="prefecture"
                value={formData.prefecture}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-hot-herbe-green ${
                  errors.prefecture ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">選択してください</option>
                {prefectures.map(prefecture => (
                  <option key={prefecture} value={prefecture}>{prefecture}</option>
                ))}
              </select>
              {errors.prefecture && <p className="text-red-500 text-sm mt-1">{errors.prefecture}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-hot-herbe-dark mb-2">
              市区町村 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-hot-herbe-green ${
                errors.city ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="渋谷区"
            />
            {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-hot-herbe-dark mb-2">
              住所 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-hot-herbe-green ${
                errors.address ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="神宮前1-1-1"
            />
            {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-hot-herbe-dark mb-2">
              建物名・部屋番号
            </label>
            <input
              type="text"
              name="building"
              value={formData.building}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-hot-herbe-green"
              placeholder="○○マンション101号室"
            />
          </div>
        </div>

        {/* 支払い方法 */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-hot-herbe-dark border-b pb-2">お支払い方法</h3>
          
          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="radio"
                name="paymentMethod"
                value="credit"
                checked={formData.paymentMethod === 'credit'}
                onChange={handleInputChange}
                className="text-hot-herbe-green focus:ring-hot-herbe-green"
              />
              <span className="ml-2 text-hot-herbe-dark">クレジットカード</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="paymentMethod"
                value="bank"
                checked={formData.paymentMethod === 'bank'}
                onChange={handleInputChange}
                className="text-hot-herbe-green focus:ring-hot-herbe-green"
              />
              <span className="ml-2 text-hot-herbe-dark">銀行振込</span>
            </label>
          </div>

          {formData.paymentMethod === 'credit' && (
            <div className="space-y-4 mt-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <label className="block text-sm font-medium text-hot-herbe-dark mb-2">
                  カード番号 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-hot-herbe-green ${
                    errors.cardNumber ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="1234 5678 9012 3456"
                />
                {errors.cardNumber && <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-hot-herbe-dark mb-2">
                    有効期限 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-hot-herbe-green ${
                      errors.expiryDate ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="MM/YY"
                  />
                  {errors.expiryDate && <p className="text-red-500 text-sm mt-1">{errors.expiryDate}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-hot-herbe-dark mb-2">
                    CVV <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="cvv"
                    value={formData.cvv}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-hot-herbe-green ${
                      errors.cvv ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="123"
                  />
                  {errors.cvv && <p className="text-red-500 text-sm mt-1">{errors.cvv}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-hot-herbe-dark mb-2">
                  カード名義人 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="cardHolder"
                  value={formData.cardHolder}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-hot-herbe-green ${
                    errors.cardHolder ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="TARO YAMADA"
                />
                {errors.cardHolder && <p className="text-red-500 text-sm mt-1">{errors.cardHolder}</p>}
              </div>
            </div>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-hot-herbe-green text-white py-3 px-6 rounded-md font-semibold hover:bg-hot-herbe-dark transition-colors"
        >
          注文内容を確認する
        </button>
      </form>

      <PurchaseConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        formData={formData}
        selectedOption={selectedOption}
      />
    </>
  )
}