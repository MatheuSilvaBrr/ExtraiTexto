import React from 'react';
import { FileType, Languages, Zap, Shield } from 'lucide-react';

export const FeaturesSection: React.FC = () => {
  return (
    <section id="recursos" className="py-16 px-6 md:px-10 bg-white">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">Recursos Principais</h2>
        <p className="text-gray-600 text-center max-w-3xl mx-auto mb-12">
          O ExtraiTexto oferece a melhor experiência para extrair texto de imagens com tecnologia OCR avançada.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-blue-50 p-6 rounded-xl">
            <div className="bg-blue-100 w-14 h-14 rounded-full flex items-center justify-center mb-4">
              <FileType className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Múltiplos Formatos</h3>
            <p className="text-gray-600">Compatível com JPG, PNG e documentos PDF de várias páginas.</p>
          </div>
          
          <div className="bg-green-50 p-6 rounded-xl">
            <div className="bg-green-100 w-14 h-14 rounded-full flex items-center justify-center mb-4">
              <Languages className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Detecção de Idioma</h3>
            <p className="text-gray-600">Reconhecimento automático de português, inglês e espanhol.</p>
          </div>
          
          <div className="bg-purple-50 p-6 rounded-xl">
            <div className="bg-purple-100 w-14 h-14 rounded-full flex items-center justify-center mb-4">
              <Zap className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Alta Precisão</h3>
            <p className="text-gray-600">Tecnologia OCR de ponta para extração precisa mesmo em imagens com baixa qualidade.</p>
          </div>
          
          <div className="bg-amber-50 p-6 rounded-xl">
            <div className="bg-amber-100 w-14 h-14 rounded-full flex items-center justify-center mb-4">
              <Shield className="h-8 w-8 text-amber-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Segurança Total</h3>
            <p className="text-gray-600">Seus arquivos são processados localmente e nunca armazenados em nossos servidores.</p>
          </div>
        </div>
      </div>
    </section>
  );
};