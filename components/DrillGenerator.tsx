import React, { useState } from 'react';
import { generateDrills } from '../services/geminiService';
import { Drill } from '../types';
import Loader from './Loader';
import SparklesIcon from './icons/SparklesIcon';
import { useTranslations } from '../hooks/useTranslations';

const DrillGenerator: React.FC = () => {
  const [sport, setSport] = useState('Basketball');
  const [skill, setSkill] = useState('');
  const [drills, setDrills] = useState<Drill[]>([]);
  const [loading, setLoading] = useState(false);
  const t = useTranslations();

  const handleGenerate = async () => {
    if (!sport || !skill) return;
    setLoading(true);
    setDrills([]);
    const result = await generateDrills(sport, skill);
    setDrills(result);
    setLoading(false);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <SparklesIcon className="w-6 h-6 text-brand-primary" />
        {t('drillGenerator.title')}
      </h2>
      <p className="text-medium-dark-text dark:text-medium-text mb-6">{t('drillGenerator.description')}</p>

      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <select
          value={sport}
          onChange={(e) => setSport(e.target.value)}
          className="w-full md:w-1/3 p-3 bg-light-bg dark:bg-gray-800 border border-light-border dark:border-dark-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition text-dark-text dark:text-light-text"
        >
          <option>Basketball</option>
          <option>Soccer</option>
          <option>Football</option>
          <option>Track & Field</option>
        </select>
        <input
          type="text"
          value={skill}
          onChange={(e) => setSkill(e.target.value)}
          placeholder={t('drillGenerator.placeholder')}
          className="w-full md:w-2/3 p-3 bg-light-bg dark:bg-gray-800 border border-light-border dark:border-dark-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition text-dark-text dark:text-light-text"
        />
      </div>
      
      <button
        onClick={handleGenerate}
        disabled={!sport || !skill || loading}
        className="w-full bg-brand-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-brand-secondary transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center"
      >
        <SparklesIcon className="w-5 h-5 mr-2" />
        {loading ? t('drillGenerator.loading') : t('drillGenerator.button')}
      </button>

      <div className="mt-6 space-y-4">
        {loading && <Loader message={t('drillGenerator.loaderMessage')} />}
        {drills.map((drill, index) => (
          <div key={index} className="bg-light-bg dark:bg-gray-800 p-6 rounded-lg border border-light-border dark:border-dark-border">
            <h3 className="text-xl font-bold text-brand-primary">{drill.title}</h3>
            <div className="mt-4 space-y-3">
              <div>
                <h4 className="font-semibold text-dark-text dark:text-light-text">{t('drillGenerator.objective')}</h4>
                <p className="text-medium-dark-text dark:text-medium-text">{drill.objective}</p>
              </div>
              <div>
                <h4 className="font-semibold text-dark-text dark:text-light-text">{t('drillGenerator.setup')}</h4>
                <p className="text-medium-dark-text dark:text-medium-text">{drill.setup}</p>
              </div>
              <div>
                <h4 className="font-semibold text-dark-text dark:text-light-text">{t('drillGenerator.instructions')}</h4>
                <p className="text-medium-dark-text dark:text-medium-text whitespace-pre-line">{drill.instructions}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DrillGenerator;