import React from 'react';
import { useUserPlan } from '../hooks/useUserPlan';
import { useAuth } from '../contexts/AuthContext';
import { DatabaseService } from '../lib/database';
import { Loader2, AlertCircle } from 'lucide-react';

// Componente para a barra de progresso visual
const ProgressBar: React.FC<{ value: number; max: number }> = ({
  value,
  max,
}) => {
  const percentage = max > 0 ? (value / max) * 100 : 0;
  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
      <div
        className="bg-blue-600 h-2.5 rounded-full"
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );
};

export const UsageCounter: React.FC = () => {
  const { user } = useAuth();
  const { plan, isLoading: isPlanLoading, error: planError } = useUserPlan();
  const [usage, setUsage] = React.useState(0);
  const [isLoadingUsage, setIsLoadingUsage] = React.useState(true);

  React.useEffect(() => {
    if (user) {
      setIsLoadingUsage(true);
      const today = new Date().toISOString().split('T')[0];

      DatabaseService.getDailyUsage(user.id, today)
        .then(setUsage)
        .catch(console.error)
        .finally(() => setIsLoadingUsage(false));
    }
  }, [user]);

  const isLoading = isPlanLoading || isLoadingUsage;

  if (isLoading) {
    return (
      <div className="flex items-center text-gray-500">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        <span>A verificar o seu uso...</span>
      </div>
    );
  }

  if (planError) {
    return (
      <div className="flex items-center text-red-600">
        <AlertCircle className="mr-2 h-4 w-4" />
        <span>Não foi possível carregar o uso.</span>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-gray-600">
          Extrações Hoje: {usage} de {plan?.daily_limit ?? 0}
        </span>
        <span className="text-xs font-semibold text-blue-800 bg-blue-100 px-2 py-1 rounded-full">
          {plan?.name ?? 'Plano não encontrado'}
        </span>
      </div>
      <ProgressBar value={usage} max={plan?.daily_limit ?? 0} />
    </div>
  );
};