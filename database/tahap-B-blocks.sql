-- ============================================================
--  TAHAP B — SISTEM BLOK BERANDA
--  Jalankan di Supabase Dashboard > SQL Editor.
-- ============================================================

-- 1. Tabel blok beranda
create table if not exists public.page_blocks (
  id uuid primary key default gen_random_uuid(),
  type text not null,                 -- 'hero','text','image','text_image','cards','cta','gallery','news'
  content jsonb not null default '{}', -- isi fleksibel sesuai tipe
  sort_order int not null default 0,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists page_blocks_order_idx
  on public.page_blocks (is_active, sort_order);

-- 2. Menu 'content' di daftar permission (untuk kelola blok beranda)
--    (dipakai juga sebagai izin akses editor konten)
insert into public.permissions (menu_key, label, sort_order) values
  ('content', 'Konten Beranda', 6)
on conflict (menu_key) do nothing;

-- Superadmin penuh; admin default tidak (konten publik sensitif)
insert into public.role_permissions (role_id, permission_id, can_view, can_create, can_edit, can_delete)
select
  (select id from public.roles where name = 'superadmin'),
  (select id from public.permissions where menu_key = 'content'),
  true, true, true, true
on conflict (role_id, permission_id) do nothing;

insert into public.role_permissions (role_id, permission_id, can_view, can_create, can_edit, can_delete)
select
  (select id from public.roles where name = 'admin'),
  (select id from public.permissions where menu_key = 'content'),
  false, false, false, false
on conflict (role_id, permission_id) do nothing;

-- 3. RLS
alter table public.page_blocks enable row level security;

-- Publik boleh baca blok AKTIF (untuk render beranda tanpa login)
drop policy if exists "publik baca blok aktif" on public.page_blocks;
create policy "publik baca blok aktif" on public.page_blocks
  for select using (is_active = true or public.has_permission('content','view'));

drop policy if exists "kelola blok" on public.page_blocks;
create policy "kelola blok" on public.page_blocks
  for all using (public.has_permission('content','edit'))
  with check (public.has_permission('content','edit'));

-- 4. Bucket gambar blok (publik)
insert into storage.buckets (id, name, public)
values ('blocks', 'blocks', true)
on conflict (id) do nothing;

drop policy if exists "blocks lihat publik" on storage.objects;
create policy "blocks lihat publik" on storage.objects
  for select using (bucket_id = 'blocks');

drop policy if exists "blocks upload berizin" on storage.objects;
create policy "blocks upload berizin" on storage.objects
  for insert with check (
    bucket_id = 'blocks' and public.has_permission('content','edit')
  );

drop policy if exists "blocks hapus berizin" on storage.objects;
create policy "blocks hapus berizin" on storage.objects
  for delete using (
    bucket_id = 'blocks' and public.has_permission('content','edit')
  );

-- 5. Isi blok default (agar beranda tidak kosong saat pertama kali)
--    Hanya jika tabel masih kosong.
insert into public.page_blocks (type, content, sort_order, is_active)
select * from (values
  ('hero', '{"welcome":"Selamat Datang","title":"Official Website","highlight":"PERBAKIN SHOOTING CLUB","subtitle":"Wadah bagi semua orang yang ingin menyalurkan bakat, hobi, serta kreativitas di bidang olahraga menembak.","button_enabled":true,"button_text":"Selengkapnya","button_link":"#tentang"}'::jsonb, 1, true),
  ('text_image', '{"eyebrow":"Perbakin Shooting Club","title":"Tentang Kami","body":"Perbakin Shooting Club adalah perkumpulan terbuka bagi semua orang yang ingin menyalurkan bakat, hobi, maupun aktivitas dan kreativitas lainnya di bidang olahraga menembak.","image_url":"","image_side":"right","button_enabled":false,"button_text":"","button_link":""}'::jsonb, 2, true),
  ('cards', '{"eyebrow":"Tentang Kami","title":"Visi & Misi","cards":[{"title":"Visi","body":"Menjadi perkumpulan menembak yang bermanfaat dan berprestasi."},{"title":"Misi","body":"Mewujudkan kemandirian organisasi dengan kerja sama yang solid."},{"title":"Nilai","body":"Teamwork, Inovasi, Integritas, dan Profesionalisme."}],"dark":true}'::jsonb, 3, true),
  ('gallery', '{"eyebrow":"Dokumentasi","title":"Galeri"}'::jsonb, 4, true),
  ('news', '{"eyebrow":"Informasi","title":"Berita Terbaru"}'::jsonb, 5, true)
) as v(type, content, sort_order, is_active)
where not exists (select 1 from public.page_blocks);

-- ============================================================
--  SELESAI.
-- ============================================================
