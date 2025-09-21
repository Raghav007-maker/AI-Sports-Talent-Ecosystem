import { useState, useEffect } from 'react';
import { useSettings } from '../contexts/SettingsContext';

// A simple in-memory cache for translations
const translationsCache: { [key: string]: any } = {};

const getNestedTranslation = (obj: any, key: string): string | undefined => {
  if (!obj) return undefined;
  return key.split('.').reduce((o, i) => (o ? o[i] : undefined), obj);
};

export const useTranslations = () => {
  const { language } = useSettings();
  const [translations, setTranslations] = useState<any>(translationsCache[language] || null);

  useEffect(() => {
    const fetchTranslations = async () => {
      // Return if translations for the current language are already in cache
      if (translationsCache[language]) {
        setTranslations(translationsCache[language]);
        return;
      }
      
      try {
        // Using an absolute path from the root of the server
        const response = await fetch(`/locales/${language}.json`);
        if (!response.ok) {
          throw new Error(`Failed to load translations for ${language}`);
        }
        const data = await response.json();
        translationsCache[language] = data;
        setTranslations(data);
      } catch (error) {
        console.error(error);
        // Fallback to English if the selected language fails to load
        if (language !== 'en') {
          try {
            const response = await fetch('/locales/en.json');
            const data = await response.json();
            translationsCache['en'] = data;
            setTranslations(data); // Set state to fallback translations
          } catch (e) {
            console.error("Failed to load fallback English translations", e);
          }
        }
      }
    };

    fetchTranslations();
  }, [language]);

  return (key: string, interpolations?: Record<string, string | number>): string => {
    // If translations are not loaded yet, return the key as a fallback.
    if (!translations) {
      return key;
    }

    let translation = getNestedTranslation(translations, key) || key;

    if (interpolations) {
      Object.keys(interpolations).forEach(iKey => {
        const regex = new RegExp(`{{${iKey}}}`, 'g');
        translation = translation.replace(regex, String(interpolations[iKey]));
      });
    }

    return translation;
  };
};
