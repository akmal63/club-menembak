import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 gap-6">
      <h1 className="text-3xl font-bold">Club Menembak</h1>
      <p className="text-gray-600">Sistem Manajemen Anggota & Kegiatan</p>
      <div className="flex gap-4">
        <Link
          href="/login"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          Masuk
        </Link>
      </div>
    </div>
  )
}
