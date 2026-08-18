# Panduan — Kompres Gambar Otomatis

Setiap gambar yang diupload (Galeri, Berita, Blok Konten) kini otomatis dikompres di browser sebelum dikirim. Ini mempercepat upload, menghemat penyimpanan, dan membuat halaman publik memuat lebih ringan.

---

## Langkah Wajib: Install Library

Ada library baru. Setelah menimpa file, jalankan:

```
npm install
```

Lalu jalankan ulang `npm run dev`.

---

## File Baru

```
lib/compress-image.ts          fungsi kompres (di browser)
components/image-input.tsx      input gambar dengan kompres otomatis + pratinjau
```

## File yang Berubah

```
package.json                    tambah browser-image-compression
components/gallery-upload.tsx    pakai ImageInput
components/news-form.tsx         pakai ImageInput
components/block-editor-form.tsx pakai ImageInput
```

---

## Cara Kerja

Saat Anda memilih gambar:
1. Gambar dikecilkan dimensinya (maksimal 1600 px) dan dikompres ke target ~800 KB.
2. Muncul info kecil, misalnya "Dikompres: 4200 KB → 380 KB".
3. Versi terkompres itulah yang diupload — bukan file asli yang besar.

GIF animasi tidak dikompres (agar animasinya tidak rusak). Kalau kompres gagal karena alasan tertentu, file asli tetap diupload sebagai cadangan.

---

## Cara Menguji

1. Buka salah satu form upload (mis. Berita → Tambah, atau Konten Beranda → blok Teks+Gambar).
2. Pilih gambar berukuran besar (mis. foto dari kamera HP, 3–5 MB).
3. Perhatikan muncul tulisan hijau "Dikompres: ... KB → ... KB" dengan angka akhir jauh lebih kecil.
4. Simpan. Upload berjalan cepat dan tidak lagi kena error "Body exceeded 1 MB".

---

## Catatan

- Batas `bodySizeLimit` di `next.config.ts` (6 MB) tetap berguna sebagai jaring pengaman, tapi dengan kompres otomatis, gambar hampir selalu jauh di bawah itu.
- Kualitas gambar tetap bagus untuk web meski ukurannya kecil.
- Kompres terjadi di perangkat pengguna (browser), jadi tidak membebani server.
