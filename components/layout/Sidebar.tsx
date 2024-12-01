import React, { useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import {
  HomeIcon,
  ChartBarIcon,
  CommandLineIcon,
  Cog6ToothIcon,
  BeakerIcon,
  DocumentTextIcon,
  EnvelopeIcon,
  CubeTransparentIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline'
import { useDevMode } from '../../contexts/DevModeContext'

interface NavItem {
  name: string
  href: string
  icon: React.ForwardRefExoticComponent<any>
  devOnly?: boolean
}

const navigation: NavItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Analytics', href: '/analytics', icon: ChartBarIcon },
  { name: 'SQL Terminal', href: '/sql-terminal', icon: CommandLineIcon },
  { name: 'Documents', href: '/documents', icon: DocumentTextIcon },
  { name: 'Email Automation', href: '/email', icon: EnvelopeIcon },
  { name: 'Integrations', href: '/integrations', icon: CubeTransparentIcon },
  { name: 'Settings', href: '/settings', icon: Cog6ToothIcon },
  { name: 'Diagnostics', href: '/diagnostics', icon: BeakerIcon, devOnly: true }
]

const Sidebar: React.FC = () => {
  const router = useRouter()
  const { isDevMode } = useDevMode()

  // Debug logging
  useEffect(() => {
    console.log('Sidebar - Dev Mode Status:', isDevMode)
    console.log('Current Route:', router.pathname)
  }, [isDevMode, router.pathname])

  // Filter navigation items based on dev mode
  const filteredNavigation = navigation.filter(item => !item.devOnly || (item.devOnly && isDevMode))
  console.log('Filtered Navigation Items:', filteredNavigation.map(item => item.name))

  return (
    <div className="w-64 bg-background border-r border-background-lighter">
      <div className="flex flex-col h-full">
        <nav className="flex-1 px-4 py-4 space-y-1">
          {filteredNavigation.map((item) => {
            const isActive = router.pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium
                  transition-colors
                  ${isActive
                    ? 'bg-accent-blue/10 text-accent-blue'
                    : 'text-text-secondary hover:text-text-primary hover:bg-background-lighter'
                  }
                `}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            )
          })}
        </nav>

        {/* Profile Section */}
        <div className="p-4 border-t border-background-lighter">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-accent-blue/10 flex items-center justify-center">
              <UserCircleIcon className="w-5 h-5 text-accent-blue" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-text-primary truncate">Admin User</p>
              <p className="text-xs text-text-secondary truncate">admin@fusionix.com</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar 