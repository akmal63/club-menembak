// ============================================================
//  DEFINISI TIPE BLOK BERANDA
// ============================================================

export type BlockType =
  | 'hero'
  | 'text'
  | 'image'
  | 'text_image'
  | 'cards'
  | 'cta'
  | 'gallery'
  | 'news'
  | 'schedules'
  | 'events'
  | 'federations'
  | 'legal'
  | 'identity_club'

export type BlockButton = {
  button_enabled?: boolean
  button_text?: string
  button_link?: string
}

// Isi tiap tipe (semua opsional agar fleksibel)
export type BlockContent = BlockButton & {
  // umum
  anchor?: string // ID section untuk menu navbar (mis. "tentang", "visimisi")
  eyebrow?: string
  title?: string
  body?: string
  dark?: boolean
  // hero
  welcome?: string
  highlight?: string
  subtitle?: string
  // image / text_image
  image_url?: string
  image_side?: 'left' | 'right'
  image_fit?: 'cover' | 'contain'
  // cards
  cards?: { title?: string; body?: string }[]
  // federations
  federations?: { abbr?: string; name?: string; image_url?: string }[]
}

export type PageBlock = {
  id: string
  type: BlockType
  content: BlockContent
  sort_order: number
  is_active: boolean
}

// Label ramah untuk tiap tipe (dipakai di dashboard)
export const BLOCK_LABELS: Record<BlockType, string> = {
  hero: 'Hero (sambutan besar)',
  text: 'Teks saja',
  image: 'Gambar saja',
  text_image: 'Teks + Gambar',
  cards: 'Kartu berjajar',
  cta: 'Sorotan / Ajakan (CTA)',
  gallery: 'Galeri (otomatis)',
  news: 'Berita (otomatis)',
  schedules: 'Jadwal Latihan (otomatis)',
  events: 'Jadwal Kegiatan (otomatis)',
  federations: 'Afiliasi / Federasi',
  legal: 'Legalitas & Ketua (otomatis)',
  identity_club: 'Identitas Club (otomatis)',
}

// Tipe yang menarik data dari tabel lain / pengaturan (tak punya konten teks utama)
export const AUTO_TYPES: BlockType[] = ['gallery', 'news', 'schedules', 'events', 'legal', 'identity_club']

// ID section bawaan tiap tipe (dipakai bila admin tidak mengisi anchor manual)
export const DEFAULT_ANCHORS: Partial<Record<BlockType, string>> = {
  hero: 'beranda',
  gallery: 'galeri',
  news: 'berita',
  schedules: 'jadwal',
  events: 'kegiatan',
  legal: 'legalitas',
}

// Ubah teks bebas menjadi ID yang aman untuk anchor (huruf kecil, tanpa spasi/simbol)
export function slugifyAnchor(v: string): string {
  return v
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // buang simbol
    .replace(/\s+/g, '-') // spasi -> strip
    .replace(/-+/g, '-') // rapikan strip ganda
    .replace(/^-|-$/g, '') // buang strip di ujung
}

// Tentukan ID section final untuk sebuah blok
export function resolveAnchor(type: BlockType, content: BlockContent): string | undefined {
  if (content.anchor) return content.anchor
  return DEFAULT_ANCHORS[type]
}
