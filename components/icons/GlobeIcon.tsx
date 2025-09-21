import React from 'react';

const GlobeIcon: React.FC<{ className?: string }> = ({ className }) => (
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
      d="M10.5 21l5.25-11.25L21 21m-9-3.75h.008v.008H12v-.008ZM8.25 7.5l5.25 2.25M3 13.5l5.25-2.25m0 0l5.25 2.25M15.75 7.5l-5.25 2.25m-3-3.75l-5.25 2.25m10.5-2.25L7.5 3m7.5 12l5.25-2.25" 
    />
  </svg>
);

export default GlobeIcon;