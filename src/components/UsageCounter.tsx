import React from 'react';

type UsageCounterProps = {
  current: number;
  limit: number;
  planType?: 'free' | 'premium';
};

export const UsageCounter: React.FC<UsageCounterProps> = ({ 
  current, 
  limit, 
  planType = 'free' 
}) => {
  const percentage = Math.min((current / limit) * 100, 100);
  const isUnlimited = limit > 1000;
  
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-gray-600">
          Extrações Hoje: <span className="font-medium">
            {isUnlimited ? current : `${current} de ${limit}`}
          </span>
        </span>
        <span className="text-xs text-gray-500 capitalize">
          Plano {planType === 'free' ? 'Gratuito' : 'Premium'}
        </span>
      </div>
      
      {!isUnlimited && (
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full ${
              percentage < 50 ? 'bg-green-500' : 
              percentage < 100 ? 'bg-amber-500' : 
              'bg-red-500'
            }`} 
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      )}
      
      {isUnlimited && (
        <div className="text-xs text-green-600 font-medium">
          ✨ Extrações ilimitadas
        </div>
      )}
    </div>
  );
};