'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import type { ActionState } from '@/app/dashboard/members/actions'
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
  category?: string | null
  status?: string | null
  photo_url?: string | null
  notes?: string | null
}

type Props = {
  action: (prev: ActionState, formData: FormData) => Promise<ActionState>
  initial?: Member
  submitLabel: string
}

export default function MemberForm({ action, initial, submitLabel }: Props) {
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
        <Field label="Jabatan" name="position" defaultValue={initial?.position} />
        <Field label="Pekerjaan" name="occupation" defaultValue={initial?.occupation} />
        <Field label="Email" name="email" type="email" defaultValue={initial?.email} />
        <Field label="Telepon" name="phone" defaultValue={initial?.phone} />
        <Field label="Tanggal Lahir" name="birth_date" type="date" defaultValue={initial?.birth_date} />
        <Field label="Tanggal Bergabung" name="join_date" type="date" defaultValue={initial?.join_date} />
        <Field label="Masa Aktif s/d" name="active_until" type="date" defaultValue={initial?.active_until} />

        <div>
          <label className="block text-sm font-medium mb-1">Kategori</label>
          <select
            name="category"
            defaultValue={initial?.category ?? ''}
            className="w-full border rounded-lg px-3 py-2 bg-white"
          >
            <option value="">— Pilih —</option>
            <option value="pistol">Pistol</option>
            <option value="rifle">Rifle</option>
            <option value="shotgun">Shotgun</option>
            <option value="lainnya">Lainnya</option>
          </select>
        </div>

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
          className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {pending ? 'Menyimpan...' : submitLabel}
        </button>
        <Link
          href="/dashboard/members"
          className="border px-5 py-2 rounded-lg hover:bg-gray-50"
        >
          Batal
        </Link>
      </div>
    </form>
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
