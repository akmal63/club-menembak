'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { deleteAccount } from '@/app/dashboard/settings/account-actions'

export default function DeleteAccountButton({
  userId,
  name,
}: {
  userId: string
  name: string
}) {
  const [pending, startTransition] = useTransition()
  const router = useRouter()

  function handleDelete() {
    if (!confirm(`Hapus akun "${name}"? Akun tidak bisa dipulihkan.`)) return
    startTransition(async () => {
      try {
        await deleteAccount(userId)
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
      className="text-red-600 hover:underline disabled:opacity-50 text-sm"
    >
      {pending ? 'Menghapus...' : 'Hapus'}
    </button>
  )
}
