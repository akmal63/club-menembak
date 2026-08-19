import Link from 'next/link'
import { checkPermission } from '@/lib/permissions'
import PageForm from '@/components/page-form'
import { createPage } from '../actions'

export default async function NewPagePage() {
  if (!(await checkPermission('content', 'edit'))) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-4">Tambah Halaman</h1>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          Anda tidak punya izin.{' '}
          <Link href="/dashboard/pages" className="underline">Kembali</Link>
        </div>
      </div>
    )
  }
  return (
    <div>
      <h1 className="font-display text-2xl font-bold uppercase tracking-wide text-[#0a0e27] mb-6">
        Tambah Halaman
      </h1>
      <PageForm action={createPage} submitLabel="Simpan Halaman" />
    </div>
  )
}
