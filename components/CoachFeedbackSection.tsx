import React, { useState } from 'react';
import { AnalysisRecord, User } from '../types';
import { useData } from '../contexts/DataContext';
import { useTranslations } from '../hooks/useTranslations';

interface CoachFeedbackSectionProps {
  record: AnalysisRecord;
  coach: User;
}

const CoachFeedbackSection: React.FC<CoachFeedbackSectionProps> = ({ record, coach }) => {
  const [feedbackText, setFeedbackText] = useState('');
  const { addCoachFeedback } = useData();
  const t = useTranslations();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;
    addCoachFeedback(record.id, {
      coachId: coach.id,
      coachName: coach.name,
      feedback: feedbackText,
    });
    setFeedbackText('');
  };

  return (
    <div className="space-y-4">
      <h4 className="font-semibold">{t('athleteDetailView.coachFeedback')}</h4>
      <div className="space-y-3">
        {record.coachFeedback.map(fb => (
          <div key={fb.id} className="bg-light-card dark:bg-dark-card p-3 rounded-md border border-light-border dark:border-dark-border">
            <p className="text-sm">{fb.feedback}</p>
            <p className="text-xs text-medium-dark-text dark:text-medium-text mt-1">- {fb.coachName} on {fb.timestamp.toLocaleDateString()}</p>
          </div>
        ))}
        {record.coachFeedback.length === 0 && (
             <p className="text-sm text-medium-dark-text dark:text-medium-text">{t('athleteDetailView.noFeedback')}</p>
        )}
      </div>
      <form onSubmit={handleSubmit} className="space-y-2">
        <textarea
          value={feedbackText}
          onChange={e => setFeedbackText(e.target.value)}
          placeholder={t('athleteDetailView.provideFeedbackPlaceholder')}
          className="w-full h-24 p-2 bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-md focus:ring-2 focus:ring-brand-primary text-dark-text dark:text-light-text"
        />
        <button
          type="submit"
          className="w-full px-4 py-2 text-sm font-semibold bg-brand-primary text-white rounded-lg hover:bg-brand-secondary transition-colors"
        >
          {t('athleteDetailView.submitFeedback')}
        </button>
      </form>
    </div>
  );
};

export default CoachFeedbackSection;