# Panduan Aplikasi Club Menembak — Tahap 1 & 2

Paket ini berisi fondasi aplikasi (Tahap 1) dan sistem autentikasi + dashboard dengan role (Tahap 2). Semua file sudah jadi. Ikuti panduan ini berurutan.

---

## Daftar Isi
1. Prasyarat (alat yang harus di-install)
2. Menyiapkan file project
3. Menyiapkan Supabase (database)
4. Menghubungkan aplikasi ke Supabase
5. Menjalankan aplikasi
6. Membuat akun & superadmin pertama
7. Cara menguji semua fitur
8. Menghubungkan ke GitHub
9. Struktur folder
10. Solusi masalah umum

---

## 1. Prasyarat

Install tiga hal ini dulu di komputer Anda:

| Alat | Link | Cek versi |
|------|------|-----------|
| Node.js 24 (LTS) | https://nodejs.org | `node --version` → harus v24.x |
| VS Code | https://code.visualstudio.com | — |
| Git | https://git-scm.com | `git --version` |

---

## 2. Menyiapkan File Project

1. Ekstrak file ZIP ini ke folder pilihan Anda (misal `Documents/shooting-club`).
2. Buka folder tersebut di VS Code (menu **File → Open Folder**).
3. Buka terminal di VS Code (menu **Terminal → New Terminal**).
4. Install semua library yang dibutuhkan:

   ```bash
   npm install
   ```

   Tunggu sampai selesai (beberapa menit). Perintah ini membaca `package.json` dan mengunduh Next.js, React, Supabase, dan Tailwind.

---

## 3. Menyiapkan Supabase (Database)

1. Buka https://supabase.com, buat akun / masuk.
2. Klik **New Project**. Beri nama (misal `club-menembak`), atur password database (catat), pilih region terdekat (Singapore), lalu **Create**.
3. Tunggu project selesai dibuat (1-2 menit).
4. Buka menu **SQL Editor** (ikon di kiri).
5. Klik **New query**, lalu **buka file `database/schema.sql`** dari paket ini, salin SELURUH isinya, tempel ke editor, klik **Run**.
   - Kalau muncul "Success. No rows returned" berarti berhasil.
6. **Matikan konfirmasi email** (agar mudah saat testing):
   - Buka **Authentication → Sign In / Providers → Email**.
   - Cari **Confirm email**, matikan (toggle off), simpan.

---

## 4. Menghubungkan Aplikasi ke Supabase

