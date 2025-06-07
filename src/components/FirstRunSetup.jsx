import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, Check } from 'lucide-react';

/**
 * Composant de configuration au premier lancement
 * Permet à l'utilisateur de choisir sa langue préférée
 */
function FirstRunSetup({ onComplete }) {
    const { i18n } = useTranslation();
    const [selectedLanguage, setSelectedLanguage] = useState('fr');

    const languages = [
        { code: 'fr', name: 'Français', flag: '🇫🇷' },
        { code: 'en', name: 'English', flag: '🇺🇸' }
    ];

    const handleLanguageSelect = (langCode) => {
        setSelectedLanguage(langCode);
    };

    const handleContinue = async () => {
        try {
            // Changer la langue
            await i18n.changeLanguage(selectedLanguage);

            // Sauvegarder la préférence
            localStorage.setItem('component-lab-language', selectedLanguage);
            localStorage.setItem('component-lab-first-run', 'false');

            onComplete();
        } catch (error) {
            console.error('Erreur lors de la configuration:', error);
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 max-w-md w-full mx-4">
                <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full mb-4">
                        <Globe className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        Bienvenue dans ComponentLab
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300">
                        Choisissez votre langue préférée pour commencer
                    </p>
                </div>

                <div className="space-y-3 mb-8">
                    {languages.map((language) => (
                        <button
                            key={language.code}
                            onClick={() => handleLanguageSelect(language.code)}
                            className={`w-full flex items-center justify-between p-4 rounded-lg border-2 transition-all ${selectedLanguage === language.code
                                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-400'
                                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                                }`}
                        >
                            <div className="flex items-center">
                                <span className="text-2xl mr-3">{language.flag}</span>
                                <span className="font-medium text-gray-900 dark:text-white">
                                    {language.name}
                                </span>
                            </div>
                            {selectedLanguage === language.code && (
                                <Check className="w-5 h-5 text-blue-500 dark:text-blue-400" />
                            )}
                        </button>
                    ))}
                </div>

                <button
                    onClick={handleContinue}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                >
                    Continuer
                </button>
            </div>
        </div>
    );
}

export default FirstRunSetup; 