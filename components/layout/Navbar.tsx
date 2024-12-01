import React from 'react'
import { BellIcon, UserCircleIcon, CommandLineIcon } from '@heroicons/react/24/outline'
import { useDevMode } from '../../contexts/DevModeContext'

const Navbar: React.FC = () => {
  const { isDevMode, toggleDevMode, addNotification } = useDevMode()

  const handleDevModeToggle = () => {
    const newState = !isDevMode
    toggleDevMode()
    
    addNotification({
      type: newState ? 'info' : 'info',
      message: `Dev Mode ${newState ? 'Enabled' : 'Disabled'}`,
      details: newState 
        ? 'Debug notifications are now turned on'
        : 'Debug notifications are now turned off'
    })
  }

  return (
    <nav className="h-16 border-b border-background-lighter px-4 lg:px-6 flex items-center justify-between">
      <div className="w-8 lg:w-0" />
      <div className="flex items-center gap-2 lg:gap-4">
        <button
          onClick={handleDevModeToggle}
          className={`
            hidden lg:flex items-center gap-2 px-3 py-2 rounded-lg text-sm
            transition-colors duration-200
            ${isDevMode 
              ? 'bg-accent-blue text-white' 
              : 'bg-background-lighter text-text-secondary hover:text-text-primary'
            }
          `}
        >
          <CommandLineIcon className="h-4 w-4" />
          Dev Mode {isDevMode ? 'On' : 'Off'}
        </button>
        <button className="p-2 text-text-secondary hover:text-text-primary rounded-lg hover:bg-background-lighter transition-colors">
          <BellIcon className="h-5 w-5" />
        </button>
        <button className="p-2 text-text-secondary hover:text-text-primary rounded-lg hover:bg-background-lighter transition-colors">
          <UserCircleIcon className="h-5 w-5" />
        </button>
      </div>
    </nav>
  )
}

export default Navbar 