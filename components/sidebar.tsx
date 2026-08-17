import {
  LayoutDashboard,
  Users,
  CalendarClock,
  Star,
  Newspaper,
  Image as ImageIcon,
  Settings,
} from 'lucide-react'
import { getUserPermissions } from '@/lib/permissions'
import LogoutButton from './logout-button'
import SidebarNavLink from './sidebar-nav-link'

const MENU_CONFIG: Record<
  string,
  { path: string; icon: React.ComponentType<{ className?: string }> }
> = {
  members: { path: '/dashboard/members', icon: Users },
  schedules: { path: '/dashboard/schedules', icon: CalendarClock },
  events: { path: '/dashboard/events', icon: Star },
  news: { path: '/dashboard/news', icon: Newspaper },
  gallery: { path: '/dashboard/gallery', icon: ImageIcon },
  settings: { path: '/dashboard/settings', icon: Settings },
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
        <SidebarNavLink href="/dashboard" icon={LayoutDashboard} label="Beranda" exact />
        {menus.map((menu) => {
          const cfg = MENU_CONFIG[menu.key]
          if (!cfg) return null
          return (
            <SidebarNavLink
              key={menu.key}
              href={cfg.path}
              icon={cfg.icon}
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
