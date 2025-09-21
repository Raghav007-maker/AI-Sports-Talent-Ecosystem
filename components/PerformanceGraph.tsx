import React from 'react';
import { AnalysisRecord } from '../types';
import { useTranslations } from '../hooks/useTranslations';

interface PerformanceGraphProps {
  history: AnalysisRecord[];
}

const PerformanceGraph: React.FC<PerformanceGraphProps> = ({ history }) => {
  const t = useTranslations();

  const data = history
    .filter(record => typeof record.aiScore === 'number')
    .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

  if (data.length < 2) {
    return (
      <div className="bg-light-bg dark:bg-gray-800 p-6 rounded-lg border border-light-border dark:border-dark-border text-center">
        <h3 className="text-xl font-bold mb-2">{t('performanceGraph.title')}</h3>
        <p className="text-medium-dark-text dark:text-medium-text">{t('performanceGraph.notEnoughData')}</p>
      </div>
    );
  }

  const width = 500;
  const height = 200;
  const margin = { top: 20, right: 20, bottom: 30, left: 30 };
  const graphWidth = width - margin.left - margin.right;
  const graphHeight = height - margin.top - margin.bottom;

  const scores = data.map(d => d.aiScore!);
  const minScore = Math.min(...scores);
  const maxScore = Math.max(...scores);
  
  // To avoid a flat line if all scores are the same, give some padding.
  const yMin = minScore > 10 ? minScore - 10 : 0;
  const yMax = maxScore < 90 ? maxScore + 10 : 100;

  const timestamps = data.map(d => d.timestamp.getTime());
  const xMin = Math.min(...timestamps);
  const xMax = Math.max(...timestamps);

  const getX = (timestamp: number) => {
    if (xMax === xMin) return margin.left;
    return margin.left + ((timestamp - xMin) / (xMax - xMin)) * graphWidth;
  };

  const getY = (score: number) => {
    if (yMax === yMin) return margin.top + graphHeight / 2;
    return margin.top + graphHeight - ((score - yMin) / (yMax - yMin)) * graphHeight;
  };
  
  const linePath = data.map((d, i) => {
    const x = getX(d.timestamp.getTime());
    const y = getY(d.aiScore!);
    return `${i === 0 ? 'M' : 'L'} ${x},${y}`;
  }).join(' ');

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  }

  return (
    <div className="bg-light-bg dark:bg-gray-800 p-4 md:p-6 rounded-lg border border-light-border dark:border-dark-border">
      <h3 className="text-xl font-bold mb-4 text-dark-text dark:text-light-text">{t('performanceGraph.title')}</h3>
      <div className="w-full overflow-x-auto">
        <svg viewBox={`0 0 ${width} ${height}`} className="min-w-[500px]">
          {/* Y-Axis */}
          <line x1={margin.left} y1={margin.top} x2={margin.left} y2={margin.top + graphHeight} className="stroke-current text-gray-300 dark:text-gray-600" />
          {[yMin, yMax].map(tick => (
            <text key={tick} x={margin.left - 8} y={getY(tick) + 4} textAnchor="end" className="text-xs fill-current text-medium-dark-text dark:text-medium-text">{Math.round(tick)}</text>
          ))}

          {/* X-Axis */}
          <line x1={margin.left} y1={margin.top + graphHeight} x2={margin.left + graphWidth} y2={margin.top + graphHeight} className="stroke-current text-gray-300 dark:text-gray-600" />
           {data.map((d, i) => (
             <text key={i} x={getX(d.timestamp.getTime())} y={margin.top + graphHeight + 15} textAnchor="middle" className="text-xs fill-current text-medium-dark-text dark:text-medium-text">
                {formatDate(d.timestamp.getTime())}
             </text>
           ))}
          
          {/* Line */}
          <path d={linePath} strokeWidth="2" fill="none" className="stroke-brand-primary" />
          
          {/* Points */}
          {data.map((d, i) => (
            <circle key={i} cx={getX(d.timestamp.getTime())} cy={getY(d.aiScore!)} r="3" className="fill-brand-secondary" />
          ))}
        </svg>
      </div>
    </div>
  );
};

export default PerformanceGraph;
