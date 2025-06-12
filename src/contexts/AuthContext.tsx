import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { supabase } from '../lib/supabase';
import { Session, User } from '@supabase/supabase-js';
import { toast } from 'react-hot-toast';

// Interface que define o formato do nosso contexto de autenticação
interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>; // <-- Adicionado
  signUp: (email: string, password: string, name: string) => Promise<void>; // <-- Adicionado
  signOut: () => Promise<void>;
}

// Cria o contexto com o tipo definido acima
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Componente Provedor que vai envolver nossa aplicação
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    // Pega a sessão ativa ao carregar a página
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Escuta por mudanças no estado de autenticação (login, logout)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Limpa a inscrição quando o componente for desmontado
    return () => subscription.unsubscribe();
  }, []);

  // Função de Login
  const login = async (email: string, password: string) => {
    console.log('3. Função login do AuthContext foi executada.'); // RASTRO 3
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
    } catch (error: any) {
      if (error.message.includes('Invalid login credentials')) {
        throw new Error('Email ou senha inválidos.');
      }
      throw error;
    }
  };

  // Função de Cadastro
  const signUp = async (email: string, password: string, name: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: name } },
      });
      if (error) throw error;
    } catch (error: any) {
      if (error?.message?.includes('User already registered')) {
        const customError = 'Este email já está cadastrado.';
        toast.error(customError);
        throw new Error(customError);
      }
      toast.error('Erro ao criar conta. Tente novamente.');
      throw error;
    }
  };

  // Função de Logout
  const signOut = async () => {
    await supabase.auth.signOut();
  };

  // Objeto com todos os valores e funções a serem compartilhados
  const value = {
    session,
    user,
    loading,
    login, // <-- Adicionado
    signUp, // <-- Adicionado
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Hook customizado para usar o contexto facilmente em outros componentes
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
