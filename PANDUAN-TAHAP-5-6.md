# Panduan Tahap 5 & 6 — Galeri, Pengaturan, Profil Anggota

---

# TAHAP 5A — Modul Galeri (dengan Upload Foto)

## Langkah Wajib: Setup Storage di Supabase

Sebelum galeri berfungsi, jalankan SQL untuk membuat tempat penyimpanan foto:

1. Buka **Supabase → SQL Editor**.
2. Buka file `database/tahap-5-storage.sql`, salin seluruhnya, **Run**.
3. Ini membuat bucket bernama `gallery` dan mengatur siapa boleh upload/hapus (sesuai izin role).

## File Baru
```
app/dashboard/gallery/
├── actions.ts                 upload & hapus foto
└── page.tsx                   grid galeri
components/
├── gallery-upload.tsx         form unggah
└── delete-photo-button.tsx    tombol hapus di tiap foto
```

## Perubahan File Lama
`next.config.ts` (Tahap 1) **diperbarui** agar Next.js boleh menampilkan gambar dari domain Supabase. Ganti file lama Anda dengan versi baru ini.

## Cara Menguji
1. Sebagai superadmin, klik menu **Galeri**.
2. Form unggah muncul. Pilih gambar (maks 5 MB), beri judul, klik **Unggah**.
3. Foto muncul di grid. Arahkan kursor → tombol **Hapus** muncul (kalau punya izin).

---

# TAHAP 5B — Halaman Pengaturan (Kelola Izin Admin)

Ini menggantikan SQL manual yang selama ini dipakai untuk mengubah izin. Sekarang superadmin bisa atur lewat centang.

## File Baru
```
app/dashboard/settings/
├── actions.ts                 simpan perubahan izin
└── page.tsx                   tabel centang izin
```

## Cara Menguji
1. Sebagai **superadmin**, klik menu **Pengaturan**.
2. Muncul tabel: baris = menu (Anggota, Jadwal, dll), kolom = Lihat/Tambah/Edit/Hapus.
3. Coba centang **Hapus** pada baris "Anggota", klik **Simpan Perubahan**.
4. Ubah akun Anda jadi admin (SQL), buka menu Anggota → sekarang tombol Hapus muncul untuk admin.
5. Kembalikan ke superadmin.

> Halaman ini otomatis menolak akses non-superadmin, jadi admin biasa tidak bisa membukanya meski tahu URL-nya.

---

# TAHAP 6 — Profil Anggota (Halaman Detail)

## File Baru
```
app/dashboard/members/[id]/page.tsx    halaman profil per anggota
```

## Perubahan File Lama
`app/dashboard/members/page.tsx` (Tahap 3) **diperbarui**: nama anggota di tabel kini bisa diklik menuju profilnya. Ganti dengan versi baru, atau tambahkan sendiri link pada kolom nama.

## Cara Menguji
1. Buka menu **Anggota**.
2. Klik **nama** salah satu anggota.
3. Halaman profil terbuka: header dengan inisial, status, dan detail lengkap (email, telepon, kategori, tanggal, alamat, catatan).
4. Kalau punya izin edit, tombol **Edit Profil** muncul.

## Catatan Routing
Folder `members/[id]/` kini punya dua hal: `page.tsx` (profil) dan `edit/page.tsx` (form edit). Keduanya route berbeda dan tidak bertabrakan:
- `/dashboard/members/[id]` → profil
- `/dashboard/members/[id]/edit` → form edit

---

Setelah Tahap 5 & 6 lolos uji, lanjut ke `PANDUAN-TAHAP-7-DEPLOY.md` untuk membawa website online.
