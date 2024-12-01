import { useState, useEffect, useCallback } from 'react'

export interface Metric {
  title: string
  value: string
  change: string
  trend: 'up' | 'down'
  timeframe: string
}

interface UseMetricsReturn {
  metrics: Metric[]
  isLoading: boolean
  error: Error | null
  refetch: () => Promise<void>
}

export function useMetrics(): UseMetricsReturn {
  const [metrics, setMetrics] = useState<Metric[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)

  const fetchMetrics = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const response = await fetch('/api/metrics')
      if (!response.ok) {
        throw new Error('Failed to fetch metrics')
      }
      const data = await response.json()
      setMetrics(data)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch metrics'))
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const refetch = useCallback(async () => {
    setRefreshKey(prev => prev + 1)
  }, [])

  useEffect(() => {
    fetchMetrics()
  }, [refreshKey])

  return { 
    metrics, 
    isLoading, 
    error,
    refetch
  }
} 