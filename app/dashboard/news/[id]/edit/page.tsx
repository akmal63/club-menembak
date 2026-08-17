import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { checkPermission } from '@/lib/permissions'
import NewsForm from '@/components/news-form'
import { updateNews } from '../../actions'

export default async function EditNewsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  if (!(await checkPermission('news', 'edit'))) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-4">Edit Berita</h1>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          Anda tidak punya izin mengubah berita.{' '}
          <Link href="/dashboard/news" className="underline">Kembali</Link>
        </div>
      </div>
    )
  }

  const supabase = await createClient()
  const { data: news } = await supabase
    .from('news')
    .select('*')
    .eq('id', id)
    .single()
  if (!news) notFound()

  const updateWithId = updateNews.bind(null, id)

  return (
    <div>
      <h1 className="font-display text-2xl font-bold uppercase tracking-wide text-[#0a0e27] mb-6">
        Edit Berita
      </h1>
      <NewsForm action={updateWithId} initial={news} submitLabel="Simpan Perubahan" />
    </div>
  )
}
