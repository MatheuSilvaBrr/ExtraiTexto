import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { KeyRound } from 'lucide-react';

export const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await resetPassword(email);
      setEmailSent(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="flex flex-col items-center">
            <div className="bg-blue-100 p-3 rounded-full">
              <KeyRound className="h-8 w-8 text-blue-600" />
            </div>
            
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Esqueceu sua senha?
            </h2>
            
            {!emailSent ? (
              <>
                <p className="mt-2 text-center text-sm text-gray-600">
                  Digite seu email para receber um link de redefinição de senha
                </p>

                <form onSubmit={handleSubmit} className="mt-8 space-y-6 w-full">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <div className="mt-1">
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                    ) : (
                      'Enviar email de redefinição'
                    )}
                  </button>
                </form>
              </>
            ) : (
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Email enviado! Verifique sua caixa de entrada e siga as instruções para redefinir sua senha.
                </p>
                <Link
                  to="/login"
                  className="mt-4 inline-block text-sm text-blue-600 hover:text-blue-500"
                >
                  Voltar para o login
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};