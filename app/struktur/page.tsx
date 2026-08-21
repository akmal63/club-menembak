import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { getSiteContent } from '@/lib/site-content'
import PublicNavbar from '@/components/public/public-navbar'
import PublicFooter from '@/components/public/public-footer'
import BackToTop from '@/components/public/back-to-top'
import OrgChart, { buildTree, type OrgFlat } from '@/components/public/org-chart'

export const metadata = {
  title: 'Struktur Organisasi',
}

// Bentuk baris hasil view org_structure_public (sudah join ke members_public).
type Row = {
  id: string
  parent_id: string | null
  role_override: string | null
  sort_order: number
  member_full_name: string | null
  member_position: string | null
  member_photo_url: string | null
}

export default async function StrukturPage() {
  const supabase = await createClient()
  const c = await getSiteContent()

  // Ambil dari VIEW publik agar nama & foto tetap muncul untuk pengunjung anonim
  // (menghindari blokir RLS pada tabel members di production).
  const { data } = await supabase
    .from('org_structure_public')
    .select(
      'id, parent_id, role_override, sort_order, member_full_name, member_position, member_photo_url'
    )
    .eq('is_active', true)
    .order('sort_order', { ascending: true })

  const rows = (data ?? []) as unknown as Row[]

  // Ubah ke bentuk datar untuk buildTree; jabatan = override || position anggota.
  const flat: OrgFlat[] = rows.map((r) => ({
    id: r.id,
    parent_id: r.parent_id,
    role: (r.role_override || r.member_position || '').trim(),
    name: r.member_full_name || 'Tanpa Nama',
    photo_url: r.member_photo_url ?? null,
    sort_order: r.sort_order,
  }))

  const roots = buildTree(flat)
  const dark = c.structureDark ?? true

  return (
    <div className={(dark ? 'bg-brand' : 'bg-white') + ' min-h-screen'}>
      <PublicNavbar clubName={c.clubName} logoUrl={c.logoUrl} navMenu={c.navMenu} />

      {/* Kop — latar & warna teks mengikuti setelan structureDark */}
      <section className={(dark ? 'bg-brand' : 'bg-white') + ' pt-28 pb-16 px-5'}>
        <div className="max-w-6xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[#8890b5] hover:text-accent text-sm mb-6"
          >
            <ArrowLeft className="w-4 h-4" /> Kembali ke beranda
          </Link>
          <div className="text-center">
            <p className="font-display text-accent uppercase tracking-[0.2em] font-semibold">
              Kepengurusan
            </p>
            <h1
              className={
                'font-display text-3xl md:text-4xl font-bold uppercase tracking-wide mt-1 ' +
                (dark ? 'text-white' : 'text-[#0a0e27]')
              }
            >
              Struktur Organisasi
            </h1>
            <p className="text-[#8890b5] mt-2">{c.clubName}</p>
          </div>
        </div>
      </section>

      {/* Bagan */}
      <section className={(dark ? 'bg-brand' : 'bg-white') + ' pb-24 px-5'}>
        <div className="max-w-6xl mx-auto">
          <OrgChart roots={roots} mode="full" />
        </div>
      </section>

      <PublicFooter content={c} />

      {/* Tombol gulir ke atas */}
      <BackToTop />
    </div>
  )
}
