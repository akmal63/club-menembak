'use server'

import { createClient } from '@/lib/supabase/server'
import { checkPermission } from '@/lib/permissions'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

// Bentuk hasil aksi, dipakai untuk menampilkan pesan error di form
export type ActionState = { error: string } | null

// Ambil & rapikan data dari FormData
function parseForm(formData: FormData) {
  const get = (k: string) => {
    const v = formData.get(k)
    return typeof v === 'string' && v.trim() !== '' ? v.trim() : null
  }
  return {
    member_number: get('member_number'),
    full_name: get('full_name'),
    email: get('email'),
    phone: get('phone'),
    address: get('address'),
    birth_date: get('birth_date'),
    join_date: get('join_date'),
    category: get('category'),
    status: get('status') ?? 'active',
    notes: get('notes'),
  }
}

// ---------- TAMBAH ANGGOTA ----------
export async function createMember(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const allowed = await checkPermission('members', 'create')
  if (!allowed) return { error: 'Anda tidak punya izin menambah anggota.' }

  const data = parseForm(formData)
  if (!data.full_name) return { error: 'Nama lengkap wajib diisi.' }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { error } = await supabase
    .from('members')
    .insert({ ...data, created_by: user?.id })

  if (error) {
    if (error.code === '23505') {
      return { error: 'Nomor anggota sudah dipakai. Gunakan nomor lain.' }
    }
    return { error: error.message }
  }

  revalidatePath('/dashboard/members')
  redirect('/dashboard/members')
}

// ---------- EDIT ANGGOTA ----------
export async function updateMember(
  id: string,
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const allowed = await checkPermission('members', 'edit')
  if (!allowed) return { error: 'Anda tidak punya izin mengubah anggota.' }

  const data = parseForm(formData)
  if (!data.full_name) return { error: 'Nama lengkap wajib diisi.' }

  const supabase = await createClient()
  const { error } = await supabase
    .from('members')
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq('id', id)

  if (error) {
    if (error.code === '23505') {
      return { error: 'Nomor anggota sudah dipakai. Gunakan nomor lain.' }
    }
    return { error: error.message }
  }

  revalidatePath('/dashboard/members')
  redirect('/dashboard/members')
}

// ---------- HAPUS ANGGOTA ----------
export async function deleteMember(id: string): Promise<void> {
  const allowed = await checkPermission('members', 'delete')
  if (!allowed) throw new Error('Anda tidak punya izin menghapus anggota.')

  const supabase = await createClient()
  const { error } = await supabase.from('members').delete().eq('id', id)
  if (error) throw new Error(error.message)

  revalidatePath('/dashboard/members')
}
