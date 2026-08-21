'use server'

import { createClient } from '@/lib/supabase/server'
import { checkPermission } from '@/lib/permissions'
import type { BlockType, BlockContent, BlockBg } from '@/lib/blocks'
import { AUTO_TYPES, BG_TYPES, slugifyAnchor } from '@/lib/blocks'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export type BlockState = { error: string } | null

async function ensureCanEdit() {
  const ok = await checkPermission('content', 'edit')
  if (!ok) throw new Error('Anda tidak punya izin mengelola konten beranda.')
}

// Upload gambar blok
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
    .from('blocks')
    .upload(name, file, { contentType: file.type })
  if (error) return { url: null, error: `Gagal upload: ${error.message}` }
  const {
    data: { publicUrl },
  } = supabase.storage.from('blocks').getPublicUrl(name)
  return { url: publicUrl }
}

// Susun konten dari form sesuai tipe
function buildContent(
  type: BlockType,
  formData: FormData,
  imageUrl: string | null
): BlockContent {
  const g = (k: string) => {
    const v = formData.get(k)
    return typeof v === 'string' ? v.trim() : ''
  }
  const on = (k: string) => formData.get(k) === 'on'
  const removed = (k: string) => formData.get(k) === '1'

  // ID section (anchor) untuk menu navbar — dirapikan jadi slug aman.
  const rawAnchor = g('anchor')
  const anchor = rawAnchor ? slugifyAnchor(rawAnchor) : ''

  // Warna latar (poin 7). Hanya untuk tipe yang menyediakannya; selain itu abaikan.
  // Nilai valid: theme | white | gray. Default 'white' bila tak dikirim.
  const bgRaw = g('bg')
  const bg: BlockBg | undefined = BG_TYPES.includes(type)
    ? bgRaw === 'theme' || bgRaw === 'gray' || bgRaw === 'white'
      ? bgRaw
      : 'white'
    : undefined
  // Kompatibilitas: pertahankan `dark` konsisten dengan pilihan bg (theme = gelap).
  const darkFromBg = bg ? bg === 'theme' : on('dark')

  // Tentukan URL gambar akhir: gambar baru > (jika dihapus) kosong > existing
  const resolveImage = (existingKey: string, removeKey: string) => {
    if (imageUrl) return imageUrl
    if (removed(removeKey)) return ''
    return g(existingKey) || ''
  }

  const base: BlockContent = {
    anchor,
    button_enabled: on('button_enabled'),
    button_text: g('button_text'),
    button_link: g('button_link'),
    dark: darkFromBg,
    ...(bg ? { bg } : {}),
  }

  switch (type) {
    case 'hero':
      return {
        ...base,
        welcome: g('welcome'),
        title: g('title'),
        highlight: g('highlight'),
        subtitle: g('subtitle'),
      }
    case 'text':
      return { ...base, eyebrow: g('eyebrow'), title: g('title'), body: g('body') }
    case 'image':
      return {
        ...base,
        title: g('title'),
        image_url: resolveImage('existing_image', 'image_remove'),
        image_fit: (g('image_fit') as 'cover' | 'contain') || 'cover',
      }
    case 'text_image':
      return {
        ...base,
        eyebrow: g('eyebrow'),
        title: g('title'),
        body: g('body'),
        image_url: resolveImage('existing_image', 'image_remove'),
        image_side: (g('image_side') as 'left' | 'right') || 'right',
        image_fit: (g('image_fit') as 'cover' | 'contain') || 'cover',
      }
    case 'cards': {
      const cards: { title: string; body: string; icon: string }[] = []
      for (let i = 0; i < 6; i++) {
        const t = g(`card_title_${i}`)
        const b = g(`card_body_${i}`)
        const icon = g(`card_icon_${i}`)
        if (t || b) cards.push({ title: t, body: b, icon })
      }
      return { ...base, eyebrow: g('eyebrow'), title: g('title'), cards }
    }
    case 'cta':
      return { ...base, eyebrow: g('eyebrow'), title: g('title'), body: g('body') }
    case 'federations': {
      // Gambar federasi ditangani terpisah (async) di create/update.
      // Di sini hanya teks; field image_url diisi belakangan.
      const feds: { abbr: string; name: string; image_url: string }[] = []
      for (let i = 0; i < 4; i++) {
        const abbr = g(`fed_abbr_${i}`)
        const name = g(`fed_name_${i}`)
        const existing = g(`existing_fed_image_${i}`)
        if (abbr || name || existing) {
          feds.push({ abbr, name, image_url: existing })
        }
      }
      return { ...base, eyebrow: g('eyebrow'), title: g('title'), federations: feds }
    }
    case 'legal':
      // Data (ketua & legalitas) ditarik otomatis dari Pengaturan Identitas.
      // Admin hanya mengatur judul, eyebrow, warna latar, dan ID section.
      return {
        anchor,
        eyebrow: g('eyebrow'),
        title: g('title'),
        dark: darkFromBg,
        ...(bg ? { bg } : {}),
      }
    case 'identity_club':
      // Logo + nama club + judul & isi teks ditarik otomatis dari Pengaturan Identitas.
      // Admin mengatur posisi gambar (kiri/kanan), warna latar, dan ID section.
      return {
        anchor,
        dark: darkFromBg,
        ...(bg ? { bg } : {}),
        image_side: (g('image_side') as 'left' | 'right') || 'right',
      }
    case 'gallery':
    case 'news':
      // Kini menyediakan pilihan warna latar (bg).
      return {
        anchor,
        eyebrow: g('eyebrow'),
        title: g('title'),
        dark: darkFromBg,
        ...(bg ? { bg } : {}),
      }
    case 'schedules':
    case 'events':
      return {
        anchor,
        eyebrow: g('eyebrow'),
        title: g('title'),
        dark: darkFromBg,
        ...(bg ? { bg } : {}),
      }
    case 'org_structure':
      return {
        anchor,
        eyebrow: g('eyebrow'),
        title: g('title'),
        dark: darkFromBg,
        ...(bg ? { bg } : {}),
      }
    default:
      return base
  }
}

