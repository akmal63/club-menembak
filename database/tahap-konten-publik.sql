-- ============================================================
--  TABEL PENGATURAN KONTEN PUBLIK
--  Menyimpan konten beranda publik agar bisa diedit superadmin.
--  Jalankan di Supabase Dashboard > SQL Editor.
-- ============================================================

-- Tabel key-value sederhana. Konten beranda disimpan sebagai 1 baris JSON.
create table if not exists public.site_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz default now(),
  updated_by uuid references auth.users(id)
);

-- Aktifkan RLS
alter table public.site_settings enable row level security;

-- Semua orang boleh MEMBACA (karena dipakai di halaman publik tanpa login)
drop policy if exists "baca site_settings publik" on public.site_settings;
create policy "baca site_settings publik" on public.site_settings
  for select using (true);

-- Hanya superadmin yang boleh MENGUBAH
drop policy if exists "superadmin ubah site_settings" on public.site_settings;
create policy "superadmin ubah site_settings" on public.site_settings
  for all using (public.is_superadmin()) with check (public.is_superadmin());

-- ============================================================
--  SELESAI. Konten default diisi otomatis oleh aplikasi
--  saat superadmin pertama kali menyimpan.
-- ============================================================
