'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

// Domain yang diizinkan untuk embed (iframe). Selain ini tidak di-embed.
const ALLOWED_EMBED = [
  'drive.google.com',
  'docs.google.com',
  'www.youtube.com',
  'youtube.com',
  'youtu.be',
  'player.vimeo.com',
]

// Ubah URL embed tepercaya jadi src iframe yang benar.
function toEmbedSrc(url: string): string | null {
  try {
    const u = new URL(url)
    if (!ALLOWED_EMBED.includes(u.hostname)) return null

    // YouTube: ubah watch?v= / youtu.be jadi /embed/
    if (u.hostname === 'youtu.be') {
      return `https://www.youtube.com/embed${u.pathname}`
    }
    if (u.hostname.includes('youtube.com')) {
      const v = u.searchParams.get('v')
      if (v) return `https://www.youtube.com/embed/${v}`
    }
    // Google Drive: ubah /view jadi /preview
    if (u.hostname === 'drive.google.com') {
      return url.replace('/view', '/preview').replace('?usp=sharing', '')
    }
    // Google Docs/Sheets/Slides: tambahkan /preview jika belum
    if (u.hostname === 'docs.google.com') {
      return url.replace(/\/(edit|view).*$/, '/preview')
    }
    // Vimeo player langsung
    return url
  } catch {
    return null
  }
}

export default function MarkdownContent({ body }: { body: string }) {
  return (
    <div className="prose max-w-none text-[#3a3f5c] leading-relaxed">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Link: jika domain embed tepercaya & ditulis sebagai [embed](url),
          // render sebagai iframe. Selain itu link biasa (buka tab baru).
          a({ href, children }) {
            const url = href ?? ''
            const label = Array.isArray(children) ? children[0] : children
            if (label === 'embed') {
              const src = toEmbedSrc(url)
              if (src) {
                return (
                  <span className="block my-4">
                    <iframe
                      src={src}
                      className="w-full rounded-lg border"
                      style={{ aspectRatio: '16 / 9', minHeight: 320 }}
                      allow="autoplay; encrypted-media"
                      allowFullScreen
                    />
                  </span>
                )
              }
            }
            return (
              <a href={url} target="_blank" rel="noopener noreferrer" className="text-[#ff5e3a] underline">
                {children}
              </a>
            )
          },
          // Batasi gambar agar responsif
          img({ src, alt }) {
            // eslint-disable-next-line @next/next/no-img-element
            return <img src={typeof src === 'string' ? src : ''} alt={alt ?? ''} className="rounded-lg max-w-full" />
          },
        }}
      >
        {body}
      </ReactMarkdown>
    </div>
  )
}
