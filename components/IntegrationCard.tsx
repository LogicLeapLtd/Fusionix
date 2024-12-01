import { Integration } from '../types/integration';

interface IntegrationCardProps {
  integration: Integration;
  onConnect: (id: string) => void;
}

export const IntegrationCard = ({ integration, onConnect }: IntegrationCardProps) => {
  const isClickable = integration.id === 'google-ads' || integration.id === 'google-analytics';
  const isComingSoon = !isClickable;

  return (
    <div 
      className={`
        relative bg-background-darker rounded-xl border transition-all duration-200
        ${isClickable 
          ? 'border-accent-blue hover:border-accent-blue/80 cursor-pointer' 
          : 'border-[#1E2530] cursor-not-allowed opacity-75'
        }
        p-4 lg:p-6
      `}
      onClick={() => isClickable && onConnect(integration.id)}
    >
      <div className="flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 lg:w-10 lg:h-10 bg-background rounded-lg p-2">
              <img
                src={integration.logoUrl}
                alt={`${integration.name} logo`}
                className="w-full h-full object-contain"
              />
            </div>
            <h3 className="text-base lg:text-lg font-semibold text-text-primary">
              {integration.name}
            </h3>
          </div>
          {isComingSoon && (
            <span className="text-xs lg:text-sm text-text-secondary">Coming Soon</span>
          )}
        </div>
        <p className="text-xs lg:text-sm text-text-secondary mb-4">
          {integration.description}
        </p>
        <button
          className={`
            w-full py-2 lg:py-2.5 px-4 rounded-lg font-medium transition-colors text-sm lg:text-base
            ${isClickable 
              ? 'bg-accent-blue text-white hover:bg-accent-blue/90' 
              : 'bg-background text-text-secondary cursor-not-allowed'
            }
          `}
          disabled={!isClickable}
        >
          Connect
        </button>
      </div>
    </div>
  );
}; 