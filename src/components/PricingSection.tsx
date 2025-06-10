import React, { useEffect } from 'react';
import { Check, Star, Loader2, AlertCircle } from 'lucide-react';
import { usePlans } from '../hooks/usePlans';
import { supabase } from '../lib/supabase';

export const PricingSection: React.FC = () => {
  const { freePlan, premiumPlans, loading, error } = usePlans();

  // Debug: testar conexão direta com Supabase
  useEffect(() => {
    const testConnection = async () => {
      try {
        console.log('🔍 Testando conexão com Supabase...');
        
        // Verificar se as variáveis estão definidas
        console.log('Variáveis de ambiente:', {
          url: import.meta.env.VITE_SUPABASE_URL ? '✅ Configurado' : '❌ Não configurado',
          key: import.meta.env.VITE_SUPABASE_ANON_KEY ? '✅ Configurado' : '❌ Não configurado'
        });
        
        // Testar conexão básica
        const { data: testData, error: testError } = await supabase
          .from('plans')
          .select('*')
          .limit(1);
        
        console.log('🧪 Teste de conexão:', { testData, testError });
        
        // Verificar se a tabela existe e tem dados
        const { data: allPlans, error: plansError } = await supabase
          .from('plans')
          .select('*');
        
        console.log('📊 Todos os planos no banco:', { allPlans, plansError });
        
        // Verificar planos ativos especificamente
        const { data: activePlans, error: activeError } = await supabase
          .from('plans')
          .select('*')
          .eq('is_active', true);
        
        console.log('✅ Planos ativos:', { activePlans, activeError });
        
        // Se não há dados, vamos inserir dados de teste
        if (allPlans && allPlans.length === 0) {
          console.log('⚠️ Nenhum plano encontrado. Inserindo dados de teste...');
          await insertTestData();
        }
        
      } catch (err) {
        console.error('❌ Erro no teste de conexão:', err);
      }
    };

    testConnection();
  }, []);

  const insertTestData = async () => {
    try {
      // Inserir planos de teste
      const { data: plansData, error: plansError } = await supabase
        .from('plans')
        .insert([
          {
            name: 'Free',
            description: 'Plano gratuito com recursos básicos',
            price: 0,
            daily_limit: 3,
            is_active: true,
            features: ["OCR básico", "Suporte a JPG e PNG", "3 extrações por dia"]
          },
          {
            name: 'Premium',
            description: 'Plano premium com recursos avançados',
            price: 29.90,
            daily_limit: 999999,
            is_active: true,
            features: ["OCR avançado", "Suporte a todos formatos", "Extrações ilimitadas", "Suporte prioritário"]
          }
        ])
        .select();

      console.log('📝 Planos inseridos:', { plansData, plansError });

      // Inserir idiomas de teste
      const { data: languagesData, error: languagesError } = await supabase
        .from('languages')
        .insert([
          { code: 'pt', name: 'Português', is_premium: false },
          { code: 'en', name: 'English', is_premium: false },
          { code: 'es', name: 'Español', is_premium: true },
          { code: 'fr', name: 'Français', is_premium: true },
          { code: 'de', name: 'Deutsch', is_premium: true }
        ])
        .select();

      console.log('🌐 Idiomas inseridos:', { languagesData, languagesError });

      // Recarregar a página para atualizar os dados
      window.location.reload();

    } catch (err) {
      console.error('❌ Erro ao inserir dados de teste:', err);
    }
  };

  if (loading) {
    return (
      <section id="precos" className="py-16 px-6 md:px-10">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
            Escolha o plano ideal para você
          </h2>
          <div className="flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="precos" className="py-16 px-6 md:px-10">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
            Escolha o plano ideal para você
          </h2>
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-red-800 mb-2">Erro de Conexão</h3>
            <p className="text-red-700 mb-4">
              Não foi possível carregar os planos: {error}
            </p>
            <p className="text-sm text-red-600">
              Verifique se o Supabase está configurado corretamente e se as variáveis de ambiente estão definidas.
            </p>
          </div>
        </div>
      </section>
    );
  }

  const mainPremiumPlan = premiumPlans[0]; // Primeiro plano premium

  return (
    <section id="precos" className="py-16 px-6 md:px-10">
      <div className="container mx-auto max-w-5xl">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
          Escolha o plano ideal para você
        </h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Plano Gratuito */}
          {freePlan && (
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <div className="bg-gray-50 p-6 border-b border-gray-200">
                <h3 className="text-xl font-bold text-gray-900">{freePlan.name}</h3>
                <p className="mt-2 text-gray-600">{freePlan.description}</p>
                <div className="mt-4">
                  <span className="text-3xl font-bold text-gray-900">
                    R${freePlan.price.toFixed(2).replace('.', ',')}
                  </span>
                  <span className="text-gray-600">/mês</span>
                </div>
              </div>
              <div className="p-6">
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                    <span>Até {freePlan.daily_limit} extrações por dia</span>
                  </li>
                  {Array.isArray(freePlan.features) && freePlan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <button className="w-full mt-8 bg-gray-800 text-white py-3 rounded-lg hover:bg-gray-700 transition-colors">
                  Começar Agora
                </button>
              </div>
            </div>
          )}
          
          {/* Plano Premium */}
          {mainPremiumPlan && (
            <div className="border-2 border-blue-500 rounded-xl overflow-hidden relative">
              <div className="absolute top-0 right-0 bg-blue-500 text-white px-4 py-1 rounded-bl-lg flex items-center">
                <Star className="h-4 w-4 mr-1 fill-white" />
                <span className="text-sm font-medium">Recomendado</span>
              </div>
              <div className="bg-blue-50 p-6 border-b border-blue-200">
                <h3 className="text-xl font-bold text-gray-900">{mainPremiumPlan.name}</h3>
                <p className="mt-2 text-gray-600">{mainPremiumPlan.description}</p>
                <div className="mt-4">
                  <span className="text-3xl font-bold text-gray-900">
                    R${mainPremiumPlan.price.toFixed(2).replace('.', ',')}
                  </span>
                  <span className="text-gray-600">/mês</span>
                </div>
              </div>
              <div className="p-6">
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
                    <span>
                      <strong>
                        {mainPremiumPlan.daily_limit > 1000 ? 'Extrações ilimitadas' : `${mainPremiumPlan.daily_limit} extrações por dia`}
                      </strong>
                    </span>
                  </li>
                  {Array.isArray(mainPremiumPlan.features) && mainPremiumPlan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="h-5 w-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <button className="w-full mt-8 bg-gradient-to-r from-blue-600 to-green-500 text-white py-3 rounded-lg hover:opacity-90 transition-opacity font-medium">
                  Assinar Premium
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Fallback se não houver planos */}
        {!freePlan && !mainPremiumPlan && !loading && !error && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
            <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-yellow-800 mb-2">Configuração Necessária</h3>
            <p className="text-yellow-700 mb-4">
              Nenhum plano foi encontrado no banco de dados.
            </p>
            <div className="text-sm text-yellow-600 space-y-2">
              <p>Para resolver este problema:</p>
              <ol className="list-decimal list-inside space-y-1 text-left max-w-md mx-auto">
                <li>Clique no botão "Connect to Supabase" no canto superior direito</li>
                <li>Configure seu projeto Supabase</li>
                <li>Os dados de teste serão inseridos automaticamente</li>
              </ol>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};