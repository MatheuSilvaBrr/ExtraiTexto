import React, { useState } from 'react';
import { LogIn, AlertCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Objeto de traduções para internacionalização simples
const translations = {
  en: {
    title: 'Sign in to your account',
    createAccount: 'Or create a new account',
    emailLabel: 'Email address',
    passwordLabel: 'Password',
    rememberMe: 'Remember me',
    forgotPassword: 'Forgot your password?',
    signIn: 'Sign in',
  },
  'pt-BR': {
    title: 'Entre na sua conta',
    createAccount: 'Ou crie uma nova conta',
    emailLabel: 'Endereço de email',
    passwordLabel: 'Senha',
    rememberMe: 'Lembrar de mim',
    forgotPassword: 'Esqueceu sua senha?',
    signIn: 'Entrar',
  },
};

export function Login() {
  // Hooks para navegação e autenticação
  const navigate = useNavigate();
  const { login } = useAuth();

  // Estados para gerenciar os dados do formulário e a mensagem de erro
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState<string | null>(null);

  // Determina o idioma com base no navegador do usuário
  const userLanguage = navigator.language;
  const t = translations[userLanguage.includes('pt') ? 'pt-BR' : 'en'];

  // Função para lidar com mudanças nos campos de input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Função para lidar com o envio do formulário de login
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    console.log('1. Formulário de login enviado.'); // RASTRO 1

    try {
      console.log('2. Chamando a função login do context...'); // RASTRO 2
      await login(formData.email, formData.password);

      console.log('4. Login bem-sucedido, navegando para /dashboard...'); // RASTRO 4
      navigate('/dashboard');
    } catch (err: any) {
      console.error('ERRO CAPTURADO NO LOGIN.TSX:', err); // RASTRO DE ERRO
      setError(
        err.message || 'Failed to log in. Please check your credentials.'
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-blue-100">
            <LogIn className="h-6 w-6 text-blue-600" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {t.title}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {t.createAccount}{' '}
            <Link
              to="/signup"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Criar conta
            </Link>
          </p>
        </div>

        {/* Formulário de Login */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/* Componente para exibir a mensagem de erro */}
          {error && (
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg flex items-center"
              role="alert"
            >
              <AlertCircle className="h-5 w-5 mr-2" />
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                {t.emailLabel}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none rounded-t-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder={t.emailLabel}
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                {t.passwordLabel}
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none rounded-b-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder={t.passwordLabel}
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-gray-900"
              >
                {t.rememberMe}
              </label>
            </div>
            <div className="text-sm">
              <Link
                to="/forgot-password"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                {t.forgotPassword}
              </Link>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {t.signIn}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
