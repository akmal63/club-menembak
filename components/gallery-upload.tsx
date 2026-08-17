'use client'

import { useActionState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { uploadPhoto } from '@/app/dashboard/gallery/actions'

export default function GalleryUpload() {
  const [state, formAction, pending] = useActionState(uploadPhoto, null)
  const formRef = useRef<HTMLFormElement>(null)
  const router = useRouter()

  // Setelah sukses, reset form & refresh daftar
  useEffect(() => {
    if (state && 'success' in state && state.success) {
      formRef.current?.reset()
      router.refresh()
    }
  }, [state, router])

  return (
    <form
      ref={formRef}
      action={formAction}
      className="bg-white rounded-xl shadow border p-5 mb-6 space-y-3"
    >
      <h2 className="font-semibold">Unggah Foto Baru</h2>

      {state && 'error' in state && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-sm">
          {state.error}
        </div>
      )}
      {state && 'success' in state && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-3 py-2 rounded text-sm">
          Foto berhasil diunggah.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">Judul (opsional)</label>
          <input
            type="text"
            name="title"
            className="w-full border rounded-lg px-3 py-2"
            placeholder="Contoh: Latihan Minggu Pagi"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">File Gambar *</label>
          <input
            type="file"
            name="file"
            accept="image/*"
            required
            className="w-full border rounded-lg px-3 py-2 bg-white"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
      >
        {pending ? 'Mengunggah...' : 'Unggah'}
      </button>
      <p className="text-xs text-gray-500">Maksimal 5 MB. Format: JPG, PNG, WEBP, dll.</p>
    </form>
  )
}
