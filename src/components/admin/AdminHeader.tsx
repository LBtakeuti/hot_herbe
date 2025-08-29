'use client'

import { useAdmin } from './AdminProvider'
import { Bars3Icon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline'

interface AdminHeaderProps {
  toggleSidebar: () => void
}

export default function AdminHeader({ toggleSidebar }: AdminHeaderProps) {
  const { user, signOut } = useAdmin()

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between h-16 px-6">
        <button
          onClick={toggleSidebar}
          className="md:hidden text-gray-600 hover:text-gray-900"
        >
          <Bars3Icon className="h-6 w-6" />
        </button>
        
        <div className="flex items-center gap-4 ml-auto">
          <span className="text-gray-600">{user?.email}</span>
          <button
            onClick={signOut}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowRightOnRectangleIcon className="h-5 w-5" />
            <span>ログアウト</span>
          </button>
        </div>
      </div>
    </header>
  )
}