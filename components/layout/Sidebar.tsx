'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  BookOpen,
  Home,
  Calendar,
  ListChecks,
  Zap,
  Settings,
  PlusSquare,
} from 'lucide-react'
import { ROUTES } from '@/lib/constants'
import { cn } from '@/lib/utils'

const navItems = [
  { name: 'Dashboard', href: ROUTES.DASHBOARD, icon: Home },
  { name: 'Study Planner', href: ROUTES.STUDY_PLANNER, icon: PlusSquare },
  { name: 'Calendar', href: ROUTES.CALENDAR, icon: Calendar },
  { name: 'Modules', href: ROUTES.MODULES, icon: ListChecks },
  { name: 'Focus Mode', href: ROUTES.FOCUS_MODE, icon: Zap },
  { name: 'Settings', href: ROUTES.SETTINGS, icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 border-r border-border bg-card min-h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <Link href={ROUTES.HOME} className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight">StudyFlow</h1>
            <p className="text-xs text-muted-foreground">Master Your Learning</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.name}</span>
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border text-xs text-muted-foreground text-center">
        <p>© 2024 StudyFlow</p>
      </div>
    </aside>
  )
}
