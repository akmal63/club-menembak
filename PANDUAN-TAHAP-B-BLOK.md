# Panduan Tahap B — Sistem Blok Beranda

Beranda kini tersusun dari **blok** yang bisa ditambah, diedit, dihapus, diurutkan, dan diaktif/nonaktifkan — semuanya lewat dashboard. Termasuk Hero. Tiap blok bisa punya gambar dan tombol.

---

## Langkah Wajib: Jalankan SQL

Buka **Supabase → SQL Editor**, jalankan `database/tahap-B-blocks.sql`. Ini membuat:
- Tabel `page_blocks`
- Menu izin "Konten Beranda" (khusus superadmin secara default)
- Bucket gambar blok
- **5 blok default** (Hero, Tentang, Visi-Misi, Galeri, Berita) agar beranda langsung terisi

> Penting: setelah SQL ini, beranda dibaca dari tabel `page_blocks`. Kalau tabel kosong (SQL tak dijalankan), beranda menampilkan pesan "belum ada konten".

---

## File Baru

```
database/tahap-B-blocks.sql                struktur + blok default
lib/blocks.ts                              definisi tipe blok
components/public/block-renderer.tsx       render tiap tipe blok di publik
components/public/public-footer.tsx        footer (dipisah agar rapi)
components/block-editor-form.tsx           form editor blok (adaptif per tipe)
components/block-action-buttons.tsx        tombol urut/aktif/hapus

app/dashboard/content/
├── actions.ts                             tambah/edit/hapus/urut/toggle
├── page.tsx                               daftar blok
├── new/page.tsx                           tambah (pilih tipe → isi)
└── [id]/page.tsx                          edit
```

## File yang Berubah

```
app/page.tsx           kini render blok dari database (bukan section tetap)
components/sidebar.tsx  tambah menu "Konten Beranda"
app/dashboard/settings/page.tsx  dua pintasan: Susun Beranda & Identitas/Footer
```

---

## Tipe Blok Tersedia

| Tipe | Isi |
|------|-----|
| **Hero** | Sambutan besar dengan judul, sorotan, subjudul, tombol |
| **Teks saja** | Judul + paragraf, opsi latar gelap |
| **Gambar saja** | Satu gambar lebar |
| **Teks + Gambar** | Paragraf di samping gambar (posisi kiri/kanan) |
| **Kartu berjajar** | Hingga 3 kartu (mis. Visi-Misi-Nilai) |
| **Sorotan / CTA** | Kotak ajakan dengan tombol besar |
| **Galeri (otomatis)** | Menarik foto dari data Galeri |
| **Berita (otomatis)** | Menarik berita terbaru dari data Berita |

---

## Cara Menggunakan

1. Login superadmin → menu **Konten Beranda** (atau Pengaturan → "Kelola Blok").
2. Daftar blok tampil berurutan. Untuk tiap blok:
   - **Panah atas/bawah** → ubah urutan
   - **Tombol Aktif/Nonaktif** → sembunyikan dari publik tanpa hapus
   - **Edit** → ubah isi
   - **Hapus** → buang blok
3. **+ Tambah Blok** → pilih tipe → isi form → simpan. Blok baru muncul di urutan paling bawah (bisa digeser naik).
4. Klik **Lihat beranda ↗** untuk melihat hasil.

### Tombol per blok
Di blok Hero, Teks, Teks+Gambar, dan CTA ada opsi **Tampilkan tombol**. Centang untuk memunculkan, lalu isi teks & link tombol. Link bisa berupa `#tentang` (loncat ke blok lain) atau `/berita` (halaman lain).

---

## Cara Menguji

Pastikan SQL dijalankan dan Anda superadmin.

1. **Beranda default** — buka `/`. Harus tampil 5 blok bawaan (mirip sebelumnya).
2. **Urutkan** — di dashboard, geser satu blok dengan panah. Refresh beranda → urutan berubah.
3. **Nonaktifkan** — matikan blok Galeri. Beranda → Galeri hilang. Aktifkan lagi.
4. **Tambah CTA** — Tambah Blok → "Sorotan/CTA" → isi judul, teks, aktifkan tombol (teks "Gabung", link "/login"). Simpan → muncul di beranda paling bawah. Geser ke atas jika mau.
5. **Teks+Gambar** — tambah blok ini, upload gambar, atur posisi kiri/kanan, cek di beranda.
6. **Hapus** — hapus satu blok uji, pastikan hilang dari beranda.

---

## Catatan Penting

- **Dua tempat konten**: menu "Konten Beranda" (blok) mengatur badan halaman; "Identitas & Footer" di Pengaturan mengatur nama club, kontak, partner (footer & navbar). Footer belum jadi blok — itu disempurnakan di Tahap C.
- Menu "Konten Beranda" default hanya untuk superadmin. Bisa diberikan ke admin lewat Pengaturan izin (menu `content`).
- Blok Galeri & Berita tak punya isi teks selain judul — datanya otomatis dari menu Galeri & Berita.

---

## Berikutnya

Tahap C: menu khusus pengaturan footer (jadikan footer bisa diatur lebih detail, terpisah dari identitas). Kabari kalau Tahap B sudah lolos uji.
