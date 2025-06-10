import { useState, useEffect } from 'react';
import { DatabaseService } from '../lib/database';
import { Plan } from '../types/database';

export const usePlans = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Buscando planos...');
        
        const data = await DatabaseService.getActivePlans();
        console.log('Planos encontrados:', data);
        
        setPlans(data);
      } catch (err) {
        console.error('Erro ao buscar planos:', err);
        setError('Erro ao carregar planos');
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const freePlan = plans.find(plan => plan.price === 0);
  const premiumPlans = plans.filter(plan => plan.price > 0);

  console.log('Hook usePlans:', { plans, freePlan, premiumPlans, loading, error });

  return { 
    plans, 
    freePlan, 
    premiumPlans, 
    loading, 
    error 
  };
};