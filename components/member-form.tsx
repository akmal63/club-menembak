'use client'

import { useActionState, useState, useTransition } from 'react'
import Link from 'next/link'
import type { ActionState } from '@/app/dashboard/members/actions'
import { addOption } from '@/lib/options-actions'
import ImageInput from '@/components/image-input'

type Member = {
  id?: string
  member_number?: string | null
  full_name?: string | null
  email?: string | null
  phone?: string | null
  address?: string | null
  birth_date?: string | null
  join_date?: string | null
  active_until?: string | null
  position?: string | null
  occupation?: string | null
  category?: string[] | null // kini array
  status?: string | null
  photo_url?: string | null
  notes?: string | null
}

type Props = {
  action: (prev: ActionState, formData: FormData) => Promise<ActionState>
  initial?: Member
  submitLabel: string
  positionOptions: string[]
  categoryOptions: string[]
}

const norm = (s: string) => s.toLowerCase().trim().replace(/\s+/g, ' ')

export default function MemberForm({
  action,
  initial,
  submitLabel,
  positionOptions,
  categoryOptions,
}: Props) {
  const [state, formAction, pending] = useActionState(action, null)

  return (
    <form action={formAction} className="space-y-4 max-w-2xl">
      {state?.error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm">
          {state.error}
        </div>
      )}

      {/* Pas Foto */}
      <div>
        <label className="block text-sm font-medium mb-1">Pas Foto (opsional)</label>
        <ImageInput
          name="photo"
          initialPreview={initial?.photo_url ?? null}
          hint={initial ? 'Kosongkan jika tidak ingin mengganti foto.' : 'Otomatis dikompres.'}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Nama Lengkap *" name="full_name" defaultValue={initial?.full_name} required />
        <Field label="No Registrasi" name="member_number" defaultValue={initial?.member_number} />

        {/* Jabatan: dropdown + manual + tambah ke daftar */}
        <PositionField
          value={initial?.position ?? ''}
          options={positionOptions}
        />

        <Field label="Pekerjaan" name="occupation" defaultValue={initial?.occupation} />
        <Field label="Email" name="email" type="email" defaultValue={initial?.email} />
        <Field label="Telepon" name="phone" defaultValue={initial?.phone} />
        <Field label="Tanggal Lahir" name="birth_date" type="date" defaultValue={initial?.birth_date} />
        <Field label="Tanggal Bergabung" name="join_date" type="date" defaultValue={initial?.join_date} />
        <Field label="Masa Aktif s/d" name="active_until" type="date" defaultValue={initial?.active_until} />

        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <select
            name="status"
            defaultValue={initial?.status ?? 'active'}
            className="w-full border rounded-lg px-3 py-2 bg-white"
          >
            <option value="active">Aktif</option>
            <option value="inactive">Tidak Aktif</option>
          </select>
        </div>
      </div>

      {/* Kategori: multi-pilih (checkbox) + manual + tambah ke daftar */}
      <CategoryField
        value={initial?.category ?? []}
        options={categoryOptions}
      />

      <div>
        <label className="block text-sm font-medium mb-1">Alamat</label>
        <textarea
          name="address"
          defaultValue={initial?.address ?? ''}
          rows={2}
          className="w-full border rounded-lg px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Catatan</label>
        <textarea
          name="notes"
          defaultValue={initial?.notes ?? ''}
          rows={2}
          className="w-full border rounded-lg px-3 py-2"
        />
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={pending}
          className="bg-accent text-white px-5 py-2 rounded-lg hover:opacity-90 disabled:opacity-50 font-display font-semibold uppercase tracking-wide"
        >
          {pending ? 'Menyimpan...' : submitLabel}
        </button>
        <Link href="/dashboard/members" className="border px-5 py-2 rounded-lg hover:bg-gray-50">
          Batal
        </Link>
      </div>
    </form>
  )
}

