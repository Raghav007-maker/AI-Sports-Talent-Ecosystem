import React, { useState } from 'react';
import { generateBio } from '../services/geminiService';
import Loader from './Loader';
import SparklesIcon from './icons/SparklesIcon';
import { User } from '../types';
import { useTranslations } from '../hooks/useTranslations';

interface BioGeneratorProps {
  athlete: User;
}

const BioGenerator: React.FC<BioGeneratorProps> = ({ athlete }) => {
  const [achievements, setAchievements] = useState('');
  const [bio, setBio] = useState('');
  const [loading, setLoading] = useState(false);
  const t = useTranslations();

  const handleGenerate = async () => {
    if (!achievements.trim()) return;
    setLoading(true);
    const result = await generateBio(achievements, athlete.sport);
    setBio(result);
    setLoading(false);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <SparklesIcon className="w-6 h-6 text-brand-primary" />
        {t('bioGenerator.title')}
      </h2>
      <p className="text-medium-dark-text dark:text-medium-text mb-6">{t('bioGenerator.description')}</p>

      <div className="space-y-4">
        <textarea
          value={achievements}
          onChange={(e) => setAchievements(e.target.value)}
          placeholder={t('bioGenerator.placeholder')}
          className="w-full h-32 p-3 bg-light-bg dark:bg-gray-800 border border-light-border dark:border-dark-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition text-dark-text dark:text-light-text"
        />
        <button
          onClick={handleGenerate}
          disabled={!achievements.trim() || loading}
          className="w-full bg-brand-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-brand-secondary transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center"
        >
          <SparklesIcon className="w-5 h-5 mr-2" />
          {loading ? t('bioGenerator.loading') : t('bioGenerator.button')}
        </button>
        
        <div className="mt-4 bg-light-bg dark:bg-gray-800 rounded-lg p-4 border border-light-border dark:border-dark-border min-h-[150px]">
          {loading ? (
            <Loader message={t('bioGenerator.loaderMessage')} />
          ) : bio ? (
            <p className="text-dark-text dark:text-light-text whitespace-pre-wrap">{bio}</p>
          ) : (
            <p className="text-medium-dark-text dark:text-medium-text text-center">{t('bioGenerator.resultsPlaceholder')}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BioGenerator;