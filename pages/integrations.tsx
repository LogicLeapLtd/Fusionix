import React, { useState, useEffect } from 'react';
import { ChevronDownIcon, MagnifyingGlassIcon, XMarkIcon, CheckIcon, CogIcon } from '@heroicons/react/24/outline';
import { IntegrationCard } from '../components/IntegrationCard';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

interface AccountOption {
  id: string;
  name: string;
  type?: string;
}

interface SyncOption {
  id: string;
  name: string;
  description: string;
  isEnabled: boolean;
}

interface Integration {
  id: string;
  name: string;
  description: string;
  category: string;
  logoUrl: string;
  isConnected: boolean;
  accounts: AccountOption[];
  selectedAccounts: string[];
  syncOptions: SyncOption[];
}

interface Account {
  id: string;
  name: string;
  properties: Property[];
}

interface Property {
  id: string;
  name: string;
}

interface TableConfig {
  id: string;
  name: string;
  syncOption?: 'always_full' | 'use_setting' | 'full_sync_midnight' | 'use_setting_protected';
}

const CATEGORIES = {
  ALL: 'All Integrations',
  ANALYTICS: 'Analytics & Tracking',
  ADVERTISING: 'Advertising & Marketing',
  ECOMMERCE: 'E-commerce',
  CRM: 'CRM & Sales',
  EMAIL: 'Email Marketing',
  SOCIAL: 'Social Media',
  DATA_WAREHOUSE: 'Data Warehouses',
  BI: 'Business Intelligence',
  SUPPORT: 'Customer Support',
  PAYMENT: 'Payment Processing',
  SEO: 'SEO Tools',
  AUTOMATION: 'Marketing Automation',
  SURVEY: 'Survey & Forms',
  PROJECT: 'Project Management',
  CLOUD: 'Cloud Storage',
  DATABASE: 'Databases',
  API: 'API Services',
  PRODUCTIVITY: 'Productivity Tools',
  VIDEO: 'Video Platforms'
};

