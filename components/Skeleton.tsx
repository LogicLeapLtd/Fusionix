import React from 'react'

interface SkeletonProps {
  className?: string
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '' }) => {
  return (
    <div 
      className={`
        animate-pulse bg-background-lighter rounded-lg
        ${className}
      `}
    />
  )
}

export const MetricSkeleton = () => {
  return (
    <div className="space-y-3 p-6 bg-background rounded-lg border border-background-lighter">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-8 w-32" />
      <div className="flex items-center space-x-2">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-24" />
      </div>
    </div>
  )
}

export const ChartSkeleton = () => {
  return (
    <div className="space-y-4 p-6 bg-background rounded-lg border border-background-lighter">
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-64 w-full" />
    </div>
  )
}

export const IntegrationSkeleton = () => {
  return (
    <div className="space-y-4 p-6 bg-background rounded-lg border border-background-lighter">
      <Skeleton className="h-4 w-32" />
      <div className="space-y-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex items-center space-x-3">
            <Skeleton className="h-10 w-10 rounded-lg" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-16" />
            </div>
            <Skeleton className="h-4 w-20" />
          </div>
        ))}
      </div>
    </div>
  )
} 