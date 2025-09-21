import React, { useState } from 'react';
import { Role } from './types';
import AthleteDashboard from './components/AthleteDashboard';
import CoachDashboard from './components/CoachDashboard';
import Header from './components/Header';
import { useAuth } from './contexts/AuthContext';
import LoginPage from './components/LoginPage';
import LandingPage from './components/LandingPage';
import { useSettings } from './contexts/SettingsContext';

const App: React.FC = () => {
  const { currentUser } = useAuth();
  const { language } = useSettings();
  const [loginRole, setLoginRole] = useState<Role | null>(null);

  const renderContent = () => {
    if (!currentUser) {
      if (loginRole) {
        return <LoginPage role={loginRole} onBack={() => setLoginRole(null)} />;
      }
      return <LandingPage onSelectRole={setLoginRole} />;
    }
    
    return (
      <>
        <Header />
        <div className="mt-8">
          {currentUser.role === Role.ATHLETE && <AthleteDashboard athlete={currentUser} />}
          {currentUser.role === Role.COACH && <CoachDashboard coach={currentUser} />}
        </div>
      </>
    );
  };
  
  return (
    <div key={language} className="min-h-screen bg-light-bg dark:bg-dark-bg text-dark-text dark:text-light-text font-sans antialiased">
      <main className="container mx-auto p-4 max-w-4xl">
        {renderContent()}
      </main>
      {currentUser && (
         <footer className="text-center py-4 mt-8 text-medium-dark-text dark:text-medium-text text-sm">
            <p>AI Sports Talent Ecosystem &copy; 2024</p>
         </footer>
      )}
    </div>
  );
};

export default App;