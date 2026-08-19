'use client'

import { useActionState, useState, useRef } from 'react'
import Link from 'next/link'
import type { PageState } from '@/app/dashboard/pages/actions'
import MarkdownContent from '@/components/markdown-content'

type PageData = {
  title?: string
  slug?: string
  body?: string
  is_active?: boolean
}

export default function PageForm({
  action,
  initial,
  submitLabel,
}: {
  action: (prev: PageState, formData: FormData) => Promise<PageState>
  initial?: PageData
  submitLabel: string
}) {
  const [state, formAction, pending] = useActionState(action, null)
  const c = initial ?? {}
  const [body, setBody] = useState(c.body ?? '')
  const [preview, setPreview] = useState(false)
  const bodyRef = useRef<HTMLTextAreaElement>(null)

  // Sisipkan teks di posisi kursor (untuk tombol bantu)
  function insert(before: string, after = '', placeholder = '') {
    const ta = bodyRef.current
    if (!ta) return
    const start = ta.selectionStart
    const end = ta.selectionEnd
    const selected = body.slice(start, end) || placeholder
    const next = body.slice(0, start) + before + selected + after + body.slice(end)
    setBody(next)
    // fokus kembali
    requestAnimationFrame(() => {
      ta.focus()
      ta.selectionStart = start + before.length
      ta.selectionEnd = start + before.length + selected.length
    })
  }

  return (
    <form action={formAction} className="space-y-5 max-w-3xl">
      {state?.error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm">
          {state.error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium mb-1">Judul Halaman</label>
        <input
          type="text"
          name="title"
          defaultValue={c.title ?? ''}
          required
          className="w-full border rounded-lg px-3 py-2"
          placeholder="mis. Tentang Kami"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Slug (URL)</label>
        <div className="flex items-center gap-2">
          <span className="text-sm text-[#8890b5] font-mono">/halaman/</span>
          <input
            type="text"
            name="slug"
            defaultValue={c.slug ?? ''}
            className="flex-1 border rounded-lg px-3 py-2 font-mono text-sm"
            placeholder="tentang-kami (kosongkan = dari judul)"
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Hanya huruf kecil, angka, dan tanda hubung. Kosongkan untuk membuat otomatis dari judul.
        </p>
      </div>

      {/* Editor Markdown */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="block text-sm font-medium">Isi Halaman</label>
          <button
            type="button"
            onClick={() => setPreview((v) => !v)}
            className="text-xs text-accent hover:underline"
          >
            {preview ? 'Tulis' : 'Pratinjau'}
          </button>
        </div>

        {/* Toolbar bantu */}
        {!preview && (
          <div className="flex flex-wrap gap-1.5 mb-2">
            <ToolBtn onClick={() => insert('**', '**', 'tebal')}>B</ToolBtn>
            <ToolBtn onClick={() => insert('*', '*', 'miring')}>I</ToolBtn>
            <ToolBtn onClick={() => insert('## ', '', 'Judul')}>H</ToolBtn>
            <ToolBtn onClick={() => insert('- ', '', 'item')}>• List</ToolBtn>
            <ToolBtn onClick={() => insert('1. ', '', 'item')}>1. List</ToolBtn>
            <ToolBtn onClick={() => insert('[teks](https://) ', '', '')}>Link</ToolBtn>
            <ToolBtn onClick={() => insert('[embed](', ') ', 'https://drive.google.com/...')}>
              Embed
            </ToolBtn>
          </div>
        )}

        {preview ? (
          <div className="border rounded-lg px-4 py-3 min-h-[240px] bg-white">
            {body ? <MarkdownContent body={body} /> : <p className="text-gray-400">Belum ada isi.</p>}
          </div>
        ) : (
          <textarea
            ref={bodyRef}
            name="body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={14}
            className="w-full border rounded-lg px-3 py-2 font-mono text-sm"
            placeholder="Tulis isi halaman dengan Markdown...&#10;&#10;## Judul&#10;**tebal**, *miring*&#10;- daftar&#10;&#10;Embed Google Drive/YouTube:&#10;[embed](https://drive.google.com/file/d/XXX/view)"
          />
        )}
        <p className="text-xs text-gray-500 mt-1">
          Mendukung Markdown. Untuk menyisipkan PDF/Docs/Video, pakai tombol{' '}
          <b>Embed</b> lalu tempel link Google Drive, Google Docs, atau YouTube.
        </p>
      </div>

      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          name="is_active"
          defaultChecked={c.is_active ?? true}
          className="w-4 h-4 accent-[#ff5e3a]"
        />
        <span className="text-sm font-medium">Tampilkan halaman (aktif)</span>
      </label>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={pending}
          className="bg-accent text-white px-5 py-2 rounded-lg hover:opacity-90 disabled:opacity-50 font-display font-semibold uppercase tracking-wide"
        >
          {pending ? 'Menyimpan...' : submitLabel}
        </button>
        <Link href="/dashboard/pages" className="border px-5 py-2 rounded-lg hover:bg-gray-50">
          Batal
        </Link>
      </div>
    </form>
  )
}

function ToolBtn({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="px-2.5 py-1 border rounded text-xs font-medium hover:bg-gray-50"
    >
      {children}
    </button>
  )
}
