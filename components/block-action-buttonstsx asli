'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronUp, ChevronDown } from 'lucide-react'
import {
  deleteBlock,
  toggleBlock,
  moveBlock,
} from '@/app/dashboard/content/actions'

export function MoveButtons({
  id,
  isFirst,
  isLast,
}: {
  id: string
  isFirst: boolean
  isLast: boolean
}) {
  const [pending, start] = useTransition()
  const router = useRouter()
  const move = (dir: 'up' | 'down') =>
    start(async () => {
      try {
        await moveBlock(id, dir)
        router.refresh()
      } catch (e) {
        alert(e instanceof Error ? e.message : 'Gagal.')
      }
    })
  return (
    <div className="flex flex-col">
      <button
        onClick={() => move('up')}
        disabled={pending || isFirst}
        className="text-[#8890b5] hover:text-[#0a0e27] disabled:opacity-20"
        aria-label="Naik"
      >
        <ChevronUp className="w-4 h-4" />
      </button>
      <button
        onClick={() => move('down')}
        disabled={pending || isLast}
        className="text-[#8890b5] hover:text-[#0a0e27] disabled:opacity-20"
        aria-label="Turun"
      >
        <ChevronDown className="w-4 h-4" />
      </button>
    </div>
  )
}

export function ToggleBlockButton({ id, active }: { id: string; active: boolean }) {
  const [pending, start] = useTransition()
  const router = useRouter()
  return (
    <button
      onClick={() =>
        start(async () => {
          try {
            await toggleBlock(id, !active)
            router.refresh()
          } catch (e) {
            alert(e instanceof Error ? e.message : 'Gagal.')
          }
        })
      }
      disabled={pending}
      className={
        'text-xs px-2 py-1 rounded font-medium disabled:opacity-50 ' +
        (active
          ? 'bg-green-50 text-green-700 hover:bg-green-100'
          : 'bg-gray-100 text-gray-500 hover:bg-gray-200')
      }
    >
      {pending ? '...' : active ? 'Aktif' : 'Nonaktif'}
    </button>
  )
}

export function DeleteBlockButton({ id, label }: { id: string; label: string }) {
  const [pending, start] = useTransition()
  const router = useRouter()
  return (
    <button
      onClick={() => {
        if (!confirm(`Hapus blok "${label}"? Tidak bisa dibatalkan.`)) return
        start(async () => {
          try {
            await deleteBlock(id)
            router.refresh()
          } catch (e) {
            alert(e instanceof Error ? e.message : 'Gagal.')
          }
        })
      }}
      disabled={pending}
      className="text-red-600 hover:underline disabled:opacity-50 text-sm"
    >
      {pending ? '...' : 'Hapus'}
    </button>
  )
}
