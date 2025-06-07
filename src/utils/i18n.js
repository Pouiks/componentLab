import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import des traductions
import fr from '../locales/fr.json';
import en from '../locales/en.json';

// Configuration de i18next
i18n
  .use(LanguageDetector) // Détection automatique de la langue
  .use(initReactI18next) // Integration avec React
  .init({
    // Langues supportées
    supportedLngs: ['fr', 'en'],
    fallbackLng: 'fr', // Langue par défaut

    // Ressources de traduction
    resources: {
      fr: {
        translation: fr
      },
      en: {
        translation: en
      }
    },

    // Options de détection
    detection: {
      // Ordre de détection des langues
      order: [
        'localStorage', // Préférence sauvegardée
        'navigator',    // Langue du navigateur
        'htmlTag',      // Attribut lang du HTML
        'path',         // URL path
        'subdomain'     // Sous-domaine
      ],

      // Clé localStorage pour sauvegarder la préférence
      lookupLocalStorage: 'component-lab-language',

      // Cache la langue détectée
      caches: ['localStorage'],

      // Exclure certaines langues de la détection automatique
      excludeCacheFor: ['cimode']
    },

    // Configuration générale
    debug: false, // Activer en développement si nécessaire
    
    // Options d'interpolation
    interpolation: {
      escapeValue: false // React échappe déjà les valeurs
    },

    // Options React
    react: {
      // Suspense pour le chargement asynchrone
      useSuspense: false
    },

    // Namespace par défaut
    defaultNS: 'translation',
    
    // Séparateur de clés imbriquées
    keySeparator: '.',

    // Séparateur de namespace
    nsSeparator: ':'
  });

export default i18n; 