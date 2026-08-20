import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { checkPermission } from '@/lib/permissions'
import { getSiteContent } from '@/lib/site-content'
import MemberForm from '@/components/member-form'
import { updateMember } from '../../actions'

export default async function EditMemberPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const canEdit = await checkPermission('members', 'edit')

  if (!canEdit) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-4">Edit Anggota</h1>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          Anda tidak punya izin untuk mengubah anggota.{' '}
          <Link href="/dashboard/members" className="underline">
            Kembali
          </Link>
        </div>
      </div>
    )
  }

  const supabase = await createClient()
  const { data: member } = await supabase
    .from('members')
    .select('*')
    .eq('id', id)
    .single()

  if (!member) notFound()

  const c = await getSiteContent()

  // Bungkus updateMember agar sesuai signature (prev, formData)
  const updateWithId = updateMember.bind(null, id)

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Edit Anggota</h1>
      <MemberForm
        action={updateWithId}
        initial={member}
        submitLabel="Simpan Perubahan"
        positionOptions={c.positionOptions}
        categoryOptions={c.categoryOptions}
      />
    </div>
  )
}
