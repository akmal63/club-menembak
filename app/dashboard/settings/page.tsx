import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { updatePermissions } from './actions'
import CreateAccountForm from '@/components/create-account-form'
import DeleteAccountButton from '@/components/delete-account-button'

export default async function SettingsPage() {
  const supabase = await createClient()

  // Proteksi: hanya superadmin
  const { data: isSuper } = await supabase.rpc('is_superadmin')
  if (!isSuper) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-4">Pengaturan</h1>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          Halaman ini hanya untuk Super Admin.
        </div>
      </div>
    )
  }

  // Ambil role 'admin' (yang izinnya bisa diatur)
  const { data: adminRole } = await supabase
    .from('roles')
    .select('id, label')
    .eq('name', 'admin')
    .single()

  if (!adminRole) redirect('/dashboard')

  // Ambil izin admin + info menu
  const { data: perms } = await supabase
    .from('role_permissions')
    .select('id, permission_id, can_view, can_create, can_edit, can_delete, permissions(menu_key, label, sort_order)')
    .eq('role_id', adminRole.id)

  const rows = (perms ?? [])
    .map((p) => ({
      ...p,
      menu: p.permissions as any,
    }))
    .sort((a, b) => (a.menu?.sort_order ?? 0) - (b.menu?.sort_order ?? 0))

  // Ambil daftar akun (profil + role) untuk ditampilkan
  const { data: accounts } = await supabase
    .from('profiles')
    .select('id, full_name, status, roles(name, label)')
    .order('created_at', { ascending: true })

  // ID user yang sedang login (agar tak bisa hapus diri sendiri)
  const {
    data: { user: currentUser },
  } = await supabase.auth.getUser()

  return (
    <div>
      {/* ================= MANAJEMEN AKUN ================= */}
      <h1 className="text-2xl font-bold mb-2">Manajemen Akun</h1>
      <p className="text-gray-600 mb-4">
        Buat akun untuk pengurus (Admin atau Super Admin). Pendaftaran mandiri
        dinonaktifkan — hanya Super Admin yang dapat membuat akun.
      </p>

      <div className="mb-6">
        <CreateAccountForm />
      </div>

      <div className="bg-white rounded-xl shadow border overflow-hidden mb-10">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="px-4 py-3 font-medium">Nama</th>
              <th className="px-4 py-3 font-medium">Peran</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {(accounts ?? []).map((acc) => {
              const role = acc.roles as any
              const isSelf = acc.id === currentUser?.id
              return (
                <tr key={acc.id} className="border-t">
                  <td className="px-4 py-3 font-medium">
                    {acc.full_name ?? '-'}
                    {isSelf && (
                      <span className="ml-2 text-xs text-gray-400">(Anda)</span>
                    )}
                  </td>
                  <td className="px-4 py-3">{role?.label ?? '-'}</td>
                  <td className="px-4 py-3">
                    {acc.status === 'active' ? 'Aktif' : acc.status}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {isSelf ? (
                      <span className="text-gray-300 text-sm">—</span>
                    ) : (
                      <DeleteAccountButton
                        userId={acc.id}
                        name={acc.full_name ?? 'akun ini'}
                      />
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* ================= IZIN ADMIN ================= */}
      <h1 className="text-2xl font-bold mb-2">Pengaturan Izin Admin</h1>
      <p className="text-gray-600 mb-6">
        Atur menu apa saja yang boleh diakses oleh <strong>Admin</strong>.
        Centang untuk memberi izin, hapus centang untuk mencabut.
      </p>

      <form action={updatePermissions}>
        <input type="hidden" name="role_id" value={adminRole.id} />

        <div className="bg-white rounded-xl shadow border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="px-4 py-3 font-medium">Menu</th>
                <th className="px-4 py-3 font-medium text-center">Lihat</th>
                <th className="px-4 py-3 font-medium text-center">Tambah</th>
                <th className="px-4 py-3 font-medium text-center">Edit</th>
                <th className="px-4 py-3 font-medium text-center">Hapus</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-t">
                  <td className="px-4 py-3 font-medium">{r.menu?.label}</td>
                  <Checkbox pid={r.permission_id} action="view" checked={r.can_view} />
                  <Checkbox pid={r.permission_id} action="create" checked={r.can_create} />
                  <Checkbox pid={r.permission_id} action="edit" checked={r.can_edit} />
                  <Checkbox pid={r.permission_id} action="delete" checked={r.can_delete} />
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button
          type="submit"
          className="mt-5 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          Simpan Perubahan
        </button>
      </form>

      <p className="text-xs text-gray-500 mt-4">
        Catatan: perubahan berlaku setelah Admin memuat ulang halaman mereka.
        Izin Super Admin tidak dapat diubah (selalu penuh).
      </p>
    </div>
  )
}

function Checkbox({
  pid,
  action,
  checked,
}: {
  pid: number
  action: string
  checked: boolean
}) {
  return (
    <td className="px-4 py-3 text-center">
      <input
        type="checkbox"
        name={`perm-${pid}-${action}`}
        defaultChecked={checked}
        className="w-4 h-4 accent-blue-600"
      />
    </td>
  )
}
