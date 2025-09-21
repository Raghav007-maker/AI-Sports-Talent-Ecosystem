import React from 'react';
import { Role } from '../types';
import AthleteIcon from './icons/AthleteIcon';
import CoachIcon from './icons/CoachIcon';
import ThemeToggleButton from './ThemeToggleButton';
import { useTranslations } from '../hooks/useTranslations';

interface LandingPageProps {
  onSelectRole: (role: Role) => void;
}

const RoleCard: React.FC<{ role: Role, onClick: () => void }> = ({ role, onClick }) => {
  const t = useTranslations();
  const isAthlete = role === Role.ATHLETE;
  const title = isAthlete ? t('landingPage.athlete') : t('landingPage.coach');
  const description = isAthlete ? t('landingPage.athleteDescription') : t('landingPage.coachDescription');
  const Icon = isAthlete ? AthleteIcon : CoachIcon;

  return (
    <div
      onClick={onClick}
      className="group w-full md:w-80 h-96 p-8 flex flex-col items-center justify-center bg-light-card dark:bg-dark-card rounded-2xl shadow-lg border-2 border-light-border dark:border-dark-border hover:border-brand-primary dark:hover:border-brand-primary transform hover:-translate-y-2 transition-all duration-300 cursor-pointer"
    >
      <Icon className="w-24 h-24 text-medium-dark-text dark:text-medium-text group-hover:text-brand-primary transition-colors duration-300" />
      <h3 className="mt-6 text-3xl font-bold text-dark-text dark:text-light-text">{title}</h3>
      <p className="mt-2 text-center text-medium-dark-text dark:text-medium-text">{description}</p>
    </div>
  );
};


const LandingPage: React.FC<LandingPageProps> = ({ onSelectRole }) => {
  const t = useTranslations();

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen">
      <div className="absolute top-4 right-4">
        <ThemeToggleButton />
      </div>
      <h1 className="text-4xl font-extrabold mb-2 text-dark-text dark:text-light-text text-center">{t('loginPage.welcome')}</h1>
      <h2 className="text-5xl font-extrabold mb-12 text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-secondary text-center">{t('loginPage.appName')}</h2>

      <div className="text-center mb-10">
        <h3 className="text-2xl font-semibold text-dark-text dark:text-light-text">{t('landingPage.title')}</h3>
      </div>
      
      <div className="flex flex-col md:flex-row items-center justify-center gap-10">
        <RoleCard role={Role.ATHLETE} onClick={() => onSelectRole(Role.ATHLETE)} />
        <RoleCard role={Role.COACH} onClick={() => onSelectRole(Role.COACH)} />
      </div>
    </div>
  );
};

export default LandingPage;