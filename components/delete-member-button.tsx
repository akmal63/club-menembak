'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { deleteMember } from '@/app/dashboard/members/actions'
import ConfirmDialog from '@/components/confirm-dialog'
import { useToast } from '@/components/toast'

export default function DeleteMemberButton({
  id,
  name,
}: {
  id: string
  name: string
}) {
  const [open, setOpen] = useState(false)
  const [pending, startTransition] = useTransition()
  const router = useRouter()
  const { success, error } = useToast()

  function handleConfirm() {
    startTransition(async () => {
      try {
        await deleteMember(id)
        setOpen(false)
        success('Terhapus', `Anggota "${name}" berhasil dihapus.`)
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
        title="Hapus Anggota?"
        message="Data {x} akan dihapus permanen. Tindakan ini tidak dapat dibatalkan."
        highlight={name}
        loading={pending}
        onConfirm={handleConfirm}
        onCancel={() => setOpen(false)}
      />
    </>
  )
}
