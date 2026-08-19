'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronUp, ChevronDown, Eye, EyeOff } from 'lucide-react'
import { deleteBlock, toggleBlock, moveBlock } from '@/app/dashboard/content/actions'
import ConfirmDialog from '@/components/confirm-dialog'
import { useToast } from '@/components/toast'

// ===== Urutkan (naik/turun) =====
export function MoveButtons({
  id,
  isFirst,
  isLast,
}: {
  id: string
  isFirst: boolean
  isLast: boolean
}) {
  const [pending, startTransition] = useTransition()
  const router = useRouter()

  function move(dir: 'up' | 'down') {
    startTransition(async () => {
      await moveBlock(id, dir)
      router.refresh()
    })
  }

  return (
    <div className="flex flex-col gap-1">
      <button
        onClick={() => move('up')}
        disabled={isFirst || pending}
        className="text-[#8890b5] hover:text-[#0a0e27] disabled:opacity-30"
        aria-label="Naikkan"
      >
        <ChevronUp className="w-4 h-4" />
      </button>
      <button
        onClick={() => move('down')}
        disabled={isLast || pending}
        className="text-[#8890b5] hover:text-[#0a0e27] disabled:opacity-30"
        aria-label="Turunkan"
      >
        <ChevronDown className="w-4 h-4" />
      </button>
    </div>
  )
}

// ===== Aktif / Nonaktif =====
export function ToggleBlockButton({ id, active }: { id: string; active: boolean }) {
  const [pending, startTransition] = useTransition()
  const router = useRouter()

  function toggle() {
    startTransition(async () => {
      await toggleBlock(id, !active)
      router.refresh()
    })
  }

  return (
    <button
      onClick={toggle}
      disabled={pending}
      className="text-[#8890b5] hover:text-[#0a0e27] disabled:opacity-50 flex items-center gap-1.5 text-sm"
      title={active ? 'Sedang tampil — klik untuk sembunyikan' : 'Tersembunyi — klik untuk tampilkan'}
    >
      {active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
    </button>
  )
}

// ===== Hapus blok =====
export function DeleteBlockButton({ id, label }: { id: string; label: string }) {
  const [open, setOpen] = useState(false)
  const [pending, startTransition] = useTransition()
  const router = useRouter()
  const { success, error } = useToast()

  function handleConfirm() {
    startTransition(async () => {
      try {
        await deleteBlock(id)
        setOpen(false)
        success('Terhapus', `Blok "${label}" berhasil dihapus.`)
        router.refresh()
      } catch (e) {
        setOpen(false)
        error('Gagal menghapus', e instanceof Error ? e.message : undefined)
      }
    })
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-red-600 hover:underline text-sm"
      >
        Hapus
      </button>
      <ConfirmDialog
        open={open}
        title="Hapus Blok?"
        message="Blok {x} akan dihapus dari beranda."
        highlight={label}
        loading={pending}
        onConfirm={handleConfirm}
        onCancel={() => setOpen(false)}
      />
    </>
  )
}
