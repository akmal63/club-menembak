-- ============================================================
--  TAHAP A — MENU BERITA
--  Jalankan di Supabase Dashboard > SQL Editor.
-- ============================================================

-- 1. Tabel berita
create table if not exists public.news (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique,
  excerpt text,                       -- ringkasan singkat (untuk kartu)
  body text,                          -- isi lengkap
  image_url text,
  published_at date default current_date,
  is_active boolean default true,     -- nonaktifkan tanpa hapus
  created_by uuid references auth.users(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists news_active_date_idx
  on public.news (is_active, published_at desc);

-- 2. Tambah menu 'news' ke daftar permission (agar muncul di sidebar & pengaturan izin)
insert into public.permissions (menu_key, label, sort_order) values
  ('news', 'Berita', 5)
on conflict (menu_key) do nothing;

-- 3. Beri izin default
--    Superadmin: penuh
insert into public.role_permissions (role_id, permission_id, can_view, can_create, can_edit, can_delete)
select
  (select id from public.roles where name = 'superadmin'),
  (select id from public.permissions where menu_key = 'news'),
  true, true, true, true
on conflict (role_id, permission_id) do nothing;

--    Admin: lihat, tambah, edit (tanpa hapus) — samakan gaya modul lain
insert into public.role_permissions (role_id, permission_id, can_view, can_create, can_edit, can_delete)
select
  (select id from public.roles where name = 'admin'),
  (select id from public.permissions where menu_key = 'news'),
  true, true, true, false
on conflict (role_id, permission_id) do nothing;

-- 4. Aktifkan RLS
alter table public.news enable row level security;

-- Publik boleh baca berita yang AKTIF (untuk halaman publik tanpa login)
drop policy if exists "publik baca berita aktif" on public.news;
create policy "publik baca berita aktif" on public.news
  for select using (is_active = true or public.has_permission('news','view'));

-- Kelola berita: sesuai izin
drop policy if exists "tambah berita" on public.news;
create policy "tambah berita" on public.news
  for insert with check (public.has_permission('news','create'));

drop policy if exists "edit berita" on public.news;
create policy "edit berita" on public.news
  for update using (public.has_permission('news','edit'));

drop policy if exists "hapus berita" on public.news;
create policy "hapus berita" on public.news
  for delete using (public.has_permission('news','delete'));

-- 5. Bucket gambar berita (publik)
insert into storage.buckets (id, name, public)
values ('news', 'news', true)
on conflict (id) do nothing;

drop policy if exists "news gambar lihat publik" on storage.objects;
create policy "news gambar lihat publik" on storage.objects
  for select using (bucket_id = 'news');

drop policy if exists "news gambar upload berizin" on storage.objects;
create policy "news gambar upload berizin" on storage.objects
  for insert with check (
    bucket_id = 'news' and public.has_permission('news','create')
  );

drop policy if exists "news gambar hapus berizin" on storage.objects;
create policy "news gambar hapus berizin" on storage.objects
  for delete using (
    bucket_id = 'news' and public.has_permission('news','delete')
  );

-- ============================================================
--  SELESAI.
-- ============================================================
