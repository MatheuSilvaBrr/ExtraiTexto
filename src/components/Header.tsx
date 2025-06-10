import React from 'react';
import { FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Header: React.FC = () => {
  return (
    <header className="border-b border-gray-100 py-4 px-6 md:px-10">
      <div className="container mx-auto max-w-7xl">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <FileText className="h-6 w-6 text-blue-600" />
            <span className="font-bold text-xl text-gray-900">ExtraiTexto</span>
          </Link>
          <nav className="hidden md:flex space-x-6">
            <a href="/#como-funciona" className="text-gray-600 hover:text-blue-600 transition-colors">
              Como Funciona
            </a>
            <a href="/#recursos" className="text-gray-600 hover:text-blue-600 transition-colors">
              Recursos
            </a>
            <a href="/#precos" className="text-gray-600 hover:text-blue-600 transition-colors">
              Preços
            </a>
            <Link to="/contato" className="text-gray-600 hover:text-blue-600 transition-colors">
              Contato
            </Link>
          </nav>
          <div className="flex items-center space-x-4">
            <Link 
              to="/login" 
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              Login
            </Link>
            <Link 
              to="/signup" 
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Criar Conta
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};