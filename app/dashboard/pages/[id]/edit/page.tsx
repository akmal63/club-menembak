import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { checkPermission } from '@/lib/permissions'
import PageForm from '@/components/page-form'
import { updatePage } from '../../actions'

export default async function EditPagePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  if (!(await checkPermission('content', 'edit'))) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-4">Edit Halaman</h1>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          Anda tidak punya izin.{' '}
          <Link href="/dashboard/pages" className="underline">Kembali</Link>
        </div>
      </div>
    )
  }

  const supabase = await createClient()
  const { data: page } = await supabase.from('pages').select('*').eq('id', id).single()
  if (!page) notFound()

  // updatePage butuh id sebagai argumen pertama (pola bind)
  const action = updatePage.bind(null, id)

  return (
    <div>
      <h1 className="font-display text-2xl font-bold uppercase tracking-wide text-[#0a0e27] mb-6">
        Edit Halaman
      </h1>
      <PageForm
        action={action}
        submitLabel="Simpan Perubahan"
        initial={{
          title: page.title,
          slug: page.slug,
          body: page.body ?? '',
          is_active: page.is_active,
        }}
      />
    </div>
  )
}
