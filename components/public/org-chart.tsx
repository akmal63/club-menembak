import Image from 'next/image'
import Link from 'next/link'
import { User, ArrowRight } from 'lucide-react'

// Satu posisi di bagan (data anggota sudah digabung di server).
export type OrgNode = {
  id: string
  parent_id: string | null
  role: string // jabatan final (role_override || position)
  name: string
  photo_url: string | null
  sort_order: number
  children: OrgNode[]
}

// Data mentah dari DB + anggota (sebelum disusun jadi pohon).
export type OrgFlat = {
  id: string
  parent_id: string | null
  role: string
  name: string
  photo_url: string | null
  sort_order: number
}

// Susun daftar datar menjadi pohon (banyak puncak diperbolehkan).
export function buildTree(flat: OrgFlat[]): OrgNode[] {
  const map = new Map<string, OrgNode>()
  flat.forEach((f) => map.set(f.id, { ...f, children: [] }))

  const roots: OrgNode[] = []
  map.forEach((node) => {
    if (node.parent_id && map.has(node.parent_id)) {
      map.get(node.parent_id)!.children.push(node)
    } else {
      roots.push(node)
    }
  })

  const sortRec = (nodes: OrgNode[]) => {
    nodes.sort((a, b) => a.sort_order - b.sort_order)
    nodes.forEach((n) => sortRec(n.children))
  }
  sortRec(roots)
  return roots
}

// ===== Kartu satu orang =====
function PersonCard({ node }: { node: OrgNode }) {
  return (
    <div className="bg-brand-soft rounded-2xl p-4 text-center border-b-[3px] border-accent w-44 shrink-0">
      {node.photo_url ? (
        <div className="relative w-[76px] h-[76px] mx-auto mb-3 rounded-full overflow-hidden bg-[#0d1130] ring-[3px] ring-[#ff5e3a]/40">
          <Image
            src={node.photo_url}
            alt={node.name}
            fill
            unoptimized
            sizes="76px"
            className="object-cover"
          />
        </div>
      ) : (
        <div className="w-[76px] h-[76px] mx-auto mb-3 rounded-full grid place-items-center bg-[#0d1130] ring-[3px] ring-[#ff5e3a]/35">
          <User className="w-8 h-8 text-[#4a5178]" />
        </div>
      )}
      <div className="font-display font-semibold uppercase tracking-wide text-xs text-accent leading-tight">
        {node.role}
      </div>
      <div className="text-white text-sm font-semibold mt-0.5 leading-snug">{node.name}</div>
    </div>
  )
}

// ===== Rekursif: node + anak-anaknya (desktop, bagan pohon) =====
function TreeNode({ node }: { node: OrgNode }) {
  return (
    <li className="org-li">
      <div className="flex flex-col items-center">
        <PersonCard node={node} />
      </div>
      {node.children.length > 0 && (
        <ul className="org-ul">
          {node.children.map((child) => (
            <TreeNode key={child.id} node={child} />
          ))}
        </ul>
      )}
    </li>
  )
}

// ===== Versi mobile: daftar bertingkat (indentasi per level) =====
function MobileRows({ nodes, level = 0 }: { nodes: OrgNode[]; level?: number }) {
  return (
    <>
      {nodes.map((n) => (
        <div key={n.id}>
          <div
            className="flex items-center gap-4 bg-brand-soft rounded-xl p-3.5 border-l-[3px] border-accent"
            style={{ marginLeft: Math.min(level, 3) * 22 }}
          >
            {n.photo_url ? (
              <div className="relative w-13 h-13 rounded-full overflow-hidden bg-[#0d1130] ring-2 ring-[#ff5e3a]/40 shrink-0" style={{ width: 52, height: 52 }}>
                <Image src={n.photo_url} alt={n.name} fill unoptimized sizes="52px" className="object-cover" />
              </div>
            ) : (
              <div className="rounded-full grid place-items-center bg-[#0d1130] ring-2 ring-[#ff5e3a]/35 shrink-0" style={{ width: 52, height: 52 }}>
                <User className="w-6 h-6 text-[#4a5178]" />
              </div>
            )}
            <div className="text-left min-w-0">
              <div className="font-display font-semibold uppercase tracking-wide text-xs text-accent leading-tight">
                {n.role}
              </div>
              <div className="text-white text-sm font-semibold leading-snug truncate">{n.name}</div>
            </div>
          </div>
          {n.children.length > 0 && (
            <div className="mt-3 space-y-3">
              <MobileRows nodes={n.children} level={level + 1} />
            </div>
          )}
        </div>
      ))}
    </>
  )
}

// ===== Komponen utama =====
// mode 'full'    -> tampilkan seluruh pohon (halaman /struktur)
// mode 'summary' -> hanya puncak + anak langsungnya, plus tombol "Lihat Selengkapnya" (beranda)
export default function OrgChart({
  roots,
  mode = 'full',
}: {
  roots: OrgNode[]
  mode?: 'full' | 'summary'
}) {
  if (!roots || roots.length === 0) {
    return (
      <p className="text-center text-[#8890b5]">Struktur organisasi belum diatur.</p>
    )
  }

  // Untuk ringkasan: batasi kedalaman ke puncak + 1 tingkat.
  const summaryRoots: OrgNode[] =
    mode === 'summary'
      ? roots.map((r) => ({
          ...r,
          children: r.children.map((c) => ({ ...c, children: [] })),
        }))
      : roots

  return (
    <div>
      {/* ===== Desktop: bagan pohon ===== */}
      <div className="hidden md:block overflow-x-auto">
        <div className="org-chart inline-block min-w-full">
          <ul className="org-ul org-root">
            {summaryRoots.map((r) => (
              <TreeNode key={r.id} node={r} />
            ))}
          </ul>
        </div>
      </div>

      {/* ===== Mobile: daftar bertingkat ===== */}
      <div className="md:hidden space-y-3">
        <MobileRows nodes={summaryRoots} />
      </div>

      {/* Tombol lihat selengkapnya (mode ringkas) */}
      {mode === 'summary' && (
        <div className="text-center mt-10">
          <Link
            href="/struktur"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-display font-semibold uppercase tracking-wide text-white grad-accent hover:opacity-90"
          >
            Lihat Selengkapnya <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  )
}
