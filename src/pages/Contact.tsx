import React, { useState } from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { CheckCircle2, Send } from 'lucide-react';
import emailjs from '@emailjs/browser';

type FormData = {
  subject: string;
  title: string;
  description: string;
};

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    subject: '',
    title: '',
    description: ''
  });
  
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subjects = [
    'Suporte Técnico',
    'Dúvidas sobre Pagamento',
    'Solicitação de Cancelamento',
    'Sugestões de Melhoria',
    'Outros'
  ];

  const validate = () => {
    const newErrors: Partial<FormData> = {};
    
    if (!formData.subject) {
      newErrors.subject = 'Selecione um assunto';
    }
    
    if (!formData.title || formData.title.length < 5) {
      newErrors.title = 'O título deve ter pelo menos 5 caracteres';
    }
    
    if (!formData.description || formData.description.length < 20) {
      newErrors.description = 'A descrição deve ter pelo menos 20 caracteres';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setIsSubmitting(true);
    
    try {
      const templateParams = {
        to_email: 'matheus11959@gmail.com',
        subject: formData.subject,
        title: formData.title,
        message: formData.description,
        date: new Date().toLocaleString('pt-BR')
      };

      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        templateParams,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );

      setIsSubmitted(true);
      setFormData({ subject: '', title: '', description: '' });
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      setErrors({ ...errors, submit: 'Erro ao enviar mensagem. Tente novamente.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-grow py-16 px-6 md:px-10">
        <div className="container mx-auto max-w-3xl">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">Fale Conosco</h1>
          
          {isSubmitted ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
              <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <p className="text-lg text-green-800 font-medium">
                ✅ Sua mensagem foi enviada com sucesso.
              </p>
              <p className="text-green-700 mt-2">
                Responderemos em até 24 horas úteis.
              </p>
              <button
                onClick={() => setIsSubmitted(false)}
                className="mt-6 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Enviar nova mensagem
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8">
              <div className="mb-6">
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                  Assunto
                </label>
                <select
                  id="subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className={`w-full rounded-lg border ${errors.subject ? 'border-red-500' : 'border-gray-300'} 
                    shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200`}
                >
                  <option value="">Selecione um assunto</option>
                  {subjects.map((subject) => (
                    <option key={subject} value={subject}>
                      {subject}
                    </option>
                  ))}
                </select>
                {errors.subject && (
                  <p className="mt-1 text-sm text-red-600">{errors.subject}</p>
                )}
              </div>

              <div className="mb-6">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Título
                </label>
                <input
                  type="text"
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className={`w-full rounded-lg border ${errors.title ? 'border-red-500' : 'border-gray-300'} 
                    shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200`}
                  placeholder="Resumo da sua mensagem"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                )}
              </div>

              <div className="mb-6">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Descrição
                </label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={6}
                  className={`w-full rounded-lg border ${errors.description ? 'border-red-500' : 'border-gray-300'} 
                    shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200`}
                  placeholder="Descreva em detalhes sua dúvida ou problema"
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                )}
              </div>

              {errors.submit && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                  {errors.submit}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg 
                  hover:opacity-90 transition-opacity flex items-center justify-center font-medium"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5 mr-2" />
                    Enviar Mensagem
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};