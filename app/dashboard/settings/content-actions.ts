'use server'

import { createClient } from '@/lib/supabase/server'
import {
  defaultContent,
  SITE_CONTENT_KEY,
  type SiteContent,
} from '@/lib/site-content'
import { revalidatePath } from 'next/cache'

export type ContentState =
  | { error: string }
  | { success: string }
  | null

// Ambil string dari FormData dengan aman
function s(formData: FormData, key: string): string {
  const v = formData.get(key)
  return typeof v === 'string' ? v.trim() : ''
}

export async function updateSiteContent(
  _prev: ContentState,
  formData: FormData
): Promise<ContentState> {
  const supabase = await createClient()

  // Hanya superadmin
  const { data: isSuper } = await supabase.rpc('is_superadmin')
  if (!isSuper) return { error: 'Hanya Super Admin yang boleh mengubah konten.' }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Ambil konten lama agar field yang tak ada di form ini tidak terhapus
  // (hero, visi-misi, federasi kini dikelola sebagai blok, bukan di sini)
  const { data: existing } = await supabase
    .from('site_settings')
    .select('value')
    .eq('key', SITE_CONTENT_KEY)
    .single()
  const prev = (existing?.value ?? {}) as Partial<SiteContent>

  // ----- Susun ulang objek konten dari form -----

  // Legalitas
  const legal: SiteContent['about']['legal'] = []
  for (let i = 0; i < 6; i++) {
    const label = s(formData, `legal_label_${i}`)
    const value = s(formData, `legal_value_${i}`)
    if (label || value) legal.push({ label, value })
  }

  // Partner
  const partners: SiteContent['partners'] = []
  for (let i = 0; i < 8; i++) {
    const label = s(formData, `partner_label_${i}`)
    const url = s(formData, `partner_url_${i}`)
    if (label || url) partners.push({ label, url })
  }

  // Telepon (dipisah baris)
  const phone = s(formData, 'contact_phone')
    .split('\n')
    .map((p) => p.trim())
    .filter(Boolean)

  const content: SiteContent = {
    clubName: s(formData, 'clubName') || defaultContent.clubName,
    clubShort: s(formData, 'clubShort') || defaultContent.clubShort,
    tagline: s(formData, 'tagline'),
    location: s(formData, 'location'),
    // Hero & vision & federations: pertahankan nilai lama (dikelola via blok)
    hero: prev.hero ?? defaultContent.hero,
    vision: prev.vision ?? defaultContent.vision,
    federations: prev.federations ?? defaultContent.federations,
    about: {
      heading: prev.about?.heading ?? defaultContent.about.heading,
      body: prev.about?.body ?? defaultContent.about.body,
      legal: legal.length ? legal : defaultContent.about.legal,
      chairman: s(formData, 'about_chairman'),
    },
    contact: {
      address: s(formData, 'contact_address'),
      email: s(formData, 'contact_email'),
      phone: phone.length ? phone : defaultContent.contact.phone,
    },
    partners: partners.length ? partners : defaultContent.partners,
  }

  // Simpan (upsert) ke database
  const { error } = await supabase.from('site_settings').upsert(
    {
      key: SITE_CONTENT_KEY,
      value: content,
      updated_at: new Date().toISOString(),
      updated_by: user?.id,
    },
    { onConflict: 'key' }
  )

  if (error) return { error: error.message }

  // Segarkan halaman publik & pengaturan
  revalidatePath('/')
  revalidatePath('/dashboard/settings/konten')

  return { success: 'Konten beranda berhasil diperbarui.' }
}
