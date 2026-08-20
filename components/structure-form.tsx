'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import type { StructureState } from '@/app/dashboard/structure/actions'

// Anggota untuk dropdown (dari members_public)
export type MemberOption = {
  id: string
  full_name: string | null
  position: string | null
}

// Posisi lain untuk dropdown "atasan"
export type ParentOption = {
  id: string
  label: string // "Jabatan — Nama"
}

type PositionData = {
  member_id?: string
  parent_id?: string | null
  role_override?: string | null
  sort_order?: number
  is_active?: boolean
}

export default function StructureForm({
  action,
  members,
  parents,
  initial,
  submitLabel,
}: {
  action: (prev: StructureState, formData: FormData) => Promise<StructureState>
  members: MemberOption[]
  parents: ParentOption[]
  initial?: PositionData
  submitLabel: string
}) {
  const [state, formAction, pending] = useActionState(action, null)
  const c = initial ?? {}

  return (
    <form action={formAction} className="space-y-5 max-w-xl">
      {state?.error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm">
          {state.error}
        </div>
      )}

      {/* Pilih anggota */}
      <div>
        <label className="block text-sm font-medium mb-1">Anggota</label>
        <select
          name="member_id"
          defaultValue={c.member_id ?? ''}
          required
          className="w-full border rounded-lg px-3 py-2 bg-white"
        >
          <option value="">— Pilih anggota —</option>
          {members.map((m) => (
            <option key={m.id} value={m.id}>
              {m.full_name || 'Tanpa Nama'}
              {m.position ? ` (${m.position})` : ''}
            </option>
          ))}
        </select>
        <p className="text-xs text-[#8890b5] mt-1">
          Nama &amp; foto diambil otomatis dari data anggota (selalu sinkron).
        </p>
      </div>

      {/* Jabatan override */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Jabatan di Bagan <span className="text-[#8890b5]">(opsional)</span>
        </label>
        <input
          type="text"
          name="role_override"
          defaultValue={c.role_override ?? ''}
          placeholder="Kosongkan = pakai jabatan anggota"
          className="w-full border rounded-lg px-3 py-2"
        />
        <p className="text-xs text-[#8890b5] mt-1">
          Isi hanya jika ingin jabatan berbeda dari data anggota (mis. &quot;Ketua Umum&quot;).
        </p>
      </div>

      {/* Atasan */}
      <div>
        <label className="block text-sm font-medium mb-1">Atasan Langsung</label>
        <select
          name="parent_id"
          defaultValue={c.parent_id ?? ''}
          className="w-full border rounded-lg px-3 py-2 bg-white"
        >
          <option value="">— Tidak ada (posisi puncak) —</option>
          {parents.map((p) => (
            <option key={p.id} value={p.id}>
              {p.label}
            </option>
          ))}
        </select>
        <p className="text-xs text-[#8890b5] mt-1">
          Pilih posisi di atasnya. Kosongkan bila ini puncak (mis. Ketua/Pembina).
        </p>
      </div>

      {/* Urutan */}
      <div>
        <label className="block text-sm font-medium mb-1">Urutan</label>
        <input
          type="number"
          name="sort_order"
          defaultValue={c.sort_order ?? 0}
          className="w-32 border rounded-lg px-3 py-2"
        />
        <p className="text-xs text-[#8890b5] mt-1">
          Angka lebih kecil tampil lebih kiri (untuk posisi yang setingkat).
        </p>
      </div>

      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          name="is_active"
          defaultChecked={c.is_active ?? true}
          className="w-4 h-4 accent-[#ff5e3a]"
        />
        <span className="text-sm font-medium">Tampilkan posisi ini (aktif)</span>
      </label>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={pending}
          className="bg-accent text-white px-5 py-2 rounded-lg hover:opacity-90 disabled:opacity-50 font-display font-semibold uppercase tracking-wide"
        >
          {pending ? 'Menyimpan...' : submitLabel}
        </button>
        <Link href="/dashboard/structure" className="border px-5 py-2 rounded-lg hover:bg-gray-50">
          Batal
        </Link>
      </div>
    </form>
  )
}
