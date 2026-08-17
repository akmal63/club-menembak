'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { deletePhoto } from '@/app/dashboard/gallery/actions'

export default function DeletePhotoButton({
  id,
  imageUrl,
}: {
  id: string
  imageUrl: string
}) {
  const [pending, startTransition] = useTransition()
  const router = useRouter()

  function handleDelete() {
    if (!confirm('Hapus foto ini?')) return
    startTransition(async () => {
      try {
        await deletePhoto(id, imageUrl)
        router.refresh()
      } catch (e) {
        alert(e instanceof Error ? e.message : 'Gagal menghapus.')
      }
    })
  }

  return (
    <button
      onClick={handleDelete}
      disabled={pending}
      className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded hover:bg-red-700 disabled:opacity-50"
    >
      {pending ? '...' : 'Hapus'}
    </button>
  )
}
