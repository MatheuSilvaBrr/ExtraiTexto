import { supabase } from './supabase';
import { Plan, Language, UserSubscription, UsageLog } from '../types/database';

export class DatabaseService {
  // Planos
  static async getActivePlans(): Promise<Plan[]> {
    const { data, error } = await supabase
      .from('plans')
      .select('*')
      .eq('is_active', true)
      .order('price');

    if (error) {
      console.error('Erro ao buscar planos:', error);
      throw error;
    }
    return data || [];
  }

  static async getPlanById(id: string): Promise<Plan | null> {
    const { data, error } = await supabase
      .from('plans')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Erro ao buscar plano:', error);
      throw error;
    }
    return data;
  }

  // Idiomas
  static async getAllLanguages(): Promise<Language[]> {
    const { data, error } = await supabase
      .from('languages')
      .select('*')
      .order('name');

    if (error) {
      console.error('Erro ao buscar idiomas:', error);
      throw error;
    }
    return data || [];
  }

  static async getLanguagesByPlan(isPremium: boolean): Promise<Language[]> {
    const { data, error } = await supabase
      .from('languages')
      .select('*')
      .eq('is_premium', isPremium ? true : false)
      .order('name');

    if (error) {
      console.error('Erro ao buscar idiomas por plano:', error);
      throw error;
    }
    return data || [];
  }

  static async getLanguageByCode(code: string): Promise<Language | null> {
    const { data, error } = await supabase
      .from('languages')
      .select('*')
      .eq('code', code)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Erro ao buscar idioma:', error);
      throw error;
    }
    return data;
  }

  // Assinaturas
  static async getUserActiveSubscription(userId: string): Promise<UserSubscription | null> {
    const { data, error } = await supabase
      .from('user_subscriptions')
      .select(`
        *,
        plan:plans(*)
      `)
      .eq('user_id', userId)
      .eq('status', 'active')
      .gte('current_period_end', new Date().toISOString())
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Erro ao buscar assinatura:', error);
      throw error;
    }
    return data;
  }

  static async createSubscription(subscription: Omit<UserSubscription, 'id' | 'created_at' | 'updated_at'>): Promise<UserSubscription> {
    const { data, error } = await supabase
      .from('user_subscriptions')
      .insert(subscription)
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar assinatura:', error);
      throw error;
    }
    return data;
  }

  // Logs de uso
  static async getDailyUsage(userId: string, date: string): Promise<number> {
    const { data, error } = await supabase
      .from('usage_logs')
      .select('request_count')
      .eq('user_id', userId)
      .eq('date', date);

    if (error) {
      console.error('Erro ao buscar uso diário:', error);
      throw error;
    }
    
    return data?.reduce((total, log) => total + log.request_count, 0) || 0;
  }

  static async incrementUsage(userId: string, languageId: string): Promise<void> {
    const today = new Date().toISOString().split('T')[0];
    
    // Tentar atualizar registro existente
    const { data: existing } = await supabase
      .from('usage_logs')
      .select('*')
      .eq('user_id', userId)
      .eq('language_id', languageId)
      .eq('date', today)
      .single();

    if (existing) {
      // Incrementar contador existente
      const { error } = await supabase
        .from('usage_logs')
        .update({ request_count: existing.request_count + 1 })
        .eq('id', existing.id);

      if (error) {
        console.error('Erro ao incrementar uso:', error);
        throw error;
      }
    } else {
      // Criar novo registro
      const { error } = await supabase
        .from('usage_logs')
        .insert({
          user_id: userId,
          language_id: languageId,
          request_count: 1,
          date: today
        });

      if (error) {
        console.error('Erro ao criar log de uso:', error);
        throw error;
      }
    }
  }

  static async getUserUsageLogs(userId: string, limit = 30): Promise<UsageLog[]> {
    const { data, error } = await supabase
      .from('usage_logs')
      .select(`
        *,
        language:languages(*)
      `)
      .eq('user_id', userId)
      .order('date', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Erro ao buscar logs de uso:', error);
      throw error;
    }
    return data || [];
  }

  // Verificações de acesso
  static async canUserUseLanguage(userId: string, languageCode: string): Promise<boolean> {
    // Buscar idioma
    const language = await this.getLanguageByCode(languageCode);
    if (!language) return false;

    // Se não é premium, pode usar
    if (!language.is_premium) return true;

    // Se é premium, verificar se usuário tem assinatura ativa
    const subscription = await this.getUserActiveSubscription(userId);
    return subscription !== null;
  }

  static async hasReachedDailyLimit(userId: string): Promise<boolean> {
    const subscription = await this.getUserActiveSubscription(userId);
    const today = new Date().toISOString().split('T')[0];
    const dailyUsage = await this.getDailyUsage(userId, today);

    // Se tem assinatura ativa, verificar limite do plano
    if (subscription?.plan) {
      return dailyUsage >= subscription.plan.daily_limit;
    }

    // Usuário sem assinatura - buscar plano gratuito
    const plans = await this.getActivePlans();
    const freePlan = plans.find(plan => plan.price === 0);
    
    if (!freePlan) return true; // Se não há plano gratuito, bloquear
    
    return dailyUsage >= freePlan.daily_limit;
  }

  static async getUserPlanType(userId: string): Promise<'free' | 'premium'> {
    const subscription = await this.getUserActiveSubscription(userId);
    return subscription ? 'premium' : 'free';
  }
}