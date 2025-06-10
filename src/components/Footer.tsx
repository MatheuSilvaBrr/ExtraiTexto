import React from 'react';
import { FileText, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-100 py-10 px-6 md:px-10">
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div className="flex items-center space-x-2 mb-6 md:mb-0">
            <FileText className="h-6 w-6 text-blue-600" />
            <span className="font-bold text-xl text-gray-900">ExtraiTexto</span>
          </div>
          
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-3">
            <Link to="/politica-de-privacidade" className="text-gray-600 hover:text-blue-600 transition-colors">
              Política de Privacidade
            </Link>
            <Link to="/termos-de-uso" className="text-gray-600 hover:text-blue-600 transition-colors">
              Termos de Uso
            </Link>
            <Link to="/contato" className="text-gray-600 hover:text-blue-600 transition-colors">
              Contato
            </Link>
            <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
              Blog
            </a>
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm mb-4 md:mb-0">
            © 2025 ExtraiTexto.com - Todos os direitos reservados
          </p>
          
          <p className="text-gray-500 text-sm flex items-center">
            Feito com <Heart className="h-4 w-4 mx-1 text-red-500 fill-red-500" /> por ExtraiTexto.com
          </p>
        </div>
      </div>
    </footer>
  );
};