-- ============================================================
--  JADIKAN AKUN SEBAGAI SUPER ADMIN
--  Jalankan SETELAH mendaftar akun pertama lewat aplikasi.
--  Ganti 'email-anda@contoh.com' dengan email yang Anda daftarkan.
-- ============================================================
update public.profiles
set role_id = (select id from public.roles where name = 'superadmin')
where id = (select id from auth.users where email = 'email-anda@contoh.com');

-- Verifikasi hasil:
select p.full_name, r.name as role, r.label
from public.profiles p
join public.roles r on r.id = p.role_id
join auth.users u on u.id = p.id
where u.email = 'email-anda@contoh.com';
