import Link from 'next/link'
import { checkPermission } from '@/lib/permissions'
import MemberForm from '@/components/member-form'
import { createMember } from '../actions'

export default async function NewMemberPage() {
  const canCreate = await checkPermission('members', 'create')

  if (!canCreate) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-4">Tambah Anggota</h1>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          Anda tidak punya izin untuk menambah anggota.{' '}
          <Link href="/dashboard/members" className="underline">
            Kembali
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Tambah Anggota</h1>
      <MemberForm action={createMember} submitLabel="Simpan" />
    </div>
  )
}
