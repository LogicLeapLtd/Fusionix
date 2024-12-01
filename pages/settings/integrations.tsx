import { useState } from 'react'
import Layout from '../../components/Layout'
import { Card } from '../../components/Card'
import Button from '../../components/Button'

interface Integration {
  id: string
  name: string
  isConfigured: boolean
  credentials?: {
    [key: string]: string
  }
}

const AVAILABLE_INTEGRATIONS = [
  {
    id: 'google-analytics',
    name: 'Google Analytics',
    requiredFields: ['clientId', 'clientSecret'],
    description: 'Connect to Google Analytics for website traffic insights'
  },
  {
    id: 'shopify',
    name: 'Shopify',
    requiredFields: ['apiKey', 'apiSecret'],
    description: 'Integrate with Shopify for e-commerce data'
  },
  {
    id: 'stripe',
    name: 'Stripe',
    requiredFields: ['secretKey'],
    description: 'Process payments and analyze transaction data'
  },
  {
    id: 'openai',
    name: 'OpenAI',
    requiredFields: ['apiKey'],
    description: 'Enable AI-powered analytics and insights'
  },
  {
    id: 'quickbooks',
    name: 'QuickBooks',
    requiredFields: ['clientId', 'clientSecret'],
    description: 'Sync financial and accounting data'
  }
]

export default function IntegrationsSettings() {
  const [integrations, setIntegrations] = useState<Integration[]>([])
  const [activeIntegration, setActiveIntegration] = useState<string | null>(null)
  const [credentials, setCredentials] = useState<Record<string, string>>({})

  const handleSaveCredentials = async (integrationId: string) => {
    try {
      const response = await fetch('/api/integrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          integrationId,
          credentials: credentials
        })
      })

      if (response.ok) {
        setIntegrations(prev => [
          ...prev,
          {
            id: integrationId,
            name: AVAILABLE_INTEGRATIONS.find(i => i.id === integrationId)?.name || '',
            isConfigured: true,
            credentials
          }
        ])
        setActiveIntegration(null)
        setCredentials({})
      }
    } catch (error) {
      console.error('Failed to save integration:', error)
    }
  }

  return (
    <Layout>
      <div className="p-6">
        <h1>Integration Settings</h1>
        <p className="mt-2 text-gray-600">Configure your external service integrations</p>

        <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {AVAILABLE_INTEGRATIONS.map(integration => (
            <Card key={integration.id}>
              <h3>{integration.name}</h3>
              <p className="mt-2 text-sm text-gray-600">{integration.description}</p>
              
              {activeIntegration === integration.id ? (
                <div className="mt-4 space-y-4">
                  {integration.requiredFields.map(field => (
                    <div key={field}>
                      <label className="label" htmlFor={field}>
                        {field.charAt(0).toUpperCase() + field.slice(1)}
                      </label>
                      <input
                        id={field}
                        type="password"
                        className="input"
                        value={credentials[field] || ''}
                        onChange={e => setCredentials(prev => ({
                          ...prev,
                          [field]: e.target.value
                        }))}
                      />
                    </div>
                  ))}
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => handleSaveCredentials(integration.id)}
                    >
                      Save
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => {
                        setActiveIntegration(null)
                        setCredentials({})
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  className="mt-4"
                  variant={integrations.some(i => i.id === integration.id) ? 'secondary' : 'primary'}
                  onClick={() => setActiveIntegration(integration.id)}
                >
                  {integrations.some(i => i.id === integration.id) ? 'Reconfigure' : 'Configure'}
                </Button>
              )}
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  )
} 