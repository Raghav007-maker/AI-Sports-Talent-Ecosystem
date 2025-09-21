import React from 'react';

const WifiOffIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    fill="none" 
    viewBox="0 0 24 24" 
    strokeWidth={1.5} 
    stroke="currentColor" 
    className={className}
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      d="M9.882 7.604a.75.75 0 0 1 1.06 0L12 8.662l1.058-1.058a.75.75 0 1 1 1.061 1.06L13.06 9.72l1.06 1.06a.75.75 0 1 1-1.06 1.061L12 10.782l-1.059 1.059a.75.75 0 0 1-1.06-1.061l1.058-1.06-1.058-1.058a.75.75 0 0 1 0-1.06Z" 
    />
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      d="M3.75 9.75c4.142 0 7.5 3.358 7.5 7.5m1.5-7.5c4.142 0 7.5 3.358 7.5 7.5m-16.5 0a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z" 
    />
  </svg>
);

export default WifiOffIcon;