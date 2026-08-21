import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import CreateAccountForm from '@/components/create-account-form'
import DeleteAccountButton from '@/components/delete-account-button'
import PermissionsForm, { type PermissionRow } from '@/components/permissions-form'
import Tabs from '@/components/tabs'

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

  const rows: PermissionRow[] = (perms ?? [])
    .map((p) => ({
      id: p.id,
      permission_id: p.permission_id,
      can_view: p.can_view,
      can_create: p.can_create,
      can_edit: p.can_edit,
      can_delete: p.can_delete,
      menu: p.permissions as PermissionRow['menu'],
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

  // ===== Bagian: Manajemen Akun =====
  const akunTab = (
    <div>
      <p className="text-gray-600 mb-4">
        Buat akun untuk pengurus (Admin atau Super Admin). Pendaftaran mandiri
        dinonaktifkan — hanya Super Admin yang dapat membuat akun.
      </p>

      <div className="mb-6">
        <CreateAccountForm />
      </div>

      <div className="bg-white rounded-xl shadow border overflow-hidden">
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
    </div>
  )

  // ===== Bagian: Izin Admin =====
  const izinTab = (
    <div>
      <p className="text-gray-600 mb-6">
        Atur menu apa saja yang boleh diakses oleh <strong>Admin</strong>.
        Centang untuk memberi izin, hapus centang untuk mencabut.
      </p>

      <PermissionsForm rows={rows} roleId={adminRole.id} />

      <p className="text-xs text-gray-500 mt-4">
        Catatan: perubahan berlaku setelah Admin memuat ulang halaman mereka.
        Izin Super Admin tidak dapat diubah (selalu penuh).
      </p>
    </div>
  )

  return (
    <div>
      <h1 className="font-display text-2xl font-bold uppercase tracking-wide text-[#0a0e27] mb-6">
        Pengaturan
      </h1>

      {/* ================= PINTASAN KONTEN ================= */}
      <div className="grid md:grid-cols-2 gap-4 mb-8">
        <div className="grad-brand rounded-xl p-6 flex flex-col justify-between gap-4">
          <div>
            <h2 className="font-display text-lg font-bold uppercase tracking-wide text-white mb-1">
              Susun Beranda
            </h2>
            <p className="text-[#8890b5] text-sm">
              Tambah, urutkan, aktif/nonaktifkan blok beranda (hero, teks, gambar, kartu, CTA, galeri, berita).
            </p>
          </div>
          <Link
            href="/dashboard/content"
            className="bg-accent text-white px-5 py-2.5 rounded-lg hover:opacity-90 font-display font-semibold uppercase tracking-wide text-sm text-center"
          >
            Kelola Blok →
          </Link>
        </div>

        <div className="grad-brand rounded-xl p-6 flex flex-col justify-between gap-4">
          <div>
            <h2 className="font-display text-lg font-bold uppercase tracking-wide text-white mb-1">
              Identitas &amp; Footer
            </h2>
            <p className="text-[#8890b5] text-sm">
              Ubah nama club, kontak, alamat, dan tautan partner yang tampil di navbar &amp; footer.
            </p>
          </div>
          <Link
            href="/dashboard/settings/konten"
            className="bg-white/10 text-white px-5 py-2.5 rounded-lg hover:bg-white/20 font-display font-semibold uppercase tracking-wide text-sm text-center border border-white/20"
          >
            Edit Identitas →
          </Link>
        </div>
      </div>

      {/* ================= TAB: AKUN & IZIN ================= */}
      <Tabs
        tabs={[
          { key: 'akun', label: 'Manajemen Akun', content: akunTab },
          { key: 'izin', label: 'Izin Admin', content: izinTab },
        ]}
      />
    </div>
  )
}
