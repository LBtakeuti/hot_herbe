'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

interface Customer {
  id: string
  created_at: string
  name: string
  email: string
  phone: string
  address: string
  total_orders: number
  total_spent: number
  last_order_date: string
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const supabase = createClientComponentClient()

  useEffect(() => {
    fetchCustomers()
  }, [])

  const fetchCustomers = async () => {
    try {
      // まずcustomersテーブルから取得を試みる
      const { data: customersData, error: customersError } = await supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false })

      if (!customersError && customersData && customersData.length > 0) {
        // customersテーブルにデータがある場合
        const formattedCustomers = customersData.map(customer => ({
          id: customer.id,
          created_at: customer.created_at,
          name: customer.name,
          email: customer.email,
          phone: customer.phone || '',
          address: customer.default_shipping_address || '',
          total_orders: customer.total_orders || 0,
          total_spent: customer.total_spent || 0,
          last_order_date: customer.updated_at || customer.created_at
        }))
        setCustomers(formattedCustomers)
      } else {
        // customersテーブルにデータがない場合、ordersから集計
        const { data: ordersData, error: ordersError } = await supabase
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false })

        if (ordersError) {
          console.error('Error fetching orders:', ordersError)
          // デモモードまたはエラー時のデモデータ
          const isDemoMode = localStorage.getItem('adminDemoMode') === 'true'
          if (isDemoMode) {
            setCustomers([
              {
                id: 'demo-customer-1',
                created_at: new Date(2024, 0, 1).toISOString(),
                name: '山田太郎',
                email: 'yamada@example.com',
                phone: '090-1234-5678',
                address: '東京都渋谷区1-1-1',
                total_orders: 3,
                total_spent: 25840,
                last_order_date: new Date(2024, 0, 25).toISOString()
              },
              {
                id: 'demo-customer-2',
                created_at: new Date(2024, 0, 10).toISOString(),
                name: '佐藤花子',
                email: 'sato@example.com',
                phone: '090-8765-4321',
                address: '大阪府大阪市北区2-2-2',
                total_orders: 2,
                total_spent: 18900,
                last_order_date: new Date(2024, 0, 20).toISOString()
              }
            ])
            return
          }
        }

        if (ordersData && ordersData.length > 0) {
          const customerMap = new Map<string, Customer>()

          ordersData.forEach(order => {
            const key = order.customer_email
            
            if (customerMap.has(key)) {
              const customer = customerMap.get(key)!
              customer.total_orders += 1
              customer.total_spent += Number(order.total_amount)
              if (new Date(order.created_at) > new Date(customer.last_order_date)) {
                customer.last_order_date = order.created_at
              }
            } else {
              customerMap.set(key, {
                id: `customer-${order.id}`,
                created_at: order.created_at,
                name: order.customer_name,
                email: order.customer_email,
                phone: order.customer_phone || '',
                address: typeof order.shipping_address === 'string' 
                  ? order.shipping_address 
                  : JSON.stringify(order.shipping_address),
                total_orders: 1,
                total_spent: Number(order.total_amount),
                last_order_date: order.created_at
              })
            }
          })

          setCustomers(Array.from(customerMap.values()))
        } else {
          setCustomers([])
        }
      }
    } catch (error) {
      console.error('Error fetching customers:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm)
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">顧客管理</h1>
        
        <div className="flex justify-between items-center mb-6">
          <input
            type="text"
            placeholder="名前、メール、電話番号で検索..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-96"
          />
          
          <div className="text-sm text-gray-600">
            合計: {filteredCustomers.length} 人の顧客
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                顧客名
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                連絡先
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                住所
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                注文数
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                合計購入額
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                最終購入日
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredCustomers.map((customer) => (
              <tr key={customer.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">{customer.email}</div>
                  <div className="text-sm text-gray-500">{customer.phone}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">
                    {typeof customer.address === 'object' && customer.address !== null
                      ? (customer.address as any).line1 || JSON.stringify(customer.address)
                      : customer.address || '-'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    {customer.total_orders} 件
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ¥{customer.total_spent.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(customer.last_order_date).toLocaleDateString('ja-JP')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredCustomers.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            {searchTerm ? '検索結果がありません' : '顧客データがありません'}
          </div>
        )}
      </div>
    </div>
  )
}