// ---------- TAMBAH ----------
export async function createBlock(
  _prev: BlockState,
  formData: FormData
): Promise<BlockState> {
  await ensureCanEdit()
  const type = formData.get('type') as BlockType
  if (!type) return { error: 'Tipe blok wajib dipilih.' }

  const supabase = await createClient()

  let imageUrl: string | null = null
  if (!AUTO_TYPES.includes(type)) {
    const img = await uploadImage(supabase, formData.get('image') as File | null)
    if (img.error) return { error: img.error }
    imageUrl = img.url
  }

  const content = buildContent(type, formData, imageUrl)

  // Upload logo federasi (jika tipe federations)
  if (type === 'federations' && content.federations) {
    for (let i = 0; i < content.federations.length; i++) {
      const file = formData.get(`fed_image_${i}`) as File | null
      if (file && file.size > 0) {
        const up = await uploadImage(supabase, file)
        if (up.error) return { error: up.error }
        if (up.url) content.federations[i].image_url = up.url
      }
    }
  }

  // Taruh di urutan paling bawah
  const { data: last } = await supabase
    .from('page_blocks')
    .select('sort_order')
    .order('sort_order', { ascending: false })
    .limit(1)
    .single()
  const nextOrder = (last?.sort_order ?? 0) + 1

  const { error } = await supabase.from('page_blocks').insert({
    type,
    content,
    sort_order: nextOrder,
    is_active: true,
  })
  if (error) return { error: error.message }

  revalidatePath('/')
  revalidatePath('/dashboard/content')
  redirect('/dashboard/content')
}

// ---------- EDIT ----------
export async function updateBlock(
  id: string,
  type: BlockType,
  _prev: BlockState,
  formData: FormData
): Promise<BlockState> {
  await ensureCanEdit()
  const supabase = await createClient()

  let imageUrl: string | null = null
  if (!AUTO_TYPES.includes(type)) {
    const file = formData.get('image') as File | null
    if (file && file.size > 0) {
      const img = await uploadImage(supabase, file)
      if (img.error) return { error: img.error }
      imageUrl = img.url
    }
  }

  const content = buildContent(type, formData, imageUrl)

  // Upload logo federasi (jika tipe federations)
  if (type === 'federations' && content.federations) {
    for (let i = 0; i < content.federations.length; i++) {
      const file = formData.get(`fed_image_${i}`) as File | null
      if (file && file.size > 0) {
        const up = await uploadImage(supabase, file)
        if (up.error) return { error: up.error }
        if (up.url) content.federations[i].image_url = up.url
      }
    }
  }

  const { error } = await supabase
    .from('page_blocks')
    .update({ content, updated_at: new Date().toISOString() })
    .eq('id', id)
  if (error) return { error: error.message }

  revalidatePath('/')
  revalidatePath('/dashboard/content')
  redirect('/dashboard/content')
}

// ---------- HAPUS ----------
export async function deleteBlock(id: string): Promise<void> {
  await ensureCanEdit()
  const supabase = await createClient()
  const { error } = await supabase.from('page_blocks').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/')
  revalidatePath('/dashboard/content')
}

// ---------- TOGGLE AKTIF ----------
export async function toggleBlock(id: string, next: boolean): Promise<void> {
  await ensureCanEdit()
  const supabase = await createClient()
  const { error } = await supabase
    .from('page_blocks')
    .update({ is_active: next })
    .eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/')
  revalidatePath('/dashboard/content')
}

// ---------- URUTKAN (tukar dengan tetangga) ----------
export async function moveBlock(id: string, dir: 'up' | 'down'): Promise<void> {
  await ensureCanEdit()
  const supabase = await createClient()

  const { data: all } = await supabase
    .from('page_blocks')
    .select('id, sort_order')
    .order('sort_order', { ascending: true })
  if (!all) return

  const idx = all.findIndex((b) => b.id === id)
  if (idx === -1) return
  const swapIdx = dir === 'up' ? idx - 1 : idx + 1
  if (swapIdx < 0 || swapIdx >= all.length) return

  const a = all[idx]
  const b = all[swapIdx]

  // Tukar sort_order
  await supabase.from('page_blocks').update({ sort_order: b.sort_order }).eq('id', a.id)
  await supabase.from('page_blocks').update({ sort_order: a.sort_order }).eq('id', b.id)

  revalidatePath('/')
  revalidatePath('/dashboard/content')
}
