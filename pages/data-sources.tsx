import React, { useState } from 'react';
import { ChevronDownIcon, ChevronRightIcon, CogIcon, TrashIcon } from '@heroicons/react/24/outline';

interface DataSource {
  id: string;
  name: string;
  type: string;
  status: 'active' | 'error' | 'syncing';
  lastSync: string;
  tables: Table[];
}

interface Table {
  id: string;
  name: string;
  syncOption: string;
  schema: SchemaField[];
  lastSync: string;
  rowCount: number;
}

interface SchemaField {
  name: string;
  type: string;
  description?: string;
}

// Mock data - replace with actual API call
const MOCK_DATA_SOURCES: DataSource[] = [
  {
    id: '1',
    name: 'Main Analytics',
    type: 'Google Analytics',
    status: 'active',
    lastSync: '2024-01-20T10:30:00Z',
    tables: [
      {
        id: 'audience_overview',
        name: 'Audience Overview',
        syncOption: 'always_full',
        lastSync: '2024-01-20T10:30:00Z',
        rowCount: 15420,
        schema: [
          { name: 'date', type: 'date', description: 'The date of the record' },
          { name: 'users', type: 'integer', description: 'Number of users' },
          { name: 'new_users', type: 'integer', description: 'Number of new users' },
          { name: 'sessions', type: 'integer', description: 'Number of sessions' }
        ]
      },
      {
        id: 'campaign_performance',
        name: 'Campaign Performance',
        syncOption: 'use_setting',
        lastSync: '2024-01-20T10:30:00Z',
        rowCount: 8932,
        schema: [
          { name: 'campaign_id', type: 'string', description: 'Campaign identifier' },
          { name: 'campaign_name', type: 'string', description: 'Campaign name' },
          { name: 'impressions', type: 'integer', description: 'Number of impressions' },
          { name: 'clicks', type: 'integer', description: 'Number of clicks' }
        ]
      }
    ]
  }
];

export default function DataSourcesPage() {
  const [expandedSource, setExpandedSource] = useState<string | null>(null);
  const [expandedTable, setExpandedTable] = useState<string | null>(null);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusColor = (status: DataSource['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'error':
        return 'bg-red-500';
      case 'syncing':
        return 'bg-blue-500 animate-pulse';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-text-primary">Data Sources</h1>
          <p className="mt-1 text-sm lg:text-base text-text-secondary">
            Manage your connected data sources and view their schemas
          </p>
        </div>
      </div>

      {/* Data Sources List */}
      <div className="space-y-4">
        {MOCK_DATA_SOURCES.map((source) => (
          <div key={source.id} className="bg-[#1A1D24] border border-[#1E2530] rounded-xl overflow-hidden">
            {/* Source Header */}
            <div 
              className="flex items-center justify-between px-6 py-4 cursor-pointer hover:bg-[#232830] transition-colors"
              onClick={() => setExpandedSource(expandedSource === source.id ? null : source.id)}
            >
              <div className="flex items-center space-x-4">
                <div className={`w-2 h-2 rounded-full ${getStatusColor(source.status)}`} />
                <div>
                  <h3 className="text-lg font-medium text-white">{source.name}</h3>
                  <p className="text-sm text-gray-400">{source.type}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-400">
                  Last sync: {formatDate(source.lastSync)}
                </span>
                {expandedSource === source.id ? (
                  <ChevronDownIcon className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronRightIcon className="w-5 h-5 text-gray-400" />
                )}
              </div>
            </div>

            {/* Tables List */}
            {expandedSource === source.id && (
              <div className="border-t border-[#1E2530]">
                {source.tables.map((table) => (
                  <div key={table.id} className="border-b border-[#1E2530] last:border-b-0">
                    {/* Table Header */}
                    <div 
                      className="flex items-center justify-between px-6 py-4 hover:bg-[#232830] transition-colors cursor-pointer"
                      onClick={() => setExpandedTable(expandedTable === table.id ? null : table.id)}
                    >
                      <div className="flex items-center space-x-4">
                        {expandedTable === table.id ? (
                          <ChevronDownIcon className="w-5 h-5 text-gray-400" />
                        ) : (
                          <ChevronRightIcon className="w-5 h-5 text-gray-400" />
                        )}
                        <div>
                          <h4 className="text-white font-medium">{table.name}</h4>
                          <p className="text-sm text-gray-400">
                            {table.rowCount.toLocaleString()} rows • Last sync: {formatDate(table.lastSync)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-[#1A1D24] transition-colors">
                          <CogIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    {/* Schema */}
                    {expandedTable === table.id && (
                      <div className="px-6 py-4 bg-[#232830]">
                        <div className="space-y-2">
                          <h5 className="text-sm font-medium text-gray-400">Schema</h5>
                          <div className="overflow-x-auto">
                            <table className="min-w-full">
                              <thead>
                                <tr>
                                  <th className="text-left text-sm font-medium text-gray-400 py-2">Field</th>
                                  <th className="text-left text-sm font-medium text-gray-400 py-2">Type</th>
                                  <th className="text-left text-sm font-medium text-gray-400 py-2">Description</th>
                                </tr>
                              </thead>
                              <tbody>
                                {table.schema.map((field) => (
                                  <tr key={field.name} className="border-t border-[#1E2530]">
                                    <td className="py-2 text-sm text-white">{field.name}</td>
                                    <td className="py-2 text-sm text-gray-400">{field.type}</td>
                                    <td className="py-2 text-sm text-gray-400">{field.description}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 