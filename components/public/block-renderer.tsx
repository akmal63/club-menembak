import Link from 'next/link'
import Image from 'next/image'
import { Target, ArrowRight, Calendar, Award, FileText } from 'lucide-react'
import type { PageBlock, BlockContent } from '@/lib/blocks'
import type { SiteContent } from '@/lib/site-content'
import { formatDate } from '@/lib/format'

type GalleryPhoto = { id: string; title: string | null; image_url: string }
type NewsItem = {
  id: string
  title: string
  slug: string | null
  excerpt: string | null
  image_url: string | null
  published_at: string | null
}
type ScheduleItem = {
  id: string
  title: string
  start_time: string
  location: string | null
  instructor: string | null
}
type EventItem = {
  id: string
  title: string
  start_date: string
  location: string | null
  description: string | null
}

type Props = {
  block: PageBlock
  gallery?: GalleryPhoto[]
  news?: NewsItem[]
  schedules?: ScheduleItem[]
  events?: EventItem[]
  siteContent?: SiteContent
  chairmanPhoto?: string | null
  chairmanName?: string | null
}

// Tombol opsional (dipakai beberapa tipe)
function BlockButton({ c }: { c: BlockContent }) {
  if (!c.button_enabled || !c.button_text) return null
  const link = c.button_link || '#'
  return (
    <a
      href={link}
      className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-display font-semibold uppercase tracking-wide text-white grad-accent hover:opacity-90 transition-opacity"
    >
      {c.button_text} <ArrowRight className="w-4 h-4" />
    </a>
  )
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-display text-accent uppercase tracking-[0.2em] font-semibold text-center">
      {children}
    </p>
  )
}
function Title({ children, light }: { children: React.ReactNode; light?: boolean }) {
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

export default function BlockRenderer({
  block,
  gallery,
  news,
  schedules,
  events,
  siteContent,
  chairmanPhoto,
  chairmanName,
}: Props) {
  const c = block.content

  switch (block.type) {
    // ===== HERO =====
    case 'hero':
      return (
        <section
          id="beranda"
          className="relative min-h-screen flex items-center bg-brand overflow-hidden"
        >
          <div className="absolute top-1/4 -right-40 w-96 h-96 rounded-full bg-[#ff5e3a] opacity-20 blur-3xl" />
          <div className="absolute bottom-0 -left-40 w-96 h-96 rounded-full bg-[#ff8a3a] opacity-10 blur-3xl" />
          <div className="relative max-w-6xl mx-auto px-5 py-32 grid md:grid-cols-2 gap-10 items-center">
            <div>
              {c.welcome && (
                <p className="font-display text-accent uppercase tracking-[0.2em] font-semibold mb-4">
                  {c.welcome}
                </p>
              )}
              {c.title && (
                <h1 className="font-display text-4xl md:text-6xl font-bold text-white uppercase leading-tight mb-2">
                  {c.title}
                </h1>
              )}
              {c.highlight && (
                <h2 className="font-display text-2xl md:text-4xl font-bold uppercase leading-tight mb-6 grad-accent bg-clip-text text-transparent">
                  {c.highlight}
                </h2>
              )}
              {c.subtitle && (
                <p className="text-[#8890b5] text-lg mb-8 max-w-md">{c.subtitle}</p>
              )}
              <BlockButton c={c} />
            </div>
            <div className="hidden md:flex justify-center">
              <div className="w-72 h-72 rounded-full border-4 border-accent/30 grid place-items-center">
                <div className="w-52 h-52 rounded-full border-4 border-accent/50 grid place-items-center">
                  <div className="w-32 h-32 rounded-full border-4 border-accent grid place-items-center bg-[#ff5e3a]/10">
                    <Target className="w-16 h-16 text-accent" strokeWidth={1.5} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )

    // ===== TEKS SAJA =====
    case 'text':
      return (
        <section className={'py-20 ' + (c.dark ? 'bg-brand' : 'bg-white')}>
          <div className="max-w-3xl mx-auto px-5 text-center">
            {c.eyebrow && <Eyebrow>{c.eyebrow}</Eyebrow>}
            {c.title && <Title light={c.dark}>{c.title}</Title>}
            {c.body && (
              <p
                className={
                  'text-lg leading-relaxed mt-6 whitespace-pre-line ' +
                  (c.dark ? 'text-[#8890b5]' : 'text-[#3a3f5c]')
                }
              >
                {c.body}
              </p>
            )}
            {c.button_enabled && (
              <div className="mt-8">
                <BlockButton c={c} />
              </div>
            )}
          </div>
        </section>
      )

    // ===== GAMBAR SAJA =====
    case 'image':
      if (!c.image_url) return null
      return (
        <section className={'py-20 ' + (c.dark ? 'bg-brand' : 'bg-white')}>
          <div className="max-w-5xl mx-auto px-5">
            {c.title && <Title light={c.dark}>{c.title}</Title>}
            {c.image_fit === 'contain' ? (
              <div className="mt-6 flex justify-center">
                <Image
                  src={c.image_url}
                  alt={c.title ?? 'Gambar'}
                  width={1024}
                  height={768}
                  sizes="(max-width:768px) 100vw, 1024px"
                  className="w-auto h-auto max-w-full max-h-[80vh] rounded-xl"
                />
              </div>
            ) : (
              <div className="relative aspect-video rounded-xl overflow-hidden mt-6">
                <Image
                  src={c.image_url}
                  alt={c.title ?? 'Gambar'}
                  fill
                  sizes="(max-width:768px) 100vw, 1024px"
                  className="object-cover"
                />
              </div>
            )}
          </div>
        </section>
      )

    // ===== TEKS + GAMBAR =====
    case 'text_image': {
      const imgLeft = c.image_side === 'left'
      return (
        <section className={'py-20 ' + (c.dark ? 'bg-brand' : 'bg-white')}>
          <div className="max-w-6xl mx-auto px-5">
            {c.eyebrow && <Eyebrow>{c.eyebrow}</Eyebrow>}
            {c.title && <Title light={c.dark}>{c.title}</Title>}
            <div className="grid md:grid-cols-2 gap-10 items-center mt-8">
              <div className={imgLeft ? 'md:order-2' : ''}>
                {c.body && (
                  <p
                    className={
                      'text-lg leading-relaxed whitespace-pre-line ' +
                      (c.dark ? 'text-[#8890b5]' : 'text-[#3a3f5c]')
                    }
                  >
                    {c.body}
                  </p>
                )}
                {c.button_enabled && (
                  <div className="mt-6">
                    <BlockButton c={c} />
                  </div>
                )}
              </div>
              <div className={imgLeft ? 'md:order-1' : ''}>
                {c.image_url ? (
                  c.image_fit === 'contain' ? (
                    <div className="flex justify-center">
                      <Image
                        src={c.image_url}
                        alt={c.title ?? ''}
                        width={800}
                        height={600}
                        sizes="(max-width:768px) 100vw, 50vw"
                        className="w-auto h-auto max-w-full max-h-[70vh] rounded-xl"
                      />
                    </div>
                  ) : (
                    <div className="relative aspect-[4/3] rounded-xl overflow-hidden">
                      <Image
                        src={c.image_url}
                        alt={c.title ?? ''}
                        fill
                        sizes="(max-width:768px) 100vw, 50vw"
                        className="object-cover"
                      />
                    </div>
                  )
                ) : (
                  <div className="aspect-[4/3] rounded-xl grad-brand grid place-items-center">
                    <Target className="w-16 h-16 text-accent/30" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )
    }

    // ===== KARTU BERJAJAR =====
    case 'cards':
      return (
        <section className={'py-20 ' + (c.dark ? 'bg-brand' : 'bg-white')}>
          <div className="max-w-6xl mx-auto px-5">
            {c.eyebrow && <Eyebrow>{c.eyebrow}</Eyebrow>}
            {c.title && <Title light={c.dark}>{c.title}</Title>}
            <div className="grid md:grid-cols-3 gap-6 mt-8">
              {(c.cards ?? []).map((card, i) => (
                <div
                  key={i}
                  className={
                    'rounded-xl p-7 border-b-[3px] border-accent ' +
                    (c.dark ? 'bg-brand-soft' : 'bg-white shadow-[0_4px_14px_rgba(10,14,39,0.06)]')
                  }
                >
                  <h3
                    className={
                      'font-display text-xl font-bold uppercase tracking-wide mb-3 ' +
                      (c.dark ? 'text-white' : 'text-[#0a0e27]')
                    }
                  >
                    {card.title}
                  </h3>
                  <p className={c.dark ? 'text-[#8890b5] text-sm' : 'text-[#3a3f5c] text-sm'}>
                    {card.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )

    // ===== CTA / SOROTAN =====
    case 'cta':
      return (
        <section className="py-20 bg-white">
          <div className="max-w-5xl mx-auto px-5">
            <div className="rounded-2xl grad-brand p-10 md:p-14 text-center">
              {c.eyebrow && (
                <p className="font-display text-accent uppercase tracking-[0.2em] font-semibold mb-3">
                  {c.eyebrow}
                </p>
              )}
              {c.title && (
                <h2 className="font-display text-3xl md:text-4xl font-bold uppercase tracking-wide text-white mb-4">
                  {c.title}
                </h2>
              )}
              {c.body && (
                <p className="text-[#8890b5] text-lg mb-8 max-w-2xl mx-auto">{c.body}</p>
              )}
              <BlockButton c={c} />
            </div>
          </div>
        </section>
      )

    // ===== GALERI (otomatis) =====
    case 'gallery':
      return (
        <section id="galeri" className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-5">
            {c.eyebrow && <Eyebrow>{c.eyebrow}</Eyebrow>}
            <Title>{c.title ?? 'Galeri'}</Title>
            {!gallery || gallery.length === 0 ? (
              <p className="text-center text-[#8890b5] mt-8">Belum ada foto.</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                {gallery.map((p) => (
                  <div key={p.id} className="relative aspect-square rounded-xl overflow-hidden group bg-[#f0f2f8]">
                    <Image
                      src={p.image_url}
                      alt={p.title ?? 'Foto'}
                      fill
                      unoptimized
                      sizes="(max-width:768px) 50vw, 25vw"
                      className="object-contain group-hover:scale-105 transition-transform"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )

    // ===== BERITA (otomatis) =====
    case 'news':
      return (
        <section id="berita" className="py-20 bg-[#f4f5fa]">
          <div className="max-w-6xl mx-auto px-5">
            {c.eyebrow && <Eyebrow>{c.eyebrow}</Eyebrow>}
            <Title>{c.title ?? 'Berita Terbaru'}</Title>
            {!news || news.length === 0 ? (
              <p className="text-center text-[#8890b5] mt-8">Belum ada berita.</p>
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
                            sizes="(max-width:768px) 100vw, 33vw"
                            className="object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                      ) : (
                        <div className="aspect-video grad-brand grid place-items-center">
                          <Target className="w-12 h-12 text-accent/40" />
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
                          <p className="text-sm text-[#3a3f5c] line-clamp-3">{n.excerpt}</p>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
                <div className="text-center mt-8">
                  <Link
                    href="/berita"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-display font-semibold uppercase tracking-wide text-white grad-accent hover:opacity-90"
                  >
                    Lihat Semua Berita <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </>
            )}
          </div>
        </section>
      )

    // ===== JADWAL LATIHAN (otomatis) =====
    case 'schedules':
      return (
        <section id="jadwal" className={'py-20 ' + (c.dark ? 'bg-brand' : 'bg-white')}>
          <div className="max-w-4xl mx-auto px-5">
            {c.eyebrow && <Eyebrow>{c.eyebrow}</Eyebrow>}
            <Title light={c.dark}>{c.title ?? 'Jadwal Latihan'}</Title>
            {!schedules || schedules.length === 0 ? (
              <p className="text-center text-[#8890b5] mt-8">Belum ada jadwal latihan mendatang.</p>
            ) : (
              <div className="mt-8 space-y-3">
                {schedules.map((s) => {
                  const d = new Date(s.start_time)
                  return (
                    <div
                      key={s.id}
                      className={
                        'flex gap-4 items-center rounded-xl p-4 ' +
                        (c.dark ? 'bg-brand-soft' : 'bg-white shadow-[0_4px_14px_rgba(10,14,39,0.06)]')
                      }
                    >
                      <div className="w-14 h-14 rounded-lg grid place-items-center text-white shrink-0 grad-accent">
                        <span className="font-display text-lg font-bold leading-none">{d.getDate()}</span>
                        <span className="text-[10px] uppercase leading-none">
                          {d.toLocaleDateString('id-ID', { month: 'short' })}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={'font-semibold truncate ' + (c.dark ? 'text-white' : 'text-[#0a0e27]')}>
                          {s.title}
                        </p>
                        <p className="text-xs text-[#8890b5]">
                          {formatDate(s.start_time)}
                          {s.location ? ` · ${s.location}` : ''}
                          {s.instructor ? ` · ${s.instructor}` : ''}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </section>
      )

    // ===== JADWAL KEGIATAN (otomatis) =====
    case 'events':
      return (
        <section id="kegiatan" className={'py-20 ' + (c.dark ? 'bg-brand' : 'bg-[#f4f5fa]')}>
          <div className="max-w-6xl mx-auto px-5">
            {c.eyebrow && <Eyebrow>{c.eyebrow}</Eyebrow>}
            <Title light={c.dark}>{c.title ?? 'Jadwal Kegiatan'}</Title>
            {!events || events.length === 0 ? (
              <p className="text-center text-[#8890b5] mt-8">Belum ada kegiatan mendatang.</p>
            ) : (
              <div className="grid md:grid-cols-2 gap-5 mt-8">
                {events.map((ev) => {
                  const d = new Date(ev.start_date)
                  return (
                    <div
                      key={ev.id}
                      className="bg-white rounded-xl p-5 shadow-[0_4px_14px_rgba(10,14,39,0.06)] flex gap-4"
                    >
                      <div className="w-14 h-14 rounded-lg grid place-items-center text-white shrink-0 grad-accent">
                        <span className="font-display text-lg font-bold leading-none">{d.getDate()}</span>
                        <span className="text-[10px] uppercase leading-none">
                          {d.toLocaleDateString('id-ID', { month: 'short' })}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-display text-lg font-bold uppercase tracking-wide text-[#0a0e27] leading-snug">
                          {ev.title}
                        </p>
                        <p className="text-xs text-[#8890b5] mb-1">
                          {formatDate(ev.start_date)}
                          {ev.location ? ` · ${ev.location}` : ''}
                        </p>
                        {ev.description && (
                          <p className="text-sm text-[#3a3f5c] line-clamp-2">{ev.description}</p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </section>
      )

    // ===== FEDERASI =====
    case 'federations':
      return (
        <section className={'py-20 ' + (c.dark ? 'bg-brand' : 'bg-white')}>
          <div className="max-w-6xl mx-auto px-5">
            {c.eyebrow && <Eyebrow>{c.eyebrow}</Eyebrow>}
            <Title light={c.dark}>{c.title ?? 'Afiliasi & Federasi'}</Title>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mt-8">
              {(c.federations ?? []).map((f, i) => (
                <div
                  key={i}
                  className={
                    'rounded-xl p-6 text-center border-b-[3px] border-accent ' +
                    (c.dark ? 'bg-brand-soft' : 'bg-white shadow-[0_4px_14px_rgba(10,14,39,0.06)]')
                  }
                >
                  {f.image_url ? (
                    <div className="relative w-16 h-16 mx-auto mb-3">
                      <Image
                        src={f.image_url}
                        alt={f.abbr ?? ''}
                        fill
                        sizes="64px"
                        className="object-contain"
                      />
                    </div>
                  ) : null}
                  <div
                    className={
                      'font-display text-xl font-bold mb-2 ' +
                      (c.dark ? 'text-white' : 'text-[#0a0e27]')
                    }
                  >
                    {f.abbr}
                  </div>
                  <p className="text-xs text-[#8890b5] leading-snug">{f.name}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )

    // ===== LEGALITAS & KETUA (otomatis dari Pengaturan Identitas) =====
    case 'legal': {
      const about = siteContent?.about
      const legal = about?.legal ?? []
      const clubName = siteContent?.clubName ?? ''
      // Jabatan ketua otomatis: "Ketua {Nama Club}"
      const chairTitle = clubName ? `Ketua ${clubName}` : (about?.chairman ?? '')
      const showChair = !!(chairmanName || chairmanPhoto || chairTitle)
      if (!showChair && legal.length === 0) return null
      return (
        <section
          id="legalitas"
          className={'py-20 ' + (c.dark ? 'bg-brand' : 'bg-[#f4f5fa]')}
        >
          <div className="max-w-4xl mx-auto px-5">
            {c.eyebrow && <Eyebrow>{c.eyebrow}</Eyebrow>}
            <Title light={c.dark}>{c.title ?? 'Legalitas & Kepengurusan'}</Title>

            {/* Kartu Ketua */}
            {showChair && (
              <div
                className={
                  'mt-8 rounded-xl p-6 text-center border-b-[3px] border-accent max-w-md mx-auto ' +
                  (c.dark ? 'bg-brand-soft' : 'bg-white shadow-[0_4px_14px_rgba(10,14,39,0.06)]')
                }
              >
                {chairmanPhoto ? (
                  <div className="relative w-32 h-40 mx-auto mb-3 rounded-lg overflow-hidden bg-[#f0f2f8] ring-2 ring-[#ff5e3a]/40">
                    <Image
                      src={chairmanPhoto}
                      alt={chairmanName ?? chairTitle}
                      fill
                      unoptimized
                      sizes="128px"
                      className="object-contain"
                    />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-lg grid place-items-center text-white mx-auto mb-3 grad-accent">
                    <Award className="w-6 h-6" />
                  </div>
                )}
                <p className="text-xs text-[#8890b5] uppercase tracking-[0.15em] mb-1">
                  {chairTitle || 'Kepemimpinan'}
                </p>
                {chairmanName && (
                  <p
                    className={
                      'font-display font-bold uppercase tracking-wide ' +
                      (c.dark ? 'text-white' : 'text-[#0a0e27]')
                    }
                  >
                    {chairmanName}
                  </p>
                )}
              </div>
            )}

            {/* Grid legalitas */}
            {legal.length > 0 && (
              <div className="grid md:grid-cols-2 gap-5 mt-6">
                {legal.map((item, i) => (
                  <div
                    key={i}
                    className={
                      'rounded-xl p-5 flex gap-4 items-start ' +
                      (c.dark ? 'bg-brand-soft' : 'bg-white shadow-[0_4px_14px_rgba(10,14,39,0.06)]')
                    }
                  >
                    <div className="w-10 h-10 rounded-lg grid place-items-center text-accent shrink-0 bg-[#ff5e3a]/10">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <p
                        className={
                          'font-semibold leading-snug ' +
                          (c.dark ? 'text-white' : 'text-[#0a0e27]')
                        }
                      >
                        {item.label}
                      </p>
                      <p className="text-sm text-[#8890b5] break-words">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )
    }

    // ===== TEKS IDENTITAS (otomatis dari Pengaturan Identitas) =====
    // ===== IDENTITAS CLUB (otomatis, pola Teks + Gambar) =====
    case 'identity_club': {
      const name = siteContent?.clubName ?? ''
      const logo = siteContent?.logoUrl ?? ''
      const it = siteContent?.identityText
      const label = it?.label ?? ''
      const body = it?.body ?? ''
      if (!name && !logo && !label && !body) return null
      const imgLeft = c.image_side === 'left'
      return (
        <section className={'py-20 ' + (c.dark ? 'bg-brand' : 'bg-white')}>
          <div className="max-w-6xl mx-auto px-5">
            <div className="grid md:grid-cols-2 gap-10 items-center">
              {/* Teks */}
              <div className={(imgLeft ? 'md:order-2' : '') + ' min-w-0'}>
                {name && <Eyebrow>{name}</Eyebrow>}
                {name && (
                  <h2
                    className={
                      'font-display text-3xl font-bold uppercase tracking-wide mt-2 break-words ' +
                      (c.dark ? 'text-white' : 'text-[#0a0e27]')
                    }
                  >
                    {name}
                  </h2>
                )}
                {label && (
                  <h3
                    className={
                      'font-display text-xl font-bold uppercase tracking-wide mt-4 break-words ' +
                      (c.dark ? 'text-[#ff8a3a]' : 'text-accent')
                    }
                  >
                    {label}
                  </h3>
                )}
                {body && (
                  <p
                    className={
                      'text-lg leading-relaxed mt-3 whitespace-pre-line break-words ' +
                      (c.dark ? 'text-[#8890b5]' : 'text-[#3a3f5c]')
                    }
                  >
                    {body}
                  </p>
                )}
              </div>

              {/* Gambar = logo (tidak dipotong) */}
              <div className={imgLeft ? 'md:order-1' : ''}>
                {logo ? (
                  <div className="flex justify-center">
                    <div className="relative w-64 h-64 rounded-2xl overflow-hidden bg-white ring-1 ring-black/5 grid place-items-center">
                      <Image
                        src={logo}
                        alt={name || 'Logo'}
                        fill
                        unoptimized
                        sizes="256px"
                        className="object-contain p-6"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="aspect-square max-w-64 mx-auto rounded-2xl grad-brand grid place-items-center">
                    <Target className="w-16 h-16 text-accent/30" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )
    }

    default:
      return null
  }
}
