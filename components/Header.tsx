import React, { useState } from 'react';
import { Role } from '../types';
import AthleteIcon from './icons/AthleteIcon';
import CoachIcon from './icons/CoachIcon';
import { useAuth } from '../contexts/AuthContext';
import ThemeToggleButton from './ThemeToggleButton';
import SettingsIcon from './icons/SettingsIcon';
import SettingsModal from './SettingsModal';
import { useTranslations } from '../hooks/useTranslations';

const Header: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const t = useTranslations();
  
  if (!currentUser) return null;

  return (
    <>
      <header className="flex items-center justify-between p-4 bg-light-card dark:bg-dark-card border-b border-light-border dark:border-dark-border rounded-t-lg">
        <div className="flex items-center gap-3">
          {currentUser.role === Role.ATHLETE ? <AthleteIcon className="w-8 h-8 text-brand-primary" /> : <CoachIcon className="w-8 h-8 text-brand-primary" />}
          <div>
            <h1 className="text-xl font-bold text-dark-text dark:text-light-text">{t('header.title')}</h1>
            <p className="text-sm text-medium-dark-text dark:text-medium-text">
              {currentUser.role === Role.ATHLETE ? t('header.athleteDashboard') : t('header.coachDashboard')}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 md:gap-4">
          <ThemeToggleButton />
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="p-2 rounded-full bg-light-bg dark:bg-dark-border text-dark-text dark:text-light-text hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
            aria-label={t('settings.buttonLabel')}
          >
            <SettingsIcon className="w-6 h-6" />
          </button>
          <button
            onClick={logout}
            className="px-4 py-2 text-sm font-semibold bg-light-bg dark:bg-dark-border text-dark-text dark:text-light-text rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            {t('header.logout')}
          </button>
        </div>
      </header>
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </>
  );
};

export default Header;