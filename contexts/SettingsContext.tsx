import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { User } from '../types';
import { MOCK_USERS } from '../constants';

type Language = 'en' | 'es';

interface SettingsContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  lowBandwidthMode: boolean;
  setLowBandwidthMode: (enabled: boolean) => void;
  updateProfileVisibility: (userId: number, visibility: 'Visible' | 'Hidden') => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => 
    (localStorage.getItem('language') as Language) || 'en'
  );
  const [lowBandwidthMode, setLowBandwidthModeState] = useState<boolean>(() => 
    localStorage.getItem('lowBandwidthMode') === 'true'
  );

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('lowBandwidthMode', String(lowBandwidthMode));
  }, [lowBandwidthMode]);

  const setLanguage = (lang: Language) => setLanguageState(lang);
  const setLowBandwidthMode = (enabled: boolean) => setLowBandwidthModeState(enabled);

  // This is a mock update function. In a real app, this would be an API call.
  const updateProfileVisibility = (userId: number, visibility: 'Visible' | 'Hidden') => {
    const userIndex = MOCK_USERS.findIndex(u => u.id === userId);
    if (userIndex > -1) {
      MOCK_USERS[userIndex].profileVisibility = visibility;
      console.log(`User ${userId} visibility updated to ${visibility}`, MOCK_USERS[userIndex]);
      // Note: This won't trigger a re-render across the app without a state management library
      // but serves the purpose for this mock implementation. The coach dashboard will filter on next render.
    }
  };

  return (
    <SettingsContext.Provider value={{ language, setLanguage, lowBandwidthMode, setLowBandwidthMode, updateProfileVisibility }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};