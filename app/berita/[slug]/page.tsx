import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { ArrowLeft, Calendar } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { getSiteContent } from '@/lib/site-content'
import { formatDate } from '@/lib/format'
import PublicNavbar from '@/components/public/public-navbar'
import PublicFooter from '@/components/public/public-footer'

export default async function BeritaDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const supabase = await createClient()
  const c = await getSiteContent()

  const { data: news } = await supabase
    .from('news')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (!news) notFound()

  return (
    <div className="bg-white min-h-screen">
      <PublicNavbar clubName={c.clubName} logoUrl={c.logoUrl} navMenu={c.navMenu} />

      <article className="max-w-3xl mx-auto px-5 pt-28 pb-20">
        <Link
          href="/berita"
          className="inline-flex items-center gap-2 text-[#8890b5] hover:text-accent text-sm mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Semua berita
        </Link>

        <div className="flex items-center gap-2 text-sm text-[#8890b5] mb-3">
          <Calendar className="w-4 h-4" />
          {formatDate(news.published_at)}
        </div>
        <h1 className="font-display text-3xl md:text-4xl font-bold uppercase tracking-wide text-[#0a0e27] mb-6 leading-tight">
          {news.title}
        </h1>

        {news.image_url && (
          <div className="relative aspect-video rounded-xl overflow-hidden mb-6">
            <Image
              src={news.image_url}
              alt={news.title}
              fill
              unoptimized
              sizes="(max-width:768px) 100vw, 768px"
              className="object-cover"
            />
          </div>
        )}

        {news.excerpt && (
          <p className="text-lg text-[#3a3f5c] font-medium mb-6">{news.excerpt}</p>
        )}

        {news.body && (
          <div className="prose max-w-none text-[#3a3f5c] leading-relaxed whitespace-pre-line">
            {news.body}
          </div>
        )}
      </article>

      <PublicFooter content={c} />
    </div>
  )
}
