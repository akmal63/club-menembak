# Panduan Perubahan — Pendaftaran Akun Terkontrol

Perubahan ini mematikan pendaftaran publik dan memindahkan pembuatan akun ke tangan Super Admin (lewat menu Pengaturan). Data anggota tetap seperti semula (data murni, tanpa login).

---

## Ringkasan Perubahan

**Dinonaktifkan:** halaman `/register` — siapa pun yang membukanya dialihkan ke `/login`. Tautan "Daftar" dihapus dari halaman login dan halaman depan.

**Ditambahkan:** di menu **Pengaturan**, Super Admin kini bisa membuat akun baru (Admin atau Super Admin), melihat daftar akun, dan menghapus akun.

---

## Langkah Wajib: Tambah Service Role Key

Fitur membuat akun butuh kunci khusus dari Supabase.

### 1. Ambil kunci
Supabase → **Settings → API** → cari **service_role** (di bagian Project API keys). Salin nilainya.

> Kunci ini sangat kuat (bisa bypass semua keamanan). Perlakukan seperti password utama. Jangan pernah menaruhnya di kode yang dikirim ke browser.

### 2. Tambahkan ke .env.local
Buka `.env.local`, tambahkan baris baru (tanpa awalan `NEXT_PUBLIC_`):

```
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...(service role key Anda)
```

### 3. Restart
Hentikan `npm run dev` (Ctrl+C) lalu jalankan lagi agar kunci terbaca.

### 4. (Untuk produksi) Tambahkan juga di Vercel
Saat deploy: Vercel → project → **Settings → Environment Variables** → tambah `SUPABASE_SERVICE_ROLE_KEY` dengan nilai yang sama.

---

## File Baru

```
lib/supabase/admin.ts                        service client (service role)
app/dashboard/settings/account-actions.ts    buat & hapus akun
components/create-account-form.tsx           form buat akun
components/delete-account-button.tsx         tombol hapus akun
```

## File yang Berubah (ganti dengan versi baru)

```
app/register/page.tsx           kini mengalihkan ke /login
app/login/page.tsx              tautan Daftar dihapus
app/page.tsx                    tombol Daftar dihapus
middleware.ts                   /register tak lagi di-handle
app/dashboard/settings/page.tsx tambah bagian Manajemen Akun
.env.local.example              tambah SERVICE_ROLE_KEY
```

## File Cadangan

`app/register/page.tsx.bak` menyimpan kode form pendaftaran asli. **Untuk mengaktifkan kembali pendaftaran publik** kelak: timpa `page.tsx` dengan isi `page.tsx.bak`, lalu kembalikan tautan Daftar di login/landing dan `/register` di matcher middleware.

---

## Cara Menguji

Pastikan Anda login sebagai **superadmin** dan service role key sudah diisi.

### Uji 1 — Pendaftaran publik mati
Buka `/register` di browser. Anda langsung dialihkan ke `/login`. Halaman login & depan tidak lagi punya tombol Daftar.

### Uji 2 — Buat akun admin
1. Buka menu **Pengaturan**.
2. Di bagian **Manajemen Akun**, isi form "Buat Akun Baru": nama, email, password (min 6), peran **Admin**.
3. Klik **Buat Akun**. Muncul pesan sukses, dan akun baru tampil di tabel di bawahnya.
4. **Penting:** sesi login Anda tidak terganggu — Anda tetap sebagai superadmin.

### Uji 3 — Login dengan akun baru
Buka jendela penyamaran (incognito), buka `/login`, masuk dengan email & password akun yang tadi dibuat. Berhasil masuk sebagai Admin dengan menu sesuai izin.

### Uji 4 — Hapus akun
Di tabel akun, klik **Hapus** pada akun selain milik Anda. Akun terhapus. Perhatikan: baris akun Anda sendiri tidak punya tombol hapus (proteksi agar tak mengunci diri sendiri).

---

## Catatan Keamanan

- Pembuatan akun hanya bisa dilakukan superadmin — diperiksa di server, bukan sekadar disembunyikan di UI.
- Service role key hanya dipakai di `lib/supabase/admin.ts` yang berjalan di server. Tidak pernah dikirim ke browser.
- Akun baru dibuat dengan email langsung terkonfirmasi, jadi bisa segera login tanpa menunggu email.
