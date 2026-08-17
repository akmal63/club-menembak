'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// Hanya superadmin yang boleh mengubah izin
export async function updatePermissions(formData: FormData): Promise<void> {
  const supabase = await createClient()

  // Pastikan pemanggil adalah superadmin
  const { data: isSuper } = await supabase.rpc('is_superadmin')
  if (!isSuper) throw new Error('Hanya Super Admin yang boleh mengubah izin.')

  // FormData berisi checkbox dengan nama: "perm-{permissionId}-{action}"
  // Kita kumpulkan per permission_id
  const roleId = Number(formData.get('role_id'))
  if (!roleId) throw new Error('Role tidak valid.')

  // Ambil semua permission untuk role ini
  const { data: rolePerms } = await supabase
    .from('role_permissions')
    .select('id, permission_id')
    .eq('role_id', roleId)

  if (!rolePerms) return

  // Update tiap baris berdasarkan checkbox yang tercentang
  for (const rp of rolePerms) {
    const pid = rp.permission_id
    await supabase
      .from('role_permissions')
      .update({
        can_view: formData.get(`perm-${pid}-view`) === 'on',
        can_create: formData.get(`perm-${pid}-create`) === 'on',
        can_edit: formData.get(`perm-${pid}-edit`) === 'on',
        can_delete: formData.get(`perm-${pid}-delete`) === 'on',
      })
      .eq('id', rp.id)
  }

  revalidatePath('/dashboard/settings')
  revalidatePath('/dashboard', 'layout')
}
