import React from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

export const PrivacyPolicy: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-grow py-16 px-6 md:px-10">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">Política de Privacidade</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-8">Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">1. Introdução</h2>
              <p className="mb-4">
                A sua privacidade é importante para nós. Esta Política de Privacidade descreve como o ExtraiTexto.com ("nós", "nosso" ou "ExtraiTexto") coleta, usa e protege suas informações quando você utiliza nosso serviço de extração de texto de imagens.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">2. Dados Coletados</h2>
              <p className="mb-4">Coletamos apenas os dados necessários para fornecer nosso serviço:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>Imagens e arquivos PDF enviados para extração de texto</li>
                <li>Informações técnicas como endereço IP e tipo de navegador</li>
                <li>Dados de uso do serviço (número de extrações, horários de acesso)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">3. Uso dos Dados</h2>
              <p className="mb-4">Utilizamos seus dados para:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>Fornecer o serviço de extração de texto</li>
                <li>Melhorar a precisão e qualidade do OCR</li>
                <li>Prevenir uso abusivo da plataforma</li>
                <li>Cumprir obrigações legais</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">4. Proteção de Dados (LGPD)</h2>
              <p className="mb-4">
                Em conformidade com a Lei Geral de Proteção de Dados (LGPD), garantimos:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Seus arquivos são processados localmente e excluídos após a extração</li>
                <li>Não armazenamos o conteúdo das imagens ou textos extraídos</li>
                <li>Você tem direito de solicitar exclusão de seus dados</li>
                <li>Implementamos medidas de segurança para proteger suas informações</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">5. Contato</h2>
              <p className="mb-4">
                Para questões sobre privacidade ou solicitações relacionadas aos seus dados, entre em contato através do email: privacidade@extraitexto.com
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};