'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { deleteAccount } from '@/app/dashboard/settings/account-actions'
import ConfirmDialog from '@/components/confirm-dialog'
import { useToast } from '@/components/toast'

export default function DeleteAccountButton({
  userId,
  name,
}: {
  userId: string
  name: string
}) {
  const [open, setOpen] = useState(false)
  const [pending, startTransition] = useTransition()
  const router = useRouter()
  const { success, error } = useToast()

  function handleConfirm() {
    startTransition(async () => {
      try {
        await deleteAccount(userId)
        setOpen(false)
        success('Terhapus', `Akun "${name}" berhasil dihapus.`)
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
        title="Hapus Akun?"
        message="Akun {x} akan dihapus dan tidak bisa dipulihkan."
        highlight={name}
        loading={pending}
        onConfirm={handleConfirm}
        onCancel={() => setOpen(false)}
      />
    </>
  )
}
