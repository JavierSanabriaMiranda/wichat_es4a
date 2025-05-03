// src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

if (!i18n.isInitialized) {
  i18n
    .use(Backend) // To load instructions from a backend server or a file
    .use(LanguageDetector) // Detects the language of the web browser
    .use(initReactI18next) // Initializes i18next for React
    .init({
      fallbackLng: 'es', // Default language
      debug: true, // Show useful information for debugging

      detection: {
        // Orden de detección: navegador primero para que coja siempre
        // el valor del idioma del navegador que el último idioma seleccionado
        // en la sección anterior
        order: ['navigator', 'localStorage', 'sessionStorage', 'cookie', 'htmlTag'],
        checkWhitelist: true,
      },

      interpolation: {
        escapeValue: false,
      },
    });
}

export default i18n;
