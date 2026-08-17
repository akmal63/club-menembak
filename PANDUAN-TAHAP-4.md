# Panduan Tahap 4 — Modul Jadwal Latihan & Kegiatan

Menambahkan dua modul CRUD baru: **Jadwal Latihan** dan **Jadwal Kegiatan**. Polanya sama persis dengan modul Anggota (Tahap 3), dengan proteksi izin per role.

---

## File Baru

```
app/dashboard/schedules/           JADWAL LATIHAN
├── actions.ts                     create / update / delete
├── page.tsx                       daftar (tabel)
├── new/page.tsx                   tambah
└── [id]/edit/page.tsx             edit

app/dashboard/events/              JADWAL KEGIATAN
├── actions.ts
├── page.tsx
├── new/page.tsx
└── [id]/edit/page.tsx

components/
├── schedule-form.tsx              form jadwal latihan
├── event-form.tsx                 form kegiatan
├── delete-schedule-button.tsx     tombol hapus latihan
└── delete-event-button.tsx        tombol hapus kegiatan

lib/
└── format.ts                      helper format tanggal Indonesia
```

**Tidak ada file dari tahap sebelumnya yang diubah.** Sidebar (Tahap 2) sudah otomatis mengarah ke kedua modul ini. Cukup salin file di atas ke project Anda.

---

## Cara Menguji

Pastikan akun berperan **superadmin**.

### Jadwal Latihan
1. Klik menu **Jadwal Latihan** di sidebar.
2. **+ Tambah Jadwal** → isi Judul & Waktu Mulai (wajib), simpan.
3. Data muncul di tabel dengan tanggal berformat Indonesia.
4. Coba **Edit** dan **Hapus**.

### Jadwal Kegiatan
1. Klik menu **Jadwal Kegiatan**.
2. **+ Tambah Kegiatan** → isi Nama & Tanggal Mulai, simpan.
3. Uji Edit & Hapus.

### Uji Proteksi Izin
Ubah role ke admin lewat SQL:

```sql
update public.profiles
set role_id = (select id from public.roles where name = 'admin')
where id = (select id from auth.users where email = 'email-anda@contoh.com');
```

Refresh. Ingat izin default admin:
- **Jadwal Latihan**: admin punya create & edit, TIDAK punya delete → tombol Hapus hilang.
- **Jadwal Kegiatan**: admin hanya punya view → tombol Tambah/Edit/Hapus semua hilang, hanya bisa lihat.

Kembalikan ke superadmin setelah uji:

```sql
update public.profiles
set role_id = (select id from public.roles where name = 'superadmin')
where id = (select id from auth.users where email = 'email-anda@contoh.com');
```

---

## Catatan

- Input tanggal memakai `datetime-local`; helper di form mengonversi otomatis dari/ke format database.
- Sama seperti Tahap 3, proteksi dijaga dua lapis: Server Action + RLS Supabase.

---

## Langkah Selanjutnya (Tahap 5)

Modul **Galeri** dengan upload foto ke Supabase Storage, lalu **halaman Pengaturan** tempat superadmin mengatur izin admin secara visual (centang view/create/edit/delete per menu) tanpa perlu SQL manual.
