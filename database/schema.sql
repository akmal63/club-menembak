-- ============================================================
--  SKEMA DATABASE - CLUB MENEMBAK
--  Jalankan seluruh file ini di: Supabase Dashboard > SQL Editor
--  Urutan sudah benar, jalankan sekaligus dari atas ke bawah.
-- ============================================================


-- ============================================================
--  1. ROLES
-- ============================================================
create table if not exists public.roles (
  id serial primary key,
  name text unique not null,          -- 'superadmin' | 'admin'
  label text not null,
  created_at timestamptz default now()
);

insert into public.roles (name, label) values
  ('superadmin', 'Super Admin'),
  ('admin', 'Admin')
on conflict (name) do nothing;


-- ============================================================
--  2. PERMISSIONS (daftar menu/modul)
-- ============================================================
create table if not exists public.permissions (
  id serial primary key,
  menu_key text unique not null,
  label text not null,
  sort_order int default 0,
  created_at timestamptz default now()
);

insert into public.permissions (menu_key, label, sort_order) values
  ('members',   'Anggota',         1),
  ('schedules', 'Jadwal Latihan',  2),
  ('events',    'Jadwal Kegiatan', 3),
  ('gallery',   'Galeri',          4),
  ('settings',  'Pengaturan',      99)
on conflict (menu_key) do nothing;


-- ============================================================
--  3. ROLE_PERMISSIONS (izin per role per menu)
-- ============================================================
create table if not exists public.role_permissions (
  id serial primary key,
  role_id int references public.roles(id) on delete cascade,
  permission_id int references public.permissions(id) on delete cascade,
  can_view boolean default false,
  can_create boolean default false,
  can_edit boolean default false,
  can_delete boolean default false,
  unique (role_id, permission_id)
);

-- Superadmin: akses penuh ke semua menu
insert into public.role_permissions (role_id, permission_id, can_view, can_create, can_edit, can_delete)
select
  (select id from public.roles where name = 'superadmin'),
  p.id, true, true, true, true
from public.permissions p
on conflict (role_id, permission_id) do nothing;

-- Admin: default lihat semua kecuali Pengaturan; boleh kelola Anggota & Jadwal Latihan
insert into public.role_permissions (role_id, permission_id, can_view, can_create, can_edit, can_delete)
select
  (select id from public.roles where name = 'admin'),
  p.id,
  case when p.menu_key in ('members','schedules','events','gallery') then true else false end,
  case when p.menu_key in ('members','schedules') then true else false end,
  case when p.menu_key in ('members','schedules') then true else false end,
  false
from public.permissions p
on conflict (role_id, permission_id) do nothing;


-- ============================================================
--  4. PROFILES (menghubungkan auth.users ke role)
--  Catatan: role_id default diisi lewat trigger, BUKAN DEFAULT
--  (PostgreSQL tidak mengizinkan subquery pada DEFAULT).
-- ============================================================
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role_id int references public.roles(id),
  full_name text,
  status text default 'active',
  created_at timestamptz default now()
);

-- Auto-buat profile saat user baru daftar (role default = admin)
create or replace function public.handle_new_user()
returns trigger as $$
declare
  default_role_id int;
