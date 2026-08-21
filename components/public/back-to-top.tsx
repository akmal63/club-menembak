'use client'

import { useEffect, useState } from 'react'
import { ArrowUp } from 'lucide-react'

// Tombol melayang untuk gulir cepat ke awal halaman.
// Muncul otomatis setelah pengguna menggulir turun melewati ambang tertentu.
// Warna mengikuti tema (grad-accent).
export default function BackToTop({ threshold = 400 }: { threshold?: number }) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > threshold)
    onScroll() // cek posisi awal
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [threshold])

  const toTop = () => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' })
  }

  return (
    <button
      type="button"
      onClick={toTop}
      aria-label="Kembali ke atas"
      title="Kembali ke atas"
      className={
        'fixed bottom-6 right-6 z-[120] w-12 h-12 rounded-full grid place-items-center ' +
        'text-white grad-accent shadow-[0_10px_25px_rgba(10,14,39,0.35)] ' +
        'transition-all duration-200 hover:opacity-90 ' +
        (show
          ? 'opacity-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 translate-y-3 pointer-events-none')
      }
    >
      <ArrowUp className="w-5 h-5" />
    </button>
  )
}
