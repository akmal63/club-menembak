import Link from 'next/link'
import { checkPermission } from '@/lib/permissions'
import { BLOCK_LABELS, type BlockType } from '@/lib/blocks'
import BlockEditorForm from '@/components/block-editor-form'
import { createBlock } from '../actions'

const TYPE_ORDER: BlockType[] = [
  'hero',
  'text',
  'image',
  'text_image',
  'cards',
  'cta',
  'federations',
  'legal',
  'identity_club',
  'org_structure',
  'gallery',
  'news',
  'schedules',
  'events',
]

export default async function NewBlockPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>
}) {
  if (!(await checkPermission('content', 'edit'))) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-4">Tambah Blok</h1>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          Anda tidak punya izin.{' '}
          <Link href="/dashboard/content" className="underline">Kembali</Link>
        </div>
      </div>
    )
  }

  const { type } = await searchParams
  const selected = type as BlockType | undefined

  if (!selected || !TYPE_ORDER.includes(selected)) {
    return (
      <div>
        <h1 className="font-display text-2xl font-bold uppercase tracking-wide text-[#0a0e27] mb-2">
          Tambah Blok
        </h1>
        <p className="text-[#8890b5] mb-6">Pilih jenis blok yang ingin ditambahkan.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl">
          {TYPE_ORDER.map((t) => (
            <Link
              key={t}
              href={`/dashboard/content/new?type=${t}`}
              className="bg-white border rounded-xl p-4 hover:border-accent hover:shadow transition-all"
            >
              <span className="font-display font-bold uppercase tracking-wide text-[#0a0e27]">
                {BLOCK_LABELS[t]}
              </span>
            </Link>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/dashboard/content/new" className="text-[#8890b5] hover:text-[#0a0e27] text-sm">
          ← Ganti tipe
        </Link>
      </div>
      <h1 className="font-display text-2xl font-bold uppercase tracking-wide text-[#0a0e27] mb-6">
        Tambah: {BLOCK_LABELS[selected]}
      </h1>
      <BlockEditorForm action={createBlock} type={selected} submitLabel="Tambah Blok" isNew />
    </div>
  )
}
