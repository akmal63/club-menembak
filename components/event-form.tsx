'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import type { ActionState } from '@/app/dashboard/events/actions'

type EventItem = {
  title?: string | null
  description?: string | null
  location?: string | null
  start_date?: string | null
  end_date?: string | null
  status?: string | null
}

type Props = {
  action: (prev: ActionState, formData: FormData) => Promise<ActionState>
  initial?: EventItem
  submitLabel: string
}

function toLocalInput(v?: string | null) {
  if (!v) return ''
  const d = new Date(v)
  if (isNaN(d.getTime())) return ''
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export default function EventForm({ action, initial, submitLabel }: Props) {
  const [state, formAction, pending] = useActionState(action, null)

  return (
    <form action={formAction} className="space-y-4 max-w-2xl">
      {state?.error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm">
          {state.error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium mb-1">Nama Kegiatan *</label>
        <input
          type="text"
          name="title"
          defaultValue={initial?.title ?? ''}
          required
          className="w-full border rounded-lg px-3 py-2"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Tanggal Mulai *</label>
          <input
            type="datetime-local"
            name="start_date"
            defaultValue={toLocalInput(initial?.start_date)}
            required
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Tanggal Selesai</label>
          <input
            type="datetime-local"
            name="end_date"
            defaultValue={toLocalInput(initial?.end_date)}
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Lokasi</label>
          <input
            type="text"
            name="location"
            defaultValue={initial?.location ?? ''}
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <select
            name="status"
            defaultValue={initial?.status ?? 'upcoming'}
            className="w-full border rounded-lg px-3 py-2 bg-white"
          >
            <option value="upcoming">Akan Datang</option>
            <option value="ongoing">Berlangsung</option>
            <option value="finished">Selesai</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Deskripsi</label>
        <textarea
          name="description"
          defaultValue={initial?.description ?? ''}
          rows={3}
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
        <Link href="/dashboard/events" className="border px-5 py-2 rounded-lg hover:bg-gray-50">
          Batal
        </Link>
      </div>
    </form>
  )
}
