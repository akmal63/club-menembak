'use server'

import { createClient } from '@/lib/supabase/server'
import { checkPermission } from '@/lib/permissions'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export type NewsState = { error: string } | null

// Buat slug dari judul (untuk URL /berita/xxx)
function makeSlug(title: string): string {
  return (
    title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .slice(0, 60) +
    '-' +
    Math.random().toString(36).slice(2, 7)
  )
}

// Upload gambar berita, kembalikan URL publik (atau null)
async function uploadImage(
  supabase: Awaited<ReturnType<typeof createClient>>,
  file: File | null
): Promise<{ url: string | null; error?: string }> {
  if (!file || file.size === 0) return { url: null }
  if (!file.type.startsWith('image/')) return { url: null, error: 'File harus gambar.' }
  if (file.size > 5 * 1024 * 1024) return { url: null, error: 'Gambar maksimal 5 MB.' }

  const ext = file.name.split('.').pop() ?? 'jpg'
  const name = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
  const { error } = await supabase.storage
    .from('news')
    .upload(name, file, { contentType: file.type })
  if (error) return { url: null, error: `Gagal upload: ${error.message}` }

  const {
    data: { publicUrl },
  } = supabase.storage.from('news').getPublicUrl(name)
  return { url: publicUrl }
}

function parse(formData: FormData) {
  const g = (k: string) => {
    const v = formData.get(k)
    return typeof v === 'string' && v.trim() !== '' ? v.trim() : null
  }
  return {
    title: g('title'),
    excerpt: g('excerpt'),
    body: g('body'),
    published_at: g('published_at'),
    is_active: formData.get('is_active') === 'on',
  }
}

export async function createNews(
  _prev: NewsState,
  formData: FormData
): Promise<NewsState> {
  if (!(await checkPermission('news', 'create')))
    return { error: 'Anda tidak punya izin menambah berita.' }

  const data = parse(formData)
  if (!data.title) return { error: 'Judul berita wajib diisi.' }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const img = await uploadImage(supabase, formData.get('image') as File | null)
  if (img.error) return { error: img.error }

  const { error } = await supabase.from('news').insert({
    ...data,
    slug: makeSlug(data.title),
    image_url: img.url,
    created_by: user?.id,
  })
  if (error) return { error: error.message }

  revalidatePath('/dashboard/news')
  revalidatePath('/')
  revalidatePath('/berita')
  redirect('/dashboard/news')
}

export async function updateNews(
  id: string,
  _prev: NewsState,
  formData: FormData
): Promise<NewsState> {
  if (!(await checkPermission('news', 'edit')))
    return { error: 'Anda tidak punya izin mengubah berita.' }

  const data = parse(formData)
  if (!data.title) return { error: 'Judul berita wajib diisi.' }

  const supabase = await createClient()
  const updates: Record<string, unknown> = {
    ...data,
    updated_at: new Date().toISOString(),
  }

  // Ganti gambar hanya jika ada file baru
  const file = formData.get('image') as File | null
  if (file && file.size > 0) {
    const img = await uploadImage(supabase, file)
    if (img.error) return { error: img.error }
    updates.image_url = img.url
  }

  const { error } = await supabase.from('news').update(updates).eq('id', id)
  if (error) return { error: error.message }

  revalidatePath('/dashboard/news')
  revalidatePath('/')
  revalidatePath('/berita')
  redirect('/dashboard/news')
}

export async function deleteNews(id: string): Promise<void> {
  if (!(await checkPermission('news', 'delete')))
    throw new Error('Anda tidak punya izin menghapus berita.')

  const supabase = await createClient()
  const { error } = await supabase.from('news').delete().eq('id', id)
  if (error) throw new Error(error.message)

  revalidatePath('/dashboard/news')
  revalidatePath('/')
  revalidatePath('/berita')
}

// Aktif/nonaktifkan cepat
export async function toggleNews(id: string, next: boolean): Promise<void> {
  if (!(await checkPermission('news', 'edit')))
    throw new Error('Anda tidak punya izin mengubah berita.')

  const supabase = await createClient()
  const { error } = await supabase
    .from('news')
    .update({ is_active: next })
    .eq('id', id)
  if (error) throw new Error(error.message)

  revalidatePath('/dashboard/news')
  revalidatePath('/')
  revalidatePath('/berita')
}
