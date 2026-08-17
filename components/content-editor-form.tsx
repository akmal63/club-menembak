'use client'

import { useActionState } from 'react'
import { updateSiteContent } from '@/app/dashboard/settings/content-actions'
import type { SiteContent } from '@/lib/site-content'

export default function ContentEditorForm({ initial }: { initial: SiteContent }) {
  const [state, formAction, pending] = useActionState(updateSiteContent, null)

  return (
    <form action={formAction} className="space-y-8 max-w-3xl pb-10">
      {state && 'error' in state && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm sticky top-2 z-10">
          {state.error}
        </div>
      )}
      {state && 'success' in state && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-lg text-sm sticky top-2 z-10">
          {state.success}
        </div>
      )}

      {/* ===== IDENTITAS ===== */}
      <Section title="Identitas Club">
        <Grid>
          <Field label="Nama Club" name="clubName" defaultValue={initial.clubName} />
          <Field label="Singkatan" name="clubShort" defaultValue={initial.clubShort} />
          <Field label="Tagline" name="tagline" defaultValue={initial.tagline} />
          <Field label="Lokasi Singkat" name="location" defaultValue={initial.location} />
        </Grid>
      </Section>

      {/* ===== HERO ===== */}
      <Section title="Bagian Hero (paling atas)">
        <Grid>
          <Field label="Teks Sambutan" name="hero_welcome" defaultValue={initial.hero.welcome} />
          <Field label="Judul" name="hero_title" defaultValue={initial.hero.title} />
        </Grid>
        <Field label="Judul Sorotan (berwarna)" name="hero_highlight" defaultValue={initial.hero.highlight} />
        <Area label="Subjudul" name="hero_subtitle" defaultValue={initial.hero.subtitle} />
      </Section>

      {/* ===== TENTANG ===== */}
      <Section title="Tentang Kami">
        <Field label="Judul Bagian" name="about_heading" defaultValue={initial.about.heading} />
        <Area label="Isi / Deskripsi" name="about_body" defaultValue={initial.about.body} rows={4} />
        <Field label="Jabatan Ketua" name="about_chairman" defaultValue={initial.about.chairman} />

        <SubLabel>Legalitas (SKEP, dll)</SubLabel>
        {[0, 1, 2].map((i) => (
          <Grid key={i}>
            <Field
              label={`Label ${i + 1}`}
              name={`legal_label_${i}`}
              defaultValue={initial.about.legal[i]?.label ?? ''}
            />
            <Field
              label={`Nomor ${i + 1}`}
              name={`legal_value_${i}`}
              defaultValue={initial.about.legal[i]?.value ?? ''}
            />
          </Grid>
        ))}
      </Section>

      {/* ===== VISI MISI ===== */}
      <Section title="Visi, Misi & Nilai">
        <Area label="Visi" name="vision_visi" defaultValue={initial.vision.visi} />
        <Area label="Misi" name="vision_misi" defaultValue={initial.vision.misi} />
        <Area label="Nilai" name="vision_nilai" defaultValue={initial.vision.nilai} />
      </Section>

      {/* ===== FEDERASI ===== */}
      <Section title="Afiliasi / Federasi">
        <SubLabel>Isi hingga 4 federasi. Kosongkan jika tidak dipakai.</SubLabel>
        {[0, 1, 2, 3].map((i) => (
          <Grid key={i}>
            <Field
              label={`Singkatan ${i + 1}`}
              name={`federation_abbr_${i}`}
              defaultValue={initial.federations[i]?.abbr ?? ''}
            />
            <Field
              label={`Nama Lengkap ${i + 1}`}
              name={`federation_name_${i}`}
              defaultValue={initial.federations[i]?.name ?? ''}
            />
          </Grid>
        ))}
      </Section>

      {/* ===== KONTAK ===== */}
      <Section title="Kontak">
        <Area label="Alamat (boleh beberapa baris)" name="contact_address" defaultValue={initial.contact.address} />
        <Field label="Email" name="contact_email" defaultValue={initial.contact.email} />
        <Area
          label="Telepon (satu nomor per baris)"
          name="contact_phone"
          defaultValue={initial.contact.phone.join('\n')}
        />
      </Section>

      {/* ===== PARTNER ===== */}
      <Section title="Tautan Partner">
        <SubLabel>Isi hingga 4 tautan. Kosongkan jika tidak dipakai.</SubLabel>
        {[0, 1, 2, 3].map((i) => (
          <Grid key={i}>
            <Field
              label={`Nama ${i + 1}`}
              name={`partner_label_${i}`}
              defaultValue={initial.partners[i]?.label ?? ''}
            />
            <Field
              label={`URL ${i + 1}`}
              name={`partner_url_${i}`}
              defaultValue={initial.partners[i]?.url ?? ''}
            />
          </Grid>
        ))}
      </Section>

      <div className="sticky bottom-0 bg-white/90 backdrop-blur py-3 border-t">
        <button
          type="submit"
          disabled={pending}
          className="bg-[#ff5e3a] text-white px-6 py-2.5 rounded-lg hover:opacity-90 disabled:opacity-50 font-display font-semibold uppercase tracking-wide"
        >
          {pending ? 'Menyimpan...' : 'Simpan Konten'}
        </button>
      </div>
    </form>
  )
}

// ===== Komponen bantu =====
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl shadow border p-5">
      <h2 className="font-display text-lg font-bold uppercase tracking-wide text-[#0a0e27] mb-4">
        {title}
      </h2>
      <div className="space-y-4">{children}</div>
    </div>
  )
}
function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
}
function SubLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-sm font-medium text-[#8890b5] pt-2">{children}</p>
}
function Field({
  label,
  name,
  defaultValue,
}: {
  label: string
  name: string
  defaultValue?: string
}) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input
        type="text"
        name={name}
        defaultValue={defaultValue ?? ''}
        className="w-full border rounded-lg px-3 py-2"
      />
    </div>
  )
}
function Area({
  label,
  name,
  defaultValue,
  rows = 3,
}: {
  label: string
  name: string
  defaultValue?: string
  rows?: number
}) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <textarea
        name={name}
        defaultValue={defaultValue ?? ''}
        rows={rows}
        className="w-full border rounded-lg px-3 py-2"
      />
    </div>
  )
}
