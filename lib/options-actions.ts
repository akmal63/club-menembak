'use server'

import { createClient } from '@/lib/supabase/server'
import { checkPermission } from '@/lib/permissions'
import { getSiteContent, SITE_CONTENT_KEY } from '@/lib/site-content'
import { revalidatePath } from 'next/cache'

type AddResult = { ok: boolean; error?: string }

// Normalisasi untuk cek duplikat (abaikan huruf besar/kecil & spasi).
function norm(s: string) {
  return s.toLowerCase().trim().replace(/\s+/g, ' ')
}

// Tambah satu item ke daftar 'positionOptions' atau 'categoryOptions'
// di site_settings. Dipakai tombol "+ Simpan ke daftar" di form anggota.
export async function addOption(
  field: 'positionOptions' | 'categoryOptions',
  value: string
): Promise<AddResult> {
  if (!(await checkPermission('members', 'edit'))) {
    return { ok: false, error: 'Tidak punya izin.' }
  }
  const v = value.trim()
  if (!v) return { ok: false, error: 'Nilai kosong.' }

  const c = await getSiteContent()
  const current = (field === 'positionOptions' ? c.positionOptions : c.categoryOptions) ?? []

  // Sudah ada? anggap sukses (idempoten).
  if (current.some((o) => norm(o) === norm(v))) {
    return { ok: true }
  }

  const next = [...current, v]

  const supabase = await createClient()
  // site_settings disimpan sebagai satu baris key/value 'site_content'.
  // Ambil dulu nilai penuh, ubah field terkait, simpan kembali.
  const { data: row } = await supabase
    .from('site_settings')
    .select('value')
    .eq('key', SITE_CONTENT_KEY)
    .maybeSingle()

  const value_obj = (row?.value as Record<string, unknown> | null) ?? {}
  value_obj[field] = next

  const { error } = await supabase
    .from('site_settings')
    .upsert({ key: SITE_CONTENT_KEY, value: value_obj }, { onConflict: 'key' })

  if (error) return { ok: false, error: error.message }

  revalidatePath('/anggota')
  revalidatePath('/dashboard/members')
  revalidatePath('/dashboard/settings/konten')
  return { ok: true }
}
