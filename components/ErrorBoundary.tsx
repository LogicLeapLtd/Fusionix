import React, { Component, ErrorInfo } from 'react'
import { useDevMode } from '../contexts/DevModeContext'

interface Props {
  children: React.ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

class ErrorBoundaryClass extends Component<Props & { addNotification: (notification: any) => void }, State> {
  constructor(props: Props & { addNotification: (notification: any) => void }) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo })
    
    // Send error to notification system in dev mode
    this.props.addNotification({
      type: 'error',
      message: 'Runtime Error Caught',
      details: `${error.toString()}\n\nComponent Stack:\n${errorInfo.componentStack}`
    })

    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error caught by ErrorBoundary:', error)
      console.error('Component Stack:', errorInfo.componentStack)
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
          <div className="max-w-md w-full space-y-4 text-center">
            <div className="bg-accent-red/10 border border-accent-red/20 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-accent-red mb-2">
                Something went wrong
              </h2>
              <p className="text-sm text-text-secondary mb-4">
                An error occurred while rendering this component.
                {process.env.NODE_ENV === 'development' && this.state.error && (
                  <pre className="mt-2 text-xs text-left overflow-auto">
                    {this.state.error.toString()}
                  </pre>
                )}
              </p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-accent-red text-white rounded-lg text-sm hover:opacity-90 transition-colors"
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export const ErrorBoundary: React.FC<Props> = ({ children }) => {
  const { addNotification } = useDevMode()
  return <ErrorBoundaryClass addNotification={addNotification}>{children}</ErrorBoundaryClass>
}

export default ErrorBoundary 