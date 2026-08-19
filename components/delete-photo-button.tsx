'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { deletePhoto } from '@/app/dashboard/gallery/actions'
import ConfirmDialog from '@/components/confirm-dialog'
import { useToast } from '@/components/toast'

export default function DeletePhotoButton({
  id,
  imageUrl,
}: {
  id: string
  imageUrl: string
}) {
  const [open, setOpen] = useState(false)
  const [pending, startTransition] = useTransition()
  const router = useRouter()
  const { success, error } = useToast()

  function handleConfirm() {
    startTransition(async () => {
      try {
        await deletePhoto(id, imageUrl)
        setOpen(false)
        success('Terhapus', 'Foto berhasil dihapus dari galeri.')
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
        className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded hover:bg-red-700"
      >
        Hapus
      </button>
      <ConfirmDialog
        open={open}
        title="Hapus Foto?"
        message="Foto ini akan dihapus permanen dari galeri."
        loading={pending}
        onConfirm={handleConfirm}
        onCancel={() => setOpen(false)}
      />
    </>
  )
}
