# Club Menembak

Sistem manajemen club menembak: data anggota, jadwal latihan, jadwal kegiatan, galeri, dengan kontrol akses Super Admin / Admin.

## Teknologi
- Next.js 16 (App Router)
- Supabase (PostgreSQL, Auth, Storage)
- Tailwind CSS 4
- Deploy di Vercel

## Menjalankan Secara Lokal

```bash
npm install
cp .env.local.example .env.local   # lalu isi kredensial Supabase
npm run dev
```

Buka http://localhost:3000

## Struktur Database
Jalankan file SQL di folder `database/` melalui Supabase SQL Editor secara berurutan:
1. `schema.sql` — semua tabel + RLS
2. `tahap-5-storage.sql` — bucket galeri
3. `set-superadmin.sql` — jadikan akun superadmin (sesuaikan email)

## Deploy
Lihat `PANDUAN-TAHAP-7-DEPLOY.md` untuk langkah lengkap deploy ke Vercel.
