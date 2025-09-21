import React from 'react';
import { User, AnalysisRecord } from '../types';
import FlameIcon from './icons/FlameIcon';
import TrophyIcon from './icons/TrophyIcon';
import BadgeIcon from './icons/BadgeIcon';
import SparklesIcon from './icons/SparklesIcon';
import { useTranslations } from '../hooks/useTranslations';
import PerformanceGraph from './PerformanceGraph';

interface AchievementsProps {
  athlete: User;
  history: AnalysisRecord[];
}

const AchievementCard: React.FC<{ icon: React.ReactNode; title: string; value: string | number; color: string; }> = ({ icon, title, value, color }) => (
    <div className="flex flex-col items-center justify-center p-6 bg-light-bg dark:bg-gray-800 rounded-lg border border-light-border dark:border-dark-border text-center">
        <div className={`mb-3 p-3 rounded-full ${color}`}>
            {icon}
        </div>
        <p className="text-3xl font-bold text-dark-text dark:text-light-text">{value}</p>
        <p className="text-sm text-medium-dark-text dark:text-medium-text">{title}</p>
    </div>
);


const Achievements: React.FC<AchievementsProps> = ({ athlete, history }) => {
  const t = useTranslations();

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">{t('achievements.title')}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <AchievementCard 
              icon={<SparklesIcon className="w-6 h-6 text-white" />}
              title={t('achievements.aiScore')}
              value={athlete.aiScore ?? 'N/A'}
              color="bg-purple-500"
          />
          <AchievementCard 
              icon={<FlameIcon className="w-6 h-6 text-white" />}
              title={t('achievements.streak')}
              value={athlete.streak ?? 0}
              color="bg-orange-500"
          />
          <AchievementCard 
              icon={<TrophyIcon className="w-6 h-6 text-white" />}
              title={t('achievements.rank')}
              value={`#${athlete.leaderboardPosition ?? 'N/A'}`}
              color="bg-yellow-500"
          />
          <AchievementCard 
              icon={<BadgeIcon className="w-6 h-6 text-white" />}
              title={t('achievements.badgesEarned')}
              value={athlete.badges?.length ?? 0}
              color="bg-blue-500"
          />
        </div>
      </div>
      
      <PerformanceGraph history={history} />

      <div>
        <h3 className="text-xl font-bold mb-4">{t('achievements.badges')}</h3>
        <div className="flex flex-wrap gap-4">
            {athlete.badges && athlete.badges.length > 0 ? (
                athlete.badges.map(badge => (
                    <div key={badge} className="flex items-center gap-2 bg-light-bg dark:bg-gray-800 py-2 px-4 rounded-full border border-light-border dark:border-dark-border">
                        <BadgeIcon className="w-5 h-5 text-brand-primary" />
                        <span className="font-semibold text-sm text-dark-text dark:text-light-text">{badge}</span>
                    </div>
                ))
            ) : (
                <p className="text-medium-dark-text dark:text-medium-text">{t('achievements.noBadges')}</p>
            )}
        </div>
      </div>
    </div>
  );
};

export default Achievements;