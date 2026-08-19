import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { getSiteContent } from '@/lib/site-content'
import PublicNavbar from '@/components/public/public-navbar'
import PublicFooter from '@/components/public/public-footer'
import MarkdownContent from '@/components/markdown-content'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const supabase = await createClient()
  const { data } = await supabase
    .from('pages')
    .select('title')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()
  return { title: data?.title ?? 'Halaman' }
}

export default async function HalamanPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const supabase = await createClient()
  const c = await getSiteContent()

  const { data: page } = await supabase
    .from('pages')
    .select('title, body, is_active')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (!page) notFound()

  return (
    <div className="bg-white min-h-screen">
      <PublicNavbar clubName={c.clubName} logoUrl={c.logoUrl} navMenu={c.navMenu} />

      <article className="max-w-3xl mx-auto px-5 pt-28 pb-20">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[#8890b5] hover:text-accent text-sm mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali ke beranda
        </Link>

        <h1 className="font-display text-3xl md:text-4xl font-bold uppercase tracking-wide text-[#0a0e27] mb-6 leading-tight">
          {page.title}
        </h1>

        {page.body ? (
          <MarkdownContent body={page.body} />
        ) : (
          <p className="text-[#8890b5]">Halaman ini belum memiliki isi.</p>
        )}
      </article>

      <PublicFooter content={c} />
    </div>
  )
}
