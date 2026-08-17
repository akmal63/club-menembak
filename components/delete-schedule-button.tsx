'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { deleteSchedule } from '@/app/dashboard/schedules/actions'

export default function DeleteScheduleButton({
  id,
  title,
}: {
  id: string
  title: string
}) {
  const [pending, startTransition] = useTransition()
  const router = useRouter()

  function handleDelete() {
    if (!confirm(`Hapus jadwal "${title}"?`)) return
    startTransition(async () => {
      try {
        await deleteSchedule(id)
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
      className="text-red-600 hover:underline disabled:opacity-50"
    >
      {pending ? 'Menghapus...' : 'Hapus'}
    </button>
  )
}
