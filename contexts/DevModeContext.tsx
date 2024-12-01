import React, { createContext, useContext, useState, useCallback } from 'react'
import { NotificationProps, NotificationContainer } from '../components/Notification'

interface DevModeContextType {
  isDevMode: boolean
  toggleDevMode: () => void
  addNotification: (notification: Omit<NotificationProps, 'id' | 'timestamp' | 'onDismiss'>) => void
}

const DevModeContext = createContext<DevModeContextType | undefined>(undefined)

export function useDevMode() {
  const context = useContext(DevModeContext)
  if (context === undefined) {
    throw new Error('useDevMode must be used within a DevModeProvider')
  }
  return context
}

export const DevModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDevMode, setIsDevMode] = useState(false)
  const [notifications, setNotifications] = useState<NotificationProps[]>([])

  const toggleDevMode = useCallback(() => {
    setIsDevMode(prev => !prev)
  }, [])

  const addNotification = useCallback(
    (notification: Omit<NotificationProps, 'id' | 'timestamp' | 'onDismiss'>) => {
      // Special case: always show dev mode toggle notifications
      const isDevModeToggleNotification = 
        notification.message.includes('Dev Mode Enabled') || 
        notification.message.includes('Dev Mode Disabled')

      if (!isDevMode && !isDevModeToggleNotification) return // Only block non-toggle notifications when dev mode is off

      const id = Date.now().toString()
      setNotifications(prev => [
        {
          ...notification,
          id,
          timestamp: new Date(),
          onDismiss: dismissNotification
        },
        ...prev
      ])
    },
    [isDevMode]
  )

  const dismissNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }, [])

  return (
    <DevModeContext.Provider value={{ isDevMode, toggleDevMode, addNotification }}>
      {children}
      <NotificationContainer
        notifications={notifications}
        onDismiss={dismissNotification}
      />
    </DevModeContext.Provider>
  )
} 