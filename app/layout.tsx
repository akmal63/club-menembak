import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Club Menembak',
  description: 'Sistem manajemen club menembak',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  )
}
