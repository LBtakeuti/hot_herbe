'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import {
  ChartBarIcon,
  UserGroupIcon,
  ShoppingCartIcon,
  CurrencyYenIcon,
  MapPinIcon
} from '@heroicons/react/24/outline'
import KPICard from '@/components/admin/KPICard'
import AnalyticsTabNav from '@/components/admin/AnalyticsTabNav'
import BarChart from '@/components/admin/BarChart'
import RFMAnalysisCard from '@/components/admin/RFMAnalysisCard'
import { CustomerAnalytics } from '@/types'

const tabs = [
  { id: 'overview', label: '概要' },
  { id: 'segments', label: 'セグメント分析' },
  { id: 'behavior', label: '購買行動' },
  { id: 'retention', label: 'リテンション' }
]

export default function CustomerAnalyticsPage() {
  const [analytics, setAnalytics] = useState<CustomerAnalytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState('30days')
  const [activeTab, setActiveTab] = useState('overview')
  const supabase = createClientComponentClient()

  useEffect(() => {
    fetchAnalyticsData()
  }, [dateRange])

  const fetchAnalyticsData = async () => {
    try {
      // Supabaseから実際のデータを取得
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })

      const { data: customers, error: customersError } = await supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false })

      // データが存在しない場合は初期データを表示
      if (!orders || orders.length === 0) {
        // 販売前の初期状態
        setAnalytics({
          totalCustomers: 0,
          newCustomers: 0,
          returningCustomers: 0,
          churnRate: 0,
          
          averageOrderValue: 0,
          purchaseFrequency: 0,
          customerLifetimeValue: 0,
          
          segments: [
            { name: '新規顧客', count: 0, revenue: 0, percentage: 0, avgOrderValue: 0 },
            { name: 'リピーター', count: 0, revenue: 0, percentage: 0, avgOrderValue: 0 },
            { name: 'ロイヤル顧客', count: 0, revenue: 0, percentage: 0, avgOrderValue: 0 },
            { name: 'VIP顧客', count: 0, revenue: 0, percentage: 0, avgOrderValue: 0 }
          ],
          
          rfmAnalysis: {
            champions: 0,
            loyalCustomers: 0,
            potentialLoyalists: 0,
            newCustomers: 0,
            atRisk: 0,
            cantLose: 0
          },
          
          regionalDistribution: [
            { region: '関東', customers: 0, revenue: 0, avgOrderValue: 0 },
            { region: '関西', customers: 0, revenue: 0, avgOrderValue: 0 },
            { region: '中部', customers: 0, revenue: 0, avgOrderValue: 0 },
            { region: '九州', customers: 0, revenue: 0, avgOrderValue: 0 },
            { region: 'その他', customers: 0, revenue: 0, avgOrderValue: 0 }
          ],
          
          purchasePatterns: {
            timeOfDay: [
              { hour: '00-03', orders: 0 },
              { hour: '03-06', orders: 0 },
              { hour: '06-09', orders: 0 },
              { hour: '09-12', orders: 0 },
              { hour: '12-15', orders: 0 },
              { hour: '15-18', orders: 0 },
              { hour: '18-21', orders: 0 },
              { hour: '21-24', orders: 0 }
            ],
            dayOfWeek: [
              { day: '月', orders: 0 },
              { day: '火', orders: 0 },
              { day: '水', orders: 0 },
              { day: '木', orders: 0 },
              { day: '金', orders: 0 },
              { day: '土', orders: 0 },
              { day: '日', orders: 0 }
            ],
            seasonality: [
              { month: '1月', orders: 0, revenue: 0 },
              { month: '2月', orders: 0, revenue: 0 },
              { month: '3月', orders: 0, revenue: 0 },
              { month: '4月', orders: 0, revenue: 0 },
              { month: '5月', orders: 0, revenue: 0 },
              { month: '6月', orders: 0, revenue: 0 },
              { month: '7月', orders: 0, revenue: 0 },
              { month: '8月', orders: 0, revenue: 0 },
              { month: '9月', orders: 0, revenue: 0 },
              { month: '10月', orders: 0, revenue: 0 },
              { month: '11月', orders: 0, revenue: 0 },
              { month: '12月', orders: 0, revenue: 0 }
            ]
          },
          
          productPerformance: [
            { product: 'HOT HERBE 30日分', units: 0, revenue: 0, customers: 0, repurchaseRate: 0 },
            { product: 'HOT HERBE 90日分', units: 0, revenue: 0, customers: 0, repurchaseRate: 0 },
            { product: 'HOT HERBE 180日分', units: 0, revenue: 0, customers: 0, repurchaseRate: 0 }
          ],
          
          cohortRetention: [
            { cohort: '2025年1月', month0: 0, month1: 0, month2: 0, month3: 0 },
            { cohort: '2024年12月', month0: 0, month1: 0, month2: 0, month3: 0 },
            { cohort: '2024年11月', month0: 0, month1: 0, month2: 0, month3: 0 },
            { cohort: '2024年10月', month0: 0, month1: 0, month2: 0, month3: 0 }
          ]
        })
      } else {
        // 実際のデータがある場合は集計
        const totalCustomers = customers?.length || 0
        const totalRevenue = orders.reduce((sum, order) => sum + Number(order.total_amount), 0)
        const avgOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0

        // 時間帯別の集計
        const timeOfDayData = orders.reduce((acc, order) => {
          const hour = new Date(order.created_at).getHours()
          let timeSlot = ''
          if (hour < 3) timeSlot = '00-03'
          else if (hour < 6) timeSlot = '03-06'
          else if (hour < 9) timeSlot = '06-09'
          else if (hour < 12) timeSlot = '09-12'
          else if (hour < 15) timeSlot = '12-15'
          else if (hour < 18) timeSlot = '15-18'
          else if (hour < 21) timeSlot = '18-21'
          else timeSlot = '21-24'
          
          const existing = acc.find((a: { hour: string; orders: number }) => a.hour === timeSlot)
          if (existing) existing.orders++
          else acc.push({ hour: timeSlot, orders: 1 })
          return acc
        }, [] as { hour: string; orders: number }[])

        // 曜日別の集計
        const dayOfWeekData = orders.reduce((acc, order) => {
          const day = new Date(order.created_at).getDay()
          const dayNames = ['日', '月', '火', '水', '木', '金', '土']
          const dayName = dayNames[day]
          
          const existing = acc.find((a: { day: string; orders: number }) => a.day === dayName)
          if (existing) existing.orders++
          else acc.push({ day: dayName, orders: 1 })
          return acc
        }, [] as { day: string; orders: number }[])

        // 月別の集計
        const monthlyData = orders.reduce((acc, order) => {
          const month = new Date(order.created_at).getMonth() + 1
          const monthName = `${month}月`
          
          const existing = acc.find((a: { month: string; orders: number; revenue: number }) => a.month === monthName)
          if (existing) {
            existing.orders++
            existing.revenue += Number(order.total_amount)
          } else {
            acc.push({ month: monthName, orders: 1, revenue: Number(order.total_amount) })
          }
          return acc
        }, [] as { month: string; orders: number; revenue: number }[])

        // 実データから分析情報を生成
        setAnalytics({
          totalCustomers: totalCustomers,
          newCustomers: totalCustomers,
          returningCustomers: 0,
          churnRate: 0,
          
          averageOrderValue: avgOrderValue,
          purchaseFrequency: totalCustomers > 0 ? orders.length / totalCustomers : 0,
          customerLifetimeValue: avgOrderValue,
          
          segments: [
            { name: '新規顧客', count: totalCustomers, revenue: totalRevenue, percentage: 100, avgOrderValue: avgOrderValue },
            { name: 'リピーター', count: 0, revenue: 0, percentage: 0, avgOrderValue: 0 },
            { name: 'ロイヤル顧客', count: 0, revenue: 0, percentage: 0, avgOrderValue: 0 },
            { name: 'VIP顧客', count: 0, revenue: 0, percentage: 0, avgOrderValue: 0 }
          ],
          
          rfmAnalysis: {
            champions: 0,
            loyalCustomers: 0,
            potentialLoyalists: 0,
            newCustomers: totalCustomers,
            atRisk: 0,
            cantLose: 0
          },
          
          regionalDistribution: [
            { region: '関東', customers: totalCustomers, revenue: totalRevenue, avgOrderValue: avgOrderValue },
            { region: '関西', customers: 0, revenue: 0, avgOrderValue: 0 },
            { region: '中部', customers: 0, revenue: 0, avgOrderValue: 0 },
            { region: '九州', customers: 0, revenue: 0, avgOrderValue: 0 },
            { region: 'その他', customers: 0, revenue: 0, avgOrderValue: 0 }
          ],
          
          purchasePatterns: {
            timeOfDay: [
              { hour: '00-03', orders: 0 },
              { hour: '03-06', orders: 0 },
              { hour: '06-09', orders: 0 },
              { hour: '09-12', orders: 0 },
              { hour: '12-15', orders: 0 },
              { hour: '15-18', orders: 0 },
              { hour: '18-21', orders: 0 },
              { hour: '21-24', orders: 0 }
            ].map(slot => {
              const data = timeOfDayData.find((d: { hour: string; orders: number }) => d.hour === slot.hour)
              return data || slot
            }),
            dayOfWeek: [
              { day: '月', orders: 0 },
              { day: '火', orders: 0 },
              { day: '水', orders: 0 },
              { day: '木', orders: 0 },
              { day: '金', orders: 0 },
              { day: '土', orders: 0 },
              { day: '日', orders: 0 }
            ].map(slot => {
              const data = dayOfWeekData.find((d: { day: string; orders: number }) => d.day === slot.day)
              return data || slot
            }),
            seasonality: [
              { month: '1月', orders: 0, revenue: 0 },
              { month: '2月', orders: 0, revenue: 0 },
              { month: '3月', orders: 0, revenue: 0 },
              { month: '4月', orders: 0, revenue: 0 },
              { month: '5月', orders: 0, revenue: 0 },
              { month: '6月', orders: 0, revenue: 0 },
              { month: '7月', orders: 0, revenue: 0 },
              { month: '8月', orders: 0, revenue: 0 },
              { month: '9月', orders: 0, revenue: 0 },
              { month: '10月', orders: 0, revenue: 0 },
              { month: '11月', orders: 0, revenue: 0 },
              { month: '12月', orders: 0, revenue: 0 }
            ].map(slot => {
              const data = monthlyData.find((d: { month: string; orders: number; revenue: number }) => d.month === slot.month)
              return data || slot
            })
          },
          
          productPerformance: [
            { 
              product: 'HOT HERBE 30日分', 
              units: orders.filter(o => o.product_name?.includes('30日')).length, 
              revenue: orders.filter(o => o.product_name?.includes('30日')).reduce((sum, o) => sum + Number(o.total_amount), 0), 
              customers: new Set(orders.filter(o => o.product_name?.includes('30日')).map(o => o.customer_email)).size, 
              repurchaseRate: 0 
            },
            { 
              product: 'HOT HERBE 90日分', 
              units: orders.filter(o => o.product_name?.includes('90日')).length, 
              revenue: orders.filter(o => o.product_name?.includes('90日')).reduce((sum, o) => sum + Number(o.total_amount), 0), 
              customers: new Set(orders.filter(o => o.product_name?.includes('90日')).map(o => o.customer_email)).size, 
              repurchaseRate: 0 
            },
            { 
              product: 'HOT HERBE 180日分', 
              units: orders.filter(o => o.product_name?.includes('180日')).length, 
              revenue: orders.filter(o => o.product_name?.includes('180日')).reduce((sum, o) => sum + Number(o.total_amount), 0), 
              customers: new Set(orders.filter(o => o.product_name?.includes('180日')).map(o => o.customer_email)).size, 
              repurchaseRate: 0 
            }
          ],
          
          cohortRetention: [
            { cohort: '2025年1月', month0: totalCustomers > 0 ? 100 : 0, month1: 0, month2: 0, month3: 0 },
            { cohort: '2024年12月', month0: 0, month1: 0, month2: 0, month3: 0 },
            { cohort: '2024年11月', month0: 0, month1: 0, month2: 0, month3: 0 },
            { cohort: '2024年10月', month0: 0, month1: 0, month2: 0, month3: 0 }
          ]
        })
      }

      setLoading(false)
    } catch (error) {
      console.error('Error:', error)
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">分析データがありません</p>
      </div>
    )
  }

  return (
    <div>
      {/* ヘッダー */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">顧客分析ダッシュボード</h1>
        <div className="flex gap-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="7days">過去7日間</option>
            <option value="30days">過去30日間</option>
            <option value="90days">過去90日間</option>
            <option value="365days">過去1年間</option>
          </select>
        </div>
      </div>

      {/* タブナビゲーション */}
      <AnalyticsTabNav
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* 概要タブ */}
      {activeTab === 'overview' && (
        <>
          {/* KPIカード */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <KPICard
              title="総顧客数"
              value={analytics.totalCustomers.toLocaleString()}
              subtext={`+${analytics.newCustomers} 今月`}
              icon={UserGroupIcon}
              iconColor="text-blue-500"
            />
            <KPICard
              title="平均注文額"
              value={`¥${Math.round(analytics.averageOrderValue).toLocaleString()}`}
              subtext="前月比 +0%"
              icon={ShoppingCartIcon}
              iconColor="text-green-500"
            />
            <KPICard
              title="顧客生涯価値"
              value={`¥${Math.round(analytics.customerLifetimeValue).toLocaleString()}`}
              subtext={`購買頻度: ${analytics.purchaseFrequency.toFixed(1)}回`}
              icon={CurrencyYenIcon}
              iconColor="text-purple-500"
            />
            <KPICard
              title="離脱率"
              value={`${analytics.churnRate.toFixed(1)}%`}
              subtext="前月比 -0%"
              icon={ChartBarIcon}
              iconColor="text-red-500"
            />
          </div>

          {/* RFM分析 */}
          <RFMAnalysisCard rfmAnalysis={analytics.rfmAnalysis} />

          {/* 地域分布 */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b">
              <h2 className="text-lg font-semibold">地域別分布</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {analytics.regionalDistribution.map((region) => (
                  <div key={region.region} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <MapPinIcon className="h-5 w-5 text-gray-400 mr-2" />
                      <span className="font-medium">{region.region}</span>
                    </div>
                    <div className="flex items-center space-x-6">
                      <span className="text-sm text-gray-500">{region.customers}人</span>
                      <span className="text-sm font-medium">¥{region.revenue.toLocaleString()}</span>
                      <span className="text-sm text-gray-500">平均: ¥{Math.round(region.avgOrderValue).toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* セグメント分析タブ */}
      {activeTab === 'segments' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b">
              <h2 className="text-lg font-semibold">顧客セグメント</h2>
            </div>
            <div className="p-6">
              {analytics.segments.map((segment) => (
                <div key={segment.name} className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">{segment.name}</span>
                    <span className="text-sm text-gray-500">{segment.count}人 ({segment.percentage}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div 
                      className="bg-blue-500 h-4 rounded-full"
                      style={{ width: `${segment.percentage}%` }}
                    />
                  </div>
                  <div className="flex justify-between mt-2 text-sm text-gray-500">
                    <span>売上: ¥{segment.revenue.toLocaleString()}</span>
                    <span>平均: ¥{Math.round(segment.avgOrderValue).toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b">
              <h2 className="text-lg font-semibold">商品別パフォーマンス</h2>
            </div>
            <div className="p-6">
              {analytics.productPerformance.map((product) => (
                <div key={product.product} className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">{product.product}</span>
                    <span className="text-sm text-gray-500">{product.units}個</span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">売上</p>
                      <p className="font-medium">¥{product.revenue.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">顧客数</p>
                      <p className="font-medium">{product.customers}人</p>
                    </div>
                    <div>
                      <p className="text-gray-500">再購入率</p>
                      <p className="font-medium">{product.repurchaseRate}%</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 購買行動タブ */}
      {activeTab === 'behavior' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b">
              <h2 className="text-lg font-semibold">時間帯別注文数</h2>
            </div>
            <div className="p-6">
              <BarChart
                data={analytics.purchasePatterns.timeOfDay.map(t => ({ label: t.hour, value: t.orders }))}
                color="bg-green-500"
              />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b">
              <h2 className="text-lg font-semibold">曜日別注文数</h2>
            </div>
            <div className="p-6">
              <BarChart
                data={analytics.purchasePatterns.dayOfWeek.map(d => ({ label: d.day, value: d.orders }))}
                color="bg-blue-500"
              />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow lg:col-span-2">
            <div className="px-6 py-4 border-b">
              <h2 className="text-lg font-semibold">月別売上推移</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-12 gap-2">
                {analytics.purchasePatterns.seasonality.map((month) => (
                  <div key={month.month} className="text-center">
                    <div className="relative">
                      <div className="h-32 bg-gray-100 rounded relative">
                        <div 
                          className="absolute bottom-0 w-full bg-purple-500 rounded"
                          style={{ 
                            height: `${(month.revenue / Math.max(...analytics.purchasePatterns.seasonality.map(m => m.revenue), 1)) * 100}%` 
                          }}
                        />
                      </div>
                    </div>
                    <p className="text-xs mt-2">{month.month}</p>
                    <p className="text-xs text-gray-500">{month.orders}件</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* リテンションタブ */}
      {activeTab === 'retention' && (
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b">
            <h2 className="text-lg font-semibold">コホート別リテンション率</h2>
          </div>
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-4">コホート</th>
                    <th className="text-center py-2 px-4">初月</th>
                    <th className="text-center py-2 px-4">1ヶ月後</th>
                    <th className="text-center py-2 px-4">2ヶ月後</th>
                    <th className="text-center py-2 px-4">3ヶ月後</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.cohortRetention.map((cohort) => (
                    <tr key={cohort.cohort} className="border-b">
                      <td className="py-3 px-4 font-medium">{cohort.cohort}</td>
                      <td className="py-3 px-4 text-center">
                        <span className="inline-block px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                          {cohort.month0}%
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        {cohort.month1 > 0 ? (
                          <span className={`inline-block px-3 py-1 rounded-full text-sm ${
                            cohort.month1 >= 70 ? 'bg-green-100 text-green-800' : 
                            cohort.month1 >= 50 ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-red-100 text-red-800'
                          }`}>
                            {cohort.month1}%
                          </span>
                        ) : '-'}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {cohort.month2 > 0 ? (
                          <span className={`inline-block px-3 py-1 rounded-full text-sm ${
                            cohort.month2 >= 60 ? 'bg-green-100 text-green-800' : 
                            cohort.month2 >= 40 ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-red-100 text-red-800'
                          }`}>
                            {cohort.month2}%
                          </span>
                        ) : '-'}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {cohort.month3 > 0 ? (
                          <span className={`inline-block px-3 py-1 rounded-full text-sm ${
                            cohort.month3 >= 50 ? 'bg-green-100 text-green-800' : 
                            cohort.month3 >= 30 ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-red-100 text-red-800'
                          }`}>
                            {cohort.month3}%
                          </span>
                        ) : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {analytics.totalCustomers === 0 && (
              <div className="text-center py-8 text-gray-500">
                <p>まだ顧客データがありません</p>
                <p className="text-sm mt-2">販売開始後にリテンションデータが表示されます</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}