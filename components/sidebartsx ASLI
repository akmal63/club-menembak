import { getUserPermissions } from '@/lib/permissions'
import LogoutButton from './logout-button'
import SidebarNavLink from './sidebar-nav-link'

// Peta menu_key -> path
const MENU_PATHS: Record<string, string> = {
  members: '/dashboard/members',
  schedules: '/dashboard/schedules',
  events: '/dashboard/events',
  news: '/dashboard/news',
  gallery: '/dashboard/gallery',
  content: '/dashboard/content',
  settings: '/dashboard/settings',
}

export default async function Sidebar() {
  const permissions = await getUserPermissions()

  const menus = (permissions ?? [])
    .filter((p) => p.can_view && p.permissions)
    .map((p) => ({
      key: (p.permissions as any).menu_key as string,
      label: (p.permissions as any).label as string,
      sort: (p.permissions as any).sort_order as number,
    }))
    .sort((a, b) => a.sort - b.sort)

  return (
    <aside className="w-60 min-h-screen flex flex-col bg-[#0a0e27]">
      {/* Brand */}
      <div className="p-5 border-b border-[#1e2547]">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg grid place-items-center text-white font-bold text-lg bg-gradient-to-br from-[#ff5e3a] to-[#ff8a3a]">
            ◎
          </div>
          <span className="font-display text-lg font-bold text-white uppercase tracking-wide">
            Perbakin Club
          </span>
        </div>
      </div>

      {/* Beranda + menu berizin */}
      <nav className="flex-1 p-3 space-y-1">
        <SidebarNavLink href="/dashboard" iconKey="dashboard" label="Beranda" exact />
        {menus.map((menu) => {
          const path = MENU_PATHS[menu.key]
          if (!path) return null
          return (
            <SidebarNavLink
              key={menu.key}
              href={path}
              iconKey={menu.key}
              label={menu.label}
            />
          )
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-[#1e2547]">
        <LogoutButton />
      </div>
    </aside>
  )
}