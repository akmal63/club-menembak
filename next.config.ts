import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        // Ganti otomatis: domain Supabase Anda (contoh: xxxxx.supabase.co)
        // Pola ini mengizinkan semua subdomain supabase.co
        hostname: '**.supabase.co',
      },
    ],
  },
}

export default nextConfig
