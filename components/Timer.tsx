import React, { useState, useEffect, useRef } from 'react';
import { useTranslations } from '../hooks/useTranslations';
import TimerIcon from './icons/TimerIcon';

const Timer: React.FC = () => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState<number[]>([]);
  const intervalRef = useRef<number | null>(null);
  const t = useTranslations();

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = window.setInterval(() => {
        setTime(prevTime => prevTime + 10);
      }, 10);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]);

  const handleStartStop = () => {
    setIsRunning(!isRunning);
  };

  const handleLap = () => {
    if (isRunning) {
      setLaps([...laps, time]);
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setTime(0);
    setLaps([]);
  };

  const formatTime = (timeMs: number) => {
    const minutes = Math.floor(timeMs / 60000).toString().padStart(2, '0');
    const seconds = Math.floor((timeMs % 60000) / 1000).toString().padStart(2, '0');
    const milliseconds = (timeMs % 1000).toString().padStart(3, '0').slice(0, 2);
    return `${minutes}:${seconds}.${milliseconds}`;
  };

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <TimerIcon className="w-6 h-6 text-brand-primary" />
        {t('timerComponent.title')}
      </h2>
      <div className="text-7xl font-mono font-bold text-dark-text dark:text-light-text mb-8 p-4 bg-light-bg dark:bg-gray-800 rounded-lg w-full max-w-sm text-center">
        {formatTime(time)}
      </div>
      <div className="flex gap-4 mb-8">
        <button
          onClick={handleReset}
          className="w-24 py-3 text-sm font-semibold bg-gray-200 dark:bg-gray-700 text-dark-text dark:text-light-text rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          {t('timerComponent.reset')}
        </button>
        <button
          onClick={handleStartStop}
          className={`w-24 py-3 text-sm font-semibold text-white rounded-full transition-colors ${
            isRunning ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
          }`}
        >
          {isRunning ? t('timerComponent.stop') : t('timerComponent.start')}
        </button>
         <button
          onClick={handleLap}
          disabled={!isRunning && time === 0}
          className="w-24 py-3 text-sm font-semibold bg-brand-primary text-white rounded-full hover:bg-brand-secondary transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
        >
          {t('timerComponent.lap')}
        </button>
      </div>
      {laps.length > 0 && (
        <div className="w-full max-w-sm">
          <h3 className="text-lg font-semibold mb-2 text-center">{t('timerComponent.laps')}</h3>
          <ul className="h-40 overflow-y-auto bg-light-bg dark:bg-gray-800 rounded-lg p-2 border border-light-border dark:border-dark-border">
            {laps.map((lap, index) => {
              const prevLap = index > 0 ? laps[index - 1] : 0;
              const lapTime = lap - prevLap;
              return (
                 <li key={index} className="flex justify-between p-2 border-b border-light-border dark:border-dark-border last:border-b-0 text-sm font-mono">
                    <span className="text-medium-dark-text dark:text-medium-text">Lap {index + 1}</span>
                    <span className="text-dark-text dark:text-light-text">{formatTime(lapTime)}</span>
                 </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Timer;