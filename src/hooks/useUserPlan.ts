import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { DatabaseService } from '../lib/database';
import { UserSubscription } from '../types/database';

export const useUserPlan = () => {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [planType, setPlanType] = useState<'free' | 'premium'>('free');

  useEffect(() => {
    const fetchUserPlan = async () => {
      if (!user) {
        setSubscription(null);
        setPlanType('free');
        setLoading(false);
        return;
      }

      try {
        const userSubscription = await DatabaseService.getUserActiveSubscription(user.id);
        setSubscription(userSubscription);
        setPlanType(userSubscription ? 'premium' : 'free');
      } catch (error) {
        console.error('Erro ao buscar plano do usuário:', error);
        setSubscription(null);
        setPlanType('free');
      } finally {
        setLoading(false);
      }
    };

    fetchUserPlan();
  }, [user]);

  return {
    subscription,
    planType,
    loading,
    isPremium: planType === 'premium',
    isFree: planType === 'free'
  };
};