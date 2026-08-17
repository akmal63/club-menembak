import Link from 'next/link'
import { getUserPermissions } from '@/lib/permissions'
import LogoutButton from './logout-button'

// Peta menu_key -> path URL
const MENU_PATHS: Record<string, string> = {
  members: '/dashboard/members',
  schedules: '/dashboard/schedules',
  events: '/dashboard/events',
  gallery: '/dashboard/gallery',
  settings: '/dashboard/settings',
}

export default async function Sidebar() {
  const permissions = await getUserPermissions()

  // Ambil hanya menu yang boleh dilihat (can_view = true), lalu urutkan
  const menus = (permissions ?? [])
    .filter((p) => p.can_view && p.permissions)
    .map((p) => ({
      key: (p.permissions as any).menu_key as string,
      label: (p.permissions as any).label as string,
      sort: (p.permissions as any).sort_order as number,
    }))
    .sort((a, b) => a.sort - b.sort)

  return (
    <aside className="w-60 bg-gray-900 text-white min-h-screen flex flex-col">
      <div className="p-5 text-lg font-bold border-b border-gray-700">
        Club Menembak
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {menus.map((menu) => (
          <Link
            key={menu.key}
            href={MENU_PATHS[menu.key] ?? '/dashboard'}
            className="block px-3 py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            {menu.label}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-700">
        <LogoutButton />
      </div>
    </aside>
  )
}
