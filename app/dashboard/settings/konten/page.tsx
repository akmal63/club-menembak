import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getSiteContent } from '@/lib/site-content'
import ContentEditorForm from '@/components/content-editor-form'

export default async function KontenPage() {
  const supabase = await createClient()

  // Proteksi: hanya superadmin
  const { data: isSuper } = await supabase.rpc('is_superadmin')
  if (!isSuper) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-4">Konten Beranda</h1>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          Halaman ini hanya untuk Super Admin.
        </div>
      </div>
    )
  }

  const content = await getSiteContent()

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h1 className="font-display text-2xl font-bold uppercase tracking-wide text-[#0a0e27]">
          Konten Beranda Publik
        </h1>
        <Link
          href="/"
          target="_blank"
          className="text-[#ff5e3a] text-sm font-medium hover:underline"
        >
          Lihat halaman publik ↗
        </Link>
      </div>
      <p className="text-[#8890b5] mb-6">
        Edit teks yang tampil di beranda publik. Galeri dan berita diambil
        otomatis dari data yang Anda kelola, jadi tidak perlu diatur di sini.
      </p>

      <ContentEditorForm initial={content} />
    </div>
  )
}
