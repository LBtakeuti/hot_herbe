'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import {
  CurrencyYenIcon,
  ShoppingCartIcon,
  UsersIcon
} from '@heroicons/react/24/outline'
import StatCard from '@/components/admin/StatCard'
import OrdersTable from '@/components/admin/OrdersTable'
import { Stats, RecentOrder } from '@/types'

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
        <StatCard
          title="総売上"
          value={`¥${Number(stats.totalRevenue).toLocaleString('ja-JP')}`}
          change={stats.revenueChange}
          icon={CurrencyYenIcon}
          iconColor="text-blue-600"
          iconBgColor="bg-blue-100"
        />
        <StatCard
          title="総注文数"
          value={stats.totalOrders}
          change={stats.ordersChange}
          icon={ShoppingCartIcon}
          iconColor="text-green-600"
          iconBgColor="bg-green-100"
        />
        <StatCard
          title="顧客数"
          value={stats.totalCustomers}
          change={stats.customersChange}
          icon={UsersIcon}
          iconColor="text-purple-600"
          iconBgColor="bg-purple-100"
        />
        <StatCard
          title="保留中の注文"
          value={stats.pendingOrders}
          changeLabel="要対応"
          icon={ShoppingCartIcon}
          iconColor="text-yellow-600"
          iconBgColor="bg-yellow-100"
        />
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">最近の注文</h2>
        </div>
        <OrdersTable
          orders={recentOrders}
          getStatusColor={getStatusColor}
          getStatusText={getStatusText}
        />
      </div>
    </div>
  )
}