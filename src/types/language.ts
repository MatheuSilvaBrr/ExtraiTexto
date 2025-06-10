// Mantendo apenas para compatibilidade com código existente
export type UserPlan = 'free' | 'premium';

// Funções de localStorage para fallback quando usuário não está logado
export const getDailyUsageKey = () => {
  const today = new Date().toLocaleDateString();
  return `extraitexto_daily_usage_${today}`;
};

export const getDailyUsage = (): number => {
  const key = getDailyUsageKey();
  return parseInt(localStorage.getItem(key) || '0', 10);
};

export const incrementDailyUsage = (): void => {
  const key = getDailyUsageKey();
  const currentUsage = getDailyUsage();
  localStorage.setItem(key, (currentUsage + 1).toString());
};

export const hasReachedDailyLimit = (userPlan: UserPlan): boolean => {
  if (userPlan === 'premium') return false;
  return getDailyUsage() >= 3;
};