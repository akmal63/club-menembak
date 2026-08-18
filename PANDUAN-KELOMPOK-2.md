# Panduan Kelompok 2 — Perluasan Data Anggota

Menambah ke data anggota (poin 3): pas foto (opsional), ubah "No Anggota" → "No Registrasi", serta kolom Masa Aktif, Jabatan, dan Pekerjaan.

---

## Langkah Wajib: Jalankan SQL

Buka **Supabase → SQL Editor**, jalankan `database/kelompok-2-anggota.sql`. Ini:
- Menambah kolom `position` (jabatan), `occupation` (pekerjaan), `active_until` (masa aktif) ke tabel members
- Membuat bucket `members` untuk pas foto
- Membuat **view `members_public`** — versi aman data anggota (hanya kolom non-sensitif) untuk Database Anggota publik nanti

> Penting soal privasi: kami sengaja TIDAK membuka akses publik ke seluruh tabel members (yang berisi email, telepon, tanggal lahir). Sebagai gantinya dibuat "view" khusus berisi kolom aman saja. Ini dipakai di Kelompok 4 (Database Anggota publik).

---

## File yang Berubah
```
components/member-form.tsx           tambah pas foto, No Registrasi, masa aktif, jabatan, pekerjaan
app/dashboard/members/actions.ts     upload foto + simpan field baru
app/dashboard/members/page.tsx       kolom Foto, No Registrasi, Jabatan
app/dashboard/members/[id]/page.tsx  detail dengan foto + field baru
```

## File Baru
```
database/kelompok-2-anggota.sql
```

---

## Yang Berubah untuk Pengguna

Di form Tambah/Edit Anggota kini ada:
- **Pas Foto** (opsional, otomatis dikompres)
- **No Registrasi** (dulu "Nomor Anggota")
- **Jabatan** (mis. Ketua, Sekretaris)
- **Pekerjaan** (mis. Wiraswasta, POLRI)
- **Masa Aktif s/d** (tanggal berakhirnya keanggotaan)

Daftar anggota kini menampilkan foto kecil, No Registrasi, dan Jabatan. Halaman detail menampilkan foto asli dan semua field baru. Alamat dipakai sebagai Domisili.

---

## Cara Menguji

1. Jalankan SQL dulu.
2. Menu Anggota → Tambah Anggota.
3. Upload pas foto (perhatikan info kompres muncul), isi No Registrasi, Jabatan, Pekerjaan, Masa Aktif.
4. Simpan → di daftar, foto & jabatan tampil.
5. Klik nama → halaman detail menampilkan foto dan semua data.
6. Edit → ganti foto, pastikan foto lama tetap kalau input dikosongkan.

---

## Catatan

- Foto disimpan di bucket `members` yang publik, agar nanti bisa tampil di Database Anggota & kartu anggota (Kelompok 4).
- No Registrasi tetap harus unik (kalau diisi). Kalau bentrok, muncul pesan error.

---

## Berikutnya

Kelompok 3: Identitas Club + upload logo (dipakai di navbar, footer, dan kartu anggota). Lalu Kelompok 4: Database Anggota publik + kartu detail dengan QR. Kabari kalau Kelompok 2 sudah lolos uji.
