import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'HOT HERBE - 天然温感クリーム',
  description: '天然成分をブレンドしたHOT HERBEクリームで、心地よい温感とリラクゼーションを体験してください。筋肉や関節をやさしく温めます。',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  )
}