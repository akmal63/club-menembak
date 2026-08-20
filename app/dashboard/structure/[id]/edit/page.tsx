import { createClient } from '@/lib/supabase/server'
import { checkPermission } from '@/lib/permissions'
import { redirect, notFound } from 'next/navigation'
import StructureForm, {
  type MemberOption,
  type ParentOption,
} from '@/components/structure-form'
import { updatePosition } from '../../actions'

type ParentRow = {
  id: string
  role_override: string | null
  member: { full_name: string | null; position: string | null } | null
}

export default async function EditPositionPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  if (!(await checkPermission('content', 'edit'))) redirect('/dashboard/structure')

  const supabase = await createClient()

  const { data: pos } = await supabase
    .from('org_structure')
    .select('id, member_id, parent_id, role_override, sort_order, is_active')
    .eq('id', id)
    .maybeSingle()
  if (!pos) notFound()

  const { data: memberData } = await supabase
    .from('members_public')
    .select('id, full_name, position')
    .order('full_name', { ascending: true })
  const members = (memberData ?? []) as MemberOption[]

  // Atasan: semua posisi KECUALI dirinya sendiri (agar tak jadi atasan sendiri)
  const { data: parentData } = await supabase
    .from('org_structure')
    .select('id, role_override, member:members(full_name, position)')
    .neq('id', id)
    .order('sort_order', { ascending: true })
  const parents: ParentOption[] = ((parentData ?? []) as unknown as ParentRow[]).map((p) => ({
    id: p.id,
    label: `${p.role_override || p.member?.position || 'Tanpa Jabatan'} — ${p.member?.full_name || 'Tanpa Nama'}`,
  }))

  const updateWithId = updatePosition.bind(null, id)

  return (
    <div>
      <h1 className="font-display text-2xl font-bold uppercase tracking-wide text-[#0a0e27] mb-6">
        Edit Posisi
      </h1>
      <StructureForm
        action={updateWithId}
        members={members}
        parents={parents}
        initial={{
          member_id: pos.member_id,
          parent_id: pos.parent_id,
          role_override: pos.role_override,
          sort_order: pos.sort_order,
          is_active: pos.is_active,
        }}
        submitLabel="Simpan Perubahan"
      />
    </div>
  )
}
