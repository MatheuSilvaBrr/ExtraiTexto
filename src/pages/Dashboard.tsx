import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useUserPlan } from '../hooks/useUserPlan';
import { DatabaseService } from '../lib/database';
import {
  Loader2,
  AlertCircle,
  LogOut,
  FileText,
  Upload,
  BarChart3,
  Crown,
  Calendar,
  TrendingUp,
  Zap,
  Star,
  ArrowRight,
  Activity,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const { planType, subscription, loading: planLoading } = useUserPlan();
  const [dailyUsage, setDailyUsage] = useState(0);
  const [dailyLimit, setDailyLimit] = useState(3);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      if (!user) return;

      try {
        const today = new Date().toISOString().split('T')[0];
        const usage = await DatabaseService.getDailyUsage(user.id, today);
        setDailyUsage(usage);

        if (subscription?.plan) {
          setDailyLimit(subscription.plan.daily_limit);
        } else {
          const plans = await DatabaseService.getActivePlans();
          const freePlan = plans.find(plan => plan.price === 0);
          setDailyLimit(freePlan?.daily_limit || 3);
        }
      } catch (error) {
        console.error('Erro ao carregar dados do dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [user, subscription]);

  if (!user || planLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Carregando seu dashboard...</p>
        </div>
      </div>
    );
  }

  const userName = user?.user_metadata?.full_name || 'Usuário';
  const usagePercentage = dailyLimit > 0 ? (dailyUsage / dailyLimit) * 100 : 0;
  const isPremium = planType === 'premium';

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="border-b border-gray-100 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto max-w-7xl px-6 py-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="flex items-center space-x-2">
              <FileText className="h-6 w-6 text-blue-600" />
              <span className="font-bold text-xl text-gray-900">ExtraiTexto</span>
            </Link>
            
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-2 bg-gray-100 px-3 py-1 rounded-full">
                {isPremium ? (
                  <>
                    <Crown className="h-4 w-4 text-amber-500" />
                    <span className="text-sm font-medium text-gray-700">Premium</span>
                  </>
                ) : (
                  <>
                    <Star className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">Gratuito</span>
                  </>
                )}
              </div>
              
              <button
                onClick={signOut}
                className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors"
              >
                <LogOut className="h-5 w-5" />
                <span className="hidden md:inline">Sair</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto max-w-7xl px-6 py-8">
        {/* Welcome Section */}
        <section className="mb-12">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Bem-vindo de volta, {userName}! 👋
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Pronto para extrair texto de suas imagens? Vamos transformar seus documentos em texto editável.
            </p>
          </div>

          {/* Quick Action */}
          <div className="flex justify-center">
            <Link
              to="/#upload"
              className="inline-flex items-center bg-gradient-to-r from-blue-600 to-green-500 text-white font-medium px-8 py-4 rounded-xl hover:opacity-90 transition-all transform hover:-translate-y-1 shadow-lg"
            >
              <Upload className="h-5 w-5 mr-2" />
              Nova Extração
              <ArrowRight className="h-5 w-5 ml-2" />
            </Link>
          </div>
        </section>

        {/* Stats Cards */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Usage Card */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center">
                <Activity className="h-6 w-6 text-blue-600" />
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                isPremium ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {isPremium ? 'Premium' : 'Gratuito'}
              </span>
            </div>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Uso Hoje</h3>
            <div className="flex items-baseline space-x-2 mb-3">
              <span className="text-3xl font-bold text-gray-900">{dailyUsage}</span>
              <span className="text-gray-600">
                {isPremium ? 'extrações' : `de ${dailyLimit}`}
              </span>
            </div>
            
            {!isPremium && (
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                />
              </div>
            )}
          </div>

          {/* Plan Card */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                isPremium ? 'bg-amber-100' : 'bg-gray-100'
              }`}>
                {isPremium ? (
                  <Crown className="h-6 w-6 text-amber-600" />
                ) : (
                  <Star className="h-6 w-6 text-gray-600" />
                )}
              </div>
              {!isPremium && (
                <Link
                  to="/#precos"
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  Upgrade
                </Link>
              )}
            </div>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Seu Plano</h3>
            <p className="text-3xl font-bold text-gray-900 mb-1">
              {isPremium ? 'Premium' : 'Gratuito'}
            </p>
            <p className="text-gray-600 text-sm">
              {isPremium ? 'Extrações ilimitadas' : `${dailyLimit} extrações por dia`}
            </p>
          </div>

          {/* Performance Card */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            </div>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Status</h3>
            <p className="text-3xl font-bold text-green-600 mb-1">Ativo</p>
            <p className="text-gray-600 text-sm">Sistema funcionando perfeitamente</p>
          </div>
        </section>

        {/* Features Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-md p-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Ações Rápidas</h2>
            
            <div className="space-y-4">
              <Link
                to="/#upload"
                className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors group"
              >
                <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mr-4 group-hover:bg-blue-200 transition-colors">
                  <Upload className="h-6 w-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">Nova Extração</h3>
                  <p className="text-gray-600 text-sm">Envie uma imagem ou PDF</p>
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
              </Link>

              <Link
                to="/#recursos"
                className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors group"
              >
                <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mr-4 group-hover:bg-green-200 transition-colors">
                  <Zap className="h-6 w-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">Ver Recursos</h3>
                  <p className="text-gray-600 text-sm">Conheça todas as funcionalidades</p>
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-green-600 transition-colors" />
              </Link>

              {!isPremium && (
                <Link
                  to="/#precos"
                  className="flex items-center p-4 bg-amber-50 rounded-lg hover:bg-amber-100 transition-colors group"
                >
                  <div className="bg-amber-100 w-12 h-12 rounded-full flex items-center justify-center mr-4 group-hover:bg-amber-200 transition-colors">
                    <Crown className="h-6 w-6 text-amber-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">Upgrade Premium</h3>
                    <p className="text-gray-600 text-sm">Extrações ilimitadas e mais idiomas</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-amber-600 transition-colors" />
                </Link>
              )}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-md p-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Atividade Recente</h2>
            
            <div className="space-y-4">
              {dailyUsage > 0 ? (
                <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                  <div className="bg-blue-100 w-10 h-10 rounded-full flex items-center justify-center mr-3">
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">
                      {dailyUsage} extração{dailyUsage > 1 ? 'ões' : ''} hoje
                    </p>
                    <p className="text-gray-600 text-sm flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      Última atividade recente
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BarChart3 className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-gray-600">Nenhuma extração hoje</p>
                  <p className="text-gray-500 text-sm">Comece enviando sua primeira imagem!</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Upgrade Banner for Free Users */}
        {!isPremium && (
          <section className="bg-gradient-to-r from-blue-600 to-green-500 rounded-xl p-8 text-white text-center">
            <div className="max-w-3xl mx-auto">
              <Crown className="h-12 w-12 mx-auto mb-4 text-amber-300" />
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Desbloqueie Todo o Potencial do ExtraiTexto
              </h2>
              <p className="text-xl mb-6 opacity-90">
                Extrações ilimitadas, mais idiomas e suporte prioritário por apenas R$ 29,90/mês
              </p>
              <Link
                to="/#precos"
                className="inline-flex items-center bg-white text-blue-600 font-medium px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Crown className="h-5 w-5 mr-2" />
                Upgrade para Premium
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default Dashboard;