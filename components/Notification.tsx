import React, { useEffect } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'

export interface NotificationProps {
  id: string
  type: 'error' | 'info' | 'success'
  message: string
  details?: string
  timestamp: Date
  onDismiss: (id: string) => void
}

export const Notification: React.FC<NotificationProps> = ({
  id,
  type,
  message,
  details,
  timestamp,
  onDismiss
}) => {
  // Auto dismiss after 10 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(id)
    }, 10000)

    return () => clearTimeout(timer)
  }, [id, onDismiss])

  return (
    <div className={`
      max-w-sm w-full bg-background border rounded-lg shadow-lg
      transform transition-all duration-500 hover:scale-102
      ${type === 'error' ? 'border-accent-red' : 'border-background-lighter'}
    `}>
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-1">
            <p className="text-sm font-medium text-text-primary">
              {message}
            </p>
            {details && (
              <div className="mt-1">
                <pre className="text-xs text-text-secondary font-mono bg-background-lighter p-2 rounded overflow-x-auto">
                  {details}
                </pre>
              </div>
            )}
            <p className="mt-1 text-xs text-text-secondary">
              {timestamp.toLocaleTimeString()}
            </p>
          </div>
          <button
            onClick={() => onDismiss(id)}
            className="ml-4 text-text-secondary hover:text-text-primary"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  )
}

export const NotificationContainer: React.FC<{
  notifications: NotificationProps[]
  onDismiss: (id: string) => void
}> = ({ notifications, onDismiss }) => {
  return (
    <div className="fixed bottom-4 right-4 space-y-2 z-50">
      {notifications.map(notification => (
        <Notification
          key={notification.id}
          {...notification}
          onDismiss={onDismiss}
        />
      ))}
    </div>
  )
} 