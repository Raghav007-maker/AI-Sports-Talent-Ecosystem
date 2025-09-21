import React, { useState } from 'react';
import { User } from '../types';
import { useSettings } from '../contexts/SettingsContext';
import { useTranslations } from '../hooks/useTranslations';

interface ProfileCardProps {
  athlete: User;
  isCurrentUser?: boolean;
  onSelect?: (athlete: User) => void;
  isSelected?: boolean;
}

const StatItem: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="text-center">
    <p className="text-sm text-medium-dark-text dark:text-medium-text">{label}</p>
    <p className="text-lg font-bold text-dark-text dark:text-light-text">{value}</p>
  </div>
);

const ProfileCard: React.FC<ProfileCardProps> = ({ athlete, isCurrentUser = false, onSelect, isSelected = false }) => {
  const { lowBandwidthMode } = useSettings();
  const t = useTranslations();
  const [showImage, setShowImage] = useState(!lowBandwidthMode);

  const cardClasses = `bg-light-card dark:bg-gray-800 p-6 rounded-lg border-2 transition-colors duration-200 ${
    isSelected ? 'border-brand-primary' : 'border-light-border dark:border-dark-border'
  } ${onSelect ? 'cursor-pointer hover:border-brand-secondary' : ''}`;

  return (
    <div className={cardClasses} onClick={() => onSelect?.(athlete)}>
      <div className="flex items-center space-x-4">
        {showImage ? (
           <img
            src={athlete.avatarUrl}
            alt={athlete.name}
            className="w-20 h-20 rounded-full border-2 border-brand-primary object-cover"
          />
        ) : (
          <div className="w-20 h-20 rounded-full bg-light-bg dark:bg-gray-700 flex flex-col items-center justify-center border-2 border-light-border dark:border-dark-border">
            <button onClick={(e) => { e.stopPropagation(); setShowImage(true); }} className="text-xs px-2 py-1 bg-brand-primary text-white rounded">
              {t('profileCard.loadImage')}
            </button>
          </div>
        )}
        <div>
          <h3 className="text-xl font-bold text-dark-text dark:text-light-text">{athlete.name} {isCurrentUser && `(${t('profileCard.you')})`}</h3>
          <p className="text-brand-primary">{athlete.sport}</p>
          <p className="text-sm text-medium-dark-text dark:text-medium-text">{athlete.location}</p>
        </div>
      </div>
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatItem label={t('profileCard.sprint')} value={athlete.stats.sprint} />
        <StatItem label={t('profileCard.vertical')} value={athlete.stats.vertical} />
        <StatItem label={t('profileCard.endurance')} value={athlete.stats.endurance} />
        <StatItem label={t('profileCard.agility')} value={athlete.stats.agility} />
      </div>
    </div>
  );
};

export default ProfileCard;