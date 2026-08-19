'use server'

import { createClient } from '@/lib/supabase/server'
import { checkPermission } from '@/lib/permissions'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export type PageState = { error: string } | null

// Slug yang dilarang (bentrok dengan route/folder yang sudah ada)
const RESERVED = [
  'anggota',
  'berita',
  'login',
  'register',
  'dashboard',
  'api',
  'halaman',
  '',
]

// Rapikan slug dari input admin (huruf kecil, tanda hubung)
function cleanSlug(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 60)
}

function parse(formData: FormData) {
  const g = (k: string) => {
    const v = formData.get(k)
    return typeof v === 'string' ? v.trim() : ''
  }
  return {
    title: g('title'),
    slug: cleanSlug(g('slug') || g('title')),
    body: g('body'),
    is_active: formData.get('is_active') === 'on',
  }
}

export async function createPage(
  _prev: PageState,
  formData: FormData
): Promise<PageState> {
  if (!(await checkPermission('content', 'edit')))
    return { error: 'Anda tidak punya izin mengelola halaman.' }

  const data = parse(formData)
  if (!data.title) return { error: 'Judul halaman wajib diisi.' }
  if (!data.slug) return { error: 'Slug (URL) wajib diisi.' }
  if (RESERVED.includes(data.slug))
    return { error: `Slug "${data.slug}" tidak boleh dipakai (bentrok dengan halaman sistem).` }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Pastikan slug unik
  const { data: exist } = await supabase
    .from('pages')
    .select('id')
    .eq('slug', data.slug)
    .maybeSingle()
  if (exist) return { error: `Slug "${data.slug}" sudah dipakai halaman lain.` }

  const { error } = await supabase.from('pages').insert({
    ...data,
    updated_by: user?.id,
  })
  if (error) return { error: error.message }

  revalidatePath('/dashboard/pages')
  revalidatePath(`/halaman/${data.slug}`)
  redirect('/dashboard/pages')
}

export async function updatePage(
  id: string,
  _prev: PageState,
  formData: FormData
): Promise<PageState> {
  if (!(await checkPermission('content', 'edit')))
    return { error: 'Anda tidak punya izin mengelola halaman.' }

  const data = parse(formData)
  if (!data.title) return { error: 'Judul halaman wajib diisi.' }
  if (!data.slug) return { error: 'Slug (URL) wajib diisi.' }
  if (RESERVED.includes(data.slug))
    return { error: `Slug "${data.slug}" tidak boleh dipakai.` }

  const supabase = await createClient()

  // Slug unik (kecuali milik halaman ini sendiri)
  const { data: exist } = await supabase
    .from('pages')
    .select('id')
    .eq('slug', data.slug)
    .neq('id', id)
    .maybeSingle()
  if (exist) return { error: `Slug "${data.slug}" sudah dipakai halaman lain.` }

  const { error } = await supabase
    .from('pages')
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq('id', id)
  if (error) return { error: error.message }

  revalidatePath('/dashboard/pages')
  revalidatePath(`/halaman/${data.slug}`)
  redirect('/dashboard/pages')
}

export async function deletePage(id: string): Promise<void> {
  if (!(await checkPermission('content', 'edit')))
    throw new Error('Anda tidak punya izin menghapus halaman.')

  const supabase = await createClient()
  const { error } = await supabase.from('pages').delete().eq('id', id)
  if (error) throw new Error(error.message)

  revalidatePath('/dashboard/pages')
}

export async function togglePage(id: string, next: boolean): Promise<void> {
  if (!(await checkPermission('content', 'edit')))
    throw new Error('Anda tidak punya izin mengubah halaman.')

  const supabase = await createClient()
  const { error } = await supabase
    .from('pages')
    .update({ is_active: next })
    .eq('id', id)
  if (error) throw new Error(error.message)

  revalidatePath('/dashboard/pages')
}
