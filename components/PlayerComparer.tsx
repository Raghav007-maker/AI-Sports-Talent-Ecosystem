import React, { useState, useEffect } from 'react';
import { User } from '../types';
import ProfileCard from './ProfileCard';
import { comparePlayers } from '../services/geminiService';
import Loader from './Loader';
import SparklesIcon from './icons/SparklesIcon';
import { useTranslations } from '../hooks/useTranslations';

interface PlayerComparerProps {
  athletes: User[];
}

const PlayerComparer: React.FC<PlayerComparerProps> = ({ athletes }) => {
  const [selected, setSelected] = useState<User[]>([]);
  const [comparison, setComparison] = useState('');
  const [loading, setLoading] = useState(false);
  const t = useTranslations();

  const handleSelect = (athlete: User) => {
    setSelected(prev => {
      if (prev.find(a => a.id === athlete.id)) {
        return prev.filter(a => a.id !== athlete.id);
      }
      if (prev.length < 2) {
        return [...prev, athlete];
      }
      return [prev[1], athlete]; // Keep last selected and add new one
    });
  };

  const handleCompare = async () => {
    if (selected.length !== 2) return;
    setLoading(true);
    const player1Str = `Name: ${selected[0].name}, Sport: ${selected[0].sport}, Stats: ${JSON.stringify(selected[0].stats)}`;
    const player2Str = `Name: ${selected[1].name}, Sport: ${selected[1].sport}, Stats: ${JSON.stringify(selected[1].stats)}`;
    const result = await comparePlayers(player1Str, player2Str);
    setComparison(result);
    setLoading(false);
  };
  
  useEffect(() => {
    setComparison('');
  }, [selected]);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <SparklesIcon className="w-6 h-6 text-brand-primary" />
        {t('playerComparer.title')}
      </h2>
      <p className="text-medium-dark-text dark:text-medium-text mb-6">{t('playerComparer.description')}</p>

      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {athletes.map(athlete => (
          <ProfileCard 
            key={athlete.id} 
            athlete={athlete} 
            onSelect={handleSelect}
            isSelected={!!selected.find(a => a.id === athlete.id)} 
          />
        ))}
      </div>

      <button
        onClick={handleCompare}
        disabled={selected.length !== 2 || loading}
        className="w-full bg-brand-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-brand-secondary transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center"
      >
        <SparklesIcon className="w-5 h-5 mr-2" />
        {loading ? t('playerComparer.loading') : t('playerComparer.button')}
      </button>

      {(loading || comparison) && (
        <div className="mt-6 bg-light-bg dark:bg-gray-800 rounded-lg p-6 border border-light-border dark:border-dark-border">
          {loading ? (
            <Loader message={t('playerComparer.loaderMessage')} />
          ) : (
             <div className="prose dark:prose-invert" dangerouslySetInnerHTML={{ __html: comparison.replace(/\n/g, '<br/>') }}></div>
          )}
        </div>
      )}
    </div>
  );
};

export default PlayerComparer;