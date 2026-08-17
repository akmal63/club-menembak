'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import { siteContent } from '@/lib/site-content'

const LINKS = [
  { href: '#beranda', label: 'Beranda' },
  { href: '#tentang', label: 'Tentang Kami' },
  { href: '#visimisi', label: 'Visi Misi' },
  { href: '#galeri', label: 'Galeri' },
  { href: '#berita', label: 'Berita' },
  { href: '#kontak', label: 'Kontak' },
]

export default function PublicNavbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={
        'fixed top-0 left-0 right-0 z-50 transition-all ' +
        (scrolled ? 'bg-[#0a0e27] shadow-lg py-3' : 'bg-[#0a0e27]/90 py-4')
      }
    >
      <div className="max-w-6xl mx-auto px-5 flex items-center justify-between">
        {/* Logo */}
        <a href="#beranda" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg grid place-items-center text-white font-bold text-lg bg-gradient-to-br from-[#ff5e3a] to-[#ff8a3a]">
            ◎
          </div>
          <span className="font-display text-lg font-bold text-white uppercase tracking-wide hidden sm:block">
            {siteContent.clubName}
          </span>
        </a>

        {/* Menu desktop */}
        <nav className="hidden md:flex items-center gap-1">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="px-3 py-2 rounded-lg text-sm font-display font-semibold uppercase tracking-wide text-[#8890b5] hover:text-white hover:bg-[#151b3d] transition-colors"
            >
              {l.label}
            </a>
          ))}
          <Link
            href="/login"
            className="ml-2 px-4 py-2 rounded-lg text-sm font-display font-semibold uppercase tracking-wide text-white bg-gradient-to-br from-[#ff5e3a] to-[#ff8a3a] hover:opacity-90 transition-opacity"
          >
            Masuk
          </Link>
        </nav>

        {/* Tombol menu mobile */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-white p-1"
          aria-label="Menu"
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Menu mobile */}
      {open && (
        <nav className="md:hidden bg-[#0a0e27] border-t border-[#1e2547] px-5 py-3 space-y-1">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block px-3 py-2.5 rounded-lg text-sm font-display font-semibold uppercase tracking-wide text-[#8890b5] hover:text-white hover:bg-[#151b3d]"
            >
              {l.label}
            </a>
          ))}
          <Link
            href="/login"
            className="block px-3 py-2.5 rounded-lg text-sm font-display font-semibold uppercase tracking-wide text-white bg-gradient-to-br from-[#ff5e3a] to-[#ff8a3a] text-center"
          >
            Masuk
          </Link>
        </nav>
      )}
    </header>
  )
}
