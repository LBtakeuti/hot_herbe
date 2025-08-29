'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import {
  CurrencyYenIcon,
  ChartBarIcon,
  CalculatorIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ExclamationTriangleIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ShoppingBagIcon,
  BanknotesIcon,
  CreditCardIcon,
  BuildingStorefrontIcon
} from '@heroicons/react/24/outline'

// 商品マスタデータ
interface ProductMaster {
  id: string
  name: string
  sku: string
  unit_cost: number           // 仕入原価
  manufacturing_cost: number  // 製造原価
  selling_price: number      // 販売価格
  wholesale_price?: number   // 卸売価格
  shipping_cost: number      // 配送費
  packaging_cost: number     // 梱包費
  min_stock: number         // 最小在庫数
  current_stock: number     // 現在在庫数
  max_stock: number         // 最大在庫数
}

interface ProfitAnalysis {
  // 売上データ
  totalRevenue: number           // 総売上
  totalCost: number              // 総原価
  grossProfit: number            // 粗利益
  grossMargin: number            // 粗利率
  netProfit: number              // 純利益
  netMargin: number              // 純利率
  
  // 販売データ
  totalUnits: number             // 総販売数
  averageOrderValue: number      // 平均注文額
  returnRate: number             // 返品率
  
  // コスト内訳
  costBreakdown: {
    productCost: number          // 商品原価
    shippingCost: number         // 配送費総額
    packagingCost: number        // 梱包費総額
    marketingCost: number        // マーケティング費
    operationalCost: number      // 運営費
    otherCost: number           // その他費用
  }
  
  // 月別推移
  monthlyTrends: {
    month: string
    revenue: number
    cost: number
    profit: number
    margin: number
    units: number
  }[]
  
  // 商品別分析
  productAnalysis: {
    product: string
    units: number
    revenue: number
    cost: number
    profit: number
    margin: number
    contribution: number  // 利益貢献度
  }[]
  
  // 販売チャネル別
  channelAnalysis: {
    channel: string
    revenue: number
    cost: number
    profit: number
    margin: number
    percentage: number
  }[]
}

