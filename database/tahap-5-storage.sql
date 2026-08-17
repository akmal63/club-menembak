-- ============================================================
--  TAHAP 5 — SETUP STORAGE UNTUK GALERI
--  Jalankan di Supabase Dashboard > SQL Editor
-- ============================================================

-- 1. Buat bucket publik bernama 'gallery'
--    (publik = foto bisa ditampilkan langsung via URL)
insert into storage.buckets (id, name, public)
values ('gallery', 'gallery', true)
on conflict (id) do nothing;


-- 2. Policy Storage: siapa boleh apa pada bucket 'gallery'

-- Semua orang boleh LIHAT foto (karena galeri bersifat publik)
drop policy if exists "gallery lihat publik" on storage.objects;
create policy "gallery lihat publik" on storage.objects
  for select using (bucket_id = 'gallery');

-- Hanya user dengan izin 'gallery create' yang boleh UPLOAD
drop policy if exists "gallery upload berizin" on storage.objects;
create policy "gallery upload berizin" on storage.objects
  for insert with check (
    bucket_id = 'gallery'
    and public.has_permission('gallery', 'create')
  );

-- Hanya user dengan izin 'gallery delete' yang boleh HAPUS file
drop policy if exists "gallery hapus berizin" on storage.objects;
create policy "gallery hapus berizin" on storage.objects
  for delete using (
    bucket_id = 'gallery'
    and public.has_permission('gallery', 'delete')
  );

-- ============================================================
--  SELESAI. Bucket 'gallery' siap dipakai.
-- ============================================================
