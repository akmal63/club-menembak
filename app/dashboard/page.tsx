import { createClient } from '@/lib/supabase/server'

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Ambil nama & role user
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, roles(label)')
    .eq('id', user!.id)
    .single()

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">
        Selamat datang, {profile?.full_name ?? 'Pengguna'}
      </h1>
      <p className="text-gray-600">
        Anda masuk sebagai:{' '}
        <span className="font-semibold">
          {(profile?.roles as any)?.label ?? 'Tidak diketahui'}
        </span>
      </p>

      <div className="mt-6 p-5 bg-white rounded-xl shadow border border-gray-100">
        <p className="text-gray-700">
          Gunakan menu di samping untuk mengelola data. Menu yang tampil
          menyesuaikan izin akun Anda.
        </p>
      </div>
    </div>
  )
}
