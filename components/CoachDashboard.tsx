import React, { useState } from 'react';
import { MOCK_USERS } from '../constants';
import ProfileCard from './ProfileCard';
import PlayerComparer from './PlayerComparer';
import DrillGenerator from './DrillGenerator';
import { Role, User } from '../types';
import Leaderboard from './Leaderboard';
import { useTranslations } from '../hooks/useTranslations';
import AthleteDetailView from './AthleteDetailView';
import EventsView from './EventsView';

interface CoachDashboardProps {
  coach: User;
}

const CoachDashboard: React.FC<CoachDashboardProps> = ({ coach }) => {
  const [activeTab, setActiveTab] = useState('roster');
  const [selectedAthlete, setSelectedAthlete] = useState<User | null>(null);
  const t = useTranslations();

  // Filter for athletes assigned to this coach
  const myAthletes = MOCK_USERS.filter(user => user.role === Role.ATHLETE && user.coachId === coach.id);
  
  // For comparer, show all athletes with visible profiles
  const allVisibleAthletes = MOCK_USERS.filter(user => user.role === Role.ATHLETE && user.profileVisibility !== 'Hidden');

  if (selectedAthlete) {
    return <AthleteDetailView athlete={selectedAthlete} coach={coach} onBack={() => setSelectedAthlete(null)} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'roster':
        return (
            <>
                <h2 className="text-2xl font-bold mb-4">{t('coachDashboard.myRoster')}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {myAthletes.map(athlete => (
                        <div key={athlete.id} onClick={() => setSelectedAthlete(athlete)} className="cursor-pointer">
                          <ProfileCard athlete={athlete} />
                        </div>
                    ))}
                    {myAthletes.length === 0 && <p className="text-medium-dark-text dark:text-medium-text">{t('coachDashboard.noAthletes')}</p>}
                </div>
            </>
        );
      case 'comparer':
        return <PlayerComparer athletes={allVisibleAthletes} />;
      case 'drills':
        return <DrillGenerator />;
      case 'leaderboard':
        return <Leaderboard currentUser={coach} />;
      case 'events':
        return <EventsView currentUser={coach} />;
      default:
        return null;
    }
  };

  const TabButton: React.FC<{tabId: string, label: string}> = ({ tabId, label }) => (
    <button
        onClick={() => setActiveTab(tabId)}
        className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${activeTab === tabId ? 'bg-brand-primary text-white' : 'bg-transparent text-medium-dark-text dark:text-medium-text hover:bg-gray-100 dark:hover:bg-gray-700'}`}
    >
        {label}
    </button>
  );


  return (
    <div className="space-y-6">
      <div className="p-4 bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-lg flex items-center justify-center md:justify-start gap-4 flex-wrap">
          <TabButton tabId="roster" label={t('coachDashboard.tabs.roster')} />
          <TabButton tabId="comparer" label={t('coachDashboard.tabs.comparer')} />
          <TabButton tabId="drills" label={t('coachDashboard.tabs.drills')} />
          <TabButton tabId="leaderboard" label={t('coachDashboard.tabs.leaderboard')} />
          <TabButton tabId="events" label={t('coachDashboard.tabs.events')} />
      </div>
       <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-lg p-6 min-h-[400px]">
        {renderContent()}
      </div>
    </div>
  );
};

export default CoachDashboard;