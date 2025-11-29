'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Home, Bell, User, Settings, MessageCircle } from 'lucide-react'
import { usePathname } from 'next/navigation'

interface SidebarProps {
  user: any
}

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname()

  const navItems = [
    { href: '/timeline', icon: Home, label: 'Home' },
    { href: '/notifications', icon: Bell, label: 'Notifications' },
    { href: '/messages', icon: MessageCircle, label: 'Messages' },
    { href: `/profile/${user?.username}`, icon: User, label: 'Profile' },
    { href: '/settings', icon: Settings, label: 'Settings' },
  ]

  return (
    <aside className="hidden lg:block w-64 fixed left-0 top-16 bottom-0 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
      <nav className="space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 font-semibold'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <Icon size={24} />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {user && (
        <div className="absolute bottom-4 left-4 right-4">
          <div className="card p-4 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold overflow-hidden">
                {user.avatar_url ? (
                  <Image
                    src={user.avatar_url}
                    alt={user.display_name || 'User'}
                    fill
                    className="object-cover"
                  />
                ) : (
                  user.display_name?.charAt(0).toUpperCase() || 'U'
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate">{user.display_name || 'Unknown'}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                  @{user.username || 'anonymous'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </aside>
  )
}
