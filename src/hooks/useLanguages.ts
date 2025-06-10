import { useState, useEffect } from 'react';
import { DatabaseService } from '../lib/database';
import { Language } from '../types/database';

export const useLanguages = (planType: 'free' | 'premium' = 'free') => {
  const [languages, setLanguages] = useState<Language[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        setLoading(true);
        setError(null);
        
        let data: Language[];
        if (planType === 'premium') {
          // Premium: todos os idiomas
          data = await DatabaseService.getAllLanguages();
        } else {
          // Free: apenas idiomas não premium
          data = await DatabaseService.getLanguagesByPlan(false);
        }
        
        setLanguages(data);
      } catch (err) {
        console.error('Erro ao buscar idiomas:', err);
        setError('Erro ao carregar idiomas');
      } finally {
        setLoading(false);
      }
    };

    fetchLanguages();
  }, [planType]);

  return { languages, loading, error };
};