1. Di Supabase, buka **Settings → API**.
2. Salin dua nilai: **Project URL** dan **anon public key**.
3. Di folder project, cari file `.env.local.example`. **Salin** dan **ganti namanya** menjadi `.env.local`.
4. Buka `.env.local`, isi dengan nilai dari langkah 2:

   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
   ```

5. Simpan file.

> File `.env.local` berisi kunci rahasia dan otomatis diabaikan Git (tidak ikut ter-upload ke GitHub).

---

## 5. Menjalankan Aplikasi

Di terminal VS Code:

```bash
npm run dev
```

Buka browser ke **http://localhost:3000**. Halaman depan Club Menembak akan muncul.

> Biarkan perintah ini tetap berjalan selama Anda bekerja. Untuk menghentikan, tekan `Ctrl + C`.

---

## 6. Membuat Akun & Superadmin Pertama

1. Buka **http://localhost:3000/register**.
2. Daftar dengan nama, email, dan password (minimal 6 karakter).
3. Setelah daftar, Anda otomatis masuk ke dashboard sebagai **Admin**.
4. Untuk menjadikan akun ini **Super Admin**:
   - Buka Supabase **SQL Editor**.
   - Buka file `database/set-superadmin.sql`, ganti `email-anda@contoh.com` dengan email Anda.
   - Salin, tempel, **Run**.
   - Kembali ke aplikasi, **refresh** halaman dashboard. Menu **Pengaturan** akan muncul.

---

## 7. Cara Menguji Semua Fitur

### Uji A — Koneksi & Database
- Buka `/register`, daftar akun. Kalau berhasil masuk ke dashboard → koneksi Supabase OK.

### Uji B — Role Admin (default)
- Setelah daftar, sidebar menampilkan: **Anggota, Jadwal Latihan, Jadwal Kegiatan, Galeri**.
- Menu **Pengaturan TIDAK muncul** → benar, karena admin tidak punya izin itu.

### Uji C — Role Super Admin
- Jalankan `set-superadmin.sql`, refresh dashboard.
- Sekarang menu **Pengaturan ikut muncul** → sistem role bekerja.

### Uji D — Middleware (proteksi)
- Klik **Keluar**. Anda diarahkan ke `/login`.
- Coba buka `/dashboard` langsung di browser → otomatis dilempar ke `/login`.
- Login lagi → berhasil masuk kembali.

### Uji E — Menu per role
- Ubah kembali role ke admin (di SQL, ganti `superadmin` jadi `admin`), refresh → menu Pengaturan hilang lagi.

> Catatan: mengklik menu di sidebar (Anggota, dll) akan memunculkan halaman 404. Ini **normal** — halaman isinya dibuat di Tahap 3.

---

## 8. Menghubungkan ke GitHub

1. Buat repo baru di https://github.com (jangan centang "Add README").
2. Di terminal project:

   ```bash
   git init
   git add .
   git commit -m "Tahap 1 & 2: fondasi, auth, dashboard"
   git branch -M main
   git remote add origin https://github.com/USERNAME-ANDA/shooting-club.git
   git push -u origin main
   ```

   Ganti `USERNAME-ANDA` dengan username GitHub Anda.

---

## 9. Struktur Folder

```
shooting-club/
├── PANDUAN.md                  ← file ini
├── package.json                daftar library
├── tsconfig.json               konfigurasi TypeScript
├── next.config.ts              konfigurasi Next.js
├── postcss.config.mjs          konfigurasi Tailwind
├── .env.local.example          template kunci (salin jadi .env.local)
├── .gitignore
├── middleware.ts               satpam login (proteksi route)
│
├── app/
│   ├── layout.tsx              kerangka global
│   ├── globals.css             styling global
│   ├── page.tsx                halaman depan
│   ├── login/page.tsx          halaman masuk
│   ├── register/page.tsx       halaman daftar
│   └── dashboard/
│       ├── layout.tsx          kerangka dashboard + sidebar
│       └── page.tsx            beranda dashboard
│
├── components/
│   ├── sidebar.tsx             menu dinamis (sesuai izin role)
│   └── logout-button.tsx       tombol keluar
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts           koneksi Supabase (browser)
│   │   └── server.ts           koneksi Supabase (server)
│   └── permissions.ts          helper cek izin
│
└── database/
    ├── schema.sql              SEMUA tabel + RLS (jalankan pertama)
    ├── set-superadmin.sql      jadikan akun superadmin
    └── _test-query.sql         uji cepat (opsional)
```

---

## 10. Solusi Masalah Umum

| Masalah | Penyebab & Solusi |
|---------|-------------------|
| `npm run dev` error "command not found" | Node.js belum ter-install. Install dari nodejs.org. |
| Halaman `/register` error "Invalid API key" | `.env.local` salah/kosong. Cek URL & key, lalu restart `npm run dev`. |
| Setelah daftar tidak masuk dashboard | Konfirmasi email masih aktif. Matikan di Authentication → Email. |
| Menu Pengaturan tidak muncul untuk superadmin | Belum jalankan `set-superadmin.sql`, atau belum refresh halaman. |
| `relation "roles" does not exist` | `schema.sql` belum dijalankan di Supabase. |
| Perubahan `.env.local` tidak terbaca | Restart `npm run dev` (Ctrl+C lalu jalankan lagi). |

---

## Langkah Selanjutnya (Tahap 3)

Tahap 3 akan membangun modul **Anggota** lengkap: menampilkan daftar, tambah, edit, hapus data — semua dengan proteksi izin berdasarkan role. Sistem yang sama nanti diterapkan untuk Jadwal, Kegiatan, dan Galeri.
