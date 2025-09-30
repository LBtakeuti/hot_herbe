import { PencilIcon, TrashIcon, CalculatorIcon } from '@heroicons/react/24/outline'
import { Product } from '@/types'

interface ProductTableProps {
  products: Product[]
  onEdit: (product: Product) => void
  onDelete: (product: Product) => void
  onStockAdjustment: (product: Product) => void
  getStockStatus: (product: Product) => {
    color: string
    label: string
    icon: React.ComponentType<{ className?: string }>
  }
}

export default function ProductTable({
  products,
  onEdit,
  onDelete,
  onStockAdjustment,
  getStockStatus
}: ProductTableProps) {
  return (
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
                      onClick={() => onStockAdjustment(product)}
                      className="text-blue-600 hover:text-blue-800"
                      title="在庫調整"
                    >
                      <CalculatorIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => onEdit(product)}
                      className="text-gray-600 hover:text-gray-800"
                      title="編集"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => onDelete(product)}
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
  )
}