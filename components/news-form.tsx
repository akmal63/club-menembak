'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import type { NewsState } from '@/app/dashboard/news/actions'
import ImageInput from '@/components/image-input'

type News = {
  title?: string | null
  excerpt?: string | null
  body?: string | null
  image_url?: string | null
  published_at?: string | null
  is_active?: boolean | null
}

type Props = {
  action: (prev: NewsState, formData: FormData) => Promise<NewsState>
  initial?: News
  submitLabel: string
}

export default function NewsForm({ action, initial, submitLabel }: Props) {
  const [state, formAction, pending] = useActionState(action, null)

  return (
    <form action={formAction} className="space-y-4 max-w-2xl">
      {state?.error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm">
          {state.error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium mb-1">Judul Berita *</label>
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
          <label className="block text-sm font-medium mb-1">Tanggal Terbit</label>
          <input
            type="date"
            name="published_at"
            defaultValue={
              initial?.published_at ?? new Date().toISOString().slice(0, 10)
            }
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>
        <div className="flex items-end">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="is_active"
              defaultChecked={initial?.is_active ?? true}
              className="w-4 h-4 accent-[#ff5e3a]"
            />
            <span className="text-sm font-medium">Tampilkan di publik (aktif)</span>
          </label>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Ringkasan (tampil di kartu)
        </label>
        <textarea
          name="excerpt"
          defaultValue={initial?.excerpt ?? ''}
          rows={2}
          className="w-full border rounded-lg px-3 py-2"
          placeholder="Kalimat singkat yang menggambarkan berita..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Isi Lengkap</label>
        <textarea
          name="body"
          defaultValue={initial?.body ?? ''}
          rows={8}
          className="w-full border rounded-lg px-3 py-2"
          placeholder="Tulis isi berita di sini..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Gambar</label>
        <ImageInput
          name="image"
          initialPreview={initial?.image_url ?? null}
          hint={initial ? 'Kosongkan jika tidak ingin mengganti gambar.' : undefined}
        />
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={pending}
          className="bg-[#ff5e3a] text-white px-5 py-2 rounded-lg hover:opacity-90 disabled:opacity-50 font-display font-semibold uppercase tracking-wide"
        >
          {pending ? 'Menyimpan...' : submitLabel}
        </button>
        <Link href="/dashboard/news" className="border px-5 py-2 rounded-lg hover:bg-gray-50">
          Batal
        </Link>
      </div>
    </form>
  )
}
