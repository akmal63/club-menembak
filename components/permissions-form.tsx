'use client'

import { useActionState, useEffect, useRef } from 'react'
import { updatePermissions } from '@/app/dashboard/settings/actions'
import { useToast } from '@/components/toast'

// Bentuk baris izin yang dikirim dari server component (page.tsx).
export type PermissionRow = {
  id: number | string
  permission_id: number
  can_view: boolean
  can_create: boolean
  can_edit: boolean
  can_delete: boolean
  menu: { label?: string; sort_order?: number } | null
}

export default function PermissionsForm({
  rows,
  roleId,
}: {
  rows: PermissionRow[]
  roleId: number | string
}) {
  const [state, formAction, pending] = useActionState(updatePermissions, null)
  const { success, error } = useToast()
  const lastState = useRef<unknown>(null)

  useEffect(() => {
    if (!state || state === lastState.current) return
    lastState.current = state
    if ('success' in state) success('Tersimpan', state.success)
    else if ('error' in state) error('Gagal menyimpan', state.error)
  }, [state, success, error])

  return (
    <form action={formAction}>
      <input type="hidden" name="role_id" value={roleId} />

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
        disabled={pending}
        className="mt-5 bg-accent text-white px-6 py-2 rounded-lg hover:opacity-90 disabled:opacity-50 font-display font-semibold uppercase tracking-wide"
      >
        {pending ? 'Menyimpan...' : 'Simpan Perubahan'}
      </button>
    </form>
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
        className="w-4 h-4 accent-[#ff5e3a]"
      />
    </td>
  )
}
