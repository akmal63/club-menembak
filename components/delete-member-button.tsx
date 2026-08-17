'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { deleteMember } from '@/app/dashboard/members/actions'

export default function DeleteMemberButton({
  id,
  name,
}: {
  id: string
  name: string
}) {
  const [pending, startTransition] = useTransition()
  const router = useRouter()

  function handleDelete() {
    if (!confirm(`Hapus anggota "${name}"? Tindakan ini tidak bisa dibatalkan.`)) {
      return
    }
    startTransition(async () => {
      try {
        await deleteMember(id)
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
