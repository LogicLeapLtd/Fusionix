import { useDevMode } from '../contexts/DevModeContext'

export interface ErrorDetails {
  message: string
  code?: string
  stack?: string
  context?: Record<string, any>
}

export function formatError(error: unknown): ErrorDetails {
  if (error instanceof Error) {
    return {
      message: error.message,
      stack: error.stack,
      code: (error as any).code,
    }
  }
  
  if (typeof error === 'string') {
    return { message: error }
  }
  
  return { message: 'An unknown error occurred' }
}

export function useErrorHandler() {
  const { addNotification } = useDevMode()

  return {
    handleError: (error: unknown, context?: Record<string, any>) => {
      const errorDetails = formatError(error)
      
      if (context) {
        errorDetails.context = context
      }

      // Always log to console in development
      if (process.env.NODE_ENV === 'development') {
        console.error('Error caught:', errorDetails)
      }

      // Send to notification system
      addNotification({
        type: 'error',
        message: errorDetails.message,
        details: errorDetails.stack || JSON.stringify(errorDetails.context, null, 2)
      })

      return errorDetails
    }
  }
} 