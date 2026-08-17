# Panduan — Pengaturan Konten Beranda Publik

Superadmin kini bisa mengedit semua teks di beranda publik lewat dashboard, tanpa menyentuh kode.

---

## Langkah Wajib: Buat Tabel di Database

Jalankan SQL berikut lebih dulu, kalau tidak, fitur belum aktif:

1. Buka **Supabase → SQL Editor**.
2. Buka file `database/tahap-konten-publik.sql`, salin seluruhnya, **Run**.
3. Ini membuat tabel `site_settings` (menyimpan konten) beserta aturan keamanannya: semua orang boleh membaca (untuk halaman publik), hanya superadmin yang boleh mengubah.

---

## File Baru

```
database/tahap-konten-publik.sql              tabel site_settings
app/dashboard/settings/content-actions.ts     simpan konten
app/dashboard/settings/konten/page.tsx        halaman edit konten
components/content-editor-form.tsx            form editor semua field
```

## File yang Berubah (ganti dengan versi baru)

```
lib/site-content.ts                 kini berisi default + fungsi baca dari DB
app/page.tsx                        baca konten dari DB (bukan file statis)
components/public/public-navbar.tsx nama club via prop
app/dashboard/settings/page.tsx     tambah kartu tautan ke editor konten
```

---

## Cara Kerja

Sebelumnya konten publik ditulis langsung di kode (`lib/site-content.ts`). Sekarang:

1. `lib/site-content.ts` menyimpan **nilai default** dan fungsi `getSiteContent()` yang membaca dari database.
2. Kalau database belum ada isinya, halaman publik memakai nilai default (jadi tetap tampil normal sejak awal).
3. Saat superadmin menyimpan lewat form, konten tersimpan di tabel `site_settings` dan langsung dipakai halaman publik.

Galeri dan berita **tidak** diatur di sini karena sudah otomatis mengambil dari data yang dikelola (foto galeri & kegiatan).

---

## Cara Menggunakan

1. Login sebagai **superadmin**, buka menu **Pengaturan**.
2. Di paling atas ada kartu gelap "Konten Beranda Publik" — klik **Edit Konten →**.
3. Halaman editor terbuka dengan semua field, dikelompokkan: Identitas, Hero, Tentang, Visi-Misi, Federasi, Kontak, Partner.
4. Ubah teks yang diinginkan, klik **Simpan Konten** (tombol menempel di bawah).
5. Klik **Lihat halaman publik ↗** di kanan atas untuk melihat hasilnya.

---

## Cara Menguji

### Uji 1 — Edit tampil di publik
1. Buka editor konten, ubah "Nama Club" menjadi sesuatu yang khas (misal "Elang Shooting Club").
2. Simpan.
3. Buka `/` (halaman publik) di tab baru → nama baru tampil di navbar, hero, dan footer.

### Uji 2 — Proteksi
Login sebagai **admin biasa** (bukan superadmin), coba buka `/dashboard/settings/konten` langsung lewat URL → ditolak dengan pesan "hanya untuk Super Admin".

### Uji 3 — Fallback default
Sebelum pernah menyimpan apa pun, halaman publik tetap tampil normal dengan teks bawaan (tidak kosong/error). Ini karena sistem memakai nilai default saat database masih kosong.

---

## Catatan

- Field yang dikosongkan pada Legalitas, Federasi, atau Partner otomatis diabaikan (tidak tampil di publik).
- Nomor telepon: tulis satu nomor per baris.
- Alamat: boleh beberapa baris.
- Perubahan langsung berlaku begitu disimpan (halaman publik otomatis disegarkan).

---

## Langkah Selanjutnya (opsional)

Kalau nanti mau, kita bisa tambah: upload logo club (menggantikan ikon ◎), atur foto ketua di bagian Tentang, atau atur struktur organisasi dengan foto pengurus.
