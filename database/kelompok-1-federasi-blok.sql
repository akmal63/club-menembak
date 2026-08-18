-- ============================================================
--  KELOMPOK 1 — Tambah blok Federasi ke beranda (opsional)
--  Jalankan jika ingin blok Afiliasi/Federasi langsung ada.
--  Anda tetap bisa menambah/mengeditnya lewat menu Konten Beranda.
-- ============================================================

-- Tambah blok federasi setelah blok Visi-Misi (sort_order 3),
-- hanya jika belum ada blok tipe 'federations'.
insert into public.page_blocks (type, content, sort_order, is_active)
select
  'federations',
  '{"eyebrow":"Tentang Kami","title":"Afiliasi & Federasi","federations":[{"abbr":"ISSF","name":"International Shooting Sport Federation","image_url":""},{"abbr":"IPSC","name":"International Practical Shooting Confederation","image_url":""},{"abbr":"WRABF","name":"World Rimfire & Air Rifle Benchrest Federation","image_url":""},{"abbr":"IMSSU","name":"International Metallic Silhouette Shooting Association","image_url":""}]}'::jsonb,
  4,
  true
where not exists (
  select 1 from public.page_blocks where type = 'federations'
);

-- Rapikan urutan agar tak bentrok (opsional, aman dijalankan)
-- Blok baru diberi sort_order 4; blok galeri/berita yang tadinya 4,5 akan
-- tetap tampil setelahnya karena urutan dibaca menaik lalu id.
