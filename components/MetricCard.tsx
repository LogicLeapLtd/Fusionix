import { ArrowTrendingUpIcon, ArrowTrendingDownIcon } from '@heroicons/react/24/outline';

interface MetricCardProps {
  title: string;
  value: string | number;
  changePercentage: number;
  comparisonText?: string;
  className?: string;
}

export const MetricCard = ({ 
  title, 
  value, 
  changePercentage, 
  comparisonText = 'vs last month',
  className = ''
}: MetricCardProps) => {
  const isPositive = changePercentage > 0;
  const changeText = `${isPositive ? '+' : ''}${changePercentage}%`;

  return (
    <div className={`relative bg-background-darker rounded-xl border border-[#1E2530] p-6 ${className}`}>
      <div className="flex flex-col">
        <div className="flex items-center justify-between mb-2">
          <span className="text-text-secondary">{title}</span>
          <div className={`flex items-center text-sm ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
            {isPositive ? (
              <ArrowTrendingUpIcon className="w-4 h-4 mr-1" />
            ) : (
              <ArrowTrendingDownIcon className="w-4 h-4 mr-1" />
            )}
            {changeText}
          </div>
        </div>
        <div className="text-3xl font-bold text-text-primary mb-1">
          {value}
        </div>
        <span className="text-sm text-text-secondary">
          {comparisonText}
        </span>
      </div>
    </div>
  );
}; 