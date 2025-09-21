import React from 'react';
import { AnalysisRecord } from '../types';
import HistoryIcon from './icons/HistoryIcon';
import { useTranslations } from '../hooks/useTranslations';
import AlertTriangleIcon from './icons/AlertTriangleIcon';

interface ProgressTrackerProps {
  history: AnalysisRecord[];
}

const ProgressTracker: React.FC<ProgressTrackerProps> = ({ history }) => {
  const t = useTranslations();

  if (history.length === 0) {
    return (
      <div className="text-center py-10">
        <HistoryIcon className="w-12 h-12 mx-auto text-gray-400" />
        <h3 className="mt-2 text-lg font-medium text-dark-text dark:text-light-text">{t('progressTracker.noHistoryTitle')}</h3>
        <p className="mt-1 text-sm text-medium-dark-text dark:text-medium-text">
          {t('progressTracker.noHistoryDescription')}
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <HistoryIcon className="w-6 h-6 text-brand-primary" />
        {t('progressTracker.title')}
      </h2>
      <div className="space-y-4">
        {history.map((record) => (
          <details key={record.id} className="bg-light-bg dark:bg-gray-800 p-4 rounded-lg border border-light-border dark:border-dark-border group">
            <summary className="font-semibold cursor-pointer flex justify-between items-center text-dark-text dark:text-light-text">
              <span>{t('progressTracker.analysisFrom', { date: record.timestamp.toLocaleDateString(), time: record.timestamp.toLocaleTimeString() })}</span>
              <span className="text-sm text-brand-primary group-open:hidden">{t('progressTracker.viewDetails')}</span>
              <span className="text-sm text-brand-primary hidden group-open:inline">{t('progressTracker.hideDetails')}</span>
            </summary>
            <div className="mt-4 pt-4 border-t border-light-border dark:border-dark-border text-sm space-y-4">
               {record.feedback.injuryDetection && !record.feedback.injuryDetection.toLowerCase().includes("no immediate signs") && (
                    <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg text-red-800 dark:text-red-300 flex items-start gap-2 text-sm">
                        <AlertTriangleIcon className="w-5 h-5 mt-0.5 flex-shrink-0" />
                        <div>
                            <h4 className="font-bold">{t('performanceAnalyzer.injuryDetection')}</h4>
                            <p>{record.feedback.injuryDetection}</p>
                        </div>
                    </div>
                )}
               <div>
                  <h4 className="font-bold text-dark-text dark:text-light-text">{t('performanceAnalyzer.techniqueAnalysis')}</h4>
                  <div className="prose prose-sm dark:prose-invert" dangerouslySetInnerHTML={{ __html: record.feedback.techniqueAnalysis.replace(/\n/g, '<br/>') }} />
              </div>
               <div>
                  <h4 className="font-bold text-dark-text dark:text-light-text">{t('performanceAnalyzer.injuryRisk')}</h4>
                  <p className="text-medium-dark-text dark:text-medium-text">{record.feedback.injuryRisk}</p>
              </div>
              <div>
                  <h4 className="font-bold text-dark-text dark:text-light-text">{t('performanceAnalyzer.cheatDetection')}</h4>
                  <p className="text-medium-dark-text dark:text-medium-text">{record.feedback.cheatDetection}</p>
              </div>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
};

export default ProgressTracker;