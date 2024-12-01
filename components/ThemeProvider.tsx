import React from 'react'

interface ThemeProviderProps {
  children: React.ReactNode
}

const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-background text-text-primary">
      {children}
    </div>
  )
}

export default ThemeProvider 