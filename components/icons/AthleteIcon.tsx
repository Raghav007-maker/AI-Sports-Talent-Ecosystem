
import React from 'react';

const AthleteIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M14.5 2a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Zm-2.5 7H8a4 4 0 0 0-4 4v2.25c0 .414.336.75.75.75h14.5a.75.75 0 0 0 .75-.75V13a4 4 0 0 0-4-4h-4Z" />
  </svg>
);

export default AthleteIcon;
