'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

interface Order {
  id: string
  created_at: string
  customer_name: string
  customer_email: string
  customer_phone: string
  shipping_address: string
  product_name: string
  quantity: number
  total_amount: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'confirmed'
  payment_status?: string
  metadata?: any
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const supabase = createClientComponentClient()

  useEffect(() => {
    fetchOrders()
  }, [filter])

  const fetchOrders = async () => {
    try {
      // デモモードのチェック
      const isDemoMode = localStorage.getItem('adminDemoMode') === 'true'
      
      let query = supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })

      if (filter !== 'all') {
        query = query.eq('status', filter)
      }

      const { data, error } = await query

      if (error) {
        console.error('Error fetching orders:', error)
        
        // エラー時またはデモモード時にデモデータを表示
        if (isDemoMode || error.message.includes('Failed to fetch')) {
          const demoOrders: Order[] = [
            {
              id: 'demo-001',
              created_at: new Date(2024, 0, 15).toISOString(),
              customer_name: '山田太郎',
              customer_email: 'yamada@example.com',
              customer_phone: '090-1234-5678',
              shipping_address: JSON.stringify({ line1: '東京都渋谷区1-1-1' }),
              product_name: 'HOT Herbe 1箱',
              quantity: 1,
              total_amount: 6980,
              status: 'delivered',
              payment_method: 'credit_card'
            },
            {
              id: 'demo-002',
              created_at: new Date(2024, 0, 20).toISOString(),
              customer_name: '佐藤花子',
              customer_email: 'sato@example.com',
              customer_phone: '090-8765-4321',
              shipping_address: JSON.stringify({ line1: '大阪府大阪市北区2-2-2' }),
              product_name: 'HOT Herbe 3箱セット',
              quantity: 1,
              total_amount: 18900,
              status: 'shipped',
              payment_method: 'paypal'
            },
            {
              id: 'demo-003',
              created_at: new Date(2024, 0, 25).toISOString(),
              customer_name: '鈴木一郎',
              customer_email: 'suzuki@example.com',
              customer_phone: '090-5555-5555',
              shipping_address: JSON.stringify({ line1: '愛知県名古屋市中区3-3-3' }),
              product_name: 'HOT Herbe 1箱',
              quantity: 2,
              total_amount: 13960,
              status: 'processing',
              payment_method: 'credit_card'
            },
            {
              id: 'demo-004',
              created_at: new Date().toISOString(),
              customer_name: '田中美咲',
              customer_email: 'tanaka@example.com',
              customer_phone: '090-9999-9999',
              shipping_address: JSON.stringify({ line1: '福岡県福岡市博多区4-4-4' }),
              product_name: 'HOT Herbe 定期購入',
              quantity: 1,
              total_amount: 5580,
              status: 'pending',
              payment_method: 'credit_card'
            }
          ]
          
          const filtered = filter === 'all' 
            ? demoOrders 
            : demoOrders.filter(order => order.status === filter)
          
          setOrders(filtered)
          setLoading(false)
          return
        }
      }
      
      // 実データまたは空配列を設定
      setOrders(data || [])
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      // デモモードのチェック
      const isDemoMode = localStorage.getItem('adminDemoMode') === 'true'
      
      // 実際のDBを更新
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId)

      if (error) {
        console.error('Error updating order:', error)
        
        // エラー時またはデモモード時はローカル更新
        if (isDemoMode || error.message.includes('Failed to fetch')) {
          setOrders(prevOrders => 
            prevOrders.map(order => 
              order.id === orderId ? { ...order, status: newStatus as any } : order
            )
          )
          return
        }
        throw error
      }
      
      fetchOrders()
    } catch (error) {
      console.error('Error updating order:', error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'processing': return 'bg-blue-100 text-blue-800'
      case 'shipped': return 'bg-purple-100 text-purple-800'
      case 'delivered': return 'bg-green-100 text-green-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return '保留中'
      case 'processing': return '処理中'
      case 'shipped': return '発送済み'
      case 'delivered': return '配達完了'
      case 'cancelled': return 'キャンセル'
      default: return status
    }
  }

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
        <h1 className="text-2xl font-bold text-gray-800 mb-4">注文管理</h1>
        
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            すべて
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-lg ${filter === 'pending' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            保留中
          </button>
          <button
            onClick={() => setFilter('processing')}
            className={`px-4 py-2 rounded-lg ${filter === 'processing' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            処理中
          </button>
          <button
            onClick={() => setFilter('shipped')}
            className={`px-4 py-2 rounded-lg ${filter === 'shipped' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            発送済み
          </button>
          <button
            onClick={() => setFilter('delivered')}
            className={`px-4 py-2 rounded-lg ${filter === 'delivered' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            配達完了
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                注文ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                日時
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                顧客
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                商品
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                金額
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ステータス
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                アクション
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  #{order.id.slice(0, 8)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(order.created_at).toLocaleDateString('ja-JP')}
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">{order.customer_name}</div>
                  <div className="text-sm text-gray-500">{order.customer_email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{order.product_name}</div>
                  <div className="text-sm text-gray-500">数量: {order.quantity}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ¥{order.total_amount.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                    {getStatusText(order.status)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <select
                    value={order.status}
                    onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                    className="border border-gray-300 rounded px-2 py-1 text-sm"
                  >
                    <option value="pending">保留中</option>
                    <option value="processing">処理中</option>
                    <option value="shipped">発送済み</option>
                    <option value="delivered">配達完了</option>
                    <option value="cancelled">キャンセル</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {orders.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            注文データがありません
          </div>
        )}
      </div>
    </div>
  )
}