'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { compressImage } from '@/lib/compress-image'

// Input file yang otomatis mengompres gambar begitu dipilih,
// lalu menaruh versi terkompres kembali ke input (agar ikut terkirim ke Server Action).
export default function ImageInput({
  name,
  initialPreview,
  hint,
}: {
  name: string
  initialPreview?: string | null
  hint?: string
}) {
  const [preview, setPreview] = useState<string | null>(initialPreview ?? null)
  const [status, setStatus] = useState<string>('')
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setStatus('Mengompres...')
    const beforeKB = Math.round(file.size / 1024)

    const compressed = await compressImage(file)
    const afterKB = Math.round(compressed.size / 1024)

    // Ganti isi input dengan file terkompres agar versi inilah yang terkirim
    const dt = new DataTransfer()
    dt.items.add(compressed)
    if (inputRef.current) inputRef.current.files = dt.files

    setPreview(URL.createObjectURL(compressed))
    setStatus(
      afterKB < beforeKB
        ? `Dikompres: ${beforeKB} KB → ${afterKB} KB`
        : `Ukuran: ${afterKB} KB`
    )
  }

  return (
    <div>
      {preview && (
        <div className="relative w-48 h-32 mb-2 rounded-lg overflow-hidden border">
          <Image src={preview} alt="Pratinjau" fill className="object-cover" />
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        name={name}
        accept="image/*"
        onChange={handleChange}
        className="w-full border rounded-lg px-3 py-2 bg-white"
      />
      {status && <p className="text-xs text-green-600 mt-1">{status}</p>}
      {hint && <p className="text-xs text-gray-500 mt-1">{hint}</p>}
    </div>
  )
}
