import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

export const EmailVerification: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const token = searchParams.get('token');
        const type = searchParams.get('type');

        if (!token || type !== 'email_verification') {
          setVerificationStatus('error');
          return;
        }

        const { error } = await supabase.auth.verifyOtp({
          token_hash: token,
          type: 'email',
        });

        if (error) {
          throw error;
        }

        setVerificationStatus('success');
        toast.success('Email verificado com sucesso!');
        
        // Redirect to dashboard after 3 seconds
        setTimeout(() => {
          navigate('/dashboard');
        }, 3000);
      } catch (error) {
        console.error('Erro na verificação:', error);
        setVerificationStatus('error');
        toast.error('Erro ao verificar email. Tente novamente.');
      }
    };

    verifyEmail();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
        {verificationStatus === 'loading' && (
          <>
            <Loader2 className="h-16 w-16 text-blue-500 animate-spin mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Verificando seu email</h2>
            <p className="text-gray-600">Por favor, aguarde um momento...</p>
          </>
        )}

        {verificationStatus === 'success' && (
          <>
            <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Email Verificado!</h2>
            <p className="text-gray-600 mb-4">
              Seu email foi verificado com sucesso. Você será redirecionado para o dashboard em alguns segundos.
            </p>
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors"
            >
              Ir para o Dashboard
            </button>
          </>
        )}

        {verificationStatus === 'error' && (
          <>
            <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Erro na Verificação</h2>
            <p className="text-gray-600 mb-4">
              Não foi possível verificar seu email. O link pode ter expirado ou ser inválido.
            </p>
            <button
              onClick={() => navigate('/login')}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Voltar para Login
            </button>
          </>
        )}
      </div>
    </div>
  );
};