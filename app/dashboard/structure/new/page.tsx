import { createClient } from '@/lib/supabase/server'
import { checkPermission } from '@/lib/permissions'
import { redirect } from 'next/navigation'
import StructureForm, {
  type MemberOption,
  type ParentOption,
} from '@/components/structure-form'
import { createPosition } from '../actions'

type ParentRow = {
  id: string
  role_override: string | null
  member: { full_name: string | null; position: string | null } | null
}

export default async function NewPositionPage() {
  if (!(await checkPermission('content', 'edit'))) redirect('/dashboard/structure')

  const supabase = await createClient()

  // Daftar anggota untuk dropdown
  const { data: memberData } = await supabase
    .from('members_public')
    .select('id, full_name, position')
    .order('full_name', { ascending: true })
  const members = (memberData ?? []) as MemberOption[]

  // Daftar posisi yang sudah ada (untuk dropdown atasan)
  const { data: parentData } = await supabase
    .from('org_structure')
    .select('id, role_override, member:members(full_name, position)')
    .order('sort_order', { ascending: true })
  const parents: ParentOption[] = ((parentData ?? []) as unknown as ParentRow[]).map((p) => ({
    id: p.id,
    label: `${p.role_override || p.member?.position || 'Tanpa Jabatan'} — ${p.member?.full_name || 'Tanpa Nama'}`,
  }))

  return (
    <div>
      <h1 className="font-display text-2xl font-bold uppercase tracking-wide text-[#0a0e27] mb-6">
        Tambah Posisi
      </h1>
      <StructureForm
        action={createPosition}
        members={members}
        parents={parents}
        submitLabel="Simpan Posisi"
      />
    </div>
  )
}
