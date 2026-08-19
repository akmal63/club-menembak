import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { getSiteContent } from '@/lib/site-content'
import PublicNavbar from '@/components/public/public-navbar'
import PublicFooter from '@/components/public/public-footer'
import MembersTable, { type PublicMember } from './members-table'

export const metadata = {
  title: 'Database Anggota',
}

export default async function AnggotaPage() {
  const supabase = await createClient()
  const c = await getSiteContent()

  const { data } = await supabase
    .from('members_public')
    .select('id, member_number, full_name, position, status, photo_url')
    .order('member_number', { ascending: true })

  const members = (data ?? []) as PublicMember[]

  return (
    <div className="bg-white min-h-screen">
      <PublicNavbar clubName={c.clubName} logoUrl={c.logoUrl} navMenu={c.navMenu} />

      <div className="max-w-5xl mx-auto px-5 pt-28 pb-20">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[#8890b5] hover:text-accent text-sm mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali ke beranda
        </Link>

        {/* Kop */}
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl md:text-4xl font-bold uppercase tracking-wide text-[#0a0e27]">
            Database Anggota
          </h1>
          <p className="font-display text-accent uppercase tracking-[0.2em] font-semibold mt-1">
            {c.clubName}
          </p>
        </div>

        <MembersTable members={members} />
      </div>

      <PublicFooter content={c} />
    </div>
  )
}
