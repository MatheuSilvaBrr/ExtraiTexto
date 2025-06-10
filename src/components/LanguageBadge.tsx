import React from 'react';

type LanguageBadgeProps = {
  language: 'pt' | 'en' | 'es';
};

export const LanguageBadge: React.FC<LanguageBadgeProps> = ({ language }) => {
  const getLanguageInfo = () => {
    switch (language) {
      case 'pt':
        return { name: 'Português', bgColor: 'bg-green-100', textColor: 'text-green-800' };
      case 'en':
        return { name: 'Inglês', bgColor: 'bg-blue-100', textColor: 'text-blue-800' };
      case 'es':
        return { name: 'Espanhol', bgColor: 'bg-amber-100', textColor: 'text-amber-800' };
      default:
        return { name: '', bgColor: '', textColor: '' };
    }
  };

  const { name, bgColor, textColor } = getLanguageInfo();

  return (
    <div className={`px-3 py-1 rounded-full text-sm font-medium ${bgColor} ${textColor}`}>
      {name}
    </div>
  );
};