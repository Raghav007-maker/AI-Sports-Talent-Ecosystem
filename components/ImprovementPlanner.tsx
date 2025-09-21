import React, { useState } from 'react';
import { User, AnalysisRecord, ImprovementTip } from '../types';
import { generateImprovementTips } from '../services/geminiService';
import Loader from './Loader';
import BrainCircuitIcon from './icons/BrainCircuitIcon';
import { useTranslations } from '../hooks/useTranslations';

interface ImprovementPlannerProps {
  athlete: User;
  history: AnalysisRecord[];
}

const ImprovementPlanner: React.FC<ImprovementPlannerProps> = ({ athlete, history }) => {
  const [tips, setTips] = useState<ImprovementTip[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const t = useTranslations();

  const handleGenerate = async () => {
    setLoading(true);
    setError('');
    setTips([]);
    try {
      const result = await generateImprovementTips(athlete, history);
      if (result.length === 0) {
          setError(t('improvementPlanner.error'));
      }
      setTips(result);
    } catch (err) {
      setError(t('improvementPlanner.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-lg p-6">
      <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
        <BrainCircuitIcon className="w-6 h-6 text-brand-primary" />
        {t('improvementPlanner.title')}
      </h3>
      <p className="text-medium-dark-text dark:text-medium-text mb-4 text-sm">{t('improvementPlanner.description')}</p>
      
      <button
        onClick={handleGenerate}
        disabled={loading}
        className="w-full bg-brand-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-brand-secondary transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center"
      >
        <BrainCircuitIcon className="w-5 h-5 mr-2" />
        {loading ? t('improvementPlanner.loading') : t('improvementPlanner.button')}
      </button>

      {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}

      <div className="mt-4 space-y-4">
        {loading && <Loader message={t('improvementPlanner.loaderMessage')} />}
        {tips.map((tip, index) => (
          <div key={index} className="bg-light-bg dark:bg-gray-800 p-4 rounded-lg border border-light-border dark:border-dark-border">
            <h4 className="font-bold text-dark-text dark:text-light-text">{tip.focusArea}</h4>
            <div className="mt-2 space-y-2 text-sm">
              <div>
                <p className="font-semibold">{t('improvementPlanner.suggestion')}:</p>
                <p className="text-medium-dark-text dark:text-medium-text">{tip.suggestion}</p>
              </div>
              <div>
                <p className="font-semibold">{t('improvementPlanner.drill')}:</p>
                <p className="text-medium-dark-text dark:text-medium-text">{tip.drill}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImprovementPlanner;
