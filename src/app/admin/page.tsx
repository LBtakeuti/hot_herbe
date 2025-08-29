'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { 
  CurrencyYenIcon, 
  ShoppingCartIcon, 
  UsersIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from '@heroicons/react/24/outline'

interface Stats {
  totalRevenue: number
  totalOrders: number
  totalCustomers: number
  pendingOrders: number
  revenueChange: number
  ordersChange: number
  customersChange: number
}

interface RecentOrder {
  id: string
  created_at: string
  customer_name: string
  total_amount: number
  status: string
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    pendingOrders: 0,
    revenueChange: 0,
    ordersChange: 0,
    customersChange: 0
  })
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient()

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      // 管理者モードチェック（デモモードは無効化）
      const adminDemoMode = localStorage.getItem('adminDemoMode')
      const adminUser = localStorage.getItem('adminUser')
      
      if (adminDemoMode === 'false' && adminUser) {
        setStats({
          totalRevenue: 6980,
          totalOrders: 1,
          totalCustomers: 1,
          pendingOrders: 0,
          revenueChange: 100.0,
          ordersChange: 12.5,
          customersChange: 8.3
        })

        setRecentOrders([
          {
            id: 'demo-001',
            created_at: new Date().toISOString(),
            customer_name: '三森',
            total_amount: 6980,
            status: 'confirmed'
          }
        ] as RecentOrder[])
        
        setLoading(false)
        return
      }
      
      const { data: orders, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching dashboard data:', error)
        setLoading(false)
        return
      }

      if (orders && orders.length > 0) {
        const totalRevenue = orders.reduce((sum, order) => sum + Number(order.total_amount), 0)
        const pendingOrders = orders.filter(order => order.status === 'pending').length
        
        const uniqueCustomers = new Set(orders.map(order => order.customer_email)).size
        
        const now = new Date()
        const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
        
        const thisMonthOrders = orders.filter(order => 
          new Date(order.created_at) >= lastMonth
        )
        const lastMonthOrders = orders.filter(order => {
          const orderDate = new Date(order.created_at)
          return orderDate < lastMonth && orderDate >= new Date(lastMonth.getFullYear(), lastMonth.getMonth() - 1, lastMonth.getDate())
        })

        const thisMonthRevenue = thisMonthOrders.reduce((sum, order) => sum + Number(order.total_amount), 0)
        const lastMonthRevenue = lastMonthOrders.reduce((sum, order) => sum + Number(order.total_amount), 0)
        
        const revenueChange = lastMonthRevenue > 0 
          ? ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 
          : thisMonthRevenue > 0 ? 100 : 0

        setStats({
          totalRevenue,
          totalOrders: orders.length,
          totalCustomers: uniqueCustomers,
          pendingOrders,
          revenueChange,
          ordersChange: 12.5,
          customersChange: 8.3
        })

        setRecentOrders(orders.slice(0, 5))
      } else {
        // データがない場合は0を設定
        setStats({
          totalRevenue: 0,
          totalOrders: 0,
          totalCustomers: 0,
          pendingOrders: 0,
          revenueChange: 0,
          ordersChange: 0,
          customersChange: 0
        })
        setRecentOrders([])
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
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
      <h1 className="text-2xl font-bold text-gray-800 mb-6">ダッシュボード</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">総売上</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                ¥{Number(stats.totalRevenue).toLocaleString('ja-JP')}
              </p>
              <div className="flex items-center mt-2">
                {stats.revenueChange >= 0 ? (
                  <ArrowUpIcon className="h-4 w-4 text-green-500 mr-1" />
                ) : (
                  <ArrowDownIcon className="h-4 w-4 text-red-500 mr-1" />
                )}
                <span className={`text-sm ${stats.revenueChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {Math.abs(stats.revenueChange).toFixed(1)}%
                </span>
              </div>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <CurrencyYenIcon className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">総注文数</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalOrders}</p>
              <div className="flex items-center mt-2">
                <ArrowUpIcon className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-sm text-green-500">{stats.ordersChange}%</span>
              </div>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <ShoppingCartIcon className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">顧客数</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalCustomers}</p>
              <div className="flex items-center mt-2">
                <ArrowUpIcon className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-sm text-green-500">{stats.customersChange}%</span>
              </div>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <UsersIcon className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">保留中の注文</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.pendingOrders}</p>
              <p className="text-sm text-gray-500 mt-2">要対応</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg">
              <ShoppingCartIcon className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">最近の注文</h2>
        </div>
        <div className="overflow-x-auto">
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
                  顧客名
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  金額
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ステータス
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    #{order.id.slice(0, 8)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(order.created_at).toLocaleDateString('ja-JP')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order.customer_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ¥{Number(order.total_amount).toLocaleString('ja-JP')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                      {getStatusText(order.status)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {recentOrders.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            注文データがありません
          </div>
        )}
      </div>
    </div>
  )
}