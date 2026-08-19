import { notFound } from 'next/navigation'
import Image from 'next/image'
import { User } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { getSiteContent } from '@/lib/site-content'
import { formatDate } from '@/lib/format'
import MemberQr from './member-qr'

type MemberCard = {
  id: string
  member_number: string | null
  full_name: string | null
  position: string | null
  occupation: string | null
  status: string | null
  active_until: string | null
  photo_url: string | null
  domicile: string | null
}

function isActive(status: string | null) {
  return (status ?? '').toLowerCase() === 'active'
}

export default async function KartuAnggotaPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const c = await getSiteContent()

  const { data } = await supabase
    .from('members_public')
    .select(
      'id, member_number, full_name, position, occupation, status, active_until, photo_url, domicile'
    )
    .eq('id', id)
    .single()

  if (!data) notFound()
  const m = data as MemberCard
  const active = isActive(m.status)

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#eef1f8] to-[#dfe4f2] py-10 px-4 grid place-items-center">
      <div className="w-full max-w-sm bg-white rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(10,14,39,0.25)] ring-1 ring-black/5">
        {/* Kop club */}
        <div className="bg-brand text-white px-5 py-4 flex items-center gap-3">
          {c.logoUrl ? (
            <span className="relative w-11 h-11 rounded-lg overflow-hidden bg-white grid place-items-center shrink-0">
              <Image src={c.logoUrl} alt={c.clubName} fill unoptimized sizes="44px" className="object-contain" />
            </span>
          ) : (
            <span className="w-11 h-11 rounded-lg grid place-items-center text-white font-bold text-xl grad-accent shrink-0">
              &#9678;
            </span>
          )}
          <div className="min-w-0">
            <div className="font-display font-bold uppercase tracking-wide leading-tight truncate">
              {c.clubName}
            </div>
            <div className="text-[11px] text-[#8890b5] uppercase tracking-[0.15em]">
              Kartu Anggota
            </div>
          </div>
        </div>

        {/* Badge status + foto */}
        <div className="px-6 pt-6 pb-4 text-center">
          <span
            className={
              'inline-block px-3 py-1 rounded-full text-xs font-display font-bold uppercase tracking-wide mb-4 ' +
              (active ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600')
            }
          >
            {active ? 'Aktif' : 'Tidak Aktif'}
          </span>

          <div className="relative w-44 h-56 mx-auto rounded-[50%] overflow-hidden border-4 border-accent bg-[#f0f2f8] grid place-items-center">
            {m.photo_url ? (
              <Image
                src={m.photo_url}
                alt={m.full_name ?? 'Anggota'}
                fill
                unoptimized
                sizes="176px"
                className="object-cover"
              />
            ) : (
              <User className="w-16 h-16 text-[#c3c8dd]" />
            )}
          </div>

          <h1 className="font-display text-xl font-bold uppercase tracking-wide text-[#0a0e27] mt-4 leading-tight">
            {m.full_name || '-'}
          </h1>
          <p className="text-[#8890b5] text-sm mt-0.5">
            No. Registrasi: {m.member_number || '-'}
          </p>
          <p className="text-[#3a3f5c] text-sm mt-1">
            Aktif s/d {m.active_until ? formatDate(m.active_until) : '-'}
          </p>
        </div>

        {/* Baris data */}
        <div className="px-6 pb-4 space-y-2">
          <Row label="Jabatan" value={m.position} />
          <Row label="Pekerjaan" value={m.occupation} />
          <Row label="Domisili" value={m.domicile} />
        </div>

        {/* QR */}
        <div className="px-6 pb-8 pt-2 flex flex-col items-center border-t border-[#eef0f6]">
          <MemberQr />
          <p className="text-[11px] text-[#8890b5] mt-2 text-center">
            Pindai untuk membuka data anggota online
          </p>
        </div>
      </div>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="flex justify-between gap-4 text-sm">
      <span className="text-[#8890b5]">{label}</span>
      <span className="font-medium text-[#0a0e27] text-right">{value || '-'}</span>
    </div>
  )
}
