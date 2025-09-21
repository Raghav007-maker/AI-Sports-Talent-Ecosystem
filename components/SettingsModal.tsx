import React from 'react';
import { useSettings } from '../contexts/SettingsContext';
import { useAuth } from '../contexts/AuthContext';
import { useTranslations } from '../hooks/useTranslations';
import GlobeIcon from './icons/GlobeIcon';
import WifiOffIcon from './icons/WifiOffIcon';
import ShieldCheckIcon from './icons/ShieldCheckIcon';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { 
    language, 
    setLanguage, 
    lowBandwidthMode, 
    setLowBandwidthMode,
    updateProfileVisibility
  } = useSettings();
  const { currentUser, logout } = useAuth();
  const t = useTranslations();

  if (!isOpen) return null;

  const handleVisibilityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (currentUser) {
      updateProfileVisibility(currentUser.id, e.target.value as 'Visible' | 'Hidden');
      // Note: This is a mock. A real app might need to refresh user data.
    }
  };

  const handleDeleteData = () => {
    if (window.confirm(t('settings.deleteDataConfirmation'))) {
        // In a real app, this would trigger an API call to delete user data.
        // For now, we just log out.
        logout();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div 
        className="bg-light-card dark:bg-dark-card w-full max-w-md p-6 rounded-lg shadow-lg border border-light-border dark:border-dark-border"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-dark-text dark:text-light-text">{t('settings.title')}</h2>
          <button onClick={onClose} className="text-medium-dark-text dark:text-medium-text">&times;</button>
        </div>

        <div className="space-y-6">
          {/* Language Settings */}
          <div className="space-y-2">
            <h3 className="font-semibold flex items-center gap-2"><GlobeIcon className="w-5 h-5" />{t('settings.language')}</h3>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as 'en' | 'es')}
              className="w-full p-2 bg-light-bg dark:bg-gray-800 border border-light-border dark:border-dark-border rounded-md"
            >
              <option value="en">English</option>
              <option value="es">Español</option>
            </select>
          </div>

          {/* Accessibility Settings */}
          <div className="space-y-2">
            <h3 className="font-semibold flex items-center gap-2"><WifiOffIcon className="w-5 h-5" />{t('settings.accessibility')}</h3>
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <span className="font-medium">{t('settings.lowBandwidthMode')}</span>
                <p className="text-sm text-medium-dark-text dark:text-medium-text">{t('settings.lowBandwidthDescription')}</p>
              </div>
              <div className="relative">
                <input type="checkbox" className="sr-only" checked={lowBandwidthMode} onChange={(e) => setLowBandwidthMode(e.target.checked)} />
                <div className={`block w-14 h-8 rounded-full ${lowBandwidthMode ? 'bg-brand-primary' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
                <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${lowBandwidthMode ? 'transform translate-x-6' : ''}`}></div>
              </div>
            </label>
          </div>
          
          {/* Privacy Settings for Athletes */}
          {currentUser?.role === 'Athlete' && (
            <div className="space-y-2">
                <h3 className="font-semibold flex items-center gap-2"><ShieldCheckIcon className="w-5 h-5" />{t('settings.privacy')}</h3>
                <label className="block">
                     <span className="font-medium">{t('settings.profileVisibility')}</span>
                    <p className="text-sm text-medium-dark-text dark:text-medium-text mb-2">{t('settings.profileVisibilityDescription')}</p>
                    <select
                        defaultValue={currentUser?.profileVisibility || 'Visible'}
                        onChange={handleVisibilityChange}
                        className="w-full p-2 bg-light-bg dark:bg-gray-800 border border-light-border dark:border-dark-border rounded-md"
                    >
                        <option value="Visible">{t('settings.visible')}</option>
                        <option value="Hidden">{t('settings.hidden')}</option>
                    </select>
                </label>
            </div>
          )}

           {/* Data Management */}
           <div className="space-y-2">
                <h3 className="font-semibold">{t('settings.dataManagement')}</h3>
                 <button 
                    onClick={handleDeleteData}
                    className="w-full text-left px-4 py-2 text-sm font-semibold text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                >
                   {t('settings.deleteData')}
                </button>
            </div>


        </div>

        <button 
          onClick={onClose} 
          className="mt-8 w-full bg-brand-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-brand-secondary transition-colors"
        >
          {t('settings.close')}
        </button>
      </div>
    </div>
  );
};

export default SettingsModal;