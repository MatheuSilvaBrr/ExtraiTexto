import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Declare a variável que será exportada
let supabase: SupabaseClient;

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('🔧 Configuração Supabase:', {
  url: supabaseUrl ? '✅ Configurado' : '❌ NÃO CONFIGURADO',
  key: supabaseAnonKey ? '✅ Configurado' : '❌ NÃO CONFIGURADO',
});

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Variáveis de ambiente do Supabase não configuradas!');

  // Apenas atribua o objeto mock à variável (sem 'export')
  supabase = {
    from: () => ({
      select: async () => ({
        data: [],
        error: new Error('Supabase não configurado'),
      }),
      insert: async () => ({
        data: [],
        error: new Error('Supabase não configurado'),
      }),
      update: async () => ({
        data: [],
        error: new Error('Supabase não configurado'),
      }),
      delete: async () => ({
        data: [],
        error: new Error('Supabase não configurado'),
      }),
    }),
    auth: {
      getSession: async () => ({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({
        data: { subscription: { unsubscribe: () => {} } },
      }),
    },
  } as any;
} else {
  // Apenas atribua a instância real à variável (sem 'export')
  supabase = createClient(supabaseUrl, supabaseAnonKey);

  // Testar conexão na inicialização
  supabase
    .from('plans')
    .select('count', { count: 'exact' })
    .limit(1)
    .then(({ error, count }) => {
      if (error) {
        console.error(
          '❌ Erro na conexão inicial com Supabase:',
          error.message
        );
      } else {
        console.log(
          `✅ Conexão com Supabase estabelecida com sucesso. Tabela 'plans' encontrada com ${count} registros.`
        );
      }
    });
}

// Exporte a variável aqui, no final do arquivo
export { supabase };
