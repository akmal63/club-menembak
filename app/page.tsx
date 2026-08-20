import { createClient } from '@/lib/supabase/server'
import { getSiteContent } from '@/lib/site-content'
import type { PageBlock } from '@/lib/blocks'
import PublicNavbar from '@/components/public/public-navbar'
import BlockRenderer from '@/components/public/block-renderer'
import PublicFooter from '@/components/public/public-footer'
import { buildTree, type OrgFlat, type OrgNode } from '@/components/public/org-chart'

// Baris hasil join org_structure -> members
type OrgRow = {
  id: string
  parent_id: string | null
  role_override: string | null
  sort_order: number
  member: {
    full_name: string | null
    position: string | null
    photo_url: string | null
  } | null
}

export default async function PublicHomePage() {
  const supabase = await createClient()
  const c = await getSiteContent()

  const nowIso = new Date().toISOString()

  // Ambil foto ketua (anggota dengan jabatan 'Ketua') untuk blok legalitas
  const { data: chairmanMember } = await supabase
    .from('members_public')
    .select('full_name, photo_url, position')
    .ilike('position', 'ketua')
    .limit(1)
    .maybeSingle()

  // Ambil blok aktif (urut), galeri, berita, jadwal, kegiatan, struktur — sekaligus
  const [
    { data: blocks },
    { data: gallery },
    { data: news },
    { data: schedules },
    { data: events },
    { data: orgData },
  ] = await Promise.all([
    supabase
      .from('page_blocks')
      .select('id, type, content, sort_order, is_active')
      .eq('is_active', true)
      .order('sort_order', { ascending: true }),
    supabase
      .from('gallery')
      .select('id, title, image_url')
      .order('created_at', { ascending: false })
      .limit(8),
    supabase
      .from('news')
      .select('id, title, slug, excerpt, image_url, published_at')
      .eq('is_active', true)
      .order('published_at', { ascending: false })
      .limit(3),
    supabase
      .from('training_schedules')
      .select('id, title, start_time, location, instructor')
      .gte('start_time', nowIso)
      .order('start_time', { ascending: true })
      .limit(4),
    supabase
      .from('events')
      .select('id, title, start_date, location, description')
      .gte('start_date', nowIso)
      .order('start_date', { ascending: true })
      .limit(4),
    supabase
      .from('org_structure')
      .select(
        'id, parent_id, role_override, sort_order, member:members(full_name, position, photo_url)'
      )
      .eq('is_active', true)
      .order('sort_order', { ascending: true }),
  ])

  const list = (blocks ?? []) as PageBlock[]

  // Susun pohon struktur untuk blok org_structure (ringkasan)
  const orgRows = (orgData ?? []) as unknown as OrgRow[]
  const orgFlat: OrgFlat[] = orgRows.map((r) => ({
    id: r.id,
    parent_id: r.parent_id,
    role: (r.role_override || r.member?.position || '').trim(),
    name: r.member?.full_name || 'Tanpa Nama',
    photo_url: r.member?.photo_url ?? null,
    sort_order: r.sort_order,
  }))
  const orgRoots: OrgNode[] = buildTree(orgFlat)

  return (
    <div className="bg-white">
      <PublicNavbar clubName={c.clubName} logoUrl={c.logoUrl} navMenu={c.navMenu} />

      {list.length === 0 ? (
        <div className="min-h-screen grid place-items-center bg-brand text-center px-5">
          <div>
            <h1 className="font-display text-3xl font-bold uppercase text-white mb-3">
              {c.clubName}
            </h1>
            <p className="text-[#8890b5]">
              Beranda belum memiliki konten. Tambahkan blok lewat dashboard.
            </p>
          </div>
        </div>
      ) : (
        list.map((block) => (
          <BlockRenderer
            key={block.id}
            block={block}
            gallery={gallery ?? []}
            news={news ?? []}
            schedules={schedules ?? []}
            events={events ?? []}
            siteContent={c}
            chairmanPhoto={chairmanMember?.photo_url ?? null}
            chairmanName={chairmanMember?.full_name ?? null}
            orgRoots={orgRoots}
          />
        ))
      )}

      <PublicFooter content={c} />
    </div>
  )
}
