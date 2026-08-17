shooting-club/
├── app/                  ← SEMUA halaman & routing ada di sini
│   ├── page.tsx          ← halaman utama (localhost:3000)
│   ├── layout.tsx        ← kerangka global (dipakai semua halaman)
│   └── globals.css       ← styling global
├── public/               ← file statis (gambar, logo)
├── package.json          ← daftar library & perintah
└── .env.local            ← (belum ada, kita buat nanti) kunci rahasia

NEXT_PUBLIC_SUPABASE_URL=https://hrkwyscdisekzmgpoenp.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhya3d5c2NkaXNla3ptZ3BvZW5wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY5NTYwNjAsImV4cCI6MjEwMjUzMjA2MH0.LMTFanIsbYU0MlBGGfkhx7GA7lpjuapfgt9xSWpxGbE