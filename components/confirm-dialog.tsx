'use client'

import { useEffect, useRef } from 'react'
import { Trash2, AlertTriangle } from 'lucide-react'

type Props = {
  open: boolean
  title: string
  message?: string
  highlight?: string // teks yang ditebalkan di tengah pesan (mis. nama data)
  confirmLabel?: string
  cancelLabel?: string
  variant?: 'danger' | 'primary'
  loading?: boolean
  onConfirm: () => void
  onCancel: () => void
}

// Dialog konfirmasi reusable (Gaya 1: ikon lingkaran).
// Menutup dengan: tombol Batal, klik area luar, atau tombol Esc.
export default function ConfirmDialog({
  open,
  title,
  message,
  highlight,
  confirmLabel = 'Hapus',
  cancelLabel = 'Batal',
  variant = 'danger',
  loading = false,
  onConfirm,
  onCancel,
}: Props) {
  const confirmRef = useRef<HTMLButtonElement>(null)

  // Kunci scroll + fokus tombol + tutup dengan Esc
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    confirmRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onCancel])

  if (!open) return null

  const isDanger = variant === 'danger'

  return (
    <div
      className="fixed inset-0 z-[100] grid place-items-center px-4 bg-[#0a0e27]/50 backdrop-blur-sm animate-[fadeIn_.15s_ease-out]"
      onClick={onCancel}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
    >
      <div
        className="w-full max-w-xs bg-white rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(10,14,39,0.35)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 text-center">
          <div
            className={
              'w-13 h-13 rounded-full grid place-items-center mx-auto mb-4 ' +
              (isDanger ? 'bg-[#fde8e8] text-[#dc2626]' : 'bg-[#fff0eb] text-[#ff5e3a]')
            }
            style={{ width: '52px', height: '52px' }}
          >
            {isDanger ? <Trash2 className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
          </div>

          <h2
            id="confirm-title"
            className="font-display text-xl font-bold uppercase tracking-wide text-[#0a0e27] mb-1.5"
          >
            {title}
          </h2>

          {message && (
            <p className="text-sm text-[#3a3f5c] mb-5">
              {highlight ? (
                <>
                  {message.split('{x}')[0]}
                  <b className="text-[#0a0e27]">{highlight}</b>
                  {message.split('{x}')[1] ?? ''}
                </>
              ) : (
                message
              )}
            </p>
          )}

          <div className="flex gap-2.5">
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="flex-1 border border-[#e6e8f0] text-[#0a0e27] rounded-lg py-2.5 font-display font-semibold uppercase tracking-wide text-sm hover:bg-[#f5f6fb] disabled:opacity-50 transition-colors"
            >
              {cancelLabel}
            </button>
            <button
              ref={confirmRef}
              type="button"
              onClick={onConfirm}
              disabled={loading}
              className={
                'flex-1 rounded-lg py-2.5 font-display font-semibold uppercase tracking-wide text-sm text-white disabled:opacity-50 transition-colors ' +
                (isDanger
                  ? 'bg-[#dc2626] hover:bg-[#b91c1c]'
                  : 'bg-gradient-to-br from-[#ff5e3a] to-[#ff8a3a] hover:opacity-90')
              }
            >
              {loading ? 'Memproses...' : confirmLabel}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @media (prefers-reduced-motion: reduce) {
          .animate-\\[fadeIn_\\.15s_ease-out\\] { animation: none }
        }
      `}</style>
    </div>
  )
}