const DEFAULT_INTEGRATIONS: Integration[] = [
  // Analytics & Tracking
  {
    id: 'google-analytics',
    name: 'Google Analytics',
    description: 'Connect your GA4 properties to sync analytics data',
    category: 'Analytics & Tracking',
    logoUrl: 'https://www.gstatic.com/analytics-suite/header/suite/v2/ic_analytics.svg',
    isConnected: false,
    accounts: [],
    selectedAccounts: [],
    syncOptions: [],
  },
  {
    id: 'mixpanel',
    name: 'Mixpanel',
    description: 'Connect user behavior analytics and event tracking',
    category: 'Analytics & Tracking',
    logoUrl: 'https://cdn.worldvectorlogo.com/logos/mixpanel.svg',
    isConnected: false,
    accounts: [],
    selectedAccounts: [],
    syncOptions: [],
  },
  {
    id: 'amplitude',
    name: 'Amplitude',
    description: 'Sync product analytics and user insights',
    category: 'Analytics & Tracking',
    logoUrl: 'https://cdn.worldvectorlogo.com/logos/amplitude-1.svg',
    isConnected: false,
    accounts: [],
    selectedAccounts: [],
    syncOptions: [],
  },

  // Advertising & Marketing
  {
    id: 'google-ads',
    name: 'Google Ads',
    description: 'Connect your Google Ads accounts to sync campaign data',
    category: 'Advertising & Marketing',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Google_Ads_logo.svg/512px-Google_Ads_logo.svg.png',
    isConnected: false,
    accounts: [],
    selectedAccounts: [],
    syncOptions: [],
  },
  {
    id: 'facebook-ads',
    name: 'Facebook Ads',
    description: 'Sync Facebook ad campaigns and performance metrics',
    category: 'Advertising & Marketing',
    logoUrl: 'https://www.facebook.com/images/fb_icon_325x325.png',
    isConnected: false,
    accounts: [],
    selectedAccounts: [],
    syncOptions: [],
  },
  {
    id: 'tiktok-ads',
    name: 'TikTok Ads',
    description: 'Connect TikTok advertising data and analytics',
    category: 'Advertising & Marketing',
    logoUrl: 'https://sf16-scmcdn-va.ibytedtos.com/goofy/tiktok/web/node/_next/static/images/logo-dark-e95da587b6efa1520dcd11f4b45c0cf6.svg',
    isConnected: false,
    accounts: [],
    selectedAccounts: [],
    syncOptions: [],
  },

  // E-commerce
  {
    id: 'shopify',
    name: 'Shopify',
    description: 'Connect your Shopify store data and analytics',
    category: 'E-commerce',
    logoUrl: 'https://cdn.worldvectorlogo.com/logos/shopify.svg',
    isConnected: false,
    accounts: [],
    selectedAccounts: [],
    syncOptions: [],
  },
  {
    id: 'woocommerce',
    name: 'WooCommerce',
    description: 'Sync WooCommerce store metrics and orders',
    category: 'E-commerce',
    logoUrl: 'https://cdn.worldvectorlogo.com/logos/woocommerce.svg',
    isConnected: false,
    accounts: [],
    selectedAccounts: [],
    syncOptions: [],
  },

  // CRM & Sales
  {
    id: 'salesforce',
    name: 'Salesforce',
    description: 'Connect Salesforce CRM data and analytics',
    category: 'CRM & Sales',
    logoUrl: 'https://cdn.worldvectorlogo.com/logos/salesforce-2.svg',
    isConnected: false,
    accounts: [],
    selectedAccounts: [],
    syncOptions: [],
  },
  {
    id: 'hubspot',
    name: 'HubSpot',
    description: 'Sync HubSpot CRM and marketing data',
    category: 'CRM & Sales',
    logoUrl: 'https://cdn.worldvectorlogo.com/logos/hubspot.svg',
    isConnected: false,
    accounts: [],
    selectedAccounts: [],
    syncOptions: [],
  },

  // Email Marketing
  {
    id: 'mailchimp',
    name: 'Mailchimp',
    description: 'Connect Mailchimp email marketing data',
    category: 'Email Marketing',
    logoUrl: 'https://cdn.worldvectorlogo.com/logos/mailchimp.svg',
    isConnected: false,
    accounts: [],
    selectedAccounts: [],
    syncOptions: [],
  },
  {
    id: 'klaviyo',
    name: 'Klaviyo',
    description: 'Sync Klaviyo email and SMS marketing metrics',
    category: 'Email Marketing',
    logoUrl: 'https://cdn.worldvectorlogo.com/logos/klaviyo-1.svg',
    isConnected: false,
    accounts: [],
    selectedAccounts: [],
    syncOptions: [],
  },

  // Social Media
  {
    id: 'facebook',
    name: 'Facebook',
    description: 'Connect Facebook page and social metrics',
    category: 'Social Media',
    logoUrl: 'https://cdn.worldvectorlogo.com/logos/facebook-3.svg',
    isConnected: false,
    accounts: [],
    selectedAccounts: [],
    syncOptions: [],
  },
  {
    id: 'instagram',
    name: 'Instagram',
    description: 'Sync Instagram engagement and audience data',
    category: 'Social Media',
    logoUrl: 'https://cdn.worldvectorlogo.com/logos/instagram-2016-5.svg',
    isConnected: false,
    accounts: [],
    selectedAccounts: [],
    syncOptions: [],
  },

  // Data Warehouses
  {
    id: 'snowflake',
    name: 'Snowflake',
    description: 'Connect your Snowflake data warehouse',
    category: 'Data Warehouses',
    logoUrl: 'https://cdn.worldvectorlogo.com/logos/snowflake.svg',
    isConnected: false,
    accounts: [],
    selectedAccounts: [],
    syncOptions: [],
  },
  {
    id: 'bigquery',
    name: 'BigQuery',
    description: 'Sync Google BigQuery datasets',
    category: 'Data Warehouses',
    logoUrl: 'https://cdn.worldvectorlogo.com/logos/google-bigquery-logo-1.svg',
    isConnected: false,
    accounts: [],
    selectedAccounts: [],
    syncOptions: [],
  },

  // Business Intelligence
  {
    id: 'tableau',
    name: 'Tableau',
    description: 'Connect Tableau dashboards and analytics',
    category: 'Business Intelligence',
    logoUrl: 'https://cdn.worldvectorlogo.com/logos/tableau-software.svg',
    isConnected: false,
    accounts: [],
    selectedAccounts: [],
    syncOptions: [],
  },
  {
    id: 'looker',
    name: 'Looker',
    description: 'Sync Looker dashboards and explores',
    category: 'Business Intelligence',
    logoUrl: 'https://cdn.worldvectorlogo.com/logos/looker.svg',
    isConnected: false,
    accounts: [],
    selectedAccounts: [],
    syncOptions: [],
  },

  // Customer Support
  {
    id: 'zendesk',
    name: 'Zendesk',
    description: 'Connect Zendesk support ticket analytics',
    category: 'Customer Support',
    logoUrl: 'https://cdn.worldvectorlogo.com/logos/zendesk-1.svg',
    isConnected: false,
    accounts: [],
    selectedAccounts: [],
    syncOptions: [],
  },
  {
    id: 'intercom',
    name: 'Intercom',
    description: 'Sync Intercom customer messaging data',
    category: 'Customer Support',
    logoUrl: 'https://cdn.worldvectorlogo.com/logos/intercom-1.svg',
    isConnected: false,
    accounts: [],
    selectedAccounts: [],
    syncOptions: [],
  },

  // Payment Processing
  {
    id: 'stripe',
    name: 'Stripe',
    description: 'Connect Stripe payment and subscription data',
    category: 'Payment Processing',
    logoUrl: 'https://cdn.worldvectorlogo.com/logos/stripe-4.svg',
    isConnected: false,
    accounts: [],
    selectedAccounts: [],
    syncOptions: [],
  },
  {
    id: 'paypal',
    name: 'PayPal',
    description: 'Sync PayPal transaction and payment data',
    category: 'Payment Processing',
    logoUrl: 'https://cdn.worldvectorlogo.com/logos/paypal-2.svg',
    isConnected: false,
    accounts: [],
    selectedAccounts: [],
    syncOptions: [],
  },

  // SEO Tools
  {
    id: 'semrush',
    name: 'SEMrush',
    description: 'Connect SEMrush SEO and keyword data',
    category: 'SEO Tools',
    logoUrl: 'https://cdn.worldvectorlogo.com/logos/semrush.svg',
    isConnected: false,
    accounts: [],
    selectedAccounts: [],
    syncOptions: [],
  },
  {
    id: 'ahrefs',
    name: 'Ahrefs',
    description: 'Sync Ahrefs SEO metrics and backlinks',
    category: 'SEO Tools',
    logoUrl: 'https://cdn.worldvectorlogo.com/logos/ahrefs.svg',
    isConnected: false,
    accounts: [],
    selectedAccounts: [],
    syncOptions: [],
  },

  // Marketing Automation
  {
    id: 'marketo',
    name: 'Marketo',
    description: 'Connect Marketo marketing automation data',
    category: 'Marketing Automation',
    logoUrl: 'https://cdn.worldvectorlogo.com/logos/marketo.svg',
    isConnected: false,
    accounts: [],
    selectedAccounts: [],
    syncOptions: [],
  },
  {
    id: 'pardot',
    name: 'Pardot',
    description: 'Sync Pardot B2B marketing analytics',
    category: 'Marketing Automation',
    logoUrl: 'https://cdn.worldvectorlogo.com/logos/pardot.svg',
    isConnected: false,
    accounts: [],
    selectedAccounts: [],
    syncOptions: [],
  },

  // Project Management
  {
    id: 'jira',
    name: 'Jira',
    description: 'Connect Jira project and issue tracking',
    category: 'Project Management',
    logoUrl: 'https://cdn.worldvectorlogo.com/logos/jira-1.svg',
    isConnected: false,
    accounts: [],
    selectedAccounts: [],
    syncOptions: [],
  },
  {
    id: 'asana',
    name: 'Asana',
    description: 'Sync Asana project management data',
    category: 'Project Management',
    logoUrl: 'https://cdn.worldvectorlogo.com/logos/asana-logo.svg',
    isConnected: false,
    accounts: [],
    selectedAccounts: [],
    syncOptions: [],
  },

  // Cloud Storage
  {
    id: 'dropbox',
    name: 'Dropbox',
    description: 'Connect Dropbox storage and file analytics',
    category: 'Cloud Storage',
    logoUrl: 'https://cdn.worldvectorlogo.com/logos/dropbox-1.svg',
    isConnected: false,
    accounts: [],
    selectedAccounts: [],
    syncOptions: [],
  },
  {
    id: 'box',
    name: 'Box',
    description: 'Sync Box enterprise storage metrics',
    category: 'Cloud Storage',
    logoUrl: 'https://cdn.worldvectorlogo.com/logos/box-1.svg',
    isConnected: false,
    accounts: [],
    selectedAccounts: [],
    syncOptions: [],
  },

  // Productivity Tools
  {
    id: 'slack',
    name: 'Slack',
    description: 'Connect Slack workspace analytics',
    category: 'Productivity Tools',
    logoUrl: 'https://cdn.worldvectorlogo.com/logos/slack-new-logo.svg',
    isConnected: false,
    accounts: [],
    selectedAccounts: [],
    syncOptions: [],
  },
  {
    id: 'notion',
    name: 'Notion',
    description: 'Sync Notion workspace and page data',
    category: 'Productivity Tools',
    logoUrl: 'https://cdn.worldvectorlogo.com/logos/notion-logo-1.svg',
    isConnected: false,
    accounts: [],
    selectedAccounts: [],
    syncOptions: [],
  },
];

