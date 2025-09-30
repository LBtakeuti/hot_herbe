interface BarChartProps {
  data: { label: string; value: number }[]
  maxValue?: number
  color?: string
}

export default function BarChart({ data, maxValue, color = 'bg-green-500' }: BarChartProps) {
  const max = maxValue || Math.max(...data.map((d) => d.value), 1)

  return (
    <div className="space-y-3">
      {data.map((item, index) => (
        <div key={index} className="flex items-center justify-between">
          <span className="text-sm font-medium w-20">{item.label}</span>
          <div className="flex-1 mx-4">
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className={`${color} h-4 rounded-full`}
                style={{ width: `${(item.value / max) * 100}%` }}
              />
            </div>
          </div>
          <span className="text-sm text-gray-500 w-12 text-right">{item.value}</span>
        </div>
      ))}
    </div>
  )
}