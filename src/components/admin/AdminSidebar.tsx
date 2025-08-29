'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  HomeIcon, 
  ShoppingCartIcon, 
  UsersIcon,
  ChartBarIcon,
  CubeIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'

interface AdminSidebarProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}

export default function AdminSidebar({ isOpen, setIsOpen }: AdminSidebarProps) {
  const pathname = usePathname()

  const menuItems = [
    { href: '/admin', label: 'ダッシュボード', icon: HomeIcon },
    { href: '/admin/inventory', label: '在庫・原価管理', icon: CubeIcon },
    { href: '/admin/orders', label: '注文管理', icon: ShoppingCartIcon },
    { href: '/admin/customers', label: '顧客管理', icon: UsersIcon },
    { href: '/admin/analytics', label: '顧客分析', icon: ChartBarIcon },
    { href: '/admin/profit', label: '損益分析', icon: ChartBarIcon },
  ]

  return (
    <>
      <div className={`fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden ${
        isOpen ? 'block' : 'hidden'
      }`} onClick={() => setIsOpen(false)} />
      
      <div className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-gray-800 transform transition-transform md:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between h-16 px-4 bg-gray-900">
          <h2 className="text-xl font-semibold text-white">HOT Herbe Admin</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="md:hidden text-gray-300 hover:text-white"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        
        <nav className="mt-8 px-4">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 mb-2 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-gray-700 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>
      </div>
    </>
  )
}