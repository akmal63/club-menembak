import Link from 'next/link'
import { checkPermission } from '@/lib/permissions'
import NewsForm from '@/components/news-form'
import { createNews } from '../actions'

export default async function NewNewsPage() {
  if (!(await checkPermission('news', 'create'))) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-4">Tambah Berita</h1>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          Anda tidak punya izin menambah berita.{' '}
          <Link href="/dashboard/news" className="underline">Kembali</Link>
        </div>
      </div>
    )
  }
  return (
    <div>
      <h1 className="font-display text-2xl font-bold uppercase tracking-wide text-[#0a0e27] mb-6">
        Tambah Berita
      </h1>
      <NewsForm action={createNews} submitLabel="Terbitkan" />
    </div>
  )
}
