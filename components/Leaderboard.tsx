import React, { useState } from 'react';
import { MOCK_USERS } from '../constants';
import { Role, User } from '../types';
import LeaderboardIcon from './icons/LeaderboardIcon';
import FlameIcon from './icons/FlameIcon';
import SparklesIcon from './icons/SparklesIcon';
import { useSettings } from '../contexts/SettingsContext';
import { useTranslations } from '../hooks/useTranslations';

interface LeaderboardProps {
  currentUser: User;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ currentUser }) => {
  const athletes = MOCK_USERS.filter(user => user.role === Role.ATHLETE);
  const { lowBandwidthMode } = useSettings();
  const t = useTranslations();
  
  const [visibleAvatars, setVisibleAvatars] = useState<Record<number, boolean>>({});

  const showAvatar = (id: number) => {
    setVisibleAvatars(prev => ({ ...prev, [id]: true }));
  };

  // Sort by AI score (desc), then by streak (desc) as a tie-breaker
  const sortedAthletes = [...athletes].sort((a, b) => {
    const scoreA = a.aiScore ?? 0;
    const scoreB = b.aiScore ?? 0;
    if (scoreA !== scoreB) {
      return scoreB - scoreA;
    }
    return (b.streak ?? 0) - (a.streak ?? 0);
  });

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <LeaderboardIcon className="w-6 h-6 text-brand-primary" />
        {t('leaderboard.title')}
      </h2>
      <p className="text-medium-dark-text dark:text-medium-text mb-6">
        {t('leaderboard.description')}
      </p>
      <div className="overflow-x-auto bg-light-bg dark:bg-dark-card rounded-lg border border-light-border dark:border-dark-border">
        <table className="min-w-full divide-y divide-light-border dark:divide-dark-border">
          <thead className="bg-light-bg dark:bg-gray-800">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-medium-dark-text dark:text-medium-text uppercase tracking-wider">
                {t('leaderboard.rank')}
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-medium-dark-text dark:text-medium-text uppercase tracking-wider">
                {t('leaderboard.athlete')}
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-medium-dark-text dark:text-medium-text uppercase tracking-wider">
                {t('leaderboard.aiScore')}
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-medium-dark-text dark:text-medium-text uppercase tracking-wider">
                {t('leaderboard.streak')}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-light-border dark:divide-dark-border">
            {sortedAthletes.map((athlete, index) => (
              <tr 
                key={athlete.id} 
                className={athlete.id === currentUser.id ? 'bg-brand-secondary/20' : ''}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`text-lg font-bold ${index < 3 ? 'text-yellow-500' : 'text-dark-text dark:text-light-text'}`}>
                    {index + 1}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      {(!lowBandwidthMode || visibleAvatars[athlete.id]) ? (
                        <img className="h-10 w-10 rounded-full object-cover" src={athlete.avatarUrl} alt={athlete.name} />
                      ) : (
                         <button onClick={() => showAvatar(athlete.id)} className="h-10 w-10 rounded-full bg-gray-300 dark:bg-gray-700 text-xs flex items-center justify-center text-center">
                           {t('leaderboard.load')}
                         </button>
                      )}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-dark-text dark:text-light-text">{athlete.name}</div>
                      <div className="text-sm text-medium-dark-text dark:text-medium-text">{athlete.sport}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1 text-sm text-dark-text dark:text-light-text font-semibold">
                        <SparklesIcon className="w-4 h-4 text-purple-500"/>
                        {athlete.aiScore ?? 'N/A'}
                    </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1 text-sm text-dark-text dark:text-light-text font-semibold">
                        <FlameIcon className="w-4 h-4 text-orange-500"/>
                        {athlete.streak ?? 0}
                    </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leaderboard;