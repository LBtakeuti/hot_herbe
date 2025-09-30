'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import {
  CubeIcon,
  PlusIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  CurrencyYenIcon,
  CalculatorIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ChartBarIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline'
import StatCard from '@/components/admin/StatCard'
import ProductTable from '@/components/admin/ProductTable'
import StockHistoryTable from '@/components/admin/StockHistoryTable'
import { Product, StockHistory } from '@/types'

export default function InventoryManagement() {
  const [products, setProducts] = useState<Product[]>([])
  const [stockHistory, setStockHistory] = useState<StockHistory[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list')
  const [showProductForm, setShowProductForm] = useState(false)
  const [showStockAdjustment, setShowStockAdjustment] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [adjustmentType, setAdjustmentType] = useState<'in' | 'out' | 'adjustment'>('in')
  const [adjustmentQuantity, setAdjustmentQuantity] = useState(0)
  const [adjustmentReason, setAdjustmentReason] = useState('')
  const [referenceNumber, setReferenceNumber] = useState('')
  const supabase = createClientComponentClient()

  useEffect(() => {
    fetchProducts()
    fetchStockHistory()
  }, [])

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('inventory_products')
        .select('*')
        .order('name')

      if (error) {
        console.error('Error fetching products:', error)
        // If table doesn't exist, create initial data
        if (error.code === '42P01') {
          await initializeDatabase()
        }
      } else if (data) {
        setProducts(data)
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStockHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('stock_history')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50)

      if (error) {
        console.error('Error fetching stock history:', error)
      } else if (data) {
        setStockHistory(data)
      }
    } catch (error) {
      console.error('Error fetching stock history:', error)
    }
  }

  const initializeDatabase = async () => {
    // Create tables if they don't exist
    const { error: createTableError } = await supabase.rpc('exec_sql', {
      sql: `
        -- Create inventory_products table
        CREATE TABLE IF NOT EXISTS inventory_products (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          name TEXT NOT NULL,
          sku TEXT UNIQUE NOT NULL,
          category TEXT NOT NULL,
          unit_cost DECIMAL(10, 2) DEFAULT 0,
          manufacturing_cost DECIMAL(10, 2) DEFAULT 0,
          packaging_cost DECIMAL(10, 2) DEFAULT 0,
          shipping_cost DECIMAL(10, 2) DEFAULT 0,
          selling_price DECIMAL(10, 2) NOT NULL,
          wholesale_price DECIMAL(10, 2),
          current_stock INTEGER DEFAULT 0,
          reserved_stock INTEGER DEFAULT 0,
          available_stock INTEGER DEFAULT 0,
          min_stock INTEGER DEFAULT 10,
          max_stock INTEGER DEFAULT 1000,
          reorder_point INTEGER DEFAULT 20,
          reorder_quantity INTEGER DEFAULT 100,
          supplier TEXT,
          lead_time INTEGER DEFAULT 7,
          notes TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
        );

        -- Create stock_history table
        CREATE TABLE IF NOT EXISTS stock_history (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          product_id UUID REFERENCES inventory_products(id) ON DELETE CASCADE,
          type TEXT NOT NULL CHECK (type IN ('in', 'out', 'adjustment')),
          quantity INTEGER NOT NULL,
          reason TEXT,
          reference_number TEXT,
          previous_stock INTEGER NOT NULL,
          new_stock INTEGER NOT NULL,
          unit_cost DECIMAL(10, 2),
          total_value DECIMAL(10, 2),
          created_by TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
        );
      `
    })

    if (createTableError) {
      console.error('Error creating tables:', createTableError)
      return
    }

    // Insert initial products
    const initialProducts = [
      {
        name: 'HOT HERBE 30日分',
        sku: 'HOT-30D-001',
        category: 'サプリメント',
        unit_cost: 800,
        manufacturing_cost: 500,
        packaging_cost: 50,
        shipping_cost: 200,
        selling_price: 3980,
        current_stock: 0,
        reserved_stock: 0,
        available_stock: 0,
        min_stock: 50,
        max_stock: 500,
        reorder_point: 100,
        reorder_quantity: 200,
        supplier: 'ヘルスケア製造株式会社',
        lead_time: 14
      },
      {
        name: 'HOT HERBE 90日分（3個セット）',
        sku: 'HOT-90D-001',
        category: 'サプリメント',
        unit_cost: 2100,
        manufacturing_cost: 1400,
        packaging_cost: 100,
        shipping_cost: 300,
        selling_price: 9980,
        current_stock: 0,
        reserved_stock: 0,
        available_stock: 0,
        min_stock: 30,
        max_stock: 200,
        reorder_point: 50,
        reorder_quantity: 100,
        supplier: 'ヘルスケア製造株式会社',
        lead_time: 14
      },
      {
        name: 'HOT HERBE 180日分（6個セット）',
        sku: 'HOT-180D-001',
        category: 'サプリメント',
        unit_cost: 3900,
        manufacturing_cost: 2600,
        packaging_cost: 150,
        shipping_cost: 400,
        selling_price: 17980,
        current_stock: 0,
        reserved_stock: 0,
        available_stock: 0,
        min_stock: 20,
        max_stock: 100,
        reorder_point: 30,
        reorder_quantity: 50,
        supplier: 'ヘルスケア製造株式会社',
        lead_time: 14
      }
    ]

    const { error: insertError } = await supabase
      .from('inventory_products')
      .insert(initialProducts)

    if (insertError) {
      console.error('Error inserting initial products:', insertError)
    }

    // Fetch products again
    await fetchProducts()
  }

  const handleSaveProduct = async (productData: any) => {
    try {
      if (selectedProduct) {
        // Update existing product
        const { error } = await supabase
          .from('inventory_products')
          .update({
            ...productData,
            updated_at: new Date().toISOString()
          })
          .eq('id', selectedProduct.id)

        if (error) throw error
      } else {
        // Create new product
        const { error } = await supabase
          .from('inventory_products')
          .insert({
            ...productData,
            current_stock: 0,
            reserved_stock: 0,
            available_stock: 0
          })

        if (error) throw error
      }

      await fetchProducts()
      setShowProductForm(false)
      setSelectedProduct(null)
    } catch (error) {
      console.error('Error saving product:', error)
      alert('製品の保存に失敗しました')
    }
  }

  const handleStockAdjustment = async () => {
    if (!selectedProduct || adjustmentQuantity <= 0) return

    try {
      let newStock = selectedProduct.current_stock
      let actualQuantity = adjustmentQuantity

      if (adjustmentType === 'in') {
        newStock += adjustmentQuantity
      } else if (adjustmentType === 'out') {
        newStock -= adjustmentQuantity
        if (newStock < 0) {
          alert('在庫が不足しています')
          return
        }
      } else {
        newStock = adjustmentQuantity
        actualQuantity = adjustmentQuantity - selectedProduct.current_stock
      }

      // Record stock history
      const { error: historyError } = await supabase
        .from('stock_history')
        .insert({
          product_id: selectedProduct.id,
          type: adjustmentType,
          quantity: actualQuantity,
          reason: adjustmentReason,
          reference_number: referenceNumber,
          previous_stock: selectedProduct.current_stock,
          new_stock: newStock,
          unit_cost: selectedProduct.unit_cost,
          total_value: Math.abs(actualQuantity) * selectedProduct.unit_cost,
          created_by: 'admin'
        })

      if (historyError) throw historyError

      // Update product stock
      const { error: updateError } = await supabase
        .from('inventory_products')
        .update({
          current_stock: newStock,
          available_stock: newStock - selectedProduct.reserved_stock,
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedProduct.id)

      if (updateError) throw updateError

      await fetchProducts()
      await fetchStockHistory()
      setShowStockAdjustment(false)
      setAdjustmentQuantity(0)
      setAdjustmentReason('')
      setReferenceNumber('')
    } catch (error) {
      console.error('Error adjusting stock:', error)
      alert('在庫調整に失敗しました')
    }
  }

  const handleDeleteProduct = async (product: Product) => {
    if (!confirm(`${product.name}を削除してもよろしいですか？`)) return

    try {
      const { error } = await supabase
        .from('inventory_products')
        .delete()
        .eq('id', product.id)

      if (error) throw error

      await fetchProducts()
    } catch (error) {
      console.error('Error deleting product:', error)
      alert('製品の削除に失敗しました')
    }
  }

  const getStockStatus = (product: Product) => {
    const stockPercentage = (product.current_stock / product.max_stock) * 100

    if (product.current_stock === 0) {
      return { color: 'red', label: '在庫切れ', icon: ExclamationTriangleIcon }
    } else if (product.current_stock <= product.reorder_point) {
      return { color: 'orange', label: '発注必要', icon: ExclamationTriangleIcon }
    } else if (product.current_stock <= product.min_stock) {
      return { color: 'yellow', label: '在庫少', icon: ExclamationTriangleIcon }
    } else if (stockPercentage > 80) {
      return { color: 'blue', label: '在庫過多', icon: CheckCircleIcon }
    } else {
      return { color: 'green', label: '正常', icon: CheckCircleIcon }
    }
  }

  const getTotalInventoryValue = () => {
    return products.reduce((sum, product) => 
      sum + (product.current_stock * product.unit_cost), 0
    )
  }

  const getTotalPotentialRevenue = () => {
    return products.reduce((sum, product) => 
      sum + (product.current_stock * product.selling_price), 0
    )
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">在庫・原価管理</h1>
        <div className="flex gap-3">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 rounded ${viewMode === 'list' ? 'bg-white shadow' : ''}`}
            >
              リスト表示
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              className={`px-4 py-2 rounded ${viewMode === 'kanban' ? 'bg-white shadow' : ''}`}
            >
              カンバン表示
            </button>
          </div>
          <button
            onClick={() => {
              setSelectedProduct(null)
              setShowProductForm(true)
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <PlusIcon className="h-5 w-5" />
            製品追加
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="総在庫数"
          value={products.reduce((sum, p) => sum + p.current_stock, 0)}
          icon={CubeIcon}
          iconColor="text-blue-500"
          iconBgColor="bg-blue-100"
        />
        <StatCard
          title="在庫評価額"
          value={`¥${getTotalInventoryValue().toLocaleString()}`}
          icon={CurrencyYenIcon}
          iconColor="text-green-500"
          iconBgColor="bg-green-100"
        />
        <StatCard
          title="潜在売上高"
          value={`¥${getTotalPotentialRevenue().toLocaleString()}`}
          icon={ChartBarIcon}
          iconColor="text-purple-500"
          iconBgColor="bg-purple-100"
        />
        <StatCard
          title="発注必要"
          value={products.filter(p => p.current_stock <= p.reorder_point).length}
          icon={ExclamationTriangleIcon}
          iconColor="text-orange-500"
          iconBgColor="bg-orange-100"
        />
      </div>

      {/* Product List/Kanban View */}
      {viewMode === 'list' ? (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">製品名</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">SKU</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">在庫状況</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">現在在庫</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">原価</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">販売価格</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">粗利率</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {products.map((product) => {
                const status = getStockStatus(product)
                const totalCost = product.unit_cost + product.manufacturing_cost + 
                                product.packaging_cost + product.shipping_cost
                const grossMargin = ((product.selling_price - totalCost) / product.selling_price * 100).toFixed(1)
                
                return (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {product.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {product.sku}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                        ${status.color === 'red' ? 'bg-red-100 text-red-800' : ''}
                        ${status.color === 'orange' ? 'bg-orange-100 text-orange-800' : ''}
                        ${status.color === 'yellow' ? 'bg-yellow-100 text-yellow-800' : ''}
                        ${status.color === 'green' ? 'bg-green-100 text-green-800' : ''}
                        ${status.color === 'blue' ? 'bg-blue-100 text-blue-800' : ''}
                      `}>
                        {status.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div>
                        <span className="font-medium">{product.current_stock}</span>
                        <span className="text-gray-500"> / {product.max_stock}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div 
                          className={`h-2 rounded-full
                            ${status.color === 'red' ? 'bg-red-500' : ''}
                            ${status.color === 'orange' ? 'bg-orange-500' : ''}
                            ${status.color === 'yellow' ? 'bg-yellow-500' : ''}
                            ${status.color === 'green' ? 'bg-green-500' : ''}
                            ${status.color === 'blue' ? 'bg-blue-500' : ''}
                          `}
                          style={{ width: `${Math.min((product.current_stock / product.max_stock) * 100, 100)}%` }}
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      ¥{totalCost.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      ¥{product.selling_price.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`font-medium ${Number(grossMargin) > 50 ? 'text-green-600' : 'text-gray-900'}`}>
                        {grossMargin}%
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setSelectedProduct(product)
                            setShowStockAdjustment(true)
                          }}
                          className="text-blue-600 hover:text-blue-800"
                          title="在庫調整"
                        >
                          <CalculatorIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedProduct(product)
                            setShowProductForm(true)
                          }}
                          className="text-gray-600 hover:text-gray-800"
                          title="編集"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product)}
                          className="text-red-600 hover:text-red-800"
                          title="削除"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {products.map((product) => {
            const status = getStockStatus(product)
            const StatusIcon = status.icon
            const totalCost = product.unit_cost + product.manufacturing_cost + 
                            product.packaging_cost + product.shipping_cost
            const grossMargin = ((product.selling_price - totalCost) / product.selling_price * 100).toFixed(1)
            
            return (
              <div key={product.id} className="bg-white rounded-lg shadow p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-medium text-gray-900">{product.name}</h3>
                    <p className="text-sm text-gray-500">{product.sku}</p>
                  </div>
                  <StatusIcon className={`h-6 w-6
                    ${status.color === 'red' ? 'text-red-500' : ''}
                    ${status.color === 'orange' ? 'text-orange-500' : ''}
                    ${status.color === 'yellow' ? 'text-yellow-500' : ''}
                    ${status.color === 'green' ? 'text-green-500' : ''}
                    ${status.color === 'blue' ? 'text-blue-500' : ''}
                  `} />
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">在庫状況</span>
                    <span className={`font-medium
                      ${status.color === 'red' ? 'text-red-600' : ''}
                      ${status.color === 'orange' ? 'text-orange-600' : ''}
                      ${status.color === 'yellow' ? 'text-yellow-600' : ''}
                      ${status.color === 'green' ? 'text-green-600' : ''}
                      ${status.color === 'blue' ? 'text-blue-600' : ''}
                    `}>{status.label}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">現在在庫</span>
                    <span className="font-medium">{product.current_stock} / {product.max_stock}</span>
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full
                        ${status.color === 'red' ? 'bg-red-500' : ''}
                        ${status.color === 'orange' ? 'bg-orange-500' : ''}
                        ${status.color === 'yellow' ? 'bg-yellow-500' : ''}
                        ${status.color === 'green' ? 'bg-green-500' : ''}
                        ${status.color === 'blue' ? 'bg-blue-500' : ''}
                      `}
                      style={{ width: `${Math.min((product.current_stock / product.max_stock) * 100, 100)}%` }}
                    />
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">総原価</span>
                    <span className="font-medium">¥{totalCost.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">販売価格</span>
                    <span className="font-medium">¥{product.selling_price.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">粗利率</span>
                    <span className={`font-medium ${Number(grossMargin) > 50 ? 'text-green-600' : ''}`}>
                      {grossMargin}%
                    </span>
                  </div>

                  {product.current_stock <= product.reorder_point && (
                    <div className="bg-orange-50 border border-orange-200 rounded p-2 text-sm">
                      <p className="text-orange-800">発注推奨: {product.reorder_quantity}個</p>
                      <p className="text-orange-600 text-xs">リードタイム: {product.lead_time}日</p>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 pt-3 border-t">
                  <button
                    onClick={() => {
                      setSelectedProduct(product)
                      setShowStockAdjustment(true)
                    }}
                    className="flex-1 bg-blue-50 text-blue-600 py-2 rounded hover:bg-blue-100 text-sm font-medium"
                  >
                    在庫調整
                  </button>
                  <button
                    onClick={() => {
                      setSelectedProduct(product)
                      setShowProductForm(true)
                    }}
                    className="flex-1 bg-gray-50 text-gray-600 py-2 rounded hover:bg-gray-100 text-sm font-medium"
                  >
                    編集
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Stock Adjustment Modal */}
      {showStockAdjustment && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">在庫調整</h2>
            <p className="text-gray-600 mb-4">{selectedProduct.name}</p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  調整タイプ
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setAdjustmentType('in')}
                    className={`py-2 px-3 rounded border ${
                      adjustmentType === 'in' 
                        ? 'bg-green-50 border-green-500 text-green-700' 
                        : 'bg-white border-gray-300'
                    }`}
                  >
                    <ArrowUpIcon className="h-4 w-4 mx-auto mb-1" />
                    入庫
                  </button>
                  <button
                    onClick={() => setAdjustmentType('out')}
                    className={`py-2 px-3 rounded border ${
                      adjustmentType === 'out' 
                        ? 'bg-red-50 border-red-500 text-red-700' 
                        : 'bg-white border-gray-300'
                    }`}
                  >
                    <ArrowDownIcon className="h-4 w-4 mx-auto mb-1" />
                    出庫
                  </button>
                  <button
                    onClick={() => setAdjustmentType('adjustment')}
                    className={`py-2 px-3 rounded border ${
                      adjustmentType === 'adjustment' 
                        ? 'bg-blue-50 border-blue-500 text-blue-700' 
                        : 'bg-white border-gray-300'
                    }`}
                  >
                    <CalculatorIcon className="h-4 w-4 mx-auto mb-1" />
                    棚卸
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {adjustmentType === 'adjustment' ? '調整後在庫数' : '数量'}
                </label>
                <input
                  type="number"
                  value={adjustmentQuantity}
                  onChange={(e) => setAdjustmentQuantity(Number(e.target.value))}
                  className="w-full px-3 py-2 border rounded-lg"
                  min="0"
                />
                {adjustmentType !== 'adjustment' && (
                  <p className="text-sm text-gray-500 mt-1">
                    現在在庫: {selectedProduct.current_stock} → 
                    {adjustmentType === 'in' 
                      ? selectedProduct.current_stock + adjustmentQuantity
                      : selectedProduct.current_stock - adjustmentQuantity
                    }
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  理由
                </label>
                <input
                  type="text"
                  value={adjustmentReason}
                  onChange={(e) => setAdjustmentReason(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="入庫、出荷、棚卸差異など"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  参照番号（オプション）
                </label>
                <input
                  type="text"
                  value={referenceNumber}
                  onChange={(e) => setReferenceNumber(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="発注番号、出荷番号など"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowStockAdjustment(false)}
                className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                キャンセル
              </button>
              <button
                onClick={handleStockAdjustment}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                調整実行
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Product Form Modal */}
      {showProductForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl my-8">
            <h2 className="text-xl font-bold mb-4">
              {selectedProduct ? '製品編集' : '新規製品登録'}
            </h2>
            
            <form onSubmit={(e) => {
              e.preventDefault()
              const formData = new FormData(e.currentTarget)
              const data = Object.fromEntries(formData)
              handleSaveProduct({
                ...data,
                unit_cost: Number(data.unit_cost),
                manufacturing_cost: Number(data.manufacturing_cost),
                packaging_cost: Number(data.packaging_cost),
                shipping_cost: Number(data.shipping_cost),
                selling_price: Number(data.selling_price),
                wholesale_price: data.wholesale_price ? Number(data.wholesale_price) : null,
                min_stock: Number(data.min_stock),
                max_stock: Number(data.max_stock),
                reorder_point: Number(data.reorder_point),
                reorder_quantity: Number(data.reorder_quantity),
                lead_time: Number(data.lead_time)
              })
            }}>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">製品名</label>
                  <input
                    name="name"
                    type="text"
                    defaultValue={selectedProduct?.name}
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
                  <input
                    name="sku"
                    type="text"
                    defaultValue={selectedProduct?.sku}
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">カテゴリ</label>
                  <input
                    name="category"
                    type="text"
                    defaultValue={selectedProduct?.category || 'サプリメント'}
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                  />
                </div>

                <div className="col-span-2 border-t pt-4">
                  <h3 className="font-medium mb-3">原価設定</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">仕入原価</label>
                      <input
                        name="unit_cost"
                        type="number"
                        defaultValue={selectedProduct?.unit_cost || 0}
                        className="w-full px-3 py-2 border rounded-lg"
                        step="0.01"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">製造原価</label>
                      <input
                        name="manufacturing_cost"
                        type="number"
                        defaultValue={selectedProduct?.manufacturing_cost || 0}
                        className="w-full px-3 py-2 border rounded-lg"
                        step="0.01"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">梱包費</label>
                      <input
                        name="packaging_cost"
                        type="number"
                        defaultValue={selectedProduct?.packaging_cost || 0}
                        className="w-full px-3 py-2 border rounded-lg"
                        step="0.01"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">配送費</label>
                      <input
                        name="shipping_cost"
                        type="number"
                        defaultValue={selectedProduct?.shipping_cost || 0}
                        className="w-full px-3 py-2 border rounded-lg"
                        step="0.01"
                      />
                    </div>
                  </div>
                </div>

                <div className="col-span-2 border-t pt-4">
                  <h3 className="font-medium mb-3">価格設定</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">販売価格</label>
                      <input
                        name="selling_price"
                        type="number"
                        defaultValue={selectedProduct?.selling_price}
                        className="w-full px-3 py-2 border rounded-lg"
                        step="0.01"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">卸売価格（オプション）</label>
                      <input
                        name="wholesale_price"
                        type="number"
                        defaultValue={selectedProduct?.wholesale_price}
                        className="w-full px-3 py-2 border rounded-lg"
                        step="0.01"
                      />
                    </div>
                  </div>
                </div>

                <div className="col-span-2 border-t pt-4">
                  <h3 className="font-medium mb-3">在庫管理設定</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">最小在庫</label>
                      <input
                        name="min_stock"
                        type="number"
                        defaultValue={selectedProduct?.min_stock || 10}
                        className="w-full px-3 py-2 border rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">最大在庫</label>
                      <input
                        name="max_stock"
                        type="number"
                        defaultValue={selectedProduct?.max_stock || 1000}
                        className="w-full px-3 py-2 border rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">発注点</label>
                      <input
                        name="reorder_point"
                        type="number"
                        defaultValue={selectedProduct?.reorder_point || 20}
                        className="w-full px-3 py-2 border rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">発注数量</label>
                      <input
                        name="reorder_quantity"
                        type="number"
                        defaultValue={selectedProduct?.reorder_quantity || 100}
                        className="w-full px-3 py-2 border rounded-lg"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">仕入先</label>
                  <input
                    name="supplier"
                    type="text"
                    defaultValue={selectedProduct?.supplier}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">リードタイム（日）</label>
                  <input
                    name="lead_time"
                    type="number"
                    defaultValue={selectedProduct?.lead_time || 7}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">備考</label>
                  <textarea
                    name="notes"
                    defaultValue={selectedProduct?.notes}
                    className="w-full px-3 py-2 border rounded-lg"
                    rows={3}
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowProductForm(false)}
                  className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  キャンセル
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  保存
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Stock History */}
      <div className="mt-8 bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-semibold">在庫履歴</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">日時</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">製品</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">タイプ</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">数量</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">変更前→後</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">理由</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">参照番号</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {stockHistory.map((history) => {
                const product = products.find(p => p.id === history.product_id)
                return (
                  <tr key={history.id}>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {new Date(history.created_at).toLocaleString('ja-JP')}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {product?.name || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                        ${history.type === 'in' ? 'bg-green-100 text-green-800' : ''}
                        ${history.type === 'out' ? 'bg-red-100 text-red-800' : ''}
                        ${history.type === 'adjustment' ? 'bg-blue-100 text-blue-800' : ''}
                      `}>
                        {history.type === 'in' ? '入庫' : history.type === 'out' ? '出庫' : '棚卸'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {history.type === 'in' ? '+' : history.type === 'out' ? '-' : ''}
                      {history.quantity}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {history.previous_stock} → {history.new_stock}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {history.reason || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {history.reference_number || '-'}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {stockHistory.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              在庫履歴がありません
            </div>
          )}
        </div>
      </div>
    </div>
  )
}