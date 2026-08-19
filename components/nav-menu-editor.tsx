'use client'

import { useState, useEffect } from 'react'
import type { NavItem } from '@/lib/site-content'

// Opsi cepat: section beranda + halaman yang tersedia.
// Dipakai untuk mengisi URL otomatis; admin tetap bisa ketik manual.
const URL_OPTIONS: { label: string; url: string; group: string }[] = [
  // Halaman
  { group: 'Halaman', label: 'Beranda', url: '/' },
  { group: 'Halaman', label: 'Database Anggota', url: '/anggota' },
  { group: 'Halaman', label: 'Berita (halaman penuh)', url: '/berita' },
  // Section beranda (anchor)
  { group: 'Section Beranda', label: 'Beranda (atas)', url: '/#beranda' },
  { group: 'Section Beranda', label: 'Tentang Kami', url: '/#tentang' },
  { group: 'Section Beranda', label: 'Visi Misi', url: '/#visimisi' },
  { group: 'Section Beranda', label: 'Galeri', url: '/#galeri' },
  { group: 'Section Beranda', label: 'Berita (section)', url: '/#berita' },
  { group: 'Section Beranda', label: 'Legalitas', url: '/#legalitas' },
  { group: 'Section Beranda', label: 'Kontak', url: '/#kontak' },
]

const DEFAULT_ROWS: NavItem[] = [
  { label: 'Beranda', url: '/#beranda', enabled: true },
  { label: 'Tentang Kami', url: '/#tentang', enabled: true },
  { label: 'Visi Misi', url: '/#visimisi', enabled: true },
  { label: 'Galeri', url: '/#galeri', enabled: true },
  { label: 'Berita', url: '/#berita', enabled: true },
  { label: 'Database Anggota', url: '/anggota', enabled: true },
  { label: 'Kontak', url: '/#kontak', enabled: true },
]

export default function NavMenuEditor({ initial }: { initial?: NavItem[] }) {
  // Selalu tampilkan 8 baris (isi awal dari data, sisanya kosong)
  const start = initial && initial.length ? initial : DEFAULT_ROWS
  const [rows, setRows] = useState<NavItem[]>(() => {
    const r = [...start]
    while (r.length < 8) r.push({ label: '', url: '', enabled: false })
    return r.slice(0, 8)
  })

  // Halaman dinamis (dari tabel pages) untuk ditambahkan ke dropdown
  const [dynamicPages, setDynamicPages] = useState<
    { label: string; url: string; group: string }[]
  >([])

  useEffect(() => {
    fetch('/api/pages-list')
      .then((r) => (r.ok ? r.json() : { pages: [] }))
      .then((d: { pages?: { slug: string; title: string }[] }) => {
        const opts = (d.pages ?? []).map((p) => ({
          group: 'Halaman Dinamis',
          label: p.title,
          url: `/halaman/${p.slug}`,
        }))
        setDynamicPages(opts)
      })
      .catch(() => setDynamicPages([]))
  }, [])

  const ALL_OPTIONS = [...URL_OPTIONS, ...dynamicPages]

  function update(i: number, patch: Partial<NavItem>) {
    setRows((prev) => prev.map((row, idx) => (idx === i ? { ...row, ...patch } : row)))
  }

  // Saat pilih dari dropdown: isi URL, dan jika label masih kosong, isi label juga.
  function pickPreset(i: number, url: string) {
    if (!url) return
    const opt = ALL_OPTIONS.find((o) => o.url === url)
    setRows((prev) =>
      prev.map((row, idx) =>
        idx === i
          ? {
              ...row,
              url,
              label: row.label || (opt ? opt.label.replace(/ \(.*\)$/, '') : row.label),
              enabled: true,
            }
          : row
      )
    )
  }

  const groups = Array.from(new Set(ALL_OPTIONS.map((o) => o.group)))

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-[#8890b5]">
        Atur menu navbar. Urutan mengikuti baris. Pilih tujuan dari daftar, atau
        ketik URL sendiri. Kosongkan Label &amp; URL untuk menghapus baris.
      </p>

      {rows.map((row, i) => (
        <div key={i} className="border rounded-lg p-3 space-y-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Label */}
            <div>
              <label className="block text-sm font-medium mb-1">Label {i + 1}</label>
              <input
                type="text"
                name={`nav_label_${i}`}
                value={row.label}
                onChange={(e) => update(i, { label: e.target.value })}
                placeholder="mis. Tentang Kami"
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>

            {/* URL + dropdown bantu */}
            <div>
              <label className="block text-sm font-medium mb-1">Tujuan / URL {i + 1}</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  name={`nav_url_${i}`}
                  value={row.url}
                  onChange={(e) => update(i, { url: e.target.value })}
                  placeholder="/anggota atau /#tentang"
                  className="flex-1 border rounded-lg px-3 py-2 font-mono text-sm"
                />
                <select
                  value=""
                  onChange={(e) => pickPreset(i, e.target.value)}
                  className="border rounded-lg px-2 py-2 bg-white text-sm max-w-[42%]"
                  title="Pilih tujuan yang tersedia"
                >
                  <option value="">Pilih…</option>
                  {groups.map((g) => (
                    <optgroup key={g} label={g}>
                      {ALL_OPTIONS.filter((o) => o.group === g).map((o) => (
                        <option key={o.url} value={o.url}>
                          {o.label}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name={`nav_enabled_${i}`}
              checked={row.enabled}
              onChange={(e) => update(i, { enabled: e.target.checked })}
              className="w-4 h-4 accent-[#ff5e3a]"
            />
            <span className="text-sm">Tampilkan di navbar</span>
          </label>
        </div>
      ))}
    </div>
  )
}
