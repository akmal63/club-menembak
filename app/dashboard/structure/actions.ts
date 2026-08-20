'use server'

import { createClient } from '@/lib/supabase/server'
import { checkPermission } from '@/lib/permissions'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export type StructureState = { error: string } | null

// Izin: menumpang 'content' (konsisten dengan menu Halaman).
async function canEdit() {
  return checkPermission('content', 'edit')
}

function parse(formData: FormData) {
  const g = (k: string) => {
    const v = formData.get(k)
    return typeof v === 'string' ? v.trim() : ''
  }
  const memberId = g('member_id')
  const parentRaw = g('parent_id')
  const roleOverride = g('role_override')
  const sortRaw = g('sort_order')
  return {
    member_id: memberId,
    parent_id: parentRaw || null, // kosong = puncak
    role_override: roleOverride || null,
    sort_order: Number.isFinite(parseInt(sortRaw, 10)) ? parseInt(sortRaw, 10) : 0,
    is_active: formData.get('is_active') === 'on',
  }
}

// ---------- TAMBAH ----------
export async function createPosition(
  _prev: StructureState,
  formData: FormData
): Promise<StructureState> {
  if (!(await canEdit()))
    return { error: 'Anda tidak punya izin mengelola struktur organisasi.' }

  const data = parse(formData)
  if (!data.member_id) return { error: 'Anggota wajib dipilih.' }

  const supabase = await createClient()
  const { error } = await supabase.from('org_structure').insert(data)
  if (error) return { error: error.message }

  revalidatePath('/dashboard/structure')
  revalidatePath('/struktur')
  revalidatePath('/')
  redirect('/dashboard/structure')
}

// ---------- EDIT ----------
export async function updatePosition(
  id: string,
  _prev: StructureState,
  formData: FormData
): Promise<StructureState> {
  if (!(await canEdit()))
    return { error: 'Anda tidak punya izin mengelola struktur organisasi.' }

  const data = parse(formData)
  if (!data.member_id) return { error: 'Anggota wajib dipilih.' }

  // Cegah posisi menjadi atasannya sendiri.
  if (data.parent_id === id)
    return { error: 'Sebuah posisi tidak boleh menjadi atasan dirinya sendiri.' }

  const supabase = await createClient()
  const { error } = await supabase
    .from('org_structure')
    .update(data)
    .eq('id', id)
  if (error) return { error: error.message }

  revalidatePath('/dashboard/structure')
  revalidatePath('/struktur')
  revalidatePath('/')
  redirect('/dashboard/structure')
}

// ---------- HAPUS ----------
export async function deletePosition(id: string): Promise<void> {
  if (!(await canEdit()))
    throw new Error('Anda tidak punya izin menghapus posisi.')

  const supabase = await createClient()
  // Anak-anak posisi ini otomatis jadi puncak (parent_id -> null) karena
  // FK on delete set null. Jadi struktur tidak rusak.
  const { error } = await supabase.from('org_structure').delete().eq('id', id)
  if (error) throw new Error(error.message)

  revalidatePath('/dashboard/structure')
  revalidatePath('/struktur')
  revalidatePath('/')
}

// ---------- TOGGLE AKTIF ----------
export async function togglePosition(id: string, next: boolean): Promise<void> {
  if (!(await canEdit()))
    throw new Error('Anda tidak punya izin mengubah posisi.')

  const supabase = await createClient()
  const { error } = await supabase
    .from('org_structure')
    .update({ is_active: next })
    .eq('id', id)
  if (error) throw new Error(error.message)

  revalidatePath('/dashboard/structure')
  revalidatePath('/struktur')
  revalidatePath('/')
}
