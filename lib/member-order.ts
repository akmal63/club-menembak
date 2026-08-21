// ============================================================
//  PENGURUTAN ANGGOTA BERDASARKAN HIERARKI JABATAN
//  Urutan jabatan diambil dari daftar (positionOptions di Pengaturan),
//  jadi bila admin mengubah/menyusun ulang daftar, urutan ikut berubah.
//  Aturan: jabatan (sesuai urutan daftar) -> nomor registrasi (lama duluan).
// ============================================================

// Normalisasi teks jabatan: huruf kecil, rapikan spasi.
export function normPosition(p: string | null | undefined): string {
  return (p ?? '').toLowerCase().trim().replace(/\s+/g, ' ')
}

// Skor prioritas berdasarkan posisi dalam daftar `order`.
// Semakin kecil = semakin atas. Tidak ada di daftar = paling bawah.
export function positionRank(
  position: string | null | undefined,
  order: string[]
): number {
  const key = normPosition(position)
  const idx = order.findIndex((o) => normPosition(o) === key)
  return idx === -1 ? order.length : idx
}

// Bandingkan nomor registrasi (lama duluan).
function compareMemberNumber(a: string | null, b: string | null): number {
  const na = (a ?? '').trim()
  const nb = (b ?? '').trim()
  if (!na && !nb) return 0
  if (!na) return 1
  if (!nb) return -1
  const numA = parseInt(na.replace(/\D/g, ''), 10)
  const numB = parseInt(nb.replace(/\D/g, ''), 10)
  if (Number.isFinite(numA) && Number.isFinite(numB) && numA !== numB) {
    return numA - numB
  }
  return na.localeCompare(nb, 'id', { numeric: true })
}

export type SortableMember = {
  position: string | null
  member_number: string | null
}

// Urutkan salinan array anggota berdasarkan daftar jabatan `order`.
export function sortMembersByHierarchy<T extends SortableMember>(
  members: T[],
  order: string[]
): T[] {
  return [...members].sort((a, b) => {
    const ra = positionRank(a.position, order)
    const rb = positionRank(b.position, order)
    if (ra !== rb) return ra - rb
    return compareMemberNumber(a.member_number, b.member_number)
  })
}

// ============================================================
//  PIMPINAN PUNCAK (untuk foto/nama di blok Legalitas, dll)
//  Ambil anggota dengan jabatan PALING ATAS menurut daftar
//  `positionOptions`. Anti-rapuh: tidak bergantung pada kata
//  "ketua" secara harfiah, sehingga "Ketua Umum" / "Ketua Harian"
//  atau nama jabatan apa pun tetap terbaca selama ada di daftar.
//
//  - Hanya anggota yang jabatannya ADA di daftar yang dipertimbangkan
//    (rank < order.length). Jika tak satu pun cocok -> null.
//  - Tie-breaker: nomor registrasi (lama duluan), konsisten dengan
//    pengurutan anggota lain.
// ============================================================
export function pickTopMember<T extends SortableMember>(
  members: T[],
  order: string[]
): T | null {
  let best: T | null = null
  let bestRank = order.length // ambang: harus lebih kecil dari ini agar dianggap
  for (const m of members) {
    const rank = positionRank(m.position, order)
    if (rank >= order.length) continue // jabatan tidak ada di daftar -> lewati
    if (
      best === null ||
      rank < bestRank ||
      (rank === bestRank &&
        compareMemberNumber(m.member_number, best.member_number) < 0)
    ) {
      best = m
      bestRank = rank
    }
  }
  return best
}

// ============================================================
//  DETEKSI "DATA LAMA"
//  Jabatan/kategori dianggap data lama bila TIDAK kosong TAPI
//  tidak ada di daftar pilihan saat ini (berarti nilai usang).
// ============================================================
export function isStaleValue(
  value: string | null | undefined,
  options: string[]
): boolean {
  const v = (value ?? '').trim()
  if (!v) return false // kosong bukan "data lama", hanya belum diisi
  const key = normPosition(v)
  return !options.some((o) => normPosition(o) === key)
}