const ANALYTICS_TABLES: TableConfig[] = [
  { id: 'audience_overview', name: 'Audience Overview' },
  { id: 'browser_and_operating_system_overview', name: 'Browser & OS Overview' },
  { id: 'campaign_performance', name: 'Campaign Performance' },
  { id: 'channel_traffic', name: 'Channel Traffic' },
  { id: 'events_overview', name: 'Events Overview' },
  { id: 'page_path', name: 'Page Path' },
  { id: 'social_media_acquisitions', name: 'Social Media Acquisitions' }
];

const SYNC_OPTIONS = [
  { id: 'always_full', name: 'Always full sync' },
  { id: 'use_setting', name: 'Use setting' },
  { id: 'full_sync_midnight', name: 'Full sync at midnight' },
  { id: 'use_setting_protected', name: 'Protected' }
];

interface SyncSetupConfig {
  mode: 'MERGE' | 'APPEND' | 'REPLACE';
  primaryKey?: string;
  cursorField?: string;
  syncInterval: string;
  syncStartTime?: string;
  isProtected: boolean;
  isFullSync: boolean;
  fullSyncSchedule?: 'always' | 'midnight' | 'custom';
}

interface SetupModalState {
  isOpen: boolean;
  integration?: Integration;
  connectionName?: string;
  googleAuth?: boolean;
  isLoadingAccounts?: boolean;
  accounts?: Account[];
  selectedAccount?: string;
  properties?: Property[];
  selectedProperty?: string;
  syncInterval?: string;
  selectedTables?: string[];
  syncSetup: {
    [tableId: string]: SyncSetupConfig;
  };
}

// Add this function before the component
const saveDataSource = async (data: {
  name: string;
  type: string;
  connectionName: string;
  integrationId: string;
  userId: string;
  tables: any[];
}) => {
  const response = await fetch('/api/data-sources', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    throw new Error('Failed to save data source');
  }

  return response.json();
};

interface SyncConfig {
  syncInterval: string;
  startTime: string;
  timezone: string;
  destinationSchema: string;
}

const CompletionAnimation = ({ onClose, dataSource }: { onClose: () => void, dataSource: any }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-[#1A1D24] border border-[#1E2530] rounded-xl w-full max-w-2xl p-8 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="mx-auto w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mb-6"
        >
          <CheckCircleIcon className="w-12 h-12 text-green-500" />
        </motion.div>
        
        <h2 className="text-2xl font-bold text-white mb-4">Data Source Connected!</h2>
        <p className="text-gray-400 mb-8">Your data source has been successfully set up and is ready to sync.</p>
        
        <div className="bg-[#232830] rounded-lg p-6 text-left mb-8">
          <h3 className="text-lg font-semibold text-white mb-4">Configuration Summary</h3>
          <dl className="space-y-4">
            <div>
              <dt className="text-sm text-gray-400">Data Source Name</dt>
              <dd className="text-white">{dataSource.name}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-400">Connected Account</dt>
              <dd className="text-white">{dataSource.accountName}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-400">Sync Schedule</dt>
              <dd className="text-white">{dataSource.syncInterval}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-400">Selected Tables</dt>
              <dd className="text-white">
                <ul className="list-disc list-inside">
                  {dataSource.tables.map((table: any) => (
                    <li key={table.id}>{table.name}</li>
                  ))}
                </ul>
              </dd>
            </div>
          </dl>
        </div>
        
        <button
          onClick={onClose}
          className="px-6 py-3 bg-accent-blue text-white rounded-lg hover:bg-accent-blue/90 transition-colors"
        >
          Done
        </button>
      </motion.div>
    </motion.div>
  );
};

