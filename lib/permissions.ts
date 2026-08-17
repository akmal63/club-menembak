import { createClient } from './supabase/server'

export type MenuKey =
  | 'members'
  | 'schedules'
  | 'events'
  | 'gallery'
  | 'settings'
export type Action = 'view' | 'create' | 'edit' | 'delete'

// Ambil semua permission user yang login (untuk render menu dinamis)
export async function getUserPermissions() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('role_id')
    .eq('id', user.id)
    .single()

  if (!profile) return null

  const { data } = await supabase
    .from('role_permissions')
    .select(
      'can_view, can_create, can_edit, can_delete, permissions(menu_key, label, sort_order)'
    )
    .eq('role_id', profile.role_id)

  return data
}

// Cek satu izin spesifik lewat fungsi database (RPC)
export async function checkPermission(menu: MenuKey, action: Action) {
  const supabase = await createClient()
  const { data } = await supabase.rpc('has_permission', {
    p_menu: menu,
    p_action: action,
  })
  return data ?? false
}
