'use client'

import { useActionState, useState } from 'react'
import Link from 'next/link'
import type { BlockType, BlockContent } from '@/lib/blocks'
import { AUTO_TYPES, CARD_ICON_KEYS, CARD_ICON_LABELS } from '@/lib/blocks'
import type { BlockState } from '@/app/dashboard/content/actions'
import ImageInput from '@/components/image-input'

type Props = {
  action: (prev: BlockState, formData: FormData) => Promise<BlockState>
  type: BlockType
  initial?: BlockContent
  submitLabel: string
  isNew?: boolean
}

export default function BlockEditorForm({
  action,
  type,
  initial,
  submitLabel,
}: Props) {
  const [state, formAction, pending] = useActionState(action, null)
  const c = initial ?? {}
  const [btnOn, setBtnOn] = useState<boolean>(c.button_enabled ?? false)

  const showText = ['text', 'text_image', 'cta'].includes(type)
  const showImage = ['image', 'text_image'].includes(type)
  const showCards = type === 'cards'
  const showFederations = type === 'federations'
  const showHero = type === 'hero'
  const showButton = ['hero', 'text', 'text_image', 'cta'].includes(type)
  const isAuto = AUTO_TYPES.includes(type)

  return (
    <form action={formAction} className="space-y-4 max-w-2xl">
      <input type="hidden" name="type" value={type} />
      {c.image_url && <input type="hidden" name="existing_image" value={c.image_url} />}

      {state?.error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm">
          {state.error}
        </div>
      )}

      {isAuto && (
        <p className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg text-sm">
          {type === 'legal'
            ? 'Blok ini menampilkan Jabatan Ketua & Legalitas secara otomatis dari Pengaturan Identitas. Anda hanya mengatur judulnya.'
            : type === 'identity_club'
            ? 'Blok ini menampilkan Logo, Nama Club, Judul & Isi Teks otomatis dari Pengaturan Identitas. Anda hanya mengatur posisi gambar & latar.'
            : type === 'org_structure'
            ? 'Blok ini menampilkan ringkasan Struktur Organisasi (pimpinan puncak) otomatis dari menu Struktur, dengan tombol "Lihat Selengkapnya" ke halaman /struktur. Anda hanya mengatur judul & latar.'
            : `Blok ini menarik data otomatis dari ${
                type === 'gallery'
                  ? 'Galeri'
                  : type === 'news'
                  ? 'Berita'
                  : type === 'schedules'
                  ? 'Jadwal Latihan'
                  : 'Jadwal Kegiatan'
              }. Anda hanya mengatur judulnya.`}
        </p>
      )}

      {/* ID SECTION (anchor) untuk menu navbar */}
      <div>
        <label className="block text-sm font-medium mb-1">
          ID Section (untuk menu navbar)
        </label>
        <input
          type="text"
          name="anchor"
          defaultValue={c.anchor ?? ''}
          placeholder="mis. tentang, visimisi, program"
          className="w-full border rounded-lg px-3 py-2"
        />
        <p className="text-xs text-[#8890b5] mt-1">
          Isi agar blok ini bisa dituju dari menu. Contoh: isi <b>tentang</b>, lalu di
          Pengaturan → Navigasi buat menu dengan URL <b>/#tentang</b>. Gunakan huruf kecil
          tanpa spasi. Kosongkan jika tak perlu.
        </p>
      </div>

      {/* Posisi gambar untuk Identitas Club */}
      {type === 'identity_club' && (
        <div>
          <label className="block text-sm font-medium mb-1">Posisi Logo</label>
          <select
            name="image_side"
            defaultValue={c.image_side ?? 'right'}
            className="w-full border rounded-lg px-3 py-2 bg-white"
          >
            <option value="right">Kanan</option>
            <option value="left">Kiri</option>
          </select>
        </div>
      )}

      {/* Eyebrow & Title (umum kecuali hero) */}
      {!showHero && (
        <>
          <Field label="Teks Kecil di Atas (eyebrow)" name="eyebrow" defaultValue={c.eyebrow} />
          <Field label="Judul" name="title" defaultValue={c.title} />
        </>
      )}

      {/* HERO */}
      {showHero && (
        <>
          <Field label="Teks Sambutan" name="welcome" defaultValue={c.welcome} />
          <Field label="Judul" name="title" defaultValue={c.title} />
          <Field label="Judul Sorotan (berwarna)" name="highlight" defaultValue={c.highlight} />
          <Area label="Subjudul" name="subtitle" defaultValue={c.subtitle} />
        </>
      )}

      {/* Teks */}
      {showText && (
        <Area label="Isi Teks" name="body" defaultValue={c.body} rows={5} />
      )}

      {/* Gambar */}
      {showImage && (
        <div>
          <label className="block text-sm font-medium mb-1">Gambar</label>
          <ImageInput
            name="image"
            initialPreview={c.image_url ?? null}
            hint="Kosongkan jika tak ingin ganti."
          />
          <div className="mt-3">
            <label className="block text-sm font-medium mb-1">Tampilan Gambar</label>
            <select
              name="image_fit"
              defaultValue={c.image_fit ?? 'cover'}
              className="w-full border rounded-lg px-3 py-2 bg-white"
            >
              <option value="cover">Isi penuh kotak (rapikan, mungkin terpotong)</option>
              <option value="contain">Tampilkan utuh (tidak terpotong)</option>
            </select>
          </div>
          {type === 'text_image' && (
            <div className="mt-3">
              <label className="block text-sm font-medium mb-1">Posisi Gambar</label>
              <select
                name="image_side"
                defaultValue={c.image_side ?? 'right'}
                className="w-full border rounded-lg px-3 py-2 bg-white"
              >
                <option value="right">Kanan</option>
                <option value="left">Kiri</option>
              </select>
            </div>
          )}
        </div>
      )}

      {/* Cards */}
      {showCards && (
        <div className="space-y-3">
          <p className="text-sm font-medium text-[#8890b5]">Kartu (isi hingga 3)</p>
          <p className="text-xs text-[#8890b5] bg-blue-50 border border-blue-200 rounded-lg px-3 py-2">
            Tips: pada Isi Kartu, jika Anda menulis daftar dipisah koma (mis.
            <b> Teamwork, Inovasi, Integritas</b>), otomatis tampil sebagai badge/chip.
            Jika kalimat biasa, tampil sebagai paragraf.
          </p>
          {[0, 1, 2].map((i) => (
            <div key={i} className="border rounded-lg p-3 space-y-2">
              <Field
                label={`Judul Kartu ${i + 1}`}
                name={`card_title_${i}`}
                defaultValue={c.cards?.[i]?.title}
              />
              <div>
                <label className="block text-sm font-medium mb-1">Ikon Kartu {i + 1}</label>
                <select
                  name={`card_icon_${i}`}
                  defaultValue={c.cards?.[i]?.icon ?? ''}
                  className="w-full border rounded-lg px-3 py-2 bg-white"
                >
                  <option value="">— Tanpa ikon —</option>
                  {CARD_ICON_KEYS.map((k) => (
                    <option key={k} value={k}>
                      {CARD_ICON_LABELS[k]}
                    </option>
                  ))}
                </select>
              </div>
              <Area
                label={`Isi Kartu ${i + 1}`}
                name={`card_body_${i}`}
                defaultValue={c.cards?.[i]?.body}
                rows={2}
              />
            </div>
          ))}
        </div>
      )}

      {/* Federasi */}
      {showFederations && (
        <div className="space-y-3">
          <p className="text-sm font-medium text-[#8890b5]">
            Afiliasi/Federasi (isi hingga 4, dengan logo)
          </p>
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="border rounded-lg p-3 space-y-2">
              {c.federations?.[i]?.image_url && (
                <input
                  type="hidden"
                  name={`existing_fed_image_${i}`}
                  value={c.federations[i].image_url}
                />
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <Field
                  label={`Singkatan ${i + 1}`}
                  name={`fed_abbr_${i}`}
                  defaultValue={c.federations?.[i]?.abbr}
                />
                <Field
                  label={`Nama Lengkap ${i + 1}`}
                  name={`fed_name_${i}`}
                  defaultValue={c.federations?.[i]?.name}
                />
              </div>
              <label className="block text-sm font-medium">Logo {i + 1}</label>
              <ImageInput
                name={`fed_image_${i}`}
                initialPreview={c.federations?.[i]?.image_url ?? null}
                hint="Opsional. Kosongkan jika tak ingin ganti."
              />
            </div>
          ))}
        </div>
      )}

      {/* Latar gelap (untuk beberapa tipe) */}
      {['text', 'image', 'text_image', 'cards', 'legal', 'identity_club', 'org_structure'].includes(type) && (
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            name="dark"
            defaultChecked={c.dark ?? false}
            className="w-4 h-4 accent-[#ff5e3a]"
          />
          <span className="text-sm font-medium">Latar gelap (navy)</span>
        </label>
      )}

      {/* Tombol (CTA per blok) */}
      {showButton && (
        <div className="border rounded-lg p-4 space-y-3 bg-gray-50">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="button_enabled"
              checked={btnOn}
              onChange={(e) => setBtnOn(e.target.checked)}
              className="w-4 h-4 accent-[#ff5e3a]"
            />
            <span className="text-sm font-medium">Tampilkan tombol</span>
          </label>
          {btnOn && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Field label="Teks Tombol" name="button_text" defaultValue={c.button_text} />
              <Field
                label="Link Tombol"
                name="button_link"
                defaultValue={c.button_link}
                placeholder="#tentang atau /berita"
              />
            </div>
          )}
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={pending}
          className="bg-accent text-white px-5 py-2 rounded-lg hover:opacity-90 disabled:opacity-50 font-display font-semibold uppercase tracking-wide"
        >
          {pending ? 'Menyimpan...' : submitLabel}
        </button>
        <Link href="/dashboard/content" className="border px-5 py-2 rounded-lg hover:bg-gray-50">
          Batal
        </Link>
      </div>
    </form>
  )
}

function Field({
  label,
  name,
  defaultValue,
  placeholder,
}: {
  label: string
  name: string
  defaultValue?: string | null
  placeholder?: string
}) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input
        type="text"
        name={name}
        defaultValue={defaultValue ?? ''}
        placeholder={placeholder}
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
  defaultValue?: string | null
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
