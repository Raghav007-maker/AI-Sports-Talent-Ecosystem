import React, { useState } from 'react';
import { analyzeMedia } from '../services/geminiService';
import Loader from './Loader';
import SparklesIcon from './icons/SparklesIcon';
import { User, AnalysisFeedback, AnalysisRecord } from '../types';
import { useSettings } from '../contexts/SettingsContext';
import { useTranslations } from '../hooks/useTranslations';
import AlertTriangleIcon from './icons/AlertTriangleIcon';

interface PerformanceAnalyzerProps {
  athlete: User;
  onAnalysisComplete: (record: Omit<AnalysisRecord, 'id' | 'timestamp' | 'coachFeedback' | 'userId'>) => void;
}

const PerformanceAnalyzer: React.FC<PerformanceAnalyzerProps> = ({ athlete, onAnalysisComplete }) => {
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<'image' | 'video' | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisFeedback | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const { lowBandwidthMode } = useSettings();
  const t = useTranslations();
  const [showPreview, setShowPreview] = useState(!lowBandwidthMode);


  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setMediaFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setMediaType(file.type.startsWith('video/') ? 'video' : 'image');
      setAnalysis(null);
      setError('');
      setShowPreview(!lowBandwidthMode);
    }
  };

  const handleAnalyze = async () => {
    if (!mediaFile || !mediaType) {
      setError(t('performanceAnalyzer.errorUpload'));
      return;
    }
    setLoading(true);
    setError('');
    const result = await analyzeMedia(mediaFile, athlete.sport);
    setAnalysis(result);
    setLoading(false);

    if (!result.techniqueAnalysis.startsWith("Error")) {
        onAnalysisComplete({
            mediaUrl: URL.createObjectURL(mediaFile),
            mediaType: mediaType,
            feedback: result,
            aiScore: result.performanceScore
        });
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <SparklesIcon className="w-6 h-6 text-brand-primary" />
        {t('performanceAnalyzer.title')}
      </h2>
      <p className="text-medium-dark-text dark:text-medium-text mb-6">{t('performanceAnalyzer.description')}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col items-center justify-center p-4 bg-light-bg dark:bg-gray-800 rounded-lg border-2 border-dashed border-light-border dark:border-dark-border min-h-[300px]">
          {previewUrl && showPreview && mediaType === 'image' && (
            <img src={previewUrl} alt="Preview" className="max-h-64 rounded-lg object-contain" />
          )}
          {previewUrl && showPreview && mediaType === 'video' && (
            <video src={previewUrl} controls className="max-h-64 rounded-lg object-contain" />
          )}
          {previewUrl && !showPreview && (
             <button onClick={() => setShowPreview(true)} className="px-4 py-2 bg-brand-primary text-white rounded-lg">
              {t('performanceAnalyzer.showPreview')}
            </button>
          )}
          {!previewUrl && (
            <p className="text-medium-dark-text dark:text-medium-text text-center">{t('performanceAnalyzer.previewPlaceholder')}</p>
          )}
          <input
            type="file"
            accept="video/*,image/*"
            onChange={handleFileChange}
            className="mt-4 block w-full text-sm text-medium-dark-text dark:text-medium-text
                       file:mr-4 file:py-2 file:px-4
                       file:rounded-full file:border-0
                       file:text-sm file:font-semibold
                       file:bg-brand-primary file:text-white
                       hover:file:bg-brand-secondary"
          />
        </div>
        
        <div className="flex flex-col">
            <button
                onClick={handleAnalyze}
                disabled={!mediaFile || loading}
                className="w-full bg-brand-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-brand-secondary transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center"
            >
                <SparklesIcon className="w-5 h-5 mr-2" />
                {loading ? t('performanceAnalyzer.loading') : t('performanceAnalyzer.button')}
            </button>
            {error && <p className="text-red-500 mt-2">{error}</p>}
            
            <div className="mt-4 flex-grow bg-light-bg dark:bg-gray-800 rounded-lg p-4 border border-light-border dark:border-dark-border overflow-y-auto max-h-80">
                {loading && <Loader />}
                {analysis && !loading && (
                    <div className="space-y-4 text-sm">
                        {analysis.performanceScore && (
                             <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-purple-800 dark:text-purple-300 flex items-start gap-2 text-sm">
                                <SparklesIcon className="w-5 h-5 mt-0.5 flex-shrink-0" />
                                <div>
                                    <h4 className="font-bold">Performance Score: {analysis.performanceScore} / 100</h4>
                                </div>
                            </div>
                        )}
                        {analysis.injuryDetection && !analysis.injuryDetection.toLowerCase().includes("no immediate signs") && (
                             <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg text-red-800 dark:text-red-300 flex items-start gap-2 text-sm">
                                <AlertTriangleIcon className="w-5 h-5 mt-0.5 flex-shrink-0" />
                                <div>
                                    <h4 className="font-bold">{t('performanceAnalyzer.injuryDetection')}</h4>
                                    <p>{analysis.injuryDetection}</p>
                                </div>
                            </div>
                        )}
                        <div>
                            <h4 className="font-bold text-dark-text dark:text-light-text">{t('performanceAnalyzer.techniqueAnalysis')}</h4>
                            <div className="prose prose-sm dark:prose-invert" dangerouslySetInnerHTML={{ __html: analysis.techniqueAnalysis.replace(/\n/g, '<br/>') }} />
                        </div>
                         <div>
                            <h4 className="font-bold text-dark-text dark:text-light-text">{t('performanceAnalyzer.injuryRisk')}</h4>
                            <p className="text-medium-dark-text dark:text-medium-text">{analysis.injuryRisk}</p>
                        </div>
                        <div>
                            <h4 className="font-bold text-dark-text dark:text-light-text">{t('performanceAnalyzer.cheatDetection')}</h4>
                            <p className="text-medium-dark-text dark:text-medium-text">{analysis.cheatDetection}</p>
                        </div>
                    </div>
                )}
                {!analysis && !loading && (
                    <p className="text-medium-dark-text dark:text-medium-text text-center self-center">{t('performanceAnalyzer.resultsPlaceholder')}</p>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceAnalyzer;