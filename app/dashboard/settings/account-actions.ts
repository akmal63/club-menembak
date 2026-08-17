'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'

export type AccountState =
  | { error: string }
  | { success: string }
  | null

// ---------- BUAT AKUN ADMIN BARU ----------
export async function createAdminAccount(
  _prev: AccountState,
  formData: FormData
): Promise<AccountState> {
  // 1. Pastikan pemanggil adalah superadmin
  const supabase = await createClient()
  const { data: isSuper } = await supabase.rpc('is_superadmin')
  if (!isSuper) return { error: 'Hanya Super Admin yang boleh membuat akun.' }

  // 2. Ambil & validasi input
  const fullName = (formData.get('full_name') as string)?.trim()
  const email = (formData.get('email') as string)?.trim()
  const password = (formData.get('password') as string) ?? ''
  const roleName = (formData.get('role') as string) ?? 'admin'

  if (!fullName) return { error: 'Nama lengkap wajib diisi.' }
  if (!email) return { error: 'Email wajib diisi.' }
  if (password.length < 6) return { error: 'Password minimal 6 karakter.' }
  if (roleName !== 'admin' && roleName !== 'superadmin') {
    return { error: 'Role tidak valid.' }
  }

  // 3. Buat user via admin API (tidak mengganggu sesi login superadmin)
  const admin = createAdminClient()
  const { data: created, error: createError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true, // langsung aktif, tanpa perlu konfirmasi email
    user_metadata: { full_name: fullName },
  })

  if (createError) {
    if (createError.message.toLowerCase().includes('already')) {
      return { error: 'Email ini sudah terdaftar.' }
    }
    return { error: createError.message }
  }

  const newUserId = created.user?.id
  if (!newUserId) return { error: 'Gagal membuat akun.' }

  // 4. Set role sesuai pilihan (profile otomatis dibuat trigger sbg admin;
  //    kalau superadmin dipilih, kita ubah)
  if (roleName === 'superadmin') {
    const { data: role } = await admin
      .from('roles')
      .select('id')
      .eq('name', 'superadmin')
      .single()
    if (role) {
      await admin
        .from('profiles')
        .update({ role_id: role.id })
        .eq('id', newUserId)
    }
  }

  revalidatePath('/dashboard/settings')
  return { success: `Akun untuk ${fullName} berhasil dibuat.` }
}

// ---------- HAPUS AKUN ----------
export async function deleteAccount(userId: string): Promise<void> {
  const supabase = await createClient()

  // Pastikan superadmin
  const { data: isSuper } = await supabase.rpc('is_superadmin')
  if (!isSuper) throw new Error('Hanya Super Admin yang boleh menghapus akun.')

  // Cegah superadmin menghapus dirinya sendiri
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (user?.id === userId) {
    throw new Error('Anda tidak bisa menghapus akun sendiri.')
  }

  const admin = createAdminClient()
  const { error } = await admin.auth.admin.deleteUser(userId)
  if (error) throw new Error(error.message)

  revalidatePath('/dashboard/settings')
}
