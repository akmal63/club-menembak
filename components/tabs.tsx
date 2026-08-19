'use client'

import { useState, type ReactNode } from 'react'

type Tab = { key: string; label: string; content: ReactNode }

// Tabs sederhana. Semua konten tetap ter-render (hanya disembunyikan via CSS)
// agar form di dalam tab tak kehilangan nilai saat pindah tab.
export default function Tabs({
  tabs,
  initial,
}: {
  tabs: Tab[]
  initial?: string
}) {
  const [active, setActive] = useState(initial ?? tabs[0]?.key)

  return (
    <div>
      {/* Bar tab */}
      <div className="flex flex-wrap gap-1 border-b mb-6">
        {tabs.map((t) => {
          const on = t.key === active
          return (
            <button
              key={t.key}
              type="button"
              onClick={() => setActive(t.key)}
              className={
                'px-4 py-2.5 font-display font-semibold uppercase tracking-wide text-sm -mb-px border-b-2 transition-colors ' +
                (on
                  ? 'border-accent text-accent'
                  : 'border-transparent text-[#8890b5] hover:text-[#0a0e27]')
              }
            >
              {t.label}
            </button>
          )
        })}
      </div>

      {/* Konten: semua dirender, hanya yang aktif tampil */}
      {tabs.map((t) => (
        <div key={t.key} className={t.key === active ? '' : 'hidden'}>
          {t.content}
        </div>
      ))}
    </div>
  )
}
