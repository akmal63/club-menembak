'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { deleteEvent } from '@/app/dashboard/events/actions'
import ConfirmDialog from '@/components/confirm-dialog'
import { useToast } from '@/components/toast'

export default function DeleteEventButton({
  id,
  title,
}: {
  id: string
  title: string
}) {
  const [open, setOpen] = useState(false)
  const [pending, startTransition] = useTransition()
  const router = useRouter()
  const { success, error } = useToast()

  function handleConfirm() {
    startTransition(async () => {
      try {
        await deleteEvent(id)
        setOpen(false)
        success('Terhapus', `Kegiatan "${title}" berhasil dihapus.`)
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
        className="text-red-600 hover:underline"
      >
        Hapus
      </button>
      <ConfirmDialog
        open={open}
        title="Hapus Kegiatan?"
        message="Kegiatan {x} akan dihapus permanen."
        highlight={title}
        loading={pending}
        onConfirm={handleConfirm}
        onCancel={() => setOpen(false)}
      />
    </>
  )
}