begin
  select id into default_role_id from public.roles where name = 'admin';

  insert into public.profiles (id, role_id, full_name)
  values (
    new.id,
    default_role_id,
    coalesce(new.raw_user_meta_data->>'full_name', new.email)
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();


-- ============================================================
--  5. HELPER FUNCTIONS (dipakai oleh RLS)
-- ============================================================

-- Ambil role_id user yang sedang login
create or replace function public.current_role_id()
returns int as $$
  select role_id from public.profiles where id = auth.uid();
$$ language sql security definer stable;

-- Cek apakah user superadmin
create or replace function public.is_superadmin()
returns boolean as $$
  select exists (
    select 1 from public.profiles p
    join public.roles r on r.id = p.role_id
    where p.id = auth.uid() and r.name = 'superadmin'
  );
$$ language sql security definer stable;

-- Cek izin spesifik: has_permission('members', 'edit')
create or replace function public.has_permission(p_menu text, p_action text)
returns boolean as $$
  select coalesce((
    select case p_action
      when 'view'   then rp.can_view
      when 'create' then rp.can_create
      when 'edit'   then rp.can_edit
      when 'delete' then rp.can_delete
    end
    from public.role_permissions rp
    join public.permissions pm on pm.id = rp.permission_id
    where rp.role_id = public.current_role_id()
      and pm.menu_key = p_menu
  ), false);
$$ language sql security definer stable;


-- ============================================================
--  6. TABEL FITUR UTAMA
-- ============================================================

-- MEMBERS (anggota club)
create table if not exists public.members (
  id uuid primary key default gen_random_uuid(),
  member_number text unique,
  full_name text not null,
  email text,
  phone text,
  address text,
  birth_date date,
  join_date date default current_date,
  category text,
  status text default 'active',
  photo_url text,
  notes text,
  created_by uuid references auth.users(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- TRAINING_SCHEDULES (jadwal latihan)
create table if not exists public.training_schedules (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  location text,
  start_time timestamptz not null,
  end_time timestamptz,
  instructor text,
  max_participants int,
  status text default 'scheduled',
  created_by uuid references auth.users(id),
  created_at timestamptz default now()
);

-- EVENTS (jadwal kegiatan)
create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  location text,
  start_date timestamptz not null,
  end_date timestamptz,
  banner_url text,
  status text default 'upcoming',
  created_by uuid references auth.users(id),
  created_at timestamptz default now()
);

-- GALLERY (galeri foto)
create table if not exists public.gallery (
  id uuid primary key default gen_random_uuid(),
  title text,
  image_url text not null,
  category text,
  event_id uuid references public.events(id) on delete set null,
  uploaded_by uuid references auth.users(id),
  created_at timestamptz default now()
);


-- ============================================================
--  7. AKTIFKAN ROW LEVEL SECURITY (RLS)
-- ============================================================
alter table public.profiles            enable row level security;
alter table public.roles               enable row level security;
alter table public.permissions         enable row level security;
alter table public.role_permissions    enable row level security;
alter table public.members             enable row level security;
alter table public.training_schedules  enable row level security;
alter table public.events              enable row level security;
alter table public.gallery             enable row level security;


-- ---------- PROFILES ----------
drop policy if exists "user lihat profil sendiri" on public.profiles;
create policy "user lihat profil sendiri" on public.profiles
  for select using (auth.uid() = id or public.is_superadmin());

drop policy if exists "superadmin kelola profil" on public.profiles;
create policy "superadmin kelola profil" on public.profiles
  for all using (public.is_superadmin());


-- ---------- ROLES ----------
drop policy if exists "baca roles" on public.roles;
create policy "baca roles" on public.roles
  for select using (auth.role() = 'authenticated');


-- ---------- PERMISSIONS ----------
drop policy if exists "baca permissions" on public.permissions;
create policy "baca permissions" on public.permissions
  for select using (auth.role() = 'authenticated');


-- ---------- ROLE_PERMISSIONS ----------
drop policy if exists "baca role_permissions" on public.role_permissions;
create policy "baca role_permissions" on public.role_permissions
  for select using (auth.role() = 'authenticated');

drop policy if exists "superadmin ubah role_permissions" on public.role_permissions;
create policy "superadmin ubah role_permissions" on public.role_permissions
  for all using (public.is_superadmin());


-- ---------- MEMBERS ----------
drop policy if exists "lihat members" on public.members;
create policy "lihat members" on public.members
  for select using (public.has_permission('members','view'));

drop policy if exists "tambah members" on public.members;
create policy "tambah members" on public.members
  for insert with check (public.has_permission('members','create'));

drop policy if exists "edit members" on public.members;
create policy "edit members" on public.members
  for update using (public.has_permission('members','edit'));

drop policy if exists "hapus members" on public.members;
create policy "hapus members" on public.members
  for delete using (public.has_permission('members','delete'));


-- ---------- TRAINING_SCHEDULES ----------
drop policy if exists "lihat schedules" on public.training_schedules;
create policy "lihat schedules" on public.training_schedules
  for select using (public.has_permission('schedules','view'));

drop policy if exists "tambah schedules" on public.training_schedules;
create policy "tambah schedules" on public.training_schedules
  for insert with check (public.has_permission('schedules','create'));

drop policy if exists "edit schedules" on public.training_schedules;
create policy "edit schedules" on public.training_schedules
  for update using (public.has_permission('schedules','edit'));

drop policy if exists "hapus schedules" on public.training_schedules;
create policy "hapus schedules" on public.training_schedules
  for delete using (public.has_permission('schedules','delete'));


-- ---------- EVENTS ----------
drop policy if exists "lihat events" on public.events;
create policy "lihat events" on public.events
  for select using (public.has_permission('events','view'));

drop policy if exists "tambah events" on public.events;
create policy "tambah events" on public.events
  for insert with check (public.has_permission('events','create'));

drop policy if exists "edit events" on public.events;
create policy "edit events" on public.events
  for update using (public.has_permission('events','edit'));

drop policy if exists "hapus events" on public.events;
create policy "hapus events" on public.events
  for delete using (public.has_permission('events','delete'));


-- ---------- GALLERY ----------
drop policy if exists "lihat gallery" on public.gallery;
create policy "lihat gallery" on public.gallery
  for select using (public.has_permission('gallery','view'));

drop policy if exists "tambah gallery" on public.gallery;
create policy "tambah gallery" on public.gallery
  for insert with check (public.has_permission('gallery','create'));

drop policy if exists "edit gallery" on public.gallery;
create policy "edit gallery" on public.gallery
  for update using (public.has_permission('gallery','edit'));

drop policy if exists "hapus gallery" on public.gallery;
create policy "hapus gallery" on public.gallery
  for delete using (public.has_permission('gallery','delete'));


-- ============================================================
--  SELESAI. Setelah ini, daftar akun pertama lewat aplikasi,
--  lalu jadikan superadmin dengan file: set-superadmin.sql
-- ============================================================
