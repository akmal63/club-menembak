'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { deletePage, togglePage } from '@/app/dashboard/pages/actions'
import ConfirmDialog from '@/components/confirm-dialog'
import { useToast } from '@/components/toast'

export function DeletePageButton({ id, title }: { id: string; title: string }) {
  const [open, setOpen] = useState(false)
  const [pending, start] = useTransition()
  const router = useRouter()
  const { success, error } = useToast()

  function handleConfirm() {
    start(async () => {
      try {
        await deletePage(id)
        setOpen(false)
        success('Terhapus', `Halaman "${title}" berhasil dihapus.`)
        router.refresh()
      } catch (e) {
        setOpen(false)
        error('Gagal menghapus', e instanceof Error ? e.message : undefined)
      }
    })
  }

  return (
    <>
      <button onClick={() => setOpen(true)} className="text-red-600 hover:underline">
        Hapus
      </button>
      <ConfirmDialog
        open={open}
        title="Hapus Halaman?"
        message="Halaman {x} akan dihapus permanen."
        highlight={title}
        loading={pending}
        onConfirm={handleConfirm}
        onCancel={() => setOpen(false)}
      />
    </>
  )
}

export function TogglePageButton({ id, active }: { id: string; active: boolean }) {
  const [pending, start] = useTransition()
  const router = useRouter()
  const { error } = useToast()

  return (
    <button
      onClick={() => {
        start(async () => {
          try {
            await togglePage(id, !active)
            router.refresh()
          } catch (e) {
            error('Gagal mengubah', e instanceof Error ? e.message : undefined)
          }
        })
      }}
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
