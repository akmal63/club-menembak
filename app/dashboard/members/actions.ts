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
    active_until: get('active_until'),
    position: get('position'),
    occupation: get('occupation'),
    category: formData
      .getAll('category[]')
      .map((v) => (typeof v === 'string' ? v.trim() : ''))
      .filter(Boolean),
    status: get('status') ?? 'active',
    notes: get('notes'),
  }
}

// Upload pas foto ke bucket 'members', kembalikan URL publik
async function uploadPhoto(
  supabase: Awaited<ReturnType<typeof createClient>>,
  file: File | null
): Promise<{ url: string | null; error?: string }> {
  if (!file || file.size === 0) return { url: null }
  if (!file.type.startsWith('image/')) return { url: null, error: 'Foto harus berupa gambar.' }
  if (file.size > 5 * 1024 * 1024) return { url: null, error: 'Foto maksimal 5 MB.' }

  const ext = file.name.split('.').pop() ?? 'jpg'
  const name = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
  const { error } = await supabase.storage
    .from('members')
    .upload(name, file, { contentType: file.type })
  if (error) return { url: null, error: `Gagal upload foto: ${error.message}` }

  const {
    data: { publicUrl },
  } = supabase.storage.from('members').getPublicUrl(name)
  return { url: publicUrl }
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

  const photo = await uploadPhoto(supabase, formData.get('photo') as File | null)
  if (photo.error) return { error: photo.error }

  const { error } = await supabase
    .from('members')
    .insert({ ...data, photo_url: photo.url, created_by: user?.id })

  if (error) {
    if (error.code === '23505') {
      return { error: 'No Registrasi sudah dipakai. Gunakan nomor lain.' }
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

  const updates: Record<string, unknown> = {
    ...data,
    updated_at: new Date().toISOString(),
  }

  // Ganti foto hanya jika ada file baru
  const file = formData.get('photo') as File | null
  if (file && file.size > 0) {
    const photo = await uploadPhoto(supabase, file)
    if (photo.error) return { error: photo.error }
    updates.photo_url = photo.url
  }

  const { error } = await supabase.from('members').update(updates).eq('id', id)

  if (error) {
    if (error.code === '23505') {
      return { error: 'No Registrasi sudah dipakai. Gunakan nomor lain.' }
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
