'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { deleteNews, toggleNews } from '@/app/dashboard/news/actions'

export function DeleteNewsButton({ id, title }: { id: string; title: string }) {
  const [pending, start] = useTransition()
  const router = useRouter()
  return (
    <button
      onClick={() => {
        if (!confirm(`Hapus berita "${title}"?`)) return
        start(async () => {
          try {
            await deleteNews(id)
            router.refresh()
          } catch (e) {
            alert(e instanceof Error ? e.message : 'Gagal menghapus.')
          }
        })
      }}
      disabled={pending}
      className="text-red-600 hover:underline disabled:opacity-50"
    >
      {pending ? '...' : 'Hapus'}
    </button>
  )
}

export function ToggleNewsButton({
  id,
  active,
}: {
  id: string
  active: boolean
}) {
  const [pending, start] = useTransition()
  const router = useRouter()
  return (
    <button
      onClick={() => {
        start(async () => {
          try {
            await toggleNews(id, !active)
            router.refresh()
          } catch (e) {
            alert(e instanceof Error ? e.message : 'Gagal mengubah.')
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
