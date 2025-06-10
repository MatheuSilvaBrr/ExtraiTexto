import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('🔧 Configuração Supabase:', {
  url: supabaseUrl ? '✅ Configurado' : '❌ NÃO CONFIGURADO',
  key: supabaseAnonKey ? '✅ Configurado' : '❌ NÃO CONFIGURADO'
});

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Variáveis de ambiente do Supabase não configuradas!');
  console.error('VITE_SUPABASE_URL:', supabaseUrl || '[NÃO DEFINIDO]');
  console.error('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? '[CONFIGURADO]' : '[NÃO DEFINIDO]');
  
  // Criar um cliente mock para evitar erros
  export const supabase = {
    from: () => ({
      select: () => Promise.resolve({ data: [], error: new Error('Supabase não configurado') }),
      insert: () => Promise.resolve({ data: [], error: new Error('Supabase não configurado') }),
      update: () => Promise.resolve({ data: [], error: new Error('Supabase não configurado') }),
      delete: () => Promise.resolve({ data: [], error: new Error('Supabase não configurado') })
    }),
    auth: {
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } })
    }
  } as any;
} else {
  export const supabase = createClient(supabaseUrl, supabaseAnonKey);

  // Testar conexão na inicialização
  supabase.from('plans').select('count').limit(1).then(({ data, error }) => {
    if (error) {
      console.error('❌ Erro na conexão inicial com Supabase:', error);
    } else {
      console.log('✅ Conexão com Supabase estabelecida com sucesso');
    }
  });
}