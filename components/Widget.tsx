import React from 'react'

interface WidgetProps {
  title?: string
  children: React.ReactNode
  className?: string
}

const Widget: React.FC<WidgetProps> = ({ title, children, className = '' }) => {
  return (
    <div className={`
      bg-background rounded-xl p-6
      border border-background-lighter
      transition-all duration-200
      ${className}
    `}>
      {title && (
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-text-primary">{title}</h2>
        </div>
      )}
      {children}
    </div>
  )
}

export default Widget 