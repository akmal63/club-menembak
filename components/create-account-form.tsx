'use client'

import { useActionState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createAdminAccount } from '@/app/dashboard/settings/account-actions'

export default function CreateAccountForm() {
  const [state, formAction, pending] = useActionState(createAdminAccount, null)
  const formRef = useRef<HTMLFormElement>(null)
  const router = useRouter()

  useEffect(() => {
    if (state && 'success' in state) {
      formRef.current?.reset()
      router.refresh()
    }
  }, [state, router])

  return (
    <form
      ref={formRef}
      action={formAction}
      className="bg-white rounded-xl shadow border p-5 space-y-3"
    >
      <h2 className="font-semibold">Buat Akun Baru</h2>

      {state && 'error' in state && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-sm">
          {state.error}
        </div>
      )}
      {state && 'success' in state && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-3 py-2 rounded text-sm">
          {state.success}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">Nama Lengkap *</label>
          <input
            type="text"
            name="full_name"
            required
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Email *</label>
          <input
            type="email"
            name="email"
            required
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Password *</label>
          <input
            type="text"
            name="password"
            required
            minLength={6}
            placeholder="Minimal 6 karakter"
            className="w-full border rounded-lg px-3 py-2"
          />
          <p className="text-xs text-gray-500 mt-1">
            Password ini akan diberikan ke pemilik akun. Sebaiknya diganti setelah login pertama.
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Peran</label>
          <select
            name="role"
            defaultValue="admin"
            className="w-full border rounded-lg px-3 py-2 bg-white"
          >
            <option value="admin">Admin</option>
            <option value="superadmin">Super Admin</option>
          </select>
        </div>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
      >
        {pending ? 'Membuat...' : 'Buat Akun'}
      </button>
    </form>
  )
}
