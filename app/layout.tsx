import type { Metadata } from 'next'
import './globals.css'
import { getSiteContent } from '@/lib/site-content'

export const metadata: Metadata = {
  title: 'Club Menembak',
  description: 'Sistem manajemen club menembak',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const c = await getSiteContent()
  const primary = c.theme?.primary || '#0a0e27'
  const accent = c.theme?.accent || '#ff5e3a'

  return (
    <html
      lang="id"
      style={
        {
          '--brand-primary': primary,
          '--brand-accent': accent,
        } as React.CSSProperties
      }
    >
      <body>{children}</body>
    </html>
  )
}
