import AdminProvider from '@/components/admin/AdminProvider'

export const metadata = {
  title: 'HOT Herbe 管理画面',
  description: 'HOT Herbe 管理システム',
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AdminProvider>
      {children}
    </AdminProvider>
  )
}