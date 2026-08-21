import { createClient } from '@/lib/supabase/server'
import { getSiteContent } from '@/lib/site-content'
import type { PageBlock } from '@/lib/blocks'
import PublicNavbar from '@/components/public/public-navbar'
import BlockRenderer from '@/components/public/block-renderer'
import PublicFooter from '@/components/public/public-footer'
import BackToTop from '@/components/public/back-to-top'
import { buildTree, type OrgFlat, type OrgNode } from '@/components/public/org-chart'
import { pickTopMember } from '@/lib/member-order'

// Baris hasil view org_structure_public (sudah digabung dengan members_public).
type OrgRow = {
  id: string
  parent_id: string | null
  role_override: string | null
  sort_order: number
  member_full_name: string | null
  member_position: string | null
  member_photo_url: string | null
}

export default async function PublicHomePage() {
  const supabase = await createClient()
  const c = await getSiteContent()

  const nowIso = new Date().toISOString()

  // Ambil blok aktif (urut), galeri, berita, jadwal, kegiatan, struktur,
  // + kandidat pimpinan puncak untuk blok legalitas — sekaligus.
  const [
    { data: blocks },
    { data: gallery },
    { data: news },
    { data: schedules },
    { data: events },
    { data: orgData },
    { data: leaderCandidates },
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
    // Struktur: baca dari VIEW publik agar nama/foto tetap muncul untuk anonim.
    supabase
      .from('org_structure_public')
      .select(
        'id, parent_id, role_override, sort_order, member_full_name, member_position, member_photo_url'
      )
      .eq('is_active', true)
      .order('sort_order', { ascending: true }),
    // Kandidat pimpinan puncak: seluruh anggota (view publik) + jabatannya,
    // lalu dipilih yang jabatannya paling atas menurut positionOptions.
    supabase
      .from('members_public')
      .select('full_name, photo_url, position, member_number'),
  ])

  const list = (blocks ?? []) as PageBlock[]

  // Susun pohon struktur untuk blok org_structure (ringkasan)
  const orgRows = (orgData ?? []) as unknown as OrgRow[]
  const orgFlat: OrgFlat[] = orgRows.map((r) => ({
    id: r.id,
    parent_id: r.parent_id,
    role: (r.role_override || r.member_position || '').trim(),
    name: r.member_full_name || 'Tanpa Nama',
    photo_url: r.member_photo_url ?? null,
    sort_order: r.sort_order,
  }))
  const orgRoots: OrgNode[] = buildTree(orgFlat)

  // Pimpinan puncak untuk blok legalitas — anti-rapuh terhadap nama jabatan.
  // Mengikuti urutan positionOptions (jabatan teratas = pimpinan).
  type LeaderRow = {
    full_name: string | null
    photo_url: string | null
    position: string | null
    member_number: string | null
  }
  const leaders = (leaderCandidates ?? []) as LeaderRow[]
  const topLeader = pickTopMember(leaders, c.positionOptions ?? [])

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
            chairmanPhoto={topLeader?.photo_url ?? null}
            chairmanName={topLeader?.full_name ?? null}
            chairmanRole={topLeader?.position ?? null}
            orgRoots={orgRoots}
          />
        ))
      )}

      <PublicFooter content={c} />

      {/* Tombol gulir ke atas (muncul saat menggulir turun) */}
      <BackToTop />
    </div>
  )
}
