'use server'

import { createClient } from '@/lib/supabase/server'
import { checkPermission } from '@/lib/permissions'
import { revalidatePath } from 'next/cache'

export type ActionState = { error: string } | { success: true } | null

// ---------- UPLOAD FOTO ----------
export async function uploadPhoto(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const allowed = await checkPermission('gallery', 'create')
  if (!allowed) return { error: 'Anda tidak punya izin mengunggah foto.' }

  const file = formData.get('file') as File | null
  const title = formData.get('title')
  const titleStr = typeof title === 'string' ? title.trim() : null

  if (!file || file.size === 0) return { error: 'Pilih file gambar dulu.' }

  // Validasi tipe & ukuran (maks 5 MB)
  if (!file.type.startsWith('image/')) {
    return { error: 'File harus berupa gambar.' }
  }
  if (file.size > 5 * 1024 * 1024) {
    return { error: 'Ukuran gambar maksimal 5 MB.' }
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Nama file unik: waktu + nama asli (dibersihkan)
  const ext = file.name.split('.').pop() ?? 'jpg'
  const safeName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`

  // Upload ke bucket
  const { error: uploadError } = await supabase.storage
    .from('gallery')
    .upload(safeName, file, { contentType: file.type })

  if (uploadError) return { error: `Gagal upload: ${uploadError.message}` }

  // Ambil URL publik
  const {
    data: { publicUrl },
  } = supabase.storage.from('gallery').getPublicUrl(safeName)

  // Simpan metadata ke tabel gallery
  const { error: dbError } = await supabase.from('gallery').insert({
    title: titleStr,
    image_url: publicUrl,
    uploaded_by: user?.id,
  })

  if (dbError) {
    // Kalau simpan DB gagal, hapus file yang terlanjur ke-upload
    await supabase.storage.from('gallery').remove([safeName])
    return { error: `Gagal menyimpan: ${dbError.message}` }
  }

  revalidatePath('/dashboard/gallery')
  return { success: true }
}

// ---------- HAPUS FOTO ----------
export async function deletePhoto(
  id: string,
  imageUrl: string
): Promise<void> {
  const allowed = await checkPermission('gallery', 'delete')
  if (!allowed) throw new Error('Anda tidak punya izin menghapus foto.')

  const supabase = await createClient()

  // Hapus baris di tabel
  const { error } = await supabase.from('gallery').delete().eq('id', id)
  if (error) throw new Error(error.message)

  // Hapus file fisik dari storage (ambil nama file dari URL)
  const fileName = imageUrl.split('/').pop()
  if (fileName) {
    await supabase.storage.from('gallery').remove([fileName])
  }

  revalidatePath('/dashboard/gallery')
}
