'use client'

import { useState, useTransition } from 'react'
import { deletePosition, togglePosition } from '@/app/dashboard/structure/actions'
import ConfirmDialog from '@/components/confirm-dialog'

export function DeletePositionButton({ id, name }: { id: string; name: string }) {
  const [open, setOpen] = useState(false)
  const [pending, start] = useTransition()

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-red-600 hover:underline"
        disabled={pending}
      >
        Hapus
      </button>
      <ConfirmDialog
        open={open}
        title="Hapus Posisi?"
        message="Posisi {x} akan dihapus dari struktur. Bawahannya (jika ada) akan menjadi posisi puncak."
        highlight={name}
        confirmLabel="Hapus"
        loading={pending}
        onCancel={() => setOpen(false)}
        onConfirm={() => {
          setOpen(false)
          start(() => deletePosition(id))
        }}
      />
    </>
  )
}

export function TogglePositionButton({ id, active }: { id: string; active: boolean }) {
  const [pending, start] = useTransition()
  return (
    <button
      onClick={() => start(() => togglePosition(id, !active))}
      disabled={pending}
      className={
        'text-xs font-semibold px-2 py-1 rounded ' +
        (active ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600')
      }
    >
      {active ? 'Aktif' : 'Nonaktif'}
    </button>
  )
}
