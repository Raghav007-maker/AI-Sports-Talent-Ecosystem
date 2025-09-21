import React from 'react';

const TrophyIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
  >
    <path d="M13.5 6A1.5 1.5 0 1112 4.5 1.5 1.5 0 0113.5 6zm-2.25 6.75A.75.75 0 0012 12a.75.75 0 00-1.25-.53l-3.25 3.5A.75.75 0 008.25 16h7.5a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75h-2.25z" />
    <path fillRule="evenodd" d="M3 3a.75.75 0 00-.75.75v16.5a.75.75 0 00.75.75h18a.75.75 0 00.75-.75V3.75a.75.75 0 00-.75-.75H3zM1.5 4.5a.75.75 0 01.75-.75h19.5a.75.75 0 01.75.75v15a.75.75 0 01-.75.75H2.25a.75.75 0 01-.75-.75v-15z" clipRule="evenodd" />
  </svg>
);

export default TrophyIcon;
