import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { checkPermission } from '@/lib/permissions'

// Kembalikan daftar halaman (slug + judul) untuk mengisi dropdown menu navbar.
// Hanya untuk pengelola konten.
export async function GET() {
  if (!(await checkPermission('content', 'view'))) {
    return NextResponse.json({ pages: [] }, { status: 403 })
  }

  const supabase = await createClient()
  const { data } = await supabase
    .from('pages')
    .select('slug, title')
    .order('title', { ascending: true })

  const pages = (data ?? []).map((p) => ({
    slug: p.slug as string,
    title: p.title as string,
  }))

  return NextResponse.json({ pages })
}
