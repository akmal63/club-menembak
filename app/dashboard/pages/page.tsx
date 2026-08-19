import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { checkPermission } from '@/lib/permissions'
import { DeletePageButton, TogglePageButton } from '@/components/page-actions-buttons'

export default async function PagesListPage() {
  if (!(await checkPermission('content', 'view'))) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-4">Halaman</h1>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          Anda tidak punya izin mengelola halaman.
        </div>
      </div>
    )
  }

  const supabase = await createClient()
  const { data: pages } = await supabase
    .from('pages')
    .select('*')
    .order('created_at', { ascending: false })

  const canEdit = await checkPermission('content', 'edit')

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold uppercase tracking-wide text-[#0a0e27]">
          Halaman
        </h1>
        {canEdit && (
          <Link
            href="/dashboard/pages/new"
            className="bg-accent text-white px-4 py-2 rounded-lg hover:opacity-90 font-display font-semibold uppercase tracking-wide text-sm"
          >
            + Tambah Halaman
          </Link>
        )}
      </div>

      {!pages || pages.length === 0 ? (
        <div className="bg-white rounded-xl shadow border p-8 text-center text-gray-500">
          Belum ada halaman. Klik &quot;Tambah Halaman&quot; untuk membuat.
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="px-4 py-3 font-medium">Judul</th>
                <th className="px-4 py-3 font-medium">URL</th>
                <th className="px-4 py-3 font-medium">Status</th>
                {canEdit && <th className="px-4 py-3 font-medium text-right">Aksi</th>}
              </tr>
            </thead>
            <tbody>
              {pages.map((p) => (
                <tr key={p.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{p.title}</td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/halaman/${p.slug}`}
                      target="_blank"
                      className="text-accent hover:underline font-mono text-xs"
                    >
                      /halaman/{p.slug} ↗
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    {canEdit ? (
                      <TogglePageButton id={p.id} active={p.is_active} />
                    ) : p.is_active ? (
                      'Aktif'
                    ) : (
                      'Nonaktif'
                    )}
                  </td>
                  {canEdit && (
                    <td className="px-4 py-3 text-right space-x-3">
                      <Link
                        href={`/dashboard/pages/${p.id}/edit`}
                        className="text-accent hover:underline"
                      >
                        Edit
                      </Link>
                      <DeletePageButton id={p.id} title={p.title} />
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
