import React from 'react';
import { User } from '../types';
import ProfileCard from './ProfileCard';
import CoachFeedbackSection from './CoachFeedbackSection';
import { useData } from '../contexts/DataContext';
import AlertTriangleIcon from './icons/AlertTriangleIcon';
import ImprovementPlanner from './ImprovementPlanner';
import { useTranslations } from '../hooks/useTranslations';

interface AthleteDetailViewProps {
  athlete: User;
  coach: User;
  onBack: () => void;
}

const AthleteDetailView: React.FC<AthleteDetailViewProps> = ({ athlete, coach, onBack }) => {
  const { analysisRecords } = useData();
  const t = useTranslations();
  const athleteRecords = analysisRecords.filter(r => r.userId === athlete.id);

  return (
    <div className="space-y-6">
        <button onClick={onBack} className="px-4 py-2 text-sm font-semibold bg-light-bg dark:bg-dark-border text-dark-text dark:text-light-text rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200">
            &larr; {t('athleteDetailView.backToRoster')}
        </button>

        <ProfileCard athlete={athlete} />
        
        <ImprovementPlanner athlete={athlete} history={athleteRecords} />

        <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-lg p-6">
            <h3 className="text-xl font-bold mb-4">{t('athleteDetailView.performanceHistory')}</h3>
            {athleteRecords.length > 0 ? (
                <div className="space-y-6">
                    {athleteRecords.map(record => (
                        <div key={record.id} className="bg-light-bg dark:bg-gray-800 p-4 rounded-lg border border-light-border dark:border-dark-border">
                            <p className="text-sm text-medium-dark-text dark:text-medium-text mb-2">
                                {t('progressTracker.analysisFrom', { date: record.timestamp.toLocaleDateString(), time: record.timestamp.toLocaleTimeString() })}
                            </p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                               <div className="space-y-4">
                                    <h4 className="font-semibold">{t('athleteDetailView.aiAnalysis')}</h4>
                                    {record.feedback.injuryDetection && !record.feedback.injuryDetection.toLowerCase().includes('no immediate signs') && (
                                        <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg text-red-800 dark:text-red-300 flex items-start gap-2 text-sm">
                                            <AlertTriangleIcon className="w-5 h-5 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <strong className="font-bold">{t('athleteDetailView.injuryDetected')}:</strong> 
                                                <p>{record.feedback.injuryDetection}</p>
                                            </div>
                                        </div>
                                    )}
                                    <div className="prose prose-sm dark:prose-invert" dangerouslySetInnerHTML={{ __html: record.feedback.techniqueAnalysis.replace(/\n/g, '<br/>') }} />
                                    <p><strong className="font-semibold">{t('athleteDetailView.futureInjuryRisk')}:</strong> {record.feedback.injuryRisk}</p>
                                    <p><strong className="font-semibold">{t('athleteDetailView.cheatDetectionLabel')}:</strong> {record.feedback.cheatDetection}</p>
                               </div>

                               <CoachFeedbackSection record={record} coach={coach} />
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-medium-dark-text dark:text-medium-text">{t('athleteDetailView.noAnalyses')}</p>
            )}
        </div>
    </div>
  );
};

export default AthleteDetailView;