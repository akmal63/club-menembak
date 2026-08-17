import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import { checkPermission } from '@/lib/permissions'
import { formatDate } from '@/lib/format'
import {
  DeleteNewsButton,
  ToggleNewsButton,
} from '@/components/news-actions-buttons'

export default async function NewsListPage() {
  const supabase = await createClient()
  const { data: news } = await supabase
    .from('news')
    .select('*')
    .order('published_at', { ascending: false })

  const canCreate = await checkPermission('news', 'create')
  const canEdit = await checkPermission('news', 'edit')
  const canDelete = await checkPermission('news', 'delete')

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold uppercase tracking-wide text-[#0a0e27]">
          Berita
        </h1>
        {canCreate && (
          <Link
            href="/dashboard/news/new"
            className="bg-[#ff5e3a] text-white px-4 py-2 rounded-lg hover:opacity-90 font-display font-semibold uppercase tracking-wide text-sm"
          >
            + Tambah Berita
          </Link>
        )}
      </div>

      {!news || news.length === 0 ? (
        <div className="bg-white rounded-xl shadow border p-8 text-center text-gray-500">
          Belum ada berita.
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="px-4 py-3 font-medium">Berita</th>
                <th className="px-4 py-3 font-medium">Tanggal</th>
                <th className="px-4 py-3 font-medium">Status</th>
                {(canEdit || canDelete) && (
                  <th className="px-4 py-3 font-medium text-right">Aksi</th>
                )}
              </tr>
            </thead>
            <tbody>
              {news.map((n) => (
                <tr key={n.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative w-14 h-10 rounded overflow-hidden bg-gray-100 shrink-0">
                        {n.image_url && (
                          <Image
                            src={n.image_url}
                            alt=""
                            fill
                            sizes="56px"
                            className="object-cover"
                          />
                        )}
                      </div>
                      <span className="font-medium">{n.title}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">{formatDate(n.published_at)}</td>
                  <td className="px-4 py-3">
                    {canEdit ? (
                      <ToggleNewsButton id={n.id} active={n.is_active} />
                    ) : n.is_active ? (
                      'Aktif'
                    ) : (
                      'Nonaktif'
                    )}
                  </td>
                  {(canEdit || canDelete) && (
                    <td className="px-4 py-3 text-right space-x-3">
                      {canEdit && (
                        <Link
                          href={`/dashboard/news/${n.id}/edit`}
                          className="text-[#ff5e3a] hover:underline"
                        >
                          Edit
                        </Link>
                      )}
                      {canDelete && <DeleteNewsButton id={n.id} title={n.title} />}
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
