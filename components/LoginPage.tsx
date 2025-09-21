import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import ThemeToggleButton from './ThemeToggleButton';
import { useTranslations } from '../hooks/useTranslations';
import { Role } from '../types';

interface LoginPageProps {
    role: Role;
    onBack: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ role, onBack }) => {
    const defaultEmail = role === Role.ATHLETE ? 'athlete@test.com' : 'coach@test.com';
    const [email, setEmail] = useState(defaultEmail);
    const [password, setPassword] = useState('password');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const t = useTranslations();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login({ email, password, role });
        } catch (err) {
            setError(t('loginPage.error'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative flex flex-col items-center justify-center min-h-screen">
            <div className="absolute top-4 right-4">
                <ThemeToggleButton />
            </div>
            <button onClick={onBack} className="absolute top-4 left-4 px-4 py-2 text-sm font-semibold bg-light-bg dark:bg-dark-border text-dark-text dark:text-light-text rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200">
                &larr; {t('loginPage.back')}
            </button>
            <h1 className="text-4xl font-extrabold mb-2 text-dark-text dark:text-light-text text-center">{t('loginPage.welcome')}</h1>
            <h2 className="text-5xl font-extrabold mb-12 text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-secondary text-center">{t('loginPage.appName')}</h2>
            
            <div className="w-full max-w-md bg-light-card dark:bg-dark-card p-8 rounded-xl shadow-lg border border-light-border dark:border-dark-border">
                <h3 className="text-2xl font-bold text-center text-dark-text dark:text-light-text mb-6">{t('loginPage.title', { role })}</h3>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-medium-dark-text dark:text-medium-text">{t('loginPage.emailLabel')}</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 bg-light-bg dark:bg-gray-800 border border-light-border dark:border-dark-border rounded-md text-dark-text dark:text-light-text focus:outline-none focus:ring-brand-primary focus:border-brand-primary"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-medium-dark-text dark:text-medium-text">{t('loginPage.passwordLabel')}</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 bg-light-bg dark:bg-gray-800 border border-light-border dark:border-dark-border rounded-md text-dark-text dark:text-light-text focus:outline-none focus:ring-brand-primary focus:border-brand-primary"
                            required
                        />
                    </div>
                     {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-primary hover:bg-brand-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-secondary disabled:bg-gray-600 disabled:cursor-not-allowed"
                    >
                        {loading ? t('loginPage.loading') : t('loginPage.button')}
                    </button>
                </form>
                 <div className="mt-6 text-center text-sm text-medium-dark-text dark:text-medium-text">
                    <p>{t('loginPage.demoInfo', { role: role === Role.ATHLETE ? t('loginPage.demoAthlete') : t('loginPage.demoCoach'), email: defaultEmail, password: 'password' })}</p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;