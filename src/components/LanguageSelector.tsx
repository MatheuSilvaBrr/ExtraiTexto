import React, { useState } from 'react';
import { Lock } from 'lucide-react';
import { Language } from '../types/database';
import { useLanguages } from '../hooks/useLanguages';

type LanguageSelectorProps = {
  selectedLanguage: string;
  onLanguageChange: (language: string) => void;
  planType: 'free' | 'premium';
};

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  selectedLanguage,
  onLanguageChange,
  planType
}) => {
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const { languages, loading } = useLanguages(planType);

  const handleLanguageSelect = (language: Language) => {
    if (language.is_premium && planType === 'free') {
      setShowPremiumModal(true);
      return;
    }
    onLanguageChange(language.code);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="animate-pulse bg-gray-200 h-12 rounded-lg"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {languages.map((language) => (
          <button
            key={language.id}
            onClick={() => handleLanguageSelect(language)}
            className={`
              flex items-center justify-between p-3 rounded-lg border transition-all
              ${selectedLanguage === language.code
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
              }
              ${language.is_premium && planType === 'free'
                ? 'opacity-50 cursor-not-allowed'
                : ''
              }
            `}
            disabled={language.is_premium && planType === 'free'}
          >
            <div className="flex items-center space-x-2">
              <span className="font-medium">{language.name}</span>
            </div>
            {language.is_premium && planType === 'free' && (
              <Lock className="h-4 w-4 text-gray-400" />
            )}
          </button>
        ))}
      </div>

      {showPremiumModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md mx-4">
            <h3 className="text-xl font-semibold mb-4">Recurso Premium</h3>
            <p className="text-gray-600 mb-6">
              Este idioma está disponível apenas no Plano Premium. Faça upgrade para
              desbloquear acesso a mais idiomas!
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowPremiumModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Fechar
              </button>
              <a
                href="#precos"
                onClick={() => setShowPremiumModal(false)}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:opacity-90 transition-opacity"
              >
                Ver Planos
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};