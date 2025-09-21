import React, { useState } from 'react';
import ProfileCard from './ProfileCard';
import PerformanceAnalyzer from './PerformanceAnalyzer';
import BioGenerator from './BioGenerator';
import ProgressTracker from './ProgressTracker';
import Achievements from './Achievements';
import { User, AnalysisRecord } from '../types';
import Leaderboard from './Leaderboard';
import { useTranslations } from '../hooks/useTranslations';
import { useData } from '../contexts/DataContext';
import EventsView from './EventsView';
import Timer from './Timer';
import Chatbot from './Chatbot';

interface AthleteDashboardProps {
  athlete: User;
}

const AthleteDashboard: React.FC<AthleteDashboardProps> = ({ athlete }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const { analysisRecords, addAnalysisRecord } = useData();
  const t = useTranslations();

  const athleteAnalysisHistory = analysisRecords.filter(r => r.userId === athlete.id);

  const handleAnalysisComplete = (record: Omit<AnalysisRecord, 'id' | 'timestamp' | 'coachFeedback' | 'userId'>) => {
    addAnalysisRecord(record, athlete.id);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileCard athlete={athlete} isCurrentUser={true} />;
      case 'analyzer':
        return <PerformanceAnalyzer athlete={athlete} onAnalysisComplete={handleAnalysisComplete} />;
      case 'progress':
        return <ProgressTracker history={athleteAnalysisHistory} />;
      case 'achievements':
        return <Achievements athlete={athlete} history={athleteAnalysisHistory} />;
      case 'leaderboard':
        return <Leaderboard currentUser={athlete} />;
      case 'bio':
        return <BioGenerator athlete={athlete} />;
      case 'events':
        return <EventsView currentUser={athlete} />;
      case 'timer':
        return <Timer />;
      case 'chatbot':
        return <Chatbot athlete={athlete} />;
      default:
        return <ProfileCard athlete={athlete} isCurrentUser={true}/>;
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
          <TabButton tabId="profile" label={t('athleteDashboard.tabs.profile')} />
          <TabButton tabId="analyzer" label={t('athleteDashboard.tabs.analyzer')} />
          <TabButton tabId="progress" label={t('athleteDashboard.tabs.progress')} />
          <TabButton tabId="achievements" label={t('athleteDashboard.tabs.achievements')} />
          <TabButton tabId="leaderboard" label={t('athleteDashboard.tabs.leaderboard')} />
          <TabButton tabId="bio" label={t('athleteDashboard.tabs.bio')} />
          <TabButton tabId="events" label={t('athleteDashboard.tabs.events')} />
          <TabButton tabId="timer" label={t('athleteDashboard.tabs.timer')} />
          <TabButton tabId="chatbot" label={t('athleteDashboard.tabs.chatbot')} />
      </div>
      <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-lg p-6 min-h-[400px]">
        {renderContent()}
      </div>
    </div>
  );
};

export default AthleteDashboard;