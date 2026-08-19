import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Calendar, Target } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { getSiteContent } from '@/lib/site-content'
import { formatDate } from '@/lib/format'
import PublicNavbar from '@/components/public/public-navbar'
import PublicFooter from '@/components/public/public-footer'

export default async function BeritaListPage() {
  const supabase = await createClient()
  const c = await getSiteContent()

  const { data: news } = await supabase
    .from('news')
    .select('id, title, slug, excerpt, image_url, published_at')
    .eq('is_active', true)
    .order('published_at', { ascending: false })

  return (
    <div className="bg-white min-h-screen">
      <PublicNavbar clubName={c.clubName} logoUrl={c.logoUrl} navMenu={c.navMenu} />

      <div className="max-w-6xl mx-auto px-5 pt-28 pb-20">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[#8890b5] hover:text-accent text-sm mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali ke beranda
        </Link>

        <p className="font-display text-accent uppercase tracking-[0.2em] font-semibold">
          Informasi
        </p>
        <h1 className="font-display text-4xl font-bold uppercase tracking-wide text-[#0a0e27] mb-8">
          Berita &amp; Kegiatan
        </h1>

        {!news || news.length === 0 ? (
          <p className="text-[#8890b5]">Belum ada berita.</p>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {news.map((n) => (
              <Link
                key={n.id}
                href={`/berita/${n.slug}`}
                className="bg-white rounded-xl overflow-hidden shadow-[0_4px_14px_rgba(10,14,39,0.06)] hover:shadow-lg transition-shadow group"
              >
                {n.image_url ? (
                  <div className="relative aspect-video">
                    <Image
                      src={n.image_url}
                      alt={n.title}
                      fill
                      unoptimized
                      sizes="(max-width:768px) 100vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                ) : (
                  <div className="aspect-video bg-gradient-to-br from-[#0a0e27] to-[#151b3d] grid place-items-center">
                    <Target className="w-12 h-12 text-accent/40" />
                  </div>
                )}
                <div className="p-5">
                  <div className="flex items-center gap-2 text-xs text-[#8890b5] mb-2">
                    <Calendar className="w-3.5 h-3.5" />
                    {formatDate(n.published_at)}
                  </div>
                  <h2 className="font-display text-lg font-bold uppercase tracking-wide text-[#0a0e27] mb-2 leading-snug">
                    {n.title}
                  </h2>
                  {n.excerpt && (
                    <p className="text-sm text-[#3a3f5c] line-clamp-3">{n.excerpt}</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <PublicFooter content={c} />
    </div>
  )
}
