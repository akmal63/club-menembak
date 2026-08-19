'use client'

import { useState } from 'react'
import { THEME_PRESETS } from '@/lib/theme'

// Editor tema: pilih preset atau atur bebas 2 warna.
// Nilai dikirim lewat hidden input theme_primary & theme_accent.
export default function ThemeEditor({
  initialPrimary,
  initialAccent,
}: {
  initialPrimary: string
  initialAccent: string
}) {
  const [primary, setPrimary] = useState(initialPrimary || '#0a0e27')
  const [accent, setAccent] = useState(initialAccent || '#ff5e3a')

  function applyPreset(p: string, a: string) {
    setPrimary(p)
    setAccent(a)
  }

  return (
    <div className="space-y-4">
      {/* Pratinjau */}
      <div className="rounded-lg overflow-hidden border">
        <div className="p-4 flex items-center gap-3" style={{ background: primary }}>
          <span
            className="w-8 h-8 rounded-lg grid place-items-center text-white font-bold"
            style={{ background: accent }}
          >
            ◎
          </span>
          <span className="text-white font-display font-bold uppercase tracking-wide">
            Pratinjau Warna
          </span>
          <button
            type="button"
            className="ml-auto px-3 py-1.5 rounded-lg text-white text-sm font-semibold"
            style={{ background: accent }}
          >
            Tombol
          </button>
        </div>
      </div>

      {/* Preset */}
      <div>
        <p className="text-sm font-medium mb-2">Pilih Tema Siap Pakai</p>
        <div className="flex flex-wrap gap-2">
          {THEME_PRESETS.map((t) => {
            const active = primary === t.primary && accent === t.accent
            return (
              <button
                key={t.name}
                type="button"
                onClick={() => applyPreset(t.primary, t.accent)}
                className={
                  'flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-all ' +
                  (active ? 'border-[#ff5e3a] ring-2 ring-[#ff5e3a]/30' : 'hover:border-gray-400')
                }
                title={t.name}
              >
                <span className="flex">
                  <span className="w-4 h-4 rounded-l" style={{ background: t.primary }} />
                  <span className="w-4 h-4 rounded-r" style={{ background: t.accent }} />
                </span>
                {t.name}
              </button>
            )
          })}
        </div>
      </div>

      {/* Color picker bebas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Warna Utama (Primary)</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={primary}
              onChange={(e) => setPrimary(e.target.value)}
              className="w-12 h-10 rounded border cursor-pointer bg-white"
            />
            <input
              type="text"
              value={primary}
              onChange={(e) => setPrimary(e.target.value)}
              className="flex-1 border rounded-lg px-3 py-2 font-mono text-sm"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Warna Aksen (Accent)</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={accent}
              onChange={(e) => setAccent(e.target.value)}
              className="w-12 h-10 rounded border cursor-pointer bg-white"
            />
            <input
              type="text"
              value={accent}
              onChange={(e) => setAccent(e.target.value)}
              className="flex-1 border rounded-lg px-3 py-2 font-mono text-sm"
            />
          </div>
        </div>
      </div>

      {/* Nilai untuk dikirim ke server */}
      <input type="hidden" name="theme_primary" value={primary} />
      <input type="hidden" name="theme_accent" value={accent} />
    </div>
  )
}
