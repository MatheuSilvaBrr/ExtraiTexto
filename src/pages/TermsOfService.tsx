import React from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

export const TermsOfService: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-grow py-16 px-6 md:px-10">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">Termos de Uso</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-8">Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">1. Aceitação dos Termos</h2>
              <p className="mb-4">
                Ao acessar e usar o ExtraiTexto.com, você concorda com estes Termos de Uso. Se você não concordar com qualquer parte destes termos, não use nosso serviço.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">2. Descrição do Serviço</h2>
              <p className="mb-4">O ExtraiTexto oferece:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>Extração de texto de imagens e PDFs usando OCR</li>
                <li>Plano gratuito com limite de 3 extrações por dia</li>
                <li>Plano Premium com extrações ilimitadas</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">3. Uso Aceitável</h2>
              <p className="mb-4">Você concorda em:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>Não ultrapassar os limites do plano gratuito</li>
                <li>Não usar o serviço para fins ilegais</li>
                <li>Não tentar burlar as restrições técnicas</li>
                <li>Não compartilhar sua conta Premium</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">4. Limitações do Serviço</h2>
              <ul className="list-disc pl-6 mb-4">
                <li>Limite de 10MB por arquivo</li>
                <li>Suporte apenas para formatos JPG, PNG e PDF</li>
                <li>Precisão do OCR pode variar conforme qualidade da imagem</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">5. Propriedade Intelectual</h2>
              <p className="mb-4">
                Todo o conteúdo e código do ExtraiTexto.com são protegidos por direitos autorais. O uso do serviço não transfere nenhum direito de propriedade intelectual.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">6. Modificações</h2>
              <p className="mb-4">
                Reservamos o direito de modificar estes termos a qualquer momento. Alterações significativas serão notificadas aos usuários.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};