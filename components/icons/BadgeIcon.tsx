import React from 'react';

const BadgeIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
  >
    <path fillRule="evenodd" d="M12.75 2.25A.75.75 0 0012 3v1.59L9.82 6.47a.75.75 0 00-.22.53v2.85a.75.75 0 00.22.53l2.18 1.88a.75.75 0 00.94 0l2.18-1.88a.75.75 0 00.22-.53V7a.75.75 0 00-.22-.53L12.75 4.59V3a.75.75 0 00-.75-.75zM12 15a.75.75 0 01.75.75v3a.75.75 0 01-1.5 0v-3a.75.75 0 01.75-.75z" clipRule="evenodd" />
  </svg>
);

export default BadgeIcon;
