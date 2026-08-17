# Panduan Tahap 7 — Deploy ke Produksi (GitHub + Vercel)

Membawa website online sehingga bisa diakses siapa saja lewat internet. Kode disimpan di **GitHub**, dijalankan oleh **Vercel** (gratis). Tiap kali Anda `git push`, website otomatis update.

> Kenapa Vercel, bukan GitHub Pages? GitHub Pages hanya bisa web statis. Aplikasi ini butuh server (login, database, upload) yang hanya berjalan di platform seperti Vercel.

---

## Bagian 1 — Persiapan Sebelum Deploy

### 1.1 Aktifkan kembali konfirmasi email
Saat development kita matikan konfirmasi email. Untuk produksi, **nyalakan lagi** demi keamanan:
- Supabase → **Authentication → Sign In / Providers → Email** → aktifkan **Confirm email**.

### 1.2 Pastikan akun superadmin sudah ada
Cek bahwa minimal satu akun sudah berperan superadmin (lewat `set-superadmin.sql`). Ini akun pengelola utama Anda.

### 1.3 Pastikan file rahasia tidak ikut ter-upload
Buka `.gitignore`, pastikan ada baris `.env*.local`. File ini menyimpan kunci Supabase dan TIDAK boleh masuk GitHub. (Sudah diatur sejak Tahap 1.)

---

## Bagian 2 — Push Kode ke GitHub

### 2.1 Buat repository
Buka https://github.com → **+** → **New repository** → beri nama (misal `club-menembak`) → **jangan** centang "Add README" (project sudah punya) → **Create**.

### 2.2 Push dari terminal project
Kalau project belum pernah di-`git init`:

```bash
git init
git add .
git commit -m "Aplikasi lengkap tahap 1-6"
git branch -M main
git remote add origin https://github.com/USERNAME-ANDA/club-menembak.git
git push -u origin main
```

Kalau sudah pernah (dari tahap sebelumnya), cukup:

```bash
git add .
git commit -m "Tahap 5-6: galeri, pengaturan, profil"
git push
```

---

## Bagian 3 — Deploy ke Vercel

### 3.1 Daftar & hubungkan GitHub
1. Buka https://vercel.com → **Sign Up** → pilih **Continue with GitHub**.
2. Izinkan Vercel mengakses repo Anda.

### 3.2 Import project
1. Di dashboard Vercel, klik **Add New → Project**.
2. Pilih repo `club-menembak` → **Import**.
3. Vercel otomatis mendeteksi Next.js. Jangan ubah pengaturan build.

### 3.3 Isi Environment Variables (PENTING)
Sebelum klik Deploy, buka bagian **Environment Variables**, tambahkan dua ini (nilai sama dengan `.env.local` Anda):

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | https://xxxxx.supabase.co |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | eyJhbGci... |

Tanpa ini, aplikasi online tidak bisa terhubung ke database.

### 3.4 Deploy
Klik **Deploy**. Tunggu 1-3 menit. Setelah selesai, Anda dapat URL seperti `https://club-menembak.vercel.app`. Buka — website Anda sudah online.

---

## Bagian 4 — Hubungkan Supabase dengan Domain Produksi

Supaya login & redirect bekerja di URL produksi:

1. Salin URL Vercel Anda (misal `https://club-menembak.vercel.app`).
2. Buka Supabase → **Authentication → URL Configuration**.
3. Set **Site URL** ke URL Vercel tersebut.
4. Di **Redirect URLs**, tambahkan `https://club-menembak.vercel.app/**`.
5. Simpan.

---

## Bagian 5 — Alur Kerja Setelah Online

Sejak sekarang, untuk mengubah website:

1. Edit kode di komputer.
2. Uji lokal dengan `npm run dev`.
3. Push perubahan:
   ```bash
   git add .
   git commit -m "deskripsi perubahan"
   git push
   ```
4. Vercel otomatis mendeteksi push dan men-deploy versi baru dalam 1-2 menit.

---

## Bagian 6 — (Opsional) Domain Sendiri

Kalau punya domain sendiri (misal `clubmenembak.or.id`):
1. Vercel → project Anda → **Settings → Domains → Add**.
2. Masukkan domain, ikuti instruksi mengarahkan DNS.
3. Setelah aktif, ulangi Bagian 4 dengan domain baru sebagai Site URL.

---

## Checklist Go-Live

- [ ] Confirm email diaktifkan kembali di Supabase
- [ ] Akun superadmin sudah ada
- [ ] `.env*.local` ada di `.gitignore` (tidak ter-push)
- [ ] Kode ter-push ke GitHub
- [ ] Environment variables diisi di Vercel
- [ ] Deploy berhasil, URL bisa dibuka
- [ ] Site URL & Redirect URLs diatur di Supabase
- [ ] Uji: register, login, tiap menu, upload galeri di URL produksi

---

## Masalah Umum Saat Deploy

| Masalah | Solusi |
|---------|--------|
| Build gagal di Vercel | Baca log error. Sering karena env variable belum diisi. |
| Website online tapi tak bisa login | Site URL / Redirect URLs belum diatur di Supabase (Bagian 4). |
| Foto galeri tidak muncul | `next.config.ts` belum mengizinkan domain Supabase, atau belum ter-push. |
| "Invalid API key" di produksi | Env variable di Vercel salah/kurang. Cek Settings → Environment Variables. |
| Perubahan tak muncul | Pastikan sudah `git push`. Cek tab Deployments di Vercel. |

---

Selamat — setelah checklist ini beres, website club menembak Anda resmi online dan siap dipakai.
