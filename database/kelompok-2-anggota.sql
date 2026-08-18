-- ============================================================
--  KELOMPOK 2 — PERLUASAN DATA ANGGOTA
--  Jalankan di Supabase Dashboard > SQL Editor.
-- ============================================================

-- 1. Tambah kolom baru ke tabel members
--    (member_number sudah ada, kita pakai sebagai "No Registrasi")
alter table public.members
  add column if not exists position text,          -- Jabatan (Ketua, Sekretaris, dll)
  add column if not exists occupation text,        -- Pekerjaan (POLRI, dll)
  add column if not exists active_until date;      -- Masa aktif s/d

-- Catatan: kolom yang sudah ada dan kita pakai:
--   member_number  -> No Registrasi (mis. A-0001.011023-02)
--   full_name      -> Nama
--   photo_url      -> Pas foto
--   address        -> Alamat (dipakai sebagai Domisili di kartu)
--   status         -> Aktif / Tidak Aktif

-- 2. Bucket pas foto anggota (publik agar bisa tampil di kartu & database publik)
insert into storage.buckets (id, name, public)
values ('members', 'members', true)
on conflict (id) do nothing;

drop policy if exists "members foto lihat publik" on storage.objects;
create policy "members foto lihat publik" on storage.objects
  for select using (bucket_id = 'members');

drop policy if exists "members foto upload berizin" on storage.objects;
create policy "members foto upload berizin" on storage.objects
  for insert with check (
    bucket_id = 'members' and public.has_permission('members','create')
  );

drop policy if exists "members foto ubah berizin" on storage.objects;
create policy "members foto ubah berizin" on storage.objects
  for update using (
    bucket_id = 'members' and public.has_permission('members','edit')
  );

drop policy if exists "members foto hapus berizin" on storage.objects;
create policy "members foto hapus berizin" on storage.objects
  for delete using (
    bucket_id = 'members' and public.has_permission('members','delete')
  );


-- 3. Data anggota untuk publik (Database Anggota).
--    Demi privasi, JANGAN buka select publik ke seluruh kolom members
--    (ada email, telepon, tgl lahir). Sebagai gantinya, buat VIEW berisi
--    kolom aman saja untuk ditampilkan ke publik.
create or replace view public.members_public as
select
  id,
  member_number,
  full_name,
  position,
  occupation,
  status,
  active_until,
  photo_url,
  address as domicile,
  category
from public.members;

grant select on public.members_public to anon, authenticated;

-- ============================================================
--  SELESAI.
-- ============================================================
