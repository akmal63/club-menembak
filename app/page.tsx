import Link from 'next/link'
import Image from 'next/image'
import {
  Target,
  Eye,
  Rocket,
  Heart,
  MapPin,
  Mail,
  Phone,
  ArrowRight,
  Calendar,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { getSiteContent } from '@/lib/site-content'
import { formatDate } from '@/lib/format'
import PublicNavbar from '@/components/public/public-navbar'

export default async function PublicHomePage() {
  const supabase = await createClient()
  const c = await getSiteContent()

  // Galeri (maks 8 foto terbaru) & berita aktif (maks 3 terbaru)
  const [{ data: photos }, { data: news }] = await Promise.all([
    supabase
      .from('gallery')
      .select('id, title, image_url')
      .order('created_at', { ascending: false })
      .limit(8),
    supabase
      .from('news')
      .select('id, title, slug, excerpt, image_url, published_at')
      .eq('is_active', true)
      .order('published_at', { ascending: false })
      .limit(3),
  ])

  return (
    <div className="bg-white">
      <PublicNavbar clubName={c.clubName} />

      {/* ===== HERO ===== */}
      <section
        id="beranda"
        className="relative min-h-screen flex items-center bg-[#0a0e27] overflow-hidden"
      >
        {/* Aksen dekoratif */}
        <div className="absolute top-1/4 -right-40 w-96 h-96 rounded-full bg-[#ff5e3a] opacity-20 blur-3xl" />
        <div className="absolute bottom-0 -left-40 w-96 h-96 rounded-full bg-[#ff8a3a] opacity-10 blur-3xl" />

        <div className="relative max-w-6xl mx-auto px-5 py-32 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <p className="font-display text-[#ff5e3a] uppercase tracking-[0.2em] font-semibold mb-4">
              {c.hero.welcome}
            </p>
            <h1 className="font-display text-4xl md:text-6xl font-bold text-white uppercase leading-tight mb-2">
              {c.hero.title}
            </h1>
            <h2 className="font-display text-2xl md:text-4xl font-bold uppercase leading-tight mb-6 bg-gradient-to-r from-[#ff5e3a] to-[#ff8a3a] bg-clip-text text-transparent">
              {c.hero.highlight}
            </h2>
            <p className="text-[#8890b5] text-lg mb-8 max-w-md">{c.hero.subtitle}</p>
            <div className="flex flex-wrap gap-3">
              <a
                href="#tentang"
                className="px-6 py-3 rounded-lg font-display font-semibold uppercase tracking-wide text-white bg-gradient-to-br from-[#ff5e3a] to-[#ff8a3a] hover:opacity-90 transition-opacity flex items-center gap-2"
              >
                Selengkapnya <ArrowRight className="w-4 h-4" />
              </a>
              <Link
                href="/login"
                className="px-6 py-3 rounded-lg font-display font-semibold uppercase tracking-wide text-white border border-[#2a3160] hover:bg-[#151b3d] transition-colors"
              >
                Portal Anggota
              </Link>
            </div>
          </div>

          {/* Ikon target besar sebagai focal point */}
          <div className="hidden md:flex justify-center">
            <div className="relative">
              <div className="w-72 h-72 rounded-full border-4 border-[#ff5e3a]/30 grid place-items-center">
                <div className="w-52 h-52 rounded-full border-4 border-[#ff5e3a]/50 grid place-items-center">
                  <div className="w-32 h-32 rounded-full border-4 border-[#ff5e3a] grid place-items-center bg-[#ff5e3a]/10">
                    <Target className="w-16 h-16 text-[#ff5e3a]" strokeWidth={1.5} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== TENTANG KAMI ===== */}
      <section id="tentang" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-5">
          <SectionEyebrow>{c.clubName}</SectionEyebrow>
          <SectionTitle>{c.about.heading}</SectionTitle>

          <div className="grid md:grid-cols-2 gap-10 mt-8 items-start">
            <p className="text-[#3a3f5c] text-lg leading-relaxed">{c.about.body}</p>

            <div className="space-y-4">
              {c.about.legal.map((item, i) => (
                <div
                  key={i}
                  className="bg-[#f4f5fa] rounded-xl p-5 border-l-4 border-[#ff5e3a]"
                >
                  <p className="font-display font-bold text-[#0a0e27] uppercase text-sm tracking-wide mb-1">
                    {item.label}
                  </p>
                  <p className="text-[#8890b5] text-sm">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Federasi */}
          <div className="mt-14">
            <h3 className="font-display text-xl font-bold uppercase tracking-wide text-[#0a0e27] text-center mb-8">
              Afiliasi &amp; Federasi
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {c.federations.map((f) => (
                <div
                  key={f.abbr}
                  className="bg-white rounded-xl p-6 text-center shadow-[0_4px_14px_rgba(10,14,39,0.06)] border-b-[3px] border-[#ff5e3a]"
                >
                  <div className="font-display text-2xl font-bold text-[#0a0e27] mb-2">
                    {f.abbr}
                  </div>
                  <p className="text-xs text-[#8890b5] leading-snug">{f.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== VISI MISI ===== */}
      <section id="visimisi" className="py-20 bg-[#0a0e27]">
        <div className="max-w-6xl mx-auto px-5">
          <SectionEyebrow light>Tentang Kami</SectionEyebrow>
          <SectionTitle light>Visi &amp; Misi</SectionTitle>

          <div className="grid md:grid-cols-3 gap-6 mt-8">
            <VisionCard icon={Eye} title="Visi" body={c.vision.visi} />
            <VisionCard icon={Rocket} title="Misi" body={c.vision.misi} />
            <VisionCard icon={Heart} title="Nilai" body={c.vision.nilai} />
          </div>
        </div>
      </section>

      {/* ===== GALERI ===== */}
      <section id="galeri" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-5">
          <SectionEyebrow>Dokumentasi</SectionEyebrow>
          <SectionTitle>Galeri</SectionTitle>

          {!photos || photos.length === 0 ? (
            <p className="text-center text-[#8890b5] mt-8">
              Belum ada foto. Foto yang diunggah lewat dashboard akan tampil di sini.
            </p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
              {photos.map((p) => (
                <div
                  key={p.id}
                  className="relative aspect-square rounded-xl overflow-hidden group"
                >
                  <Image
                    src={p.image_url}
                    alt={p.title ?? 'Foto galeri'}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ===== BERITA ===== */}
      <section id="berita" className="py-20 bg-[#f4f5fa]">
        <div className="max-w-6xl mx-auto px-5">
          <SectionEyebrow>Informasi</SectionEyebrow>
          <SectionTitle>Berita Terbaru</SectionTitle>

          {!news || news.length === 0 ? (
            <p className="text-center text-[#8890b5] mt-8">
              Belum ada berita. Berita yang diterbitkan lewat dashboard akan tampil di sini.
            </p>
          ) : (
            <>
              <div className="grid md:grid-cols-3 gap-6 mt-8">
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
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                    ) : (
                      <div className="aspect-video bg-gradient-to-br from-[#0a0e27] to-[#151b3d] grid place-items-center">
                        <Target className="w-12 h-12 text-[#ff5e3a]/40" />
                      </div>
                    )}
                    <div className="p-5">
                      <div className="flex items-center gap-2 text-xs text-[#8890b5] mb-2">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatDate(n.published_at)}
                      </div>
                      <h3 className="font-display text-lg font-bold uppercase tracking-wide text-[#0a0e27] mb-2 leading-snug">
                        {n.title}
                      </h3>
                      {n.excerpt && (
                        <p className="text-sm text-[#3a3f5c] line-clamp-3">
                          {n.excerpt}
                        </p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>

              <div className="text-center mt-8">
                <Link
                  href="/berita"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-display font-semibold uppercase tracking-wide text-white bg-gradient-to-br from-[#ff5e3a] to-[#ff8a3a] hover:opacity-90 transition-opacity"
                >
                  Lihat Semua Berita <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* ===== KONTAK / FOOTER ===== */}
      <footer id="kontak" className="bg-[#0a0e27] text-white pt-20 pb-8">
        <div className="max-w-6xl mx-auto px-5">
          <div className="grid md:grid-cols-3 gap-10 mb-12">
            {/* Info club */}
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-10 h-10 rounded-lg grid place-items-center text-white font-bold text-lg bg-gradient-to-br from-[#ff5e3a] to-[#ff8a3a]">
                  ◎
                </div>
                <span className="font-display text-lg font-bold uppercase tracking-wide">
                  {c.clubName}
                </span>
              </div>
              <p className="text-[#8890b5] text-sm leading-relaxed">
                Perkumpulan terbuka bagi semua orang yang ingin menyalurkan bakat,
                hobi, maupun kreativitas di bidang olahraga menembak.
              </p>
            </div>

            {/* Kontak */}
            <div>
              <h4 className="font-display font-bold uppercase tracking-wide mb-4">
                Kontak
              </h4>
              <ul className="space-y-3 text-sm text-[#8890b5]">
                <li className="flex gap-2">
                  <MapPin className="w-4 h-4 shrink-0 mt-0.5 text-[#ff5e3a]" />
                  <span className="whitespace-pre-line">{c.contact.address}</span>
                </li>
                <li className="flex gap-2 items-center">
                  <Mail className="w-4 h-4 shrink-0 text-[#ff5e3a]" />
                  {c.contact.email}
                </li>
                {c.contact.phone.map((p) => (
                  <li key={p} className="flex gap-2 items-center">
                    <Phone className="w-4 h-4 shrink-0 text-[#ff5e3a]" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>

            {/* Partner */}
            <div>
              <h4 className="font-display font-bold uppercase tracking-wide mb-4">
                Tautan Partner
              </h4>
              <ul className="space-y-2 text-sm">
                {c.partners.map((p) => (
                  <li key={p.label}>
                    <a
                      href={p.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#8890b5] hover:text-[#ff5e3a] transition-colors"
                    >
                      {p.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-[#1e2547] pt-6 text-center text-sm text-[#8890b5]">
            © {new Date().getFullYear()} {c.clubName}. Seluruh hak cipta dilindungi.
          </div>
        </div>
      </footer>
    </div>
  )
}

// ===== Komponen bantu =====
function SectionEyebrow({
  children,
  light,
}: {
  children: React.ReactNode
  light?: boolean
}) {
  return (
    <p
      className={
        'font-display uppercase tracking-[0.2em] font-semibold text-center ' +
        (light ? 'text-[#ff5e3a]' : 'text-[#ff5e3a]')
      }
    >
      {children}
    </p>
  )
}

function SectionTitle({
  children,
  light,
}: {
  children: React.ReactNode
  light?: boolean
}) {
  return (
    <h2
      className={
        'font-display text-3xl md:text-4xl font-bold uppercase tracking-wide text-center mt-2 ' +
        (light ? 'text-white' : 'text-[#0a0e27]')
      }
    >
      {children}
    </h2>
  )
}

function VisionCard({
  icon: Icon,
  title,
  body,
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  body: string
}) {
  return (
    <div className="bg-[#151b3d] rounded-xl p-7 border-b-[3px] border-[#ff5e3a]">
      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#ff5e3a] to-[#ff8a3a] grid place-items-center mb-4">
        <Icon className="w-6 h-6 text-white" />
      </div>
      <h3 className="font-display text-xl font-bold uppercase tracking-wide text-white mb-3">
        {title}
      </h3>
      <p className="text-[#8890b5] text-sm leading-relaxed">{body}</p>
    </div>
  )
}