export default function IntegrationsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(CATEGORIES.ALL);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const [sortBy, setSortBy] = useState<'name' | 'recent' | 'popular'>('name');
  const [statusFilter, setStatusFilter] = useState<'all' | 'connected' | 'not_connected'>('all');
  const [integrations, setIntegrations] = useState<Integration[]>(DEFAULT_INTEGRATIONS);
  const [currentStep, setCurrentStep] = useState(1);
  const [setupModal, setSetupModal] = useState<SetupModalState>({
    isOpen: false,
    syncSetup: {}
  });
  const [error, setError] = useState<string | null>(null);
  const [tableSettingsModal, setTableSettingsModal] = useState<{
    isOpen: boolean;
    tableId: string;
    syncOption: string;
  }>({
    isOpen: false,
    tableId: '',
    syncOption: ''
  });
  const [syncSetupModal, setSyncSetupModal] = useState<{
    isOpen: boolean;
    tableId: string;
    config: SyncSetupConfig;
  }>({
    isOpen: false,
    tableId: '',
    config: {
      mode: 'MERGE',
      syncInterval: 'hourly',
      isProtected: false,
      isFullSync: false
    }
  });
  const [showCompletion, setShowCompletion] = useState(false);
  const [completedDataSource, setCompletedDataSource] = useState<any>(null);

  // Handle OAuth callback
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const status = params.get('status');
    const error = params.get('error');
    const service = params.get('service');
    const accountsData = params.get('accounts');
    const connectionName = params.get('connectionName');

    if (status === 'error') {
      setError(error || 'Authentication failed');
      // Clear error from URL
      window.history.replaceState({}, '', '/integrations');
    } else if (status === 'success' && accountsData && service) {
      try {
        const data = JSON.parse(decodeURIComponent(accountsData));
        
        // Find the integration to re-open modal with
        const integration = integrations.find(i => i.id === service);
        if (!integration) throw new Error('Integration not found');

        // Re-open modal with the auth data
        setSetupModal({
          isOpen: true,
          integration,
          connectionName: connectionName || integration.id,
          googleAuth: true,
          isLoadingAccounts: false,
          accounts: data.accounts,
          selectedAccount: '',
          selectedProperty: '',
          properties: [],
          selectedTables: [],
          syncSetup: {}
        });
        setCurrentStep(2); // Move to step 2 after successful auth

        // Clear success state from URL
        window.history.replaceState({}, '', '/integrations');
      } catch (e) {
        console.error('Failed to parse accounts data:', e);
        setError('Failed to process integration data');
      }
    }
  }, [integrations]);

  // Close all dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      
      // Don't close if clicking inside a dropdown
      if (target.closest('[data-dropdown]')) return;

      setIsCategoryDropdownOpen(false);
      setIsStatusDropdownOpen(false);
      setIsSortDropdownOpen(false);
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleConnect = async (integrationId: string) => {
    const integration = integrations.find(i => i.id === integrationId);
    if (!integration) return;

    setSetupModal({ 
      isOpen: true, 
      integration,
      connectionName: integration.id,
      syncInterval: 'Every day',
      selectedTables: []
    });
    setCurrentStep(1);
  };

  const handleSetupConfirm = async () => {
    if (!setupModal.integration) return;

    if (currentStep === 3) {
      try {
        const dataSourceData = {
          name: setupModal.connectionName || 'Unnamed Connection',
          type: setupModal.integration.id,
          connectionName: setupModal.connectionName || '',
          integrationId: setupModal.integration.id,
          userId: 'default-user',
          tables: setupModal.selectedTables?.map(tableId => {
            const config = setupModal.syncSetup[tableId] || {
              mode: 'MERGE',
              syncInterval: setupModal.syncInterval || 'daily',
              isProtected: false,
              isFullSync: false
            };

            const table = ANALYTICS_TABLES.find(t => t.id === tableId);
            if (!table) throw new Error(`Table ${tableId} not found`);

            return {
              id: tableId,
              name: table.name,
              syncMode: config.mode,
              syncInterval: config.syncInterval,
              primaryKey: config.primaryKey,
              cursorField: config.cursorField,
              isFullSync: config.isFullSync,
              fullSyncSchedule: config.fullSyncSchedule,
              isProtected: config.isProtected,
              schema: [
                // Add schema fields based on the table type
                ...(tableId === 'audience_overview' ? [
                  { name: 'date', type: 'date', description: 'The date of the record' },
                  { name: 'users', type: 'integer', description: 'Number of users' },
                  { name: 'new_users', type: 'integer', description: 'Number of new users' },
                  { name: 'sessions', type: 'integer', description: 'Number of sessions' }
                ] : []),
                ...(tableId === 'campaign_performance' ? [
                  { name: 'campaign_id', type: 'string', description: 'Campaign identifier' },
                  { name: 'campaign_name', type: 'string', description: 'Campaign name' },
                  { name: 'impressions', type: 'integer', description: 'Number of impressions' },
                  { name: 'clicks', type: 'integer', description: 'Number of clicks' }
                ] : [])
              ]
            };
          }) || []
        };

        const response = await saveDataSource(dataSourceData);
        
        // Show completion animation with the saved data
        setCompletedDataSource({
          ...dataSourceData,
          accountName: setupModal.selectedAccount,
          syncInterval: setupModal.syncInterval === 'daily' ? 'Every day' :
                       setupModal.syncInterval === '12hours' ? 'Every 12 hours' :
                       setupModal.syncInterval === '6hours' ? 'Every 6 hours' :
                       setupModal.syncInterval === 'hourly' ? 'Every hour' :
                       'Custom schedule'
        });
        setShowCompletion(true);
        return;
      } catch (error) {
        console.error('Failed to save data source:', error);
        setError('Failed to save data source');
        return;
      }
    }

    // If already authenticated, move to next step
    if (currentStep === 2 && setupModal.googleAuth && setupModal.selectedAccount && setupModal.selectedProperty) {
      setCurrentStep(prev => prev + 1);
      return;
    }

    // Handle authentication for step 2
    if (currentStep === 2 && !setupModal.googleAuth) {
      try {
        const response = await fetch(`/api/integrations/${setupModal.integration.id}/auth`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            connectionName: setupModal.connectionName,
            syncInterval: setupModal.syncInterval,
            selectedTables: setupModal.selectedTables
          })
        });
        const data = await response.json();
        
        if (data.authUrl) {
          const authUrlWithState = new URL(data.authUrl);
          authUrlWithState.searchParams.append('connectionName', setupModal.connectionName || '');
          
          setSetupModal(prev => ({
            ...prev,
            isLoadingAccounts: true
          }));
          window.location.href = authUrlWithState.toString();
        }
      } catch (error) {
        console.error('Failed to initiate connection:', error);
        setError('Failed to initiate connection');
      }
    }
  };

  const steps = [
    { title: 'Data source', description: 'Select your data source' },
    { title: 'Connection Settings', description: 'Configure connection details' },
    { title: 'Data to sync', description: 'Choose what data to import' },
    { title: 'Configure sync', description: 'Set up sync schedule' }
  ];

  const filteredIntegrations = integrations
    .filter(integration => {
      const matchesCategory = selectedCategory === CATEGORIES.ALL || integration.category === selectedCategory;
      const matchesSearch = !searchQuery || 
        integration.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        integration.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || 
        (statusFilter === 'connected' && integration.isConnected) ||
        (statusFilter === 'not_connected' && !integration.isConnected);
      
      return matchesCategory && matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      // First sort by "coming soon" status
      const aIsClickable = a.id === 'google-ads' || a.id === 'google-analytics';
      const bIsClickable = b.id === 'google-ads' || b.id === 'google-analytics';
      if (aIsClickable !== bIsClickable) return aIsClickable ? -1 : 1;
      
      // Then by name if both have same status
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return 0;
    });

  const isStepValid = (step: number) => {
    switch (step) {
      case 1:
        return setupModal.connectionName && setupModal.connectionName.trim().length > 0;
      case 2:
        return setupModal.selectedAccount && setupModal.selectedProperty;
      case 3:
        return (
          setupModal.selectedTables && 
          setupModal.selectedTables.length > 0 && 
          setupModal.syncInterval
        );
      default:
        return false;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-text-primary">Integrations</h1>
          <p className="mt-1 text-sm lg:text-base text-text-secondary">
            Connect your data sources and start syncing data
          </p>
        </div>

        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search integrations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full lg:w-64 pl-10 pr-4 py-2 bg-[#232830] border border-[#1E2530] rounded-xl text-white placeholder-gray-400 focus:border-accent-blue outline-none"
          />
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-3">
        {/* Category Dropdown */}
        <div className="relative flex-1 lg:flex-none" data-dropdown>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsCategoryDropdownOpen(!isCategoryDropdownOpen);
              setIsStatusDropdownOpen(false);
              setIsSortDropdownOpen(false);
            }}
            className="w-full lg:w-48 px-4 py-2.5 rounded-xl bg-[#232830] border border-[#1E2530] text-white flex items-center justify-between hover:border-accent-blue transition-colors"
          >
            <span className="truncate">{selectedCategory}</span>
            <ChevronDownIcon className={`h-5 w-5 text-text-secondary transition-transform duration-200 ${isCategoryDropdownOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {isCategoryDropdownOpen && (
            <div className="absolute z-10 mt-1 w-full bg-[#232830] border border-[#1E2530] rounded-xl shadow-lg py-1 max-h-64 overflow-y-auto">
              {Object.values(CATEGORIES).map(category => (
                <button
                  key={category}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedCategory(category);
                    setIsCategoryDropdownOpen(false);
                  }}
                  className={`w-full px-4 py-2.5 text-left hover:bg-[#1A1D24] transition-colors ${
                    selectedCategory === category ? 'text-accent-blue bg-accent-blue/10' : 'text-white'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Status Filter */}
        <div className="relative flex-1 lg:flex-none" data-dropdown>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsStatusDropdownOpen(!isStatusDropdownOpen);
              setIsCategoryDropdownOpen(false);
              setIsSortDropdownOpen(false);
            }}
            className="w-full lg:w-48 px-4 py-2.5 rounded-xl bg-[#232830] border border-[#1E2530] text-white flex items-center justify-between hover:border-accent-blue transition-colors"
          >
            <span className="truncate">
              {statusFilter === 'all' ? 'All Status' : 
               statusFilter === 'connected' ? 'Connected' : 'Not Connected'}
            </span>
            <ChevronDownIcon className={`h-5 w-5 text-text-secondary transition-transform duration-200 ${isStatusDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {isStatusDropdownOpen && (
            <div className="absolute z-10 mt-1 w-full bg-[#232830] border border-[#1E2530] rounded-xl shadow-lg py-1">
              {['all', 'connected', 'not_connected'].map((status) => (
                <button
                  key={status}
                  onClick={(e) => {
                    e.stopPropagation();
                    setStatusFilter(status as typeof statusFilter);
                    setIsStatusDropdownOpen(false);
                  }}
                  className={`w-full px-4 py-2.5 text-left hover:bg-[#1A1D24] transition-colors ${
                    statusFilter === status ? 'text-accent-blue bg-accent-blue/10' : 'text-white'
                  }`}
                >
                  {status === 'all' ? 'All Status' : 
                   status === 'connected' ? 'Connected' : 'Not Connected'}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Sort Dropdown */}
        <div className="relative flex-1 lg:flex-none" data-dropdown>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsSortDropdownOpen(!isSortDropdownOpen);
              setIsCategoryDropdownOpen(false);
              setIsStatusDropdownOpen(false);
            }}
            className="w-full lg:w-48 px-4 py-2.5 rounded-xl bg-[#232830] border border-[#1E2530] text-white flex items-center justify-between hover:border-accent-blue transition-colors"
          >
            <span className="truncate">
              Sort by: {sortBy.charAt(0).toUpperCase() + sortBy.slice(1)}
            </span>
            <ChevronDownIcon className={`h-5 w-5 text-text-secondary transition-transform duration-200 ${isSortDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {isSortDropdownOpen && (
            <div className="absolute z-10 mt-1 w-full bg-[#232830] border border-[#1E2530] rounded-xl shadow-lg py-1">
              {['name', 'recent', 'popular'].map((sort) => (
                <button
                  key={sort}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSortBy(sort as typeof sortBy);
                    setIsSortDropdownOpen(false);
                  }}
                  className={`w-full px-4 py-2.5 text-left hover:bg-[#1A1D24] transition-colors ${
                    sortBy === sort ? 'text-accent-blue bg-accent-blue/10' : 'text-white'
                  }`}
                >
                  {sort.charAt(0).toUpperCase() + sort.slice(1)}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        {filteredIntegrations.map((integration) => (
          <IntegrationCard
            key={integration.id}
            integration={integration}
            onConnect={handleConnect}
          />
        ))}
      </div>

      {/* Setup Modal */}
      {setupModal.isOpen && setupModal.integration && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1A1D24] border border-[#1E2530] rounded-xl w-full max-w-3xl max-h-[90vh] overflow-auto">
            {/* Header */}
            <div className="flex items-center justify-between px-6 lg:px-8 py-6 border-b border-[#1E2530]">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-[#232830] rounded-lg p-2">
                  <img
                    src={setupModal.integration.logoUrl}
                    alt={`${setupModal.integration.name} logo`}
                    className="w-full h-full object-contain"
                  />
                </div>
                <h2 className="text-xl lg:text-2xl font-semibold text-white">
                  Set up a data source
                </h2>
              </div>
              <button
                onClick={() => setSetupModal({ isOpen: false })}
                className="text-gray-400 hover:text-white p-2"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 lg:p-8">
              {/* Step Counter */}
              <div className="flex items-center justify-center mb-8">
                {[1, 2, 3].map((step) => (
                  <React.Fragment key={step}>
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors ${
                        currentStep === step
                          ? 'border-accent-blue bg-accent-blue/10 text-accent-blue'
                          : currentStep > step
                          ? 'border-accent-blue bg-accent-blue text-white'
                          : 'border-[#1E2530] text-text-secondary'
                      }`}
                    >
                      {currentStep > step ? (
                        <CheckIcon className="w-5 h-5" />
                      ) : (
                        <span>{step}</span>
                      )}
                    </div>
                    {step < 3 && (
                      <div
                        className={`w-16 lg:w-24 h-0.5 transition-colors ${
                          currentStep > step ? 'bg-accent-blue' : 'bg-[#1E2530]'
                        }`}
                      />
                    )}
                  </React.Fragment>
                ))}
              </div>

              {/* Step Content */}
              <div className="space-y-6">
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">
                        Connection Name
                      </label>
                      <input
                        type="text"
                        value={setupModal.connectionName}
                        onChange={(e) =>
                          setSetupModal((prev) => ({
                            ...prev,
                            connectionName: e.target.value,
                          }))
                        }
                        className="w-full px-4 py-2.5 bg-[#232830] border border-[#1E2530] rounded-lg text-white focus:border-accent-blue outline-none"
                        placeholder="Enter a name for this connection"
                      />
                    </div>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-6">
                    {setupModal.isLoadingAccounts ? (
                      <div className="flex flex-col items-center justify-center py-8">
                        <div className="w-8 h-8 border-2 border-accent-blue border-t-transparent rounded-full animate-spin" />
                        <p className="mt-4 text-sm text-gray-400">
                          Waiting for Google Authentication...
                        </p>
                        <button
                          onClick={() => window.location.reload()}
                          className="mt-4 px-4 py-2 bg-accent-blue text-white rounded-lg hover:bg-accent-blue/90 transition-colors"
                        >
                          Click here to refresh if authentication is complete
                        </button>
                      </div>
                    ) : !setupModal.googleAuth ? (
                      <div className="flex flex-col items-center justify-center py-8">
                        <button
                          onClick={handleSetupConfirm}
                          className="flex items-center space-x-3 px-6 py-3 bg-white text-gray-800 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path
                              fill="currentColor"
                              d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27 3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12c0 5.05 4.13 10 10.22 10 5.35 0 9.25-3.67 9.25-9.09 0-1.15-.15-1.81-.15-1.81z"
                            />
                          </svg>
                          <span className="font-medium">Sign in with Google</span>
                        </button>
                        <p className="mt-4 text-sm text-gray-400">
                          You'll be redirected to Google to authorize access to your Analytics account
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {setupModal.isLoadingAccounts ? (
                          <div className="flex flex-col items-center justify-center py-8">
                            <div className="w-8 h-8 border-2 border-accent-blue border-t-transparent rounded-full animate-spin" />
                            <p className="mt-4 text-sm text-gray-400">
                              Loading your Google Analytics accounts...
                            </p>
                          </div>
                        ) : (
                          <>
                            <div className="space-y-3">
                              <label className="text-base text-gray-400">Select Analytics Account</label>
                              <select
                                value={setupModal.selectedAccount}
                                onChange={(e) => {
                                  const accountId = e.target.value;
                                  setSetupModal(prev => ({
                                    ...prev,
                                    selectedAccount: accountId,
                                    selectedProperty: '',
                                    properties: setupModal.accounts?.find(acc => acc.id === accountId)?.properties || []
                                  }));
                                }}
                                className="w-full px-4 py-3 bg-[#232830] border border-[#1E2530] rounded-lg text-white focus:border-accent-blue outline-none"
                              >
                                <option value="">Select an account</option>
                                {setupModal.accounts?.map(account => (
                                  <option key={account.id} value={account.id}>
                                    {account.name}
                                  </option>
                                ))}
                              </select>
                            </div>

                            {setupModal.selectedAccount && (
                              <div className="space-y-3">
                                <label className="text-base text-gray-400">Select GA4 Property</label>
                                <select
                                  value={setupModal.selectedProperty}
                                  onChange={(e) => {
                                    setSetupModal(prev => ({
                                      ...prev,
                                      selectedProperty: e.target.value
                                    }));
                                  }}
                                  className="w-full px-4 py-3 bg-[#232830] border border-[#1E2530] rounded-lg text-white focus:border-accent-blue outline-none"
                                >
                                  <option value="">Select a property</option>
                                  {setupModal.properties?.map(property => (
                                    <option key={property.id} value={property.id}>
                                      {property.name}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-white mb-4">Configure sync settings</h3>
                      <p className="text-sm text-gray-400 mb-6">
                        Choose how often you want to sync data from your source
                      </p>
                    </div>

                    {/* Sync Interval */}
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { value: 'daily', label: 'Every day' },
                        { value: '12hours', label: 'Every 12 hours' },
                        { value: '6hours', label: 'Every 6 hours' },
                        { value: '3hours', label: 'Every 3 hours' },
                        { value: 'hourly', label: 'Every hour' },
                        { value: '30minutes', label: 'Every 30 minutes' },
                        { value: '10minutes', label: 'Every 10 minutes' },
                        { value: '5minutes', label: 'Every 5 minutes' }
                      ].map(interval => (
                        <button
                          key={interval.value}
                          onClick={() => setSetupModal(prev => ({
                            ...prev,
                            syncInterval: interval.value
                          }))}
                          className={`
                            p-4 rounded-lg border text-left transition-colors
                            ${setupModal.syncInterval === interval.value
                              ? 'border-accent-blue bg-accent-blue/10 text-white'
                              : 'border-[#1E2530] text-gray-400 hover:border-accent-blue/50'
                            }
                          `}
                        >
                          {interval.label}
                        </button>
                      ))}
                    </div>

                    {/* Sync Schedule Info */}
                    <div className="bg-[#232830] rounded-lg p-4">
                      <h4 className="text-sm font-medium text-white mb-2">Will sync now and update data:</h4>
                      <p className="text-sm text-gray-400">
                        At {setupModal.syncStartTime || '00:00'}, {
                          setupModal.syncInterval === 'daily' ? 'every day' :
                          setupModal.syncInterval === '12hours' ? 'every 12 hours' :
                          setupModal.syncInterval === '6hours' ? 'every 6 hours' :
                          setupModal.syncInterval === '3hours' ? 'every 3 hours' :
                          setupModal.syncInterval === 'hourly' ? 'every hour' :
                          setupModal.syncInterval === '30minutes' ? 'every 30 minutes' :
                          setupModal.syncInterval === '10minutes' ? 'every 10 minutes' :
                          'every 5 minutes'
                        } (UTC)
                      </p>
                    </div>

                    {/* Destination Schema */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-400">
                        Destination schema name
                        <span className="ml-1 inline-block" title="The schema where your data will be stored">
                          ℹ️
                        </span>
                      </label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={setupModal.destinationSchema || setupModal.integration?.id.toLowerCase()}
                          onChange={(e) => setSetupModal(prev => ({
                            ...prev,
                            destinationSchema: e.target.value
                          }))}
                          className="flex-1 px-4 py-2.5 bg-[#232830] border border-[#1E2530] rounded-lg text-white focus:border-accent-blue outline-none"
                          placeholder="Enter schema name"
                        />
                        <button
                          onClick={() => {}} // Add edit functionality if needed
                          className="px-4 py-2.5 text-accent-blue hover:text-accent-blue/80 transition-colors"
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-between px-6 lg:px-8 py-6 border-t border-[#1E2530]">
              {currentStep > 1 && (
                <button
                  onClick={() => setCurrentStep(prev => prev - 1)}
                  className="px-6 py-3 text-base text-gray-400 hover:text-white transition-colors"
                >
                  Back
                </button>
              )}
              <button
                onClick={() => {
                  if (currentStep < 3) {
                    setCurrentStep(prev => prev + 1);
                  } else {
                    handleSetupConfirm();
                  }
                }}
                disabled={!isStepValid(currentStep)}
                className={`px-6 py-3 rounded-lg text-base font-medium ${
                  isStepValid(currentStep)
                    ? 'bg-accent-blue text-white hover:bg-accent-blue/90'
                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                } transition-colors`}
              >
                {currentStep === 3 ? 'Create sync' : 'Next'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Table Settings Modal */}
      {tableSettingsModal.isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
          <div className="bg-[#1A1D24] border border-[#1E2530] rounded-xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#1E2530]">
              <h3 className="text-lg font-medium text-white">Table Settings</h3>
              <button
                onClick={() => setTableSettingsModal(prev => ({ ...prev, isOpen: false }))}
                className="text-gray-400 hover:text-white"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-3">
                <label className="text-sm text-gray-400">Sync Options</label>
                {SYNC_OPTIONS.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => {
                      setTableSettingsModal(prev => ({ ...prev, syncOption: option.id }));
                      setSetupModal(prev => ({
                        ...prev,
                        selectedTables: prev.selectedTables?.map(t => 
                          t === tableSettingsModal.tableId
                            ? { ...t, syncOption: option.id }
                            : t
                        )
                      }));
                    }}
                    className={`w-full px-4 py-3 text-left rounded-lg border ${
                      tableSettingsModal.syncOption === option.id
                        ? 'border-accent-blue bg-accent-blue/10 text-white'
                        : 'border-[#1E2530] text-gray-400 hover:border-accent-blue/50'
                    }`}
                  >
                    {option.name}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex justify-end px-6 py-4 border-t border-[#1E2530]">
              <button
                onClick={() => setTableSettingsModal(prev => ({ ...prev, isOpen: false }))}
                className="px-4 py-2 bg-accent-blue text-white rounded-lg hover:bg-accent-blue/90 transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sync Setup Modal */}
      {syncSetupModal.isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
          <div className="bg-[#1A1D24] border border-[#1E2530] rounded-xl w-full max-w-2xl" style={{ maxHeight: 'calc(100vh - 2rem)' }}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#1E2530]">
              <h3 className="text-lg font-medium text-white">Configure Sync Settings</h3>
              <button
                onClick={() => setSyncSetupModal(prev => ({ ...prev, isOpen: false }))}
                className="text-gray-400 hover:text-white"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-6 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 10rem)' }}>
              {/* Sync Strategy */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-400">Sync Strategy</label>
                <select
                  value={syncSetupModal.config.mode}
                  onChange={(e) => {
                    setSyncSetupModal(prev => ({
                      ...prev,
                      config: { ...prev.config, mode: e.target.value as 'MERGE' | 'APPEND' | 'REPLACE' }
                    }));
                  }}
                  className="w-full px-4 py-2.5 bg-[#232830] border border-[#1E2530] rounded-lg text-white focus:border-accent-blue outline-none"
                >
                  <option value="MERGE">Smart Update (Recommended)</option>
                  <option value="APPEND">Add New Only</option>
                  <option value="REPLACE">Full Replace</option>
                </select>
                <p className="text-sm text-gray-400">
                  {syncSetupModal.config.mode === 'MERGE' && 'Intelligently updates existing records while adding new ones'}
                  {syncSetupModal.config.mode === 'APPEND' && 'Only adds new records without modifying existing data'}
                  {syncSetupModal.config.mode === 'REPLACE' && 'Replaces entire dataset with each sync'}
                </p>
              </div>

              {/* Unique Identifier */}
              {syncSetupModal.config.mode === 'MERGE' && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-400">Unique Identifier</label>
                  <select
                    value={syncSetupModal.config.primaryKey}
                    onChange={(e) => {
                      setSyncSetupModal(prev => ({
                        ...prev,
                        config: { ...prev.config, primaryKey: e.target.value }
                      }));
                    }}
                    className="w-full px-4 py-2.5 bg-[#232830] border border-[#1E2530] rounded-lg text-white focus:border-accent-blue outline-none"
                  >
                    <option value="">Select identifier field...</option>
                    {/* Add schema fields here */}
                  </select>
                  <p className="text-sm text-gray-400">Field that uniquely identifies each record</p>
                </div>
              )}

              {/* Update Tracker */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-400">Update Tracker</label>
                <select
                  value={syncSetupModal.config.cursorField}
                  onChange={(e) => {
                    setSyncSetupModal(prev => ({
                      ...prev,
                      config: { ...prev.config, cursorField: e.target.value }
                    }));
                  }}
                  className="w-full px-4 py-2.5 bg-[#232830] border border-[#1E2530] rounded-lg text-white focus:border-accent-blue outline-none"
                >
                  <option value="">Select tracking field...</option>
                  {/* Add timestamp/date fields here */}
                </select>
                <p className="text-sm text-gray-400">
                  Timestamp or sequential field to track data updates
                </p>
              </div>

              {/* Sync Frequency */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-400">Sync Frequency</label>
                <select
                  value={syncSetupModal.config.syncInterval}
                  onChange={(e) => {
                    setSyncSetupModal(prev => ({
                      ...prev,
                      config: { ...prev.config, syncInterval: e.target.value }
                    }));
                  }}
                  className="w-full px-4 py-2.5 bg-[#232830] border border-[#1E2530] rounded-lg text-white focus:border-accent-blue outline-none"
                >
                  <option value="hourly">Every hour</option>
                  <option value="6hours">Every 6 hours</option>
                  <option value="12hours">Every 12 hours</option>
                  <option value="daily">Once per day</option>
                  <option value="custom">Custom schedule</option>
                </select>
              </div>

              {/* Advanced Options */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-400">Advanced Options</h4>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-white font-medium">Complete Refresh</h4>
                    <p className="text-sm text-gray-400">Sync entire dataset each time</p>
                  </div>
                  <button
                    onClick={() => {
                      setSyncSetupModal(prev => ({
                        ...prev,
                        config: { 
                          ...prev.config, 
                          isFullSync: !prev.config.isFullSync,
                          fullSyncSchedule: !prev.config.isFullSync ? 'always' : undefined
                        }
                      }));
                    }}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      syncSetupModal.config.isFullSync ? 'bg-accent-blue' : 'bg-[#232830]'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        syncSetupModal.config.isFullSync ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {!syncSetupModal.config.isFullSync && (
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-white font-medium">Daily Complete Refresh</h4>
                      <p className="text-sm text-gray-400">Run complete refresh at midnight</p>
                    </div>
                    <button
                      onClick={() => {
                        setSyncSetupModal(prev => ({
                          ...prev,
                          config: { 
                            ...prev.config,
                            fullSyncSchedule: prev.config.fullSyncSchedule === 'midnight' ? undefined : 'midnight'
                          }
                        }));
                      }}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        syncSetupModal.config.fullSyncSchedule === 'midnight' ? 'bg-accent-blue' : 'bg-[#232830]'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          syncSetupModal.config.fullSyncSchedule === 'midnight' ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-white font-medium">Data Protection</h4>
                    <p className="text-sm text-gray-400">Prevent unintended data loss</p>
                  </div>
                  <button
                    onClick={() => {
                      setSyncSetupModal(prev => ({
                        ...prev,
                        config: { ...prev.config, isProtected: !prev.config.isProtected }
                      }));
                    }}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      syncSetupModal.config.isProtected ? 'bg-accent-blue' : 'bg-[#232830]'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        syncSetupModal.config.isProtected ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-between px-6 py-4 border-t border-[#1E2530]">
              <button
                onClick={() => setSyncSetupModal(prev => ({ ...prev, isOpen: false }))}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setSetupModal(prev => ({
                    ...prev,
                    syncSetup: {
                      ...prev.syncSetup,
                      [syncSetupModal.tableId]: syncSetupModal.config
                    }
                  }));
                  setSyncSetupModal(prev => ({ ...prev, isOpen: false }));
                }}
                className="px-4 py-2 bg-accent-blue text-white rounded-lg hover:bg-accent-blue/90 transition-colors"
              >
                Save Configuration
              </button>
            </div>
          </div>
        </div>
      )}

      {showCompletion && completedDataSource && (
        <CompletionAnimation
          onClose={() => {
            setShowCompletion(false);
            setSetupModal(prev => ({ ...prev, isOpen: false }));
            // Optionally refresh the integrations list
            // fetchIntegrations();
          }}
          dataSource={completedDataSource}
        />
      )}
    </div>
  );
} 

