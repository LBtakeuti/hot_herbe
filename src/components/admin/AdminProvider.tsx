'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import AdminSidebar from './AdminSidebar'
import AdminHeader from './AdminHeader'

interface AdminContextType {
  user: any
  loading: boolean
  signOut: () => Promise<void>
}

const AdminContext = createContext<AdminContextType>({
  user: null,
  loading: true,
  signOut: async () => {},
})

export const useAdmin = () => useContext(AdminContext)

export default function AdminProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClientComponentClient()

  // 初回マウント時のみ実行
  useEffect(() => {
    let mounted = true
    
    const checkUser = async () => {
      try {
        // ハードコード認証のチェック
        if (typeof window !== 'undefined') {
          const adminUser = localStorage.getItem('adminUser')
          const adminDemoMode = localStorage.getItem('adminDemoMode')
          
          // adminDemoModeがfalseで、adminUserが存在する場合は認証済みとする
          if (adminDemoMode === 'false' && adminUser) {
            if (mounted) {
              setUser(JSON.parse(adminUser))
              setLoading(false)
              return
            }
          }
        }

        const { data: { session } } = await supabase.auth.getSession()
        if (mounted) {
          setUser(session?.user ?? null)
          setLoading(false)
        }
      } catch (error) {
        console.error('Error checking user:', error)
        if (mounted) {
          setLoading(false)
        }
      }
    }

    checkUser()

    // 認証状態の監視
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return
        
        if (event === 'SIGNED_IN') {
          setUser(session?.user ?? null)
        } else if (event === 'SIGNED_OUT') {
          setUser(null)
          if (typeof window !== 'undefined') {
            localStorage.removeItem('adminDemoMode')
            localStorage.removeItem('adminUser')
          }
        }
      }
    )

    return () => {
      mounted = false
      authListener?.subscription.unsubscribe()
    }
  }, []) // 空の依存配列で初回のみ実行

  const signOut = async () => {
    // デモモードのクリア
    if (typeof window !== 'undefined') {
      localStorage.removeItem('adminDemoMode')
      localStorage.removeItem('adminUser')
    }
    
    await supabase.auth.signOut()
    setUser(null)
    router.push('/admin/login')
  }

  const isLoginPage = pathname === '/admin/login'

  // ローディング中
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // ログインページの場合
  if (isLoginPage) {
    return (
      <AdminContext.Provider value={{ user, loading, signOut }}>
        {children}
      </AdminContext.Provider>
    )
  }

  // 管理画面でユーザーがいない場合
  if (!user) {
    // 一度だけリダイレクト
    if (typeof window !== 'undefined') {
      window.location.href = '/admin/login'
    }
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // 認証済みユーザーの場合は管理画面を表示
  return (
    <AdminContext.Provider value={{ user, loading, signOut }}>
      <div className="flex h-screen bg-gray-100">
        <AdminSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <AdminHeader toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
            {children}
          </main>
        </div>
      </div>
    </AdminContext.Provider>
  )
}