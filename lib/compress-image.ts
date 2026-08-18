'use client'

import imageCompression from 'browser-image-compression'

// Kompres gambar di browser sebelum diupload.
// - Memperkecil dimensi maksimum & ukuran file
// - Kalau bukan gambar atau gagal, kembalikan file asli
export async function compressImage(file: File): Promise<File> {
  if (!file.type.startsWith('image/')) return file

  // GIF animasi jangan dikompres (bisa rusak animasinya)
  if (file.type === 'image/gif') return file

  try {
    const compressed = await imageCompression(file, {
      maxSizeMB: 0.8, // target maksimal ~800 KB
      maxWidthOrHeight: 1600, // cukup tajam untuk web
      useWebWorker: true,
      initialQuality: 0.8,
    })

    // Pertahankan nama asli (browser-image-compression kadang mengubahnya)
    return new File([compressed], file.name, {
      type: compressed.type,
      lastModified: Date.now(),
    })
  } catch {
    // Jika gagal, pakai file asli (biar upload tetap jalan)
    return file
  }
}
