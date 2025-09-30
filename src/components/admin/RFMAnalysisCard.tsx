interface RFMAnalysisCardProps {
  rfmAnalysis: {
    champions: number
    loyalCustomers: number
    potentialLoyalists: number
    newCustomers: number
    atRisk: number
    cantLose: number
  }
}

const rfmLabels: Record<string, string> = {
  champions: 'チャンピオン',
  loyalCustomers: 'ロイヤル顧客',
  potentialLoyalists: '潜在的ロイヤル',
  newCustomers: '新規顧客',
  atRisk: 'リスク顧客',
  cantLose: '離脱予備軍'
}

export default function RFMAnalysisCard({ rfmAnalysis }: RFMAnalysisCardProps) {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b">
        <h2 className="text-lg font-semibold">RFM分析</h2>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {Object.entries(rfmAnalysis).map(([key, value]) => (
            <div key={key} className="text-center">
              <p className="text-sm text-gray-500">
                {rfmLabels[key]}
              </p>
              <p className="text-2xl font-bold mt-1">{value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}