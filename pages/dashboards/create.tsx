import { useState } from 'react';
import { MetricCard } from '../../components/MetricCard';
import { PlusIcon, ArrowsPointingOutIcon, TrashIcon } from '@heroicons/react/24/outline';

interface DashboardMetric {
  id: string;
  title: string;
  value: string | number;
  changePercentage: number;
  size: 'normal' | 'wide' | 'tall';
}

export default function CreateDashboard() {
  const [dashboardName, setDashboardName] = useState('');
  const [metrics, setMetrics] = useState<DashboardMetric[]>([]);
  const [isAddingMetric, setIsAddingMetric] = useState(false);
  const [newMetric, setNewMetric] = useState<Partial<DashboardMetric>>({
    title: '',
    value: '',
    changePercentage: 0,
    size: 'normal'
  });

  const handleAddMetric = () => {
    if (newMetric.title && newMetric.value !== undefined) {
      setMetrics([...metrics, {
        id: Math.random().toString(36).substr(2, 9),
        title: newMetric.title,
        value: newMetric.value,
        changePercentage: newMetric.changePercentage || 0,
        size: newMetric.size || 'normal'
      }]);
      setNewMetric({ title: '', value: '', changePercentage: 0, size: 'normal' });
      setIsAddingMetric(false);
    }
  };

  const handleSaveDashboard = async () => {
    try {
      const response = await fetch('/api/dashboards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: dashboardName,
          metrics
        })
      });
      
      if (response.ok) {
        // Handle successful save
        window.location.href = '/dashboard';
      }
    } catch (error) {
      console.error('Failed to save dashboard:', error);
    }
  };

  return (
    <div className="w-full h-full overflow-hidden">
      <div className="px-4 py-6 h-full overflow-y-auto">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-text-primary">Create Dashboard</h1>
              <p className="text-text-secondary mt-1">
                Design your custom dashboard with metrics that matter to you.
              </p>
            </div>
            <button
              onClick={handleSaveDashboard}
              className="px-4 py-2 bg-accent-blue text-white rounded-lg hover:bg-accent-blue/90 transition-colors"
            >
              Save Dashboard
            </button>
          </div>

          {/* Dashboard Name */}
          <div>
            <input
              type="text"
              placeholder="Dashboard Name"
              value={dashboardName}
              onChange={(e) => setDashboardName(e.target.value)}
              className="w-full px-4 py-2 bg-background-darker border border-[#1E2530] rounded-lg text-text-primary focus:outline-none focus:border-accent-blue"
            />
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {metrics.map((metric) => (
              <div key={metric.id} className="relative group">
                <MetricCard
                  title={metric.title}
                  value={metric.value}
                  changePercentage={metric.changePercentage}
                  className={metric.size === 'wide' ? 'md:col-span-2' : metric.size === 'tall' ? 'row-span-2' : ''}
                />
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => setMetrics(metrics.filter(m => m.id !== metric.id))}
                    className="p-1 hover:bg-red-500/10 rounded"
                  >
                    <TrashIcon className="w-4 h-4 text-red-500" />
                  </button>
                  <button
                    onClick={() => {
                      setMetrics(metrics.map(m => 
                        m.id === metric.id 
                          ? { ...m, size: m.size === 'normal' ? 'wide' : 'normal' }
                          : m
                      ));
                    }}
                    className="p-1 hover:bg-accent-blue/10 rounded ml-1"
                  >
                    <ArrowsPointingOutIcon className="w-4 h-4 text-accent-blue" />
                  </button>
                </div>
              </div>
            ))}

            {/* Add Metric Button */}
            <button
              onClick={() => setIsAddingMetric(true)}
              className="h-[200px] border-2 border-dashed border-[#1E2530] rounded-xl flex items-center justify-center hover:border-accent-blue transition-colors"
            >
              <PlusIcon className="w-8 h-8 text-text-secondary" />
            </button>
          </div>

          {/* Add Metric Modal */}
          {isAddingMetric && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
              <div className="bg-background-darker p-6 rounded-xl w-full max-w-md">
                <h2 className="text-xl font-bold text-text-primary mb-4">Add Metric</h2>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Metric Title"
                    value={newMetric.title}
                    onChange={(e) => setNewMetric({ ...newMetric, title: e.target.value })}
                    className="w-full px-4 py-2 bg-background border border-[#1E2530] rounded-lg text-text-primary"
                  />
                  <input
                    type="text"
                    placeholder="Value"
                    value={newMetric.value}
                    onChange={(e) => setNewMetric({ ...newMetric, value: e.target.value })}
                    className="w-full px-4 py-2 bg-background border border-[#1E2530] rounded-lg text-text-primary"
                  />
                  <input
                    type="number"
                    placeholder="Change Percentage"
                    value={newMetric.changePercentage}
                    onChange={(e) => setNewMetric({ ...newMetric, changePercentage: parseFloat(e.target.value) })}
                    className="w-full px-4 py-2 bg-background border border-[#1E2530] rounded-lg text-text-primary"
                  />
                  <select
                    value={newMetric.size}
                    onChange={(e) => setNewMetric({ ...newMetric, size: e.target.value as 'normal' | 'wide' | 'tall' })}
                    className="w-full px-4 py-2 bg-background border border-[#1E2530] rounded-lg text-text-primary"
                  >
                    <option value="normal">Normal Size</option>
                    <option value="wide">Wide</option>
                    <option value="tall">Tall</option>
                  </select>
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => setIsAddingMetric(false)}
                      className="px-4 py-2 text-text-secondary hover:text-text-primary transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddMetric}
                      className="px-4 py-2 bg-accent-blue text-white rounded-lg hover:bg-accent-blue/90 transition-colors"
                    >
                      Add Metric
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 