import { Product, StockHistory } from '@/types'

interface StockHistoryTableProps {
  history: StockHistory[]
  products: Product[]
}

export default function StockHistoryTable({ history, products }: StockHistoryTableProps) {
  if (history.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        在庫履歴がありません
      </div>
    )
  }

  return (
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
          {history.map((item) => {
            const product = products.find(p => p.id === item.product_id)
            return (
              <tr key={item.id}>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {new Date(item.created_at).toLocaleString('ja-JP')}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {product?.name || '-'}
                </td>
                <td className="px-6 py-4 text-sm">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                    ${item.type === 'in' ? 'bg-green-100 text-green-800' : ''}
                    ${item.type === 'out' ? 'bg-red-100 text-red-800' : ''}
                    ${item.type === 'adjustment' ? 'bg-blue-100 text-blue-800' : ''}
                  `}>
                    {item.type === 'in' ? '入庫' : item.type === 'out' ? '出庫' : '棚卸'}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {item.type === 'in' ? '+' : item.type === 'out' ? '-' : ''}
                  {item.quantity}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {item.previous_stock} → {item.new_stock}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {item.reason || '-'}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {item.reference_number || '-'}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}