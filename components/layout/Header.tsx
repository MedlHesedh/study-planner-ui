'use client'

import { formatDateDisplay } from '@/lib/utils/dateHelpers'
import { Bell, Settings } from 'lucide-react'
import Link from 'next/link'
import { ROUTES } from '@/lib/constants'

export function Header() {
  const today = new Date()

  return (
    <header className="border-b border-border bg-card">
      <div className="px-8 py-4 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Welcome back</h2>
          <p className="text-sm text-muted-foreground">{formatDateDisplay(today)}</p>
        </div>

        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-accent rounded-lg transition-colors">
            <Bell className="w-5 h-5 text-muted-foreground" />
          </button>
          <Link
            href={ROUTES.SETTINGS}
            className="p-2 hover:bg-accent rounded-lg transition-colors"
          >
            <Settings className="w-5 h-5 text-muted-foreground" />
          </Link>
        </div>
      </div>
    </header>
  )
}
