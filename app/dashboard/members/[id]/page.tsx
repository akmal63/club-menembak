import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { checkPermission } from '@/lib/permissions'
import { formatDate } from '@/lib/format'

const CATEGORY_LABEL: Record<string, string> = {
  pistol: 'Pistol',
  rifle: 'Rifle',
  shotgun: 'Shotgun',
  lainnya: 'Lainnya',
}

export default async function MemberDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: member } = await supabase
    .from('members')
    .select('*')
    .eq('id', id)
    .single()

  if (!member) notFound()

  const canEdit = await checkPermission('members', 'edit')

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/dashboard/members"
          className="text-blue-600 hover:underline text-sm"
        >
          ← Kembali ke daftar
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow border overflow-hidden max-w-3xl">
        {/* Header profil */}
        <div className="bg-gray-900 text-white p-6 flex items-center gap-5">
          <div className="relative w-20 h-20 rounded-full bg-gray-700 overflow-hidden flex items-center justify-center text-2xl font-bold shrink-0">
            {member.photo_url ? (
              <Image
                src={member.photo_url}
                alt={member.full_name ?? ''}
                fill
                sizes="80px"
                className="object-cover"
              />
            ) : (
              (member.full_name?.charAt(0).toUpperCase() ?? '?')
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold">{member.full_name}</h1>
            <p className="text-gray-300">
              {member.member_number
                ? `No. Registrasi: ${member.member_number}`
                : 'Tanpa no registrasi'}
            </p>
            {member.position && (
              <p className="text-gray-300 text-sm">{member.position}</p>
            )}
            <span
              className={
                member.status === 'active'
                  ? 'inline-block mt-1 text-green-300 bg-green-900/40 px-2 py-0.5 rounded text-xs'
                  : 'inline-block mt-1 text-gray-300 bg-gray-700 px-2 py-0.5 rounded text-xs'
              }
            >
              {member.status === 'active' ? 'Aktif' : 'Tidak Aktif'}
            </span>
          </div>
        </div>

        {/* Detail */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          <Detail label="Jabatan" value={member.position} />
          <Detail label="Pekerjaan" value={member.occupation} />
          <Detail label="Email" value={member.email} />
          <Detail label="Telepon" value={member.phone} />
          <Detail
            label="Kategori"
            value={member.category ? CATEGORY_LABEL[member.category] ?? member.category : null}
          />
          <Detail label="Tanggal Lahir" value={formatDate(member.birth_date)} />
          <Detail label="Tanggal Bergabung" value={formatDate(member.join_date)} />
          <Detail label="Masa Aktif s/d" value={formatDate(member.active_until)} />
          <Detail label="Alamat / Domisili" value={member.address} full />
          <Detail label="Catatan" value={member.notes} full />
        </div>

        {canEdit && (
          <div className="px-6 pb-6">
            <Link
              href={`/dashboard/members/${member.id}/edit`}
              className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 inline-block"
            >
              Edit Profil
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

function Detail({
  label,
  value,
  full,
}: {
  label: string
  value?: string | null
  full?: boolean
}) {
  return (
    <div className={full ? 'md:col-span-2' : ''}>
      <p className="text-xs text-gray-500 uppercase tracking-wide">{label}</p>
      <p className="text-gray-900 mt-0.5">{value || '-'}</p>
    </div>
  )
}
