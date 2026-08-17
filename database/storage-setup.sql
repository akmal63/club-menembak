-- ============================================================
--  SETUP SUPABASE STORAGE UNTUK GALERI (Tahap 5)
--  Jalankan di SQL Editor SETELAH membuat bucket 'gallery'.
--
--  LANGKAH MANUAL DULU (di Dashboard):
--  1. Buka Storage > New bucket
--  2. Nama bucket: gallery
--  3. Centang "Public bucket" (agar foto bisa tampil publik)
--  4. Create bucket
--  Lalu jalankan SQL di bawah untuk mengatur izin upload/hapus.
-- ============================================================

-- Siapa saja yang sudah login boleh melihat file (baca)
drop policy if exists "gallery baca publik" on storage.objects;
create policy "gallery baca publik" on storage.objects
  for select using (bucket_id = 'gallery');

-- Hanya user dengan izin 'gallery create' yang boleh upload
drop policy if exists "gallery upload berizin" on storage.objects;
create policy "gallery upload berizin" on storage.objects
  for insert with check (
    bucket_id = 'gallery'
    and public.has_permission('gallery', 'create')
  );

-- Hanya user dengan izin 'gallery delete' yang boleh menghapus file
drop policy if exists "gallery hapus berizin" on storage.objects;
create policy "gallery hapus berizin" on storage.objects
  for delete using (
    bucket_id = 'gallery'
    and public.has_permission('gallery', 'delete')
  );
