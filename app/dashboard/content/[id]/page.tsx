import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { checkPermission } from '@/lib/permissions'
import { BLOCK_LABELS, type PageBlock } from '@/lib/blocks'
import BlockEditorForm from '@/components/block-editor-form'
import { updateBlock } from '../actions'

export default async function EditBlockPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  if (!(await checkPermission('content', 'edit'))) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-4">Edit Blok</h1>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          Anda tidak punya izin.{' '}
          <Link href="/dashboard/content" className="underline">Kembali</Link>
        </div>
      </div>
    )
  }

  const supabase = await createClient()
  const { data } = await supabase
    .from('page_blocks')
    .select('id, type, content, sort_order, is_active')
    .eq('id', id)
    .single()
  if (!data) notFound()

  const block = data as PageBlock
  const updateWithId = updateBlock.bind(null, id, block.type)

  return (
    <div>
      <h1 className="font-display text-2xl font-bold uppercase tracking-wide text-[#0a0e27] mb-6">
        Edit: {BLOCK_LABELS[block.type]}
      </h1>
      <BlockEditorForm
        action={updateWithId}
        type={block.type}
        initial={block.content}
        submitLabel="Simpan Perubahan"
      />
    </div>
  )
}