// ===== Field Jabatan: dropdown daftar + mode manual + tombol simpan ke daftar =====
function PositionField({ value, options }: { value: string; options: string[] }) {
  const inList = value !== '' && options.some((o) => norm(o) === norm(value))
  const isStale = value !== '' && !inList
  const [mode, setMode] = useState<'select' | 'custom'>(inList || value === '' ? 'select' : 'custom')
  const [selected, setSelected] = useState(inList ? value : '')
  const [custom, setCustom] = useState(inList ? '' : value)
  const [savedMsg, setSavedMsg] = useState('')
  const [pendingSave, startSave] = useTransition()

  const canAdd = mode === 'custom' && custom.trim() !== '' &&
    !options.some((o) => norm(o) === norm(custom))

  return (
    <div>
      <label className="block text-sm font-medium mb-1">
        Jabatan
        {isStale && (
          <span className="ml-2 text-[10px] font-semibold px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 align-middle">
            data lama — perbarui
          </span>
        )}
      </label>

      {mode === 'select' ? (
        <select
          value={selected}
          onChange={(e) => {
            const v = e.target.value
            if (v === '__custom__') { setMode('custom'); setCustom('') }
            else setSelected(v)
          }}
          className="w-full border rounded-lg px-3 py-2 bg-white"
        >
          <option value="">— Pilih —</option>
          {options.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
          <option value="__custom__">+ Ketik manual…</option>
        </select>
      ) : (
        <div className="space-y-2">
          <div className="flex gap-2">
            <input
              type="text"
              value={custom}
              onChange={(e) => { setCustom(e.target.value); setSavedMsg('') }}
              placeholder="Ketik jabatan"
              className="flex-1 border rounded-lg px-3 py-2"
            />
            <button
              type="button"
              onClick={() => { setMode('select'); setCustom('') }}
              className="px-3 border rounded-lg text-sm text-[#8890b5] hover:bg-gray-50"
            >
              Daftar
            </button>
          </div>
          {canAdd && (
            <button
              type="button"
              disabled={pendingSave}
              onClick={() =>
                startSave(async () => {
                  const r = await addOption('positionOptions', custom.trim())
                  if (r.ok) setSavedMsg('✓ Ditambahkan ke daftar. Muncul di pilihan setelah simpan/refresh.')
                  else setSavedMsg(r.error ?? 'Gagal menambah.')
                })
              }
              className="text-xs text-accent hover:underline font-medium disabled:opacity-50"
            >
              {pendingSave ? 'Menyimpan…' : '+ Simpan "' + custom.trim() + '" ke daftar jabatan'}
            </button>
          )}
          {savedMsg && <p className="text-xs text-green-600">{savedMsg}</p>}
        </div>
      )}

      <input type="hidden" name="position" value={mode === 'custom' ? custom : selected} />
    </div>
  )
}

// ===== Field Kategori: multi-pilih (checkbox) + tambah manual + simpan ke daftar =====
function CategoryField({ value, options }: { value: string[]; options: string[] }) {
  // Set kategori terpilih (normalisasi jadi acuan tampilan pakai teks asli option bila cocok)
  const [selected, setSelected] = useState<string[]>(() => value.filter(Boolean))
  const [manual, setManual] = useState('')
  const [savedMsg, setSavedMsg] = useState('')
  const [pendingSave, startSave] = useTransition()

  const isChecked = (opt: string) => selected.some((s) => norm(s) === norm(opt))
  const toggle = (opt: string) =>
    setSelected((prev) =>
      prev.some((s) => norm(s) === norm(opt))
        ? prev.filter((s) => norm(s) !== norm(opt))
        : [...prev, opt]
    )

  // Kategori terpilih yang TIDAK ada di daftar options (nilai manual/lama)
  const extras = selected.filter((s) => !options.some((o) => norm(o) === norm(s)))

  const addManual = () => {
    const v = manual.trim()
    if (!v) return
    if (!selected.some((s) => norm(s) === norm(v))) setSelected((prev) => [...prev, v])
    setManual('')
  }

  const canAddToList = manual.trim() !== '' && !options.some((o) => norm(o) === norm(manual))

  return (
    <div>
      <label className="block text-sm font-medium mb-2">Kategori (boleh lebih dari satu)</label>

      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <label
            key={opt}
            className={
              'inline-flex items-center gap-2 px-3 py-1.5 rounded-full border cursor-pointer text-sm ' +
              (isChecked(opt)
                ? 'bg-[color:var(--brand-accent)]/10 border-accent text-accent font-medium'
                : 'border-gray-300 text-gray-600 hover:bg-gray-50')
            }
          >
            <input
              type="checkbox"
              checked={isChecked(opt)}
              onChange={() => toggle(opt)}
              className="w-4 h-4 accent-[#ff5e3a]"
            />
            {opt}
          </label>
        ))}
      </div>

      {/* Kategori manual/lama yang terpilih tapi di luar daftar */}
      {extras.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {extras.map((ex) => (
            <span
              key={ex}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-amber-300 bg-amber-50 text-amber-700 text-sm"
            >
              {ex}
              <button
                type="button"
                onClick={() => setSelected((prev) => prev.filter((s) => s !== ex))}
                className="text-amber-500 hover:text-amber-700"
                title="Hapus"
              >
                ✕
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Tambah kategori manual */}
      <div className="flex gap-2 mt-3">
        <input
          type="text"
          value={manual}
          onChange={(e) => { setManual(e.target.value); setSavedMsg('') }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') { e.preventDefault(); addManual() }
          }}
          placeholder="Tambah kategori lain…"
          className="flex-1 border rounded-lg px-3 py-2 text-sm"
        />
        <button
          type="button"
          onClick={addManual}
          className="px-3 border rounded-lg text-sm text-accent hover:bg-gray-50 font-medium"
        >
          Tambah
        </button>
      </div>

      {canAddToList && (
        <button
          type="button"
          disabled={pendingSave}
          onClick={() =>
            startSave(async () => {
              const r = await addOption('categoryOptions', manual.trim())
              if (r.ok) setSavedMsg('✓ Ditambahkan ke daftar kategori.')
              else setSavedMsg(r.error ?? 'Gagal menambah.')
            })
          }
          className="text-xs text-accent hover:underline font-medium mt-1 disabled:opacity-50"
        >
          {pendingSave ? 'Menyimpan…' : '+ Simpan "' + manual.trim() + '" ke daftar kategori'}
        </button>
      )}
      {savedMsg && <p className="text-xs text-green-600 mt-1">{savedMsg}</p>}

      {/* Kirim tiap kategori sebagai category[] */}
      {selected.map((cat) => (
        <input key={cat} type="hidden" name="category[]" value={cat} />
      ))}
    </div>
  )
}

function Field({
  label,
  name,
  type = 'text',
  defaultValue,
  required,
}: {
  label: string
  name: string
  type?: string
  defaultValue?: string | null
  required?: boolean
}) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input
        type={type}
        name={name}
        defaultValue={defaultValue ?? ''}
        required={required}
        className="w-full border rounded-lg px-3 py-2"
      />
    </div>
  )
}
