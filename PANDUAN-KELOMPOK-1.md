# Panduan Kelompok 1 — Perbaikan & Pengaturan

Mencakup: pilihan tampilan gambar (poin 1 & 14), jadwal jadi blok (poin 2), dan rapikan pengaturan identitas (poin 9-12).

---

## Langkah Wajib: SQL (opsional tapi disarankan)

Jalankan `database/kelompok-1-federasi-blok.sql` di Supabase kalau Anda ingin blok **Afiliasi/Federasi** langsung muncul di beranda. Kalau tidak, Anda bisa menambahkannya manual lewat menu Konten Beranda → Tambah Blok → "Afiliasi / Federasi".

Tidak ada perubahan struktur tabel lain di kelompok ini.

---

## Yang Berubah

### Poin 1 & 14 — Pilihan tampilan gambar
Di form blok **Gambar** dan **Teks+Gambar**, kini ada pilihan **Tampilan Gambar**:
- **Isi penuh kotak** — rapi & seragam, tapi mungkin terpotong (seperti sebelumnya)
- **Tampilkan utuh** — gambar tampil penuh tanpa terpotong

Pilih "Tampilkan utuh" untuk gambar seperti poster/dokumen yang tidak boleh terpotong.

> Catatan galeri: foto galeri tetap kotak seragam (grid) agar rapi. Kalau Anda ingin galeri juga punya opsi utuh, beri tahu saya — bisa ditambahkan.

### Poin 2 — Jadwal jadi blok
Di **Konten Beranda → Tambah Blok**, kini ada dua tipe baru:
- **Jadwal Latihan (otomatis)** — menampilkan latihan mendatang dari menu Jadwal Latihan
- **Jadwal Kegiatan (otomatis)** — menampilkan kegiatan mendatang dari menu Jadwal Kegiatan

Keduanya otomatis menarik data, Anda hanya mengatur judulnya. Hanya menampilkan yang tanggalnya belum lewat.

### Poin 9, 10, 11 — Rapikan pengaturan identitas
Menu **Pengaturan → Edit Identitas** kini lebih ringkas. Dihapus (karena sudah dikelola sebagai blok di Konten Beranda):
- Bagian Hero (poin 9)
- Visi, Misi & Nilai (poin 11)
- Isi "Tentang Kami" (judul & deskripsi)

Yang **dipertahankan** di sana: Identitas Club, **Jabatan Ketua**, **Legalitas (SKEP)** (poin 10), Kontak, dan Partner.

### Poin 12 — Federasi jadi blok dengan logo
Federasi dipindah dari pengaturan identitas ke **blok konten**. Tipe blok baru "Afiliasi / Federasi" memungkinkan tiap federasi punya **logo** (upload, otomatis dikompres).

---

## File Baru
```
database/kelompok-1-federasi-blok.sql    blok federasi default (opsional)
```

## File yang Berubah
```
lib/blocks.ts                            tipe blok baru: schedules, events, federations + image_fit
components/public/block-renderer.tsx     render tipe baru + opsi tampilan gambar
components/block-editor-form.tsx         pilihan tampilan gambar + form federasi
app/dashboard/content/actions.ts         simpan image_fit, tangani logo federasi
app/dashboard/content/new/page.tsx       tipe baru di daftar tambah blok
app/page.tsx                             query jadwal & kegiatan untuk blok
components/content-editor-form.tsx       buang Hero/Visi-Misi/Federasi, ringkas Tentang
app/dashboard/settings/content-actions.ts  pertahankan data lama yang tak lagi di form
```

---

## Cara Menguji

1. **Tampilan gambar** — Konten Beranda → edit blok Teks+Gambar → ganti "Tampilan Gambar" ke "Tampilkan utuh" → simpan → cek di beranda, gambar tak terpotong.
2. **Jadwal jadi blok** — Tambah Blok → "Jadwal Latihan (otomatis)" → simpan → muncul di beranda dengan jadwal mendatang. Ulangi untuk Kegiatan.
3. **Federasi blok** — Tambah Blok → "Afiliasi / Federasi" → isi singkatan, nama, upload logo tiap federasi → simpan → cek di beranda.
4. **Pengaturan ringkas** — Pengaturan → Edit Identitas → pastikan hanya ada Identitas, Legalitas & Ketua, Kontak, Partner (Hero/Visi-Misi/Federasi sudah tidak ada).

---

## Berikutnya

Kelompok 2: perluasan data Anggota (foto, no registrasi, masa aktif, jabatan, pekerjaan). Kabari kalau Kelompok 1 sudah lolos uji.