export default function ProfitAnalysisPage() {
  const [analysis, setAnalysis] = useState<ProfitAnalysis | null>(null)
  const [products, setProducts] = useState<ProductMaster[]>([])
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState('30days')
  const [activeTab, setActiveTab] = useState('overview')
  const [showAddProduct, setShowAddProduct] = useState(false)
  const supabase = createClientComponentClient()

  useEffect(() => {
    fetchAnalysisData()
  }, [dateRange])

  const fetchAnalysisData = async () => {
    try {
      // Supabaseから実際のデータを取得
      const { data: inventoryProducts, error: inventoryError } = await supabase
        .from('inventory_products')
        .select('*')
        .order('name')

      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })

      // 在庫データが存在する場合はそれを使用
      if (inventoryProducts && inventoryProducts.length > 0) {
        setProducts(inventoryProducts)
        
        // 実際の注文データから分析を生成
        const totalRevenue = orders?.reduce((sum, order) => sum + Number(order.total_amount), 0) || 0
        const totalUnits = orders?.length || 0
        
        // 商品別の原価計算
        let totalCost = 0
        const productAnalysis = inventoryProducts.map(product => {
          const productOrders = orders?.filter(o => 
            o.product_name?.includes(product.name.replace('HOT HERBE ', ''))
          ) || []
          
          const units = productOrders.length
          const revenue = productOrders.reduce((sum, o) => sum + Number(o.total_amount), 0)
          const unitTotalCost = Number(product.unit_cost) + Number(product.manufacturing_cost) + 
                               Number(product.packaging_cost) + Number(product.shipping_cost)
          const cost = units * unitTotalCost
          const profit = revenue - cost
          const margin = revenue > 0 ? (profit / revenue) * 100 : 0
          
          totalCost += cost
          
          return {
            product: product.name,
            units,
            revenue,
            cost,
            profit,
            margin,
            contribution: 0
          }
        })
        
        // 利益貢献度の計算
        const totalProfit = totalRevenue - totalCost
        productAnalysis.forEach(p => {
          p.contribution = totalProfit > 0 ? (p.profit / totalProfit) * 100 : 0
        })
        
        setAnalysis({
          totalRevenue,
          totalCost,
          grossProfit: totalRevenue - totalCost,
          grossMargin: totalRevenue > 0 ? ((totalRevenue - totalCost) / totalRevenue) * 100 : 0,
          netProfit: totalRevenue - totalCost,
          netMargin: totalRevenue > 0 ? ((totalRevenue - totalCost) / totalRevenue) * 100 : 0,
          totalUnits,
          averageOrderValue: totalUnits > 0 ? totalRevenue / totalUnits : 0,
          returnRate: 0,
          costBreakdown: {
            productCost: inventoryProducts.reduce((sum, p) => sum + (Number(p.unit_cost) * Number(p.current_stock)), 0),
            shippingCost: inventoryProducts.reduce((sum, p) => sum + (Number(p.shipping_cost) * Number(p.current_stock)), 0),
            packagingCost: inventoryProducts.reduce((sum, p) => sum + (Number(p.packaging_cost) * Number(p.current_stock)), 0),
            marketingCost: 0,
            operationalCost: 0,
            otherCost: 0
          },
          monthlyTrends: [
            { month: '1月', revenue: totalRevenue, cost: totalCost, profit: totalRevenue - totalCost, margin: totalRevenue > 0 ? ((totalRevenue - totalCost) / totalRevenue) * 100 : 0, units: totalUnits },
            { month: '2月', revenue: 0, cost: 0, profit: 0, margin: 0, units: 0 },
            { month: '3月', revenue: 0, cost: 0, profit: 0, margin: 0, units: 0 },
            { month: '4月', revenue: 0, cost: 0, profit: 0, margin: 0, units: 0 },
            { month: '5月', revenue: 0, cost: 0, profit: 0, margin: 0, units: 0 },
            { month: '6月', revenue: 0, cost: 0, profit: 0, margin: 0, units: 0 }
          ],
          productAnalysis,
          channelAnalysis: [
            { channel: 'オンライン直販', revenue: totalRevenue, cost: totalCost, profit: totalRevenue - totalCost, margin: totalRevenue > 0 ? ((totalRevenue - totalCost) / totalRevenue) * 100 : 0, percentage: 100 },
            { channel: '卸売', revenue: 0, cost: 0, profit: 0, margin: 0, percentage: 0 },
            { channel: 'マーケットプレイス', revenue: 0, cost: 0, profit: 0, margin: 0, percentage: 0 },
            { channel: '実店舗', revenue: 0, cost: 0, profit: 0, margin: 0, percentage: 0 }
          ]
        })
      } else {
        // 在庫データがない場合は初期データを表示
        setProducts([])
        setAnalysis({
          totalRevenue: 0,
          totalCost: 0,
          grossProfit: 0,
          grossMargin: 0,
          netProfit: 0,
          netMargin: 0,
          totalUnits: 0,
          averageOrderValue: 0,
          returnRate: 0,
          costBreakdown: {
            productCost: 0,
            shippingCost: 0,
            packagingCost: 0,
            marketingCost: 0,
            operationalCost: 0,
            otherCost: 0
          },
          monthlyTrends: [
            { month: '1月', revenue: 0, cost: 0, profit: 0, margin: 0, units: 0 },
            { month: '2月', revenue: 0, cost: 0, profit: 0, margin: 0, units: 0 },
            { month: '3月', revenue: 0, cost: 0, profit: 0, margin: 0, units: 0 },
            { month: '4月', revenue: 0, cost: 0, profit: 0, margin: 0, units: 0 },
            { month: '5月', revenue: 0, cost: 0, profit: 0, margin: 0, units: 0 },
            { month: '6月', revenue: 0, cost: 0, profit: 0, margin: 0, units: 0 }
          ],
          productAnalysis: [],
          channelAnalysis: [
            { channel: 'オンライン直販', revenue: 0, cost: 0, profit: 0, margin: 0, percentage: 0 },
            { channel: '卸売', revenue: 0, cost: 0, profit: 0, margin: 0, percentage: 0 },
            { channel: 'マーケットプレイス', revenue: 0, cost: 0, profit: 0, margin: 0, percentage: 0 },
            { channel: '実店舗', revenue: 0, cost: 0, profit: 0, margin: 0, percentage: 0 }
          ]
        })
      }
      
      setLoading(false)
    } catch (error) {
      console.error('Error fetching analysis data:', error)
      setLoading(false)
    }
  }

  const handleAddProduct = async (productData: any) => {
    try {
      const { error } = await supabase
        .from('inventory_products')
        .insert({
          ...productData,
          current_stock: 0,
          reserved_stock: 0,
          available_stock: 0,
          reorder_point: 20,
          reorder_quantity: 100,
          lead_time: 14,
          category: 'サプリメント'
        })

      if (error) throw error

      await fetchAnalysisData()
      setShowAddProduct(false)
    } catch (error) {
      console.error('Error adding product:', error)
      alert('製品の追加に失敗しました')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!analysis) {
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
        <h1 className="text-2xl font-bold text-gray-800">損益分析ダッシュボード</h1>
        <div className="flex gap-3">
          <button
            onClick={() => setShowAddProduct(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            商品マスタ登録
          </button>
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
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {['overview', 'products', 'costs', 'trends'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab === 'overview' && '概要'}
              {tab === 'products' && '商品別分析'}
              {tab === 'costs' && 'コスト分析'}
              {tab === 'trends' && 'トレンド'}
            </button>
          ))}
        </nav>
      </div>

      {/* 概要タブ */}
      {activeTab === 'overview' && (
        <>
          {/* KPIカード */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">総売上</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    ¥{analysis.totalRevenue.toLocaleString()}
                  </p>
                  <p className="text-sm text-green-500 mt-2 flex items-center">
                    <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
                    前月比 +0%
                  </p>
                </div>
                <CurrencyYenIcon className="h-10 w-10 text-green-500" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">粗利益</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    ¥{Math.round(analysis.grossProfit).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    粗利率: {analysis.grossMargin.toFixed(1)}%
                  </p>
                </div>
                <ChartBarIcon className="h-10 w-10 text-blue-500" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">純利益</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    ¥{Math.round(analysis.netProfit).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    純利率: {analysis.netMargin.toFixed(1)}%
                  </p>
                </div>
                <BanknotesIcon className="h-10 w-10 text-purple-500" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">平均注文額</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    ¥{Math.round(analysis.averageOrderValue).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    総販売数: {analysis.totalUnits}
                  </p>
                </div>
                <ShoppingBagIcon className="h-10 w-10 text-orange-500" />
              </div>
            </div>
          </div>

          {/* 販売チャネル別分析 */}
          <div className="bg-white rounded-lg shadow mb-6">
            <div className="px-6 py-4 border-b">
              <h2 className="text-lg font-semibold">販売チャネル別分析</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {analysis.channelAnalysis.map((channel) => (
                  <div key={channel.channel} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <BuildingStorefrontIcon className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="font-medium">{channel.channel}</p>
                        <p className="text-sm text-gray-500">売上: ¥{channel.revenue.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-6">
                      <div className="text-right">
                        <p className="text-sm font-medium">¥{Math.round(channel.profit).toLocaleString()}</p>
                        <p className="text-xs text-gray-500">利益</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{channel.margin.toFixed(1)}%</p>
                        <p className="text-xs text-gray-500">利益率</p>
                      </div>
                      <div className="w-20">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${channel.percentage}%` }}
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{channel.percentage}%</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* コスト内訳 */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b">
              <h2 className="text-lg font-semibold">コスト内訳</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Object.entries(analysis.costBreakdown).map(([key, value]) => (
                  <div key={key} className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500">
                      {key === 'productCost' && '商品原価'}
                      {key === 'shippingCost' && '配送費'}
                      {key === 'packagingCost' && '梱包費'}
                      {key === 'marketingCost' && 'マーケティング費'}
                      {key === 'operationalCost' && '運営費'}
                      {key === 'otherCost' && 'その他'}
                    </p>
                    <p className="text-lg font-semibold mt-1">¥{value.toLocaleString()}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {analysis.totalCost > 0 ? ((value / analysis.totalCost) * 100).toFixed(1) : 0}%
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* 商品別分析タブ */}
      {activeTab === 'products' && (
        <>
          {/* 商品マスタ一覧 */}
          <div className="bg-white rounded-lg shadow mb-6">
            <div className="px-6 py-4 border-b">
              <h2 className="text-lg font-semibold">商品マスタ</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">商品名</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">SKU</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">仕入原価</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">製造原価</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">販売価格</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">粗利率</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">在庫数</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">在庫評価額</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {products.map((product) => {
                    const totalCost = Number(product.unit_cost) + Number(product.manufacturing_cost) + 
                                    Number(product.packaging_cost) + Number(product.shipping_cost)
                    const margin = ((Number(product.selling_price) - totalCost) / Number(product.selling_price)) * 100
                    const stockValue = Number(product.current_stock) * totalCost
                    
                    return (
                      <tr key={product.id}>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{product.name}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{product.sku}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">¥{Number(product.unit_cost).toLocaleString()}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">¥{Number(product.manufacturing_cost).toLocaleString()}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">¥{Number(product.selling_price).toLocaleString()}</td>
                        <td className="px-6 py-4 text-sm">
                          <span className={`font-medium ${margin > 50 ? 'text-green-600' : margin > 30 ? 'text-blue-600' : 'text-orange-600'}`}>
                            {margin.toFixed(1)}%
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">{product.current_stock}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">¥{stockValue.toLocaleString()}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
              {products.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  商品マスタが登録されていません
                </div>
              )}
            </div>
          </div>

          {/* 商品別損益分析 */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b">
              <h2 className="text-lg font-semibold">商品別損益分析</h2>
            </div>
            <div className="p-6">
              {analysis.productAnalysis.length > 0 ? (
                <div className="space-y-6">
                  {analysis.productAnalysis.map((product) => (
                    <div key={product.product} className="border-b pb-4 last:border-0">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-medium">{product.product}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          product.margin > 50 ? 'bg-green-100 text-green-800' :
                          product.margin > 30 ? 'bg-blue-100 text-blue-800' :
                          'bg-orange-100 text-orange-800'
                        }`}>
                          利益率: {product.margin.toFixed(1)}%
                        </span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">販売数</p>
                          <p className="font-medium">{product.units}個</p>
                        </div>
                        <div>
                          <p className="text-gray-500">売上</p>
                          <p className="font-medium">¥{product.revenue.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">原価</p>
                          <p className="font-medium">¥{Math.round(product.cost).toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">利益</p>
                          <p className="font-medium text-green-600">¥{Math.round(product.profit).toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">利益貢献度</p>
                          <p className="font-medium">{product.contribution.toFixed(1)}%</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  まだ販売データがありません
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* コスト分析タブ */}
      {activeTab === 'costs' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b">
              <h2 className="text-lg font-semibold">コスト構成比</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {Object.entries(analysis.costBreakdown).map(([key, value]) => {
                  const percentage = analysis.totalCost > 0 ? (value / analysis.totalCost) * 100 : 0
                  return (
                    <div key={key}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">
                          {key === 'productCost' && '商品原価'}
                          {key === 'shippingCost' && '配送費'}
                          {key === 'packagingCost' && '梱包費'}
                          {key === 'marketingCost' && 'マーケティング費'}
                          {key === 'operationalCost' && '運営費'}
                          {key === 'otherCost' && 'その他'}
                        </span>
                        <span className="text-sm text-gray-500">
                          ¥{value.toLocaleString()} ({percentage.toFixed(1)}%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
              <div className="mt-6 pt-4 border-t">
                <div className="flex justify-between">
                  <span className="font-semibold">総コスト</span>
                  <span className="font-semibold">¥{analysis.totalCost.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b">
              <h2 className="text-lg font-semibold">損益サマリー</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex justify-between py-2">
                <span className="text-gray-600">総売上</span>
                <span className="font-medium">¥{analysis.totalRevenue.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-2 border-t">
                <span className="text-gray-600">総原価</span>
                <span className="font-medium text-red-600">-¥{analysis.totalCost.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-2 border-t">
                <span className="font-semibold">粗利益</span>
                <div className="text-right">
                  <p className="font-semibold text-green-600">¥{Math.round(analysis.grossProfit).toLocaleString()}</p>
                  <p className="text-sm text-gray-500">({analysis.grossMargin.toFixed(1)}%)</p>
                </div>
              </div>
              <div className="flex justify-between py-2 border-t">
                <span className="font-semibold">純利益</span>
                <div className="text-right">
                  <p className="font-semibold text-green-600">¥{Math.round(analysis.netProfit).toLocaleString()}</p>
                  <p className="text-sm text-gray-500">({analysis.netMargin.toFixed(1)}%)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* トレンドタブ */}
      {activeTab === 'trends' && (
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b">
            <h2 className="text-lg font-semibold">月別推移</h2>
          </div>
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b">
                  <tr>
                    <th className="text-left py-2 px-4">月</th>
                    <th className="text-right py-2 px-4">売上</th>
                    <th className="text-right py-2 px-4">原価</th>
                    <th className="text-right py-2 px-4">利益</th>
                    <th className="text-right py-2 px-4">利益率</th>
                    <th className="text-right py-2 px-4">販売数</th>
                  </tr>
                </thead>
                <tbody>
                  {analysis.monthlyTrends.map((month) => (
                    <tr key={month.month} className="border-b">
                      <td className="py-3 px-4 font-medium">{month.month}</td>
                      <td className="py-3 px-4 text-right">¥{month.revenue.toLocaleString()}</td>
                      <td className="py-3 px-4 text-right text-red-600">¥{month.cost.toLocaleString()}</td>
                      <td className="py-3 px-4 text-right text-green-600">¥{Math.round(month.profit).toLocaleString()}</td>
                      <td className="py-3 px-4 text-right">
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                          month.margin > 50 ? 'bg-green-100 text-green-800' :
                          month.margin > 30 ? 'bg-blue-100 text-blue-800' :
                          month.margin > 0 ? 'bg-orange-100 text-orange-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {month.margin.toFixed(1)}%
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">{month.units}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 商品マスタ登録モーダル */}
      {showAddProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">商品マスタ登録</h2>
            <form onSubmit={(e) => {
              e.preventDefault()
              const formData = new FormData(e.currentTarget)
              const data = Object.fromEntries(formData)
              handleAddProduct({
                name: data.name,
                sku: data.sku,
                unit_cost: Number(data.unit_cost),
                manufacturing_cost: Number(data.manufacturing_cost),
                selling_price: Number(data.selling_price),
                wholesale_price: data.wholesale_price ? Number(data.wholesale_price) : null,
                shipping_cost: Number(data.shipping_cost),
                packaging_cost: Number(data.packaging_cost),
                min_stock: Number(data.min_stock),
                max_stock: Number(data.max_stock),
                supplier: data.supplier
              })
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">商品名</label>
                  <input
                    name="name"
                    type="text"
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
                  <input
                    name="sku"
                    type="text"
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">仕入原価</label>
                    <input
                      name="unit_cost"
                      type="number"
                      className="w-full px-3 py-2 border rounded-lg"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">製造原価</label>
                    <input
                      name="manufacturing_cost"
                      type="number"
                      className="w-full px-3 py-2 border rounded-lg"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">梱包費</label>
                    <input
                      name="packaging_cost"
                      type="number"
                      className="w-full px-3 py-2 border rounded-lg"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">配送費</label>
                    <input
                      name="shipping_cost"
                      type="number"
                      className="w-full px-3 py-2 border rounded-lg"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">販売価格</label>
                    <input
                      name="selling_price"
                      type="number"
                      className="w-full px-3 py-2 border rounded-lg"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">卸売価格</label>
                    <input
                      name="wholesale_price"
                      type="number"
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">最小在庫</label>
                    <input
                      name="min_stock"
                      type="number"
                      defaultValue="10"
                      className="w-full px-3 py-2 border rounded-lg"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">最大在庫</label>
                    <input
                      name="max_stock"
                      type="number"
                      defaultValue="1000"
                      className="w-full px-3 py-2 border rounded-lg"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">仕入先</label>
                  <input
                    name="supplier"
                    type="text"
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddProduct(false)}
                  className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  キャンセル
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  登録
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}