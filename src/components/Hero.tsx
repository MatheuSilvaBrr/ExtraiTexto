import React from 'react';

export const Hero: React.FC = () => {
  return (
    <section className="py-16 md:py-24 px-6 md:px-10">
      <div className="container mx-auto max-w-6xl text-center">
        <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
          Transforme qualquer imagem em texto — grátis e instantâneo.
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
          Extraia texto de imagens JPG, PNG ou documentos PDF em segundos. 
          Sem cadastro, sem complicações.
        </p>
        <a 
          href="#upload"
          className="inline-block bg-gradient-to-r from-blue-600 to-green-500 text-white font-medium px-8 py-3 rounded-lg hover:opacity-90 transition-all transform hover:-translate-y-1 shadow-lg"
        >
          Começar Agora
        </a>
      </div>
    </section>
  );
};