import { NextPage } from 'next'
import { useState, useEffect } from 'react'
import { 
  ArrowPathIcon,
  ClockIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import { MetricCard } from '../components/MetricCard'
import { useMetrics } from '../hooks/useMetrics'
import { useDevMode } from '../contexts/DevModeContext'
import { MetricSkeleton } from '../components/Skeleton'

const recentIntegrations = [
  { name: 'Google Analytics', status: 'active', lastSync: '5 mins ago' },
  { name: 'Shopify', status: 'active', lastSync: '12 mins ago' },
  { name: 'Facebook Ads', status: 'error', lastSync: '1 hour ago' },
  { name: 'Mailchimp', status: 'active', lastSync: '3 hours ago' }
]

const Dashboard: NextPage = () => {
  const { metrics, isLoading, error, refetch } = useMetrics()
  const { addNotification } = useDevMode()
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())
  const [mounted, setMounted] = useState(false)

  // Only render time-based content after mounting
  useEffect(() => {
    setMounted(true)
  }, [])

  const handleRefresh = async () => {
    addNotification({
      type: 'info',
      message: 'Refreshing dashboard data',
      details: 'Fetching latest metrics...'
    })

    try {
      await refetch()
      setLastUpdated(new Date())
      
      addNotification({
        type: 'success',
        message: 'Dashboard refreshed',
        details: 'All metrics have been updated to the latest values'
      })
    } catch (err) {
      addNotification({
        type: 'error',
        message: 'Failed to refresh dashboard',
        details: err instanceof Error ? err.message : 'Unknown error occurred'
      })
    }
  }

  if (isLoading) {
    return <MetricSkeleton />
  }

  return (
    <div className="w-full h-full overflow-hidden">
      <div className="px-4 py-6 h-full overflow-y-auto">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-text-primary">Dashboard</h1>
              <p className="text-text-secondary mt-1">
                Track your key metrics and performance indicators.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-text-secondary flex items-center gap-2">
                <ClockIcon className="h-4 w-4" />
                {mounted ? `Last updated: ${lastUpdated.toLocaleTimeString()}` : 'Loading...'}
              </div>
              <button 
                onClick={handleRefresh}
                disabled={isLoading}
                className={`
                  btn-primary flex items-center gap-2
                  ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
                `}
              >
                <ArrowPathIcon className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                {isLoading ? 'Refreshing...' : 'Refresh'}
              </button>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {error ? (
              <div className="col-span-full">
                <div className="bg-accent-red/10 border-accent-red/20 p-4 rounded-xl">
                  <div className="flex items-center gap-3 text-accent-red">
                    <XMarkIcon className="h-5 w-5" />
                    <p>Failed to load metrics. Please try again later.</p>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <MetricCard
                  title="Total Revenue"
                  value="$24,567"
                  changePercentage={12.5}
                  className="lg:col-span-1"
                />
                <MetricCard
                  title="Active Users"
                  value="1,234"
                  changePercentage={23.1}
                />
                <MetricCard
                  title="Conversion Rate"
                  value="2.4%"
                  changePercentage={-0.3}
                />
              </>
            )}
          </div>

          {/* Recent Integrations */}
          <div className="bg-background-darker rounded-xl border border-[#1E2530] p-6">
            <h2 className="text-lg font-semibold text-text-primary mb-4">Recent Integrations</h2>
            <div className="space-y-4">
              {recentIntegrations.map((integration) => (
                <div
                  key={integration.name}
                  className="flex items-center justify-between py-2 border-b border-[#1E2530] last:border-0"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${
                      integration.status === 'active' ? 'bg-green-500' : 'bg-red-500'
                    }`} />
                    <span className="text-text-primary">{integration.name}</span>
                  </div>
                  <span className="text-sm text-text-secondary">{integration.lastSync}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard 