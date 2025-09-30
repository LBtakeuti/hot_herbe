import { ArrowTrendingUpIcon } from '@heroicons/react/24/outline'

interface KPICardProps {
  title: string
  value: string | number
  subtext?: string
  icon: React.ComponentType<{ className?: string }>
  iconColor: string
}

export default function KPICard({
  title,
  value,
  subtext,
  icon: Icon,
  iconColor
}: KPICardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {value}
          </p>
          {subtext && (
            <p className="text-sm text-green-500 mt-2 flex items-center">
              <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
              {subtext}
            </p>
          )}
        </div>
        <Icon className={`h-10 w-10 ${iconColor}`} />
      </div>
    </div>
  )
}