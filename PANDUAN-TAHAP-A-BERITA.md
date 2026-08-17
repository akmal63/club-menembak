# Panduan Tahap A — Menu Berita

Menambahkan menu **Berita** dengan CRUD lengkap (tambah, edit, hapus, aktif/nonaktif), upload gambar, halaman publik `/berita`, dan detail per artikel. Jadwal latihan & kegiatan tidak lagi muncul di beranda.

---

## Langkah Wajib: Jalankan SQL

Buka **Supabase → SQL Editor**, jalankan `database/tahap-A-berita.sql`. Ini membuat:
- Tabel `news` (judul, ringkasan, isi, gambar, tanggal, status aktif)
- Menu "Berita" di daftar izin (otomatis muncul di sidebar & pengaturan izin)
- Izin default: superadmin penuh, admin bisa tambah/edit (tanpa hapus)
- Bucket penyimpanan gambar berita

---

## File Baru

```
database/tahap-A-berita.sql                    struktur database

app/dashboard/news/
├── actions.ts                                 CRUD + toggle aktif + upload
├── page.tsx                                    daftar berita
├── new/page.tsx                                tambah
└── [id]/edit/page.tsx                          edit

app/berita/
├── page.tsx                                    halaman publik: daftar berita
└── [slug]/page.tsx                             halaman publik: detail berita

components/
├── news-form.tsx                               form (tambah & edit, dgn pratinjau gambar)
└── news-actions-buttons.tsx                    tombol hapus & toggle aktif
```

## File yang Berubah

```
app/page.tsx           section berita kini dari tabel news (bukan events),
                       + tombol "Lihat Semua Berita"; jadwal tak muncul
components/sidebar.tsx  tambah ikon untuk menu Berita
```

---

## Cara Kerja

- **Dashboard**: menu Berita untuk mengelola artikel. Tombol status (Aktif/Nonaktif) bisa diklik untuk cepat menyembunyikan berita dari publik tanpa menghapus.
- **Beranda publik**: menampilkan 3 berita aktif terbaru + tombol "Lihat Semua Berita".
- **Halaman `/berita`**: daftar lengkap semua berita aktif.
- **Halaman `/berita/[slug]`**: isi lengkap satu berita.
- Hanya berita **aktif** yang tampil di publik; yang nonaktif hanya terlihat di dashboard.

---

## Cara Menguji

Pastikan SQL sudah dijalankan dan Anda login sebagai superadmin.

### Uji 1 — Menu muncul
Menu **Berita** muncul di sidebar (di antara Kegiatan dan Galeri). Kalau belum muncul, refresh halaman (izin dibaca ulang).

### Uji 2 — Tambah berita
Klik Berita → **+ Tambah Berita**. Isi judul, ringkasan, isi, pilih gambar (pratinjau langsung muncul), pastikan "Tampilkan di publik" tercentang, klik **Terbitkan**.

### Uji 3 — Tampil di publik
Buka `/` → scroll ke section Berita → berita tampil. Klik kartunya → masuk ke halaman detail `/berita/xxx`. Klik "Lihat Semua Berita" → halaman `/berita`.

### Uji 4 — Nonaktifkan
Di daftar berita dashboard, klik tombol status hijau **Aktif** → berubah jadi **Nonaktif**. Buka `/berita` di publik → berita itu hilang. Klik lagi untuk mengaktifkan.

### Uji 5 — Edit & hapus
Uji tombol Edit (ganti judul/gambar) dan Hapus.

### Uji 6 — Jadwal tidak di beranda
Buka beranda `/` → pastikan tidak ada lagi bagian jadwal latihan/kegiatan. Data itu tetap ada di dashboard, hanya tidak ditampilkan ke publik.

---

## Catatan

- Saat edit, kosongkan input gambar jika tidak ingin menggantinya (gambar lama tetap).
- Setiap berita otomatis punya alamat unik (slug) dari judulnya.
- Tombol "Berita" di navbar publik meloncat ke section berita di beranda; untuk daftar lengkap gunakan tombol "Lihat Semua Berita".

---

## Berikutnya

Tahap B: sistem blok beranda (tambah/hapus/urutkan section, tombol on/off). Tahap C: pengaturan footer. Kabari kalau Tahap A sudah lolos uji.
