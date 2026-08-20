import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { checkPermission } from '@/lib/permissions'
import {
  DeletePositionButton,
  TogglePositionButton,
} from '@/components/structure-actions-buttons'

// Baris join untuk daftar
type Row = {
  id: string
  parent_id: string | null
  role_override: string | null
  sort_order: number
  is_active: boolean
  member: { full_name: string | null; position: string | null } | null
}

export default async function StructureListPage() {
  if (!(await checkPermission('content', 'view'))) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-4">Struktur Organisasi</h1>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          Anda tidak punya izin mengelola struktur organisasi.
        </div>
      </div>
    )
  }

  const supabase = await createClient()
  const { data } = await supabase
    .from('org_structure')
    .select(
      'id, parent_id, role_override, sort_order, is_active, member:members(full_name, position)'
    )
    .order('sort_order', { ascending: true })

  const rows = (data ?? []) as unknown as Row[]
  const canEdit = await checkPermission('content', 'edit')

  // Peta id -> label untuk menampilkan nama atasan
  const labelOf = (r: Row) =>
    `${(r.role_override || r.member?.position || 'Tanpa Jabatan')} — ${r.member?.full_name || 'Tanpa Nama'}`
  const byId = new Map(rows.map((r) => [r.id, r]))

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h1 className="font-display text-2xl font-bold uppercase tracking-wide text-[#0a0e27]">
          Struktur Organisasi
        </h1>
        {canEdit && (
          <Link
            href="/dashboard/structure/new"
            className="bg-accent text-white px-4 py-2 rounded-lg hover:opacity-90 font-display font-semibold uppercase tracking-wide text-sm"
          >
            + Tambah Posisi
          </Link>
        )}
      </div>
      <p className="text-sm text-[#8890b5] mb-6">
        Atur bagan struktur. Halaman publik:{' '}
        <Link href="/struktur" target="_blank" className="text-accent hover:underline">
          /struktur ↗
        </Link>
      </p>

      {rows.length === 0 ? (
        <div className="bg-white rounded-xl shadow border p-8 text-center text-gray-500">
          Belum ada posisi. Klik &quot;Tambah Posisi&quot; untuk mulai menyusun struktur.
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="px-4 py-3 font-medium">Jabatan</th>
                <th className="px-4 py-3 font-medium">Nama</th>
                <th className="px-4 py-3 font-medium">Atasan</th>
                <th className="px-4 py-3 font-medium">Urutan</th>
                <th className="px-4 py-3 font-medium">Status</th>
                {canEdit && <th className="px-4 py-3 font-medium text-right">Aksi</th>}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => {
                const parent = r.parent_id ? byId.get(r.parent_id) : null
                return (
                  <tr key={r.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">
                      {r.role_override || r.member?.position || '-'}
                    </td>
                    <td className="px-4 py-3">{r.member?.full_name || '-'}</td>
                    <td className="px-4 py-3 text-[#8890b5]">
                      {parent ? labelOf(parent) : '— Puncak —'}
                    </td>
                    <td className="px-4 py-3">{r.sort_order}</td>
                    <td className="px-4 py-3">
                      {canEdit ? (
                        <TogglePositionButton id={r.id} active={r.is_active} />
                      ) : r.is_active ? (
                        'Aktif'
                      ) : (
                        'Nonaktif'
                      )}
                    </td>
                    {canEdit && (
                      <td className="px-4 py-3 text-right space-x-3">
                        <Link
                          href={`/dashboard/structure/${r.id}/edit`}
                          className="text-accent hover:underline"
                        >
                          Edit
                        </Link>
                        <DeletePositionButton
                          id={r.id}
                          name={r.role_override || r.member?.position || 'posisi'}
                        />
                      </td>
                    )}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
