import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { checkPermission } from '@/lib/permissions'
import { BLOCK_LABELS, type PageBlock } from '@/lib/blocks'
import {
  MoveButtons,
  ToggleBlockButton,
  DeleteBlockButton,
} from '@/components/block-action-buttons'

export default async function ContentPage() {
  const supabase = await createClient()

  if (!(await checkPermission('content', 'view'))) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-4">Konten Beranda</h1>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          Anda tidak punya izin mengelola konten beranda.
        </div>
      </div>
    )
  }

  const { data: blocks } = await supabase
    .from('page_blocks')
    .select('id, type, content, sort_order, is_active')
    .order('sort_order', { ascending: true })

  const list = (blocks ?? []) as PageBlock[]
  const canEdit = await checkPermission('content', 'edit')

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h1 className="font-display text-2xl font-bold uppercase tracking-wide text-[#0a0e27]">
          Konten Beranda
        </h1>
        <div className="flex gap-3">
          <Link href="/" target="_blank" className="text-[#ff5e3a] text-sm font-medium hover:underline self-center">
            Lihat beranda ↗
          </Link>
          {canEdit && (
            <Link
              href="/dashboard/content/new"
              className="bg-[#ff5e3a] text-white px-4 py-2 rounded-lg hover:opacity-90 font-display font-semibold uppercase tracking-wide text-sm"
            >
              + Tambah Blok
            </Link>
          )}
        </div>
      </div>
      <p className="text-[#8890b5] mb-6">
        Susun beranda dengan blok. Urutkan dengan panah, aktif/nonaktifkan, atau
        edit tiap blok. Blok Galeri &amp; Berita menarik data otomatis.
      </p>

      {list.length === 0 ? (
        <div className="bg-white rounded-xl shadow border p-8 text-center text-gray-500">
          Belum ada blok. Klik &quot;Tambah Blok&quot; untuk memulai.
        </div>
      ) : (
        <div className="space-y-2">
          {list.map((b, i) => (
            <div
              key={b.id}
              className={
                'bg-white rounded-xl border p-4 flex items-center gap-4 ' +
                (b.is_active ? '' : 'opacity-60')
              }
            >
              {canEdit && (
                <MoveButtons id={b.id} isFirst={i === 0} isLast={i === list.length - 1} />
              )}

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-display font-bold uppercase tracking-wide text-[#0a0e27] text-sm">
                    {BLOCK_LABELS[b.type]}
                  </span>
                  <span className="text-xs text-[#8890b5]">#{b.sort_order}</span>
                </div>
                <p className="text-sm text-[#8890b5] truncate">
                  {b.content.title || b.content.highlight || b.content.welcome || '(tanpa judul)'}
                </p>
              </div>

              {canEdit && <ToggleBlockButton id={b.id} active={b.is_active} />}

              {canEdit && (
                <div className="flex items-center gap-3">
                  <Link
                    href={`/dashboard/content/${b.id}`}
                    className="text-[#ff5e3a] hover:underline text-sm"
                  >
                    Edit
                  </Link>
                  <DeleteBlockButton id={b.id} label={BLOCK_LABELS[b.type]} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
