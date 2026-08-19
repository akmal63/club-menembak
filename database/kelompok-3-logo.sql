-- ============================================================
-- KELOMPOK 3 — Logo Club
-- Logo disimpan di bucket "blocks" (path: identity/logo-*.png)
-- Jalankan HANYA jika bucket "blocks" belum publik / belum ada.
-- ============================================================

-- 1) Pastikan bucket "blocks" ada dan publik.
--    Jika bucket sudah ada, baris ini akan mengabaikan (ON CONFLICT).
insert into storage.buckets (id, name, public)
values ('blocks', 'blocks', true)
on conflict (id) do update set public = true;

-- 2) Izinkan publik MEMBACA file di bucket "blocks" (agar logo tampil di web).
--    Aman diulang: dibungkus pengecekan agar tidak error bila policy sudah ada.
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'Public read blocks'
  ) then
    create policy "Public read blocks"
      on storage.objects for select
      using (bucket_id = 'blocks');
  end if;
end $$;

-- 3) Izinkan pengguna terautentikasi MENGUNGGAH ke bucket "blocks".
--    (Upload logo dilakukan lewat Server Action oleh superadmin yang sudah login.)
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'Authenticated upload blocks'
  ) then
    create policy "Authenticated upload blocks"
      on storage.objects for insert
      to authenticated
      with check (bucket_id = 'blocks');
  end if;
end $$;

-- 4) Izinkan pengguna terautentikasi MENGGANTI file (upsert logo).
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'Authenticated update blocks'
  ) then
    create policy "Authenticated update blocks"
      on storage.objects for update
      to authenticated
      using (bucket_id = 'blocks')
      with check (bucket_id = 'blocks');
  end if;
end $$;

-- Catatan:
-- Kelompok 4 (halaman /anggota) TIDAK butuh SQL baru —
-- cukup view members_public & bucket members yang sudah publik dari Kelompok 2.
