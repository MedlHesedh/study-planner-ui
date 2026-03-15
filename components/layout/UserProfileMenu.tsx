'use client'

import { LogOut, Settings, User } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuthUser } from '@/lib/hooks/useAuthUser'
import { ROUTES } from '@/lib/constants'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'

export function UserProfileMenu() {
  const { user, loading } = useAuthUser()
  const router = useRouter()

  if (loading) {
    return (
      <button disabled className="p-2 opacity-50 cursor-wait">
        <User className="w-5 h-5 text-muted-foreground" />
      </button>
    )
  }

  if (!user) {
    return null
  }

  const handleLogout = async () => {
    const response = await fetch('/api/auth/logout', {
      method: 'POST',
    })

    if (response.ok) {
      router.push('/auth/login')
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 px-3 py-2 hover:bg-accent rounded-lg transition-colors">
          <div className="text-right">
            <p className="text-sm font-medium">{user.email?.split('@')[0]}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
          <User className="w-5 h-5 text-muted-foreground" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="px-2 py-1.5">
          <p className="text-xs text-muted-foreground">{user.email}</p>
        </div>
        <DropdownMenuSeparator />
        <Link href={ROUTES.SETTINGS} asChild>
          <DropdownMenuItem>
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </DropdownMenuItem>
        </Link>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="text-destructive">
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
