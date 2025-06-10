import React from 'react';
import { Upload, Wand2, Download } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  return (
    <section id="como-funciona" className="py-16 px-6 md:px-10 bg-white">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">Como Funciona</h2>
        <p className="text-gray-600 text-center max-w-3xl mx-auto mb-12">
          Extrair texto de imagens nunca foi tão fácil. Em apenas três passos simples, você terá seu texto pronto para usar.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="relative">
            <div className="bg-blue-50 rounded-xl p-6 h-full">
              <div className="bg-blue-100 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                <Upload className="h-7 w-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">1. Envie sua Imagem</h3>
              <p className="text-gray-600">
                Clique no botão de upload ou arraste sua imagem para a área indicada. 
                Aceitamos arquivos JPG, PNG e PDF até 10MB.
              </p>
            </div>
            <div className="hidden md:block absolute -right-4 top-1/2 transform -translate-y-1/2 z-10">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="bg-green-50 rounded-xl p-6 h-full">
              <div className="bg-green-100 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                <Wand2 className="h-7 w-7 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">2. Extraia o Texto</h3>
              <p className="text-gray-600">
                Clique em "Extrair Texto" e nossa tecnologia OCR avançada 
                identificará e converterá todo o conteúdo textual da imagem.
              </p>
            </div>
            <div className="hidden md:block absolute -right-4 top-1/2 transform -translate-y-1/2 z-10">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-green-600 rounded-full"></div>
              </div>
            </div>
          </div>
          
          <div className="bg-purple-50 rounded-xl p-6 h-full">
            <div className="bg-purple-100 w-14 h-14 rounded-full flex items-center justify-center mb-4">
              <Download className="h-7 w-7 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">3. Copie ou Baixe</h3>
            <p className="text-gray-600">
              O texto extraído aparecerá instantaneamente. Copie para a área de 
              transferência ou baixe como arquivo de texto.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};