import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { translations, SUPPORTED_LANGUAGES, getLocalizedCategoryName } from '../i18n/translations';
import { useAuth } from './AuthContext';
import { api } from '../services/api';

const LanguageContext = createContext();

const STORAGE_KEY = 'novacart_language';

export function LanguageProvider({ children }) {
  const { user, isAuthenticated, setUser } = useAuth();

  // Determine initial language:
  // 1. Saved localStorage preference
  // 2. Default to 'ar' (Arabic)
  const [language, setLanguageState] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && ['ar', 'en', 'fr'].includes(saved)) {
        return saved;
      }
    } catch {
      // Fallback
    }
    return 'ar';
  });

  // Apply direction and lang attribute to HTML document root
  const applyDirection = useCallback((lang) => {
    const isArabic = lang === 'ar';
    document.documentElement.dir = isArabic ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    if (isArabic) {
      document.body.classList.add('font-arabic');
    } else {
      document.body.classList.remove('font-arabic');
    }
  }, []);

  // Update direction on initial mount or language change
  useEffect(() => {
    applyDirection(language);
  }, [language, applyDirection]);

  // Sync with authenticated user's preferred saved language from DB
  useEffect(() => {
    if (user && user.preferred_language && ['ar', 'en', 'fr'].includes(user.preferred_language)) {
      if (user.preferred_language !== language) {
        setLanguageState(user.preferred_language);
        localStorage.setItem(STORAGE_KEY, user.preferred_language);
        applyDirection(user.preferred_language);
      }
    }
  }, [user?.id, user?.preferred_language, applyDirection]);

  // Change language function
  const setLanguage = async (newLang) => {
    if (!['ar', 'en', 'fr'].includes(newLang)) return;

    setLanguageState(newLang);
    try {
      localStorage.setItem(STORAGE_KEY, newLang);
    } catch (e) {
      console.warn('Could not save language to localStorage:', e);
    }
    applyDirection(newLang);

    // If user is registered and logged in, persist their choice to their user profile in the database
    if (isAuthenticated && user?.id) {
      try {
        await api.updateProfile({ preferred_language: newLang });
        if (setUser) {
          setUser(prev => prev ? { ...prev, preferred_language: newLang } : prev);
        }
      } catch (err) {
        console.warn('Failed to update preferred language on user profile:', err);
      }
    }
  };

  // Translation helper function
  const t = useCallback((key, params = {}) => {
    const langDict = translations[language] || translations['fr'];
    let str = langDict[key] ?? translations['fr'][key] ?? translations['en'][key] ?? key;

    // Parameter interpolation, e.g. {name}, {count}, {price}
    if (typeof str === 'string' && params && typeof params === 'object') {
      Object.entries(params).forEach(([paramKey, paramVal]) => {
        str = str.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(paramVal));
      });
    }

    return str;
  }, [language]);

  const isRTL = language === 'ar';
  const currentLanguageMeta = SUPPORTED_LANGUAGES.find(l => l.code === language) || SUPPORTED_LANGUAGES[0];

  const getCategoryName = useCallback((cat) => {
    return getLocalizedCategoryName(cat, language);
  }, [language]);

  return (
    <LanguageContext.Provider value={{
      language,
      setLanguage,
      t,
      getCategoryName,
      isRTL,
      dir: isRTL ? 'rtl' : 'ltr',
      supportedLanguages: SUPPORTED_LANGUAGES,
      currentLanguageMeta
    }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
