'use client'

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from 'react'
import { Check, X, AlertTriangle } from 'lucide-react'

type ToastKind = 'success' | 'error'
type ToastItem = { id: number; kind: ToastKind; title: string; message?: string }

type ToastCtx = {
  toast: (kind: ToastKind, title: string, message?: string) => void
  success: (title: string, message?: string) => void
  error: (title: string, message?: string) => void
}

const Ctx = createContext<ToastCtx | null>(null)

// Provider toast — bungkus di layout dashboard (atau root) agar bisa dipakai di mana saja.
export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([])

  const remove = useCallback((id: number) => {
    setItems((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const toast = useCallback(
    (kind: ToastKind, title: string, message?: string) => {
      const id = Date.now() + Math.random()
      setItems((prev) => [...prev, { id, kind, title, message }])
    },
    []
  )

  const value: ToastCtx = {
    toast,
    success: (t, m) => toast('success', t, m),
    error: (t, m) => toast('error', t, m),
  }

  return (
    <Ctx.Provider value={value}>
      {children}
      <div className="fixed top-4 right-4 z-[200] flex flex-col gap-2.5 w-[330px] max-w-[calc(100vw-2rem)]">
        {items.map((t) => (
          <ToastCard key={t.id} item={t} onDone={() => remove(t.id)} />
        ))}
      </div>
    </Ctx.Provider>
  )
}

function ToastCard({ item, onDone }: { item: ToastItem; onDone: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onDone, 3200)
    return () => clearTimeout(timer)
  }, [onDone])

  const ok = item.kind === 'success'

  return (
    <div
      className="bg-white rounded-xl p-3.5 flex items-center gap-3 shadow-[0_12px_30px_rgba(10,14,39,0.25)] animate-[slideIn_.2s_ease-out]"
      style={{ borderLeft: `4px solid ${ok ? '#16a34a' : '#dc2626'}` }}
      role="status"
    >
      <span
        className="w-9 h-9 rounded-lg grid place-items-center flex-none"
        style={{
          background: ok ? '#e7f6ec' : '#fde8e8',
          color: ok ? '#16a34a' : '#dc2626',
        }}
      >
        {ok ? <Check className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
      </span>
      <div className="min-w-0">
        <b className="block font-display uppercase tracking-wide text-[15px] text-[#0a0e27] leading-tight">
          {item.title}
        </b>
        {item.message && (
          <span className="text-[12.5px] text-[#8890b5] break-words">{item.message}</span>
        )}
      </div>
      <button
        onClick={onDone}
        className="ml-auto text-[#8890b5] hover:text-[#0a0e27] flex-none"
        aria-label="Tutup notifikasi"
      >
        <X className="w-4 h-4" />
      </button>

      <style>{`
        @keyframes slideIn { from { opacity:0; transform: translateX(20px) } to { opacity:1; transform:none } }
        @media (prefers-reduced-motion: reduce) {
          .animate-\\[slideIn_\\.2s_ease-out\\] { animation: none }
        }
      `}</style>
    </div>
  )
}

// Hook pemakaian: const { success, error } = useToast()
export function useToast() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useToast harus dipakai di dalam <ToastProvider>')
  return ctx
}
