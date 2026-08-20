'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  CalendarClock,
  Star,
  Newspaper,
  Image as ImageIcon,
  LayoutTemplate,
  FileText,
  Settings,
  Network,
} from 'lucide-react'

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  dashboard: LayoutDashboard,
  members: Users,
  schedules: CalendarClock,
  events: Star,
  news: Newspaper,
  gallery: ImageIcon,
  content: LayoutTemplate,
  pages: FileText,
  settings: Settings,
  structure: Network,
}

export default function SidebarNavLink({
  href,
  iconKey,
  label,
  exact = false,
}: {
  href: string
  iconKey: string
  label: string
  exact?: boolean
}) {
  const pathname = usePathname()
  const active = exact ? pathname === href : pathname.startsWith(href)
  const Icon = ICONS[iconKey] ?? LayoutDashboard

  return (
    <Link
      href={href}
      className={
        'flex items-center gap-3 px-3 py-2.5 rounded-lg font-display font-semibold uppercase tracking-wide text-sm transition-colors ' +
        (active
          ? 'grad-accent text-white'
          : 'text-[#8890b5] hover:bg-[#151b3d] hover:text-white')
      }
    >
      <Icon className="w-[18px] h-[18px]" />
      {label}
    </Link>
  )
}