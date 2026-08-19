'use client'

import { useEffect, useState } from 'react'
import QRCode from 'qrcode'

// Membuat QR berisi URL halaman kartu ini sendiri.
// Dibuat di client karena butuh window.location (URL lengkap termasuk domain).
export default function MemberQr() {
  const [src, setSrc] = useState<string>('')

  useEffect(() => {
    const url = window.location.href
    QRCode.toDataURL(url, {
      width: 128,
      margin: 1,
      color: { dark: '#0a0e27', light: '#ffffff' },
    })
      .then(setSrc)
      .catch(() => setSrc(''))
  }, [])

  if (!src) {
    return <div className="w-32 h-32 rounded-lg bg-[#f0f2f8] animate-pulse" />
  }

  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt="QR data anggota" width={128} height={128} className="rounded-lg" />
}
