// ============================================================
//  PRESET TEMA WARNA
//  File ini SENGAJA dipisah dari lib/site-content.ts agar bisa
//  di-import oleh Client Component tanpa ikut menarik kode server
//  (lib/site-content.ts meng-import supabase/server yang server-only).
// ============================================================

export type ThemePreset = { name: string; primary: string; accent: string }

export const THEME_PRESETS: ThemePreset[] = [
  { name: 'Navy & Oranye (default)', primary: '#0a0e27', accent: '#ff5e3a' },
  { name: 'Hitam & Emas', primary: '#111111', accent: '#e0a80d' },
  { name: 'Hijau Militer', primary: '#1a2e1a', accent: '#4caf50' },
  { name: 'Merah Marun', primary: '#2a0a0a', accent: '#dc2626' },
  { name: 'Biru Laut', primary: '#0a1e3a', accent: '#0ea5e9' },
]
