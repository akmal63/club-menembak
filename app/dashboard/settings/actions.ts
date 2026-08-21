'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export type PermissionState =
  | { error: string }
  | { success: string }
  | null

// Hanya superadmin yang boleh mengubah izin.
// Mengembalikan state (bukan void) agar form bisa menampilkan toast sukses/gagal.
export async function updatePermissions(
  _prev: PermissionState,
  formData: FormData
): Promise<PermissionState> {
  const supabase = await createClient()

  // Pastikan pemanggil adalah superadmin
  const { data: isSuper } = await supabase.rpc('is_superadmin')
  if (!isSuper) return { error: 'Hanya Super Admin yang boleh mengubah izin.' }

  // FormData berisi checkbox dengan nama: "perm-{permissionId}-{action}"
  const roleId = Number(formData.get('role_id'))
  if (!roleId) return { error: 'Role tidak valid.' }

  // Ambil semua permission untuk role ini
  const { data: rolePerms, error: fetchErr } = await supabase
    .from('role_permissions')
    .select('id, permission_id')
    .eq('role_id', roleId)

  if (fetchErr) return { error: fetchErr.message }
  if (!rolePerms) return { error: 'Data izin tidak ditemukan.' }

  // Update tiap baris berdasarkan checkbox yang tercentang
  for (const rp of rolePerms) {
    const pid = rp.permission_id
    const { error: upErr } = await supabase
      .from('role_permissions')
      .update({
        can_view: formData.get(`perm-${pid}-view`) === 'on',
        can_create: formData.get(`perm-${pid}-create`) === 'on',
        can_edit: formData.get(`perm-${pid}-edit`) === 'on',
        can_delete: formData.get(`perm-${pid}-delete`) === 'on',
      })
      .eq('id', rp.id)
    if (upErr) return { error: upErr.message }
  }

  revalidatePath('/dashboard/settings')
  revalidatePath('/dashboard', 'layout')

  return { success: 'Izin admin berhasil diperbarui.' }
}
