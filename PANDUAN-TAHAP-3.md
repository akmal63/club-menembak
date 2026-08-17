# Panduan Tahap 3 — Modul CRUD Anggota

Tahap ini menambahkan modul **Anggota** lengkap: lihat daftar, tambah, edit, dan hapus — semuanya dengan proteksi izin berdasarkan role. Pola yang sama nanti dipakai untuk Jadwal, Kegiatan, dan Galeri.

---

## File Baru yang Ditambahkan

```
app/dashboard/members/
├── actions.ts                    Server Actions: create, update, delete
├── page.tsx                      Halaman daftar anggota (tabel)
├── new/
│   └── page.tsx                  Halaman tambah anggota
└── [id]/
    └── edit/
        └── page.tsx              Halaman edit anggota

components/
├── member-form.tsx               Form (dipakai bersama tambah & edit)
└── delete-member-button.tsx      Tombol hapus dengan konfirmasi
```

Kalau Anda menyalin dari ZIP, cukup tambahkan folder & file di atas ke project Anda. Tidak ada file Tahap 1/2 yang perlu diubah.

---

## Cara Kerja Singkat

- **actions.ts** berisi fungsi server yang menjalankan operasi database. Setiap fungsi mengecek izin lewat `checkPermission('members', ...)` sebelum bertindak. Ini lapisan kedua keamanan (lapisan pertama = RLS di database).
- **page.tsx** menampilkan tabel anggota. Tombol "Tambah", "Edit", "Hapus" hanya muncul kalau role punya izinnya.
- **member-form.tsx** adalah satu form yang dipakai ulang untuk tambah maupun edit, memakai `useActionState` untuk menampilkan error.
- **delete-member-button.tsx** meminta konfirmasi sebelum menghapus.

---

## Cara Menguji

Pastikan akun Anda sedang berperan **superadmin** (punya semua izin).

### Uji 1 — Lihat menu
Login, klik menu **Anggota** di sidebar. Halaman daftar terbuka (awalnya kosong).

### Uji 2 — Tambah
Klik **+ Tambah Anggota**, isi minimal Nama Lengkap, klik **Simpan**. Anda kembali ke daftar dan data muncul di tabel.

### Uji 3 — Edit
Klik **Edit** pada satu baris, ubah data, **Simpan Perubahan**. Perubahan tampil di tabel.

### Uji 4 — Hapus
Klik **Hapus**, konfirmasi. Baris hilang dari tabel.

### Uji 5 — Proteksi izin (penting)
Ubah role akun jadi **admin** biasa lewat SQL Editor:

```sql
update public.profiles
set role_id = (select id from public.roles where name = 'admin')
where id = (select id from auth.users where email = 'email-anda@contoh.com');
```

Refresh halaman Anggota. Karena admin default **tidak** punya izin hapus, tombol **Hapus tidak muncul**. Tombol Tambah & Edit tetap ada (admin punya izin itu).

Untuk uji lebih jauh: lewat menu Pengaturan (dibuat di tahap berikutnya) superadmin bisa mencabut izin edit admin, dan tombol Edit pun akan hilang. Untuk sekarang, kembalikan role ke superadmin:

```sql
update public.profiles
set role_id = (select id from public.roles where name = 'superadmin')
where id = (select id from auth.users where email = 'email-anda@contoh.com');
```

### Uji 6 — Proteksi langsung via URL
Saat berperan admin tanpa izin buat, coba buka `/dashboard/members/new` langsung. Halaman menolak dengan pesan "Anda tidak punya izin". Ini membuktikan proteksi tidak bisa dilewati lewat URL.

---

## Catatan Teknis

- Operasi tulis (tambah/edit/hapus) dijaga **dua lapis**: pengecekan izin di Server Action + RLS di Supabase. Meski seseorang memanggil action langsung, RLS tetap menolak jika role tidak berizin.
- `revalidatePath` dipakai agar tabel langsung menampilkan data terbaru setelah perubahan.
- Field Nomor Anggota bersifat unik; kalau diisi ganda, muncul pesan error yang ramah.

---

## Langkah Selanjutnya (Tahap 4)

Modul **Jadwal Latihan** dan **Jadwal Kegiatan** dengan pola yang sama, plus tampilan kalender sederhana. Setelah itu Galeri (dengan upload foto ke Supabase Storage) dan halaman Pengaturan untuk superadmin mengatur izin admin secara visual.
