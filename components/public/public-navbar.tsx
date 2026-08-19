'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'

type NavItem = { label: string; url: string; enabled: boolean }

// Menu default bila tidak ada navMenu dari pengaturan.
const DEFAULT_LINKS: NavItem[] = [
  { label: 'Beranda', url: '/#beranda', enabled: true },
  { label: 'Tentang Kami', url: '/#tentang', enabled: true },
  { label: 'Visi Misi', url: '/#visimisi', enabled: true },
  { label: 'Galeri', url: '/#galeri', enabled: true },
  { label: 'Berita', url: '/#berita', enabled: true },
  { label: 'Database Anggota', url: '/anggota', enabled: true },
  { label: 'Kontak', url: '/#kontak', enabled: true },
]

export default function PublicNavbar({
  clubName,
  logoUrl,
  navMenu,
}: {
  clubName: string
  logoUrl?: string
  navMenu?: NavItem[]
}) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  // Pakai menu dari pengaturan (yang aktif); fallback ke default.
  const LINKS = (navMenu && navMenu.length ? navMenu : DEFAULT_LINKS).filter(
    (l) => l.enabled && l.label && l.url
  )

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={'fixed top-0 left-0 right-0 z-50 transition-all ' + (scrolled ? 'shadow-lg py-3' : 'py-4')}
      style={{ backgroundColor: 'var(--brand-primary)' }}
    >
      <div className="max-w-7xl mx-auto px-5 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/#beranda" className="flex items-center gap-2.5">
          {logoUrl ? (
            <span className="relative w-9 h-9 rounded-lg overflow-hidden bg-white grid place-items-center">
              <Image src={logoUrl} alt={clubName} fill sizes="36px" className="object-contain" />
            </span>
          ) : (
            <span className="w-9 h-9 rounded-lg grid place-items-center text-white font-bold text-lg grad-accent">
              ◎
            </span>
          )}
          <span className="font-display text-lg font-bold text-white uppercase tracking-wide hidden sm:block shrink-0">
            {clubName}
          </span>
        </Link>

        {/* Menu desktop */}
        <nav className="hidden lg:flex items-center gap-0.5">
          {LINKS.map((l) => (
            <Link
              key={l.url}
              href={l.url}
              className="px-2.5 py-2 rounded-lg text-sm font-display font-semibold uppercase tracking-wide text-[#8890b5] hover:text-white hover:bg-[#151b3d] transition-colors whitespace-nowrap"
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/login"
            className="ml-2 px-4 py-2 rounded-lg text-sm font-display font-semibold uppercase tracking-wide text-white grad-accent hover:opacity-90 transition-opacity whitespace-nowrap shrink-0"
          >
            Masuk
          </Link>
        </nav>

        {/* Tombol menu mobile */}
        <button
          onClick={() => setOpen(!open)}
          className="lg:hidden text-white p-1"
          aria-label="Menu"
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Menu mobile */}
      {open && (
        <nav className="lg:hidden bg-[#0a0e27] border-t border-[#1e2547] px-5 py-3 space-y-1">
          {LINKS.map((l) => (
            <Link
              key={l.url}
              href={l.url}
              onClick={() => setOpen(false)}
              className="block px-3 py-2.5 rounded-lg text-sm font-display font-semibold uppercase tracking-wide text-[#8890b5] hover:text-white hover:bg-[#151b3d]"
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/login"
            className="block px-3 py-2.5 rounded-lg text-sm font-display font-semibold uppercase tracking-wide text-white grad-accent text-center"
          >
            Masuk
          </Link>
        </nav>
      )}
    </header>
  )
}
