import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import { checkPermission } from '@/lib/permissions'
import DeleteMemberButton from '@/components/delete-member-button'
import { sortMembersByHierarchy, isStaleValue } from '@/lib/member-order'
import { getSiteContent } from '@/lib/site-content'

export default async function MembersPage() {
  const supabase = await createClient()

  const { data: rawMembers } = await supabase
    .from('members')
    .select('*')

  // Urutkan: jabatan (Ketua Umum dulu ... Anggota terakhir) -> nomor registrasi.
  const c = await getSiteContent()
  const members = sortMembersByHierarchy(rawMembers ?? [], c.positionOptions)

  // Cek izin untuk menampilkan/menyembunyikan tombol aksi
  const canCreate = await checkPermission('members', 'create')
  const canEdit = await checkPermission('members', 'edit')
  const canDelete = await checkPermission('members', 'delete')

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Data Anggota</h1>
        {canCreate && (
          <Link
            href="/dashboard/members/new"
            className="bg-accent text-white px-4 py-2 rounded-lg hover:opacity-90"
          >
            + Tambah Anggota
          </Link>
        )}
      </div>

      {!members || members.length === 0 ? (
        <div className="bg-white rounded-xl shadow border p-8 text-center text-gray-500">
          Belum ada data anggota.
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="px-4 py-3 font-medium">Foto</th>
                <th className="px-4 py-3 font-medium">No Registrasi</th>
                <th className="px-4 py-3 font-medium">Nama</th>
                <th className="px-4 py-3 font-medium">Jabatan</th>
                <th className="px-4 py-3 font-medium">Kategori</th>
                <th className="px-4 py-3 font-medium">Status</th>
                {(canEdit || canDelete) && (
                  <th className="px-4 py-3 font-medium text-right">Aksi</th>
                )}
              </tr>
            </thead>
            <tbody>
              {members.map((m) => (
                <tr key={m.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="relative rounded-lg overflow-hidden bg-gray-100 grid place-items-center shrink-0" style={{ width: '60px', height: '80px' }}>
                      {m.photo_url ? (
                        <Image
                          src={m.photo_url}
                          alt={m.full_name ?? ''}
                          fill
                          unoptimized
                          sizes="60px"
                          className="object-cover"
                        />
                      ) : (
                        <span className="text-gray-400 text-sm font-semibold uppercase">
                          {(m.full_name ?? '?').charAt(0)}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">{m.member_number ?? '-'}</td>
                  <td className="px-4 py-3 font-medium">
                    <Link
                      href={`/dashboard/members/${m.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      {m.full_name}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    {m.position ?? '-'}
                    {isStaleValue(m.position, c.positionOptions) && (
                      <span
                        title="Jabatan ini tidak ada di daftar. Edit anggota untuk memperbarui."
                        className="ml-2 inline-block text-[10px] font-semibold px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 align-middle"
                      >
                        data lama
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {Array.isArray(m.category) && m.category.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {m.category.map((cat: string) => (
                          <span
                            key={cat}
                            className="inline-block px-2 py-0.5 rounded-full text-[11px] font-medium bg-[color:var(--brand-accent)]/10 text-accent border border-[color:var(--brand-accent)]/20"
                          >
                            {cat}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        m.status === 'active'
                          ? 'text-green-700 bg-green-50 px-2 py-0.5 rounded text-xs'
                          : 'text-gray-600 bg-gray-100 px-2 py-0.5 rounded text-xs'
                      }
                    >
                      {m.status === 'active' ? 'Aktif' : 'Tidak Aktif'}
                    </span>
                  </td>
                  {(canEdit || canDelete) && (
                    <td className="px-4 py-3 text-right space-x-3">
                      {canEdit && (
                        <Link
                          href={`/dashboard/members/${m.id}/edit`}
                          className="text-blue-600 hover:underline"
                        >
                          Edit
                        </Link>
                      )}
                      {canDelete && (
                        <DeleteMemberButton id={m.id} name={m.full_name} />
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
