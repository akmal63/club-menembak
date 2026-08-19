import Image from 'next/image'
import { MapPin, Mail, Phone } from 'lucide-react'
import type { SiteContent } from '@/lib/site-content'

export default function PublicFooter({ content: c }: { content: SiteContent }) {
  return (
    <footer id="kontak" className="bg-brand text-white pt-20 pb-8">
      <div className="max-w-6xl mx-auto px-5">
        <div className="grid md:grid-cols-3 gap-10 mb-12">
          {/* Info club */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              {c.logoUrl ? (
                <span className="relative w-10 h-10 rounded-lg overflow-hidden bg-white grid place-items-center">
                  <Image src={c.logoUrl} alt={c.clubName} fill sizes="40px" className="object-contain" />
                </span>
              ) : (
                <span className="w-10 h-10 rounded-lg grid place-items-center text-white font-bold text-lg grad-accent">
                  ◎
                </span>
              )}
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
            <h4 className="font-display font-bold uppercase tracking-wide mb-4">Kontak</h4>
            <ul className="space-y-3 text-sm text-[#8890b5]">
              <li className="flex gap-2">
                <MapPin className="w-4 h-4 shrink-0 mt-0.5 text-accent" />
                <span className="whitespace-pre-line">{c.contact.address}</span>
              </li>
              <li className="flex gap-2 items-center">
                <Mail className="w-4 h-4 shrink-0 text-accent" />
                {c.contact.email}
              </li>
              {c.contact.phone.map((p) => (
                <li key={p} className="flex gap-2 items-center">
                  <Phone className="w-4 h-4 shrink-0 text-accent" />
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
                    className="text-[#8890b5] hover:text-accent transition-colors"
                  >
                    {p.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-[#1e2547] pt-6 text-center text-sm text-[#8890b5]">
          {c.copyrightText
            ? c.copyrightText
            : `© ${new Date().getFullYear()} ${c.clubName}. Seluruh hak cipta dilindungi.`}
        </div>
      </div>
    </footer>
  )
}
