
import React from 'react';

const SparklesIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path
      fillRule="evenodd"
      d="M9 4.5a.75.75 0 0 1 .75.75l.04 1.54.996 5.024a1.5 1.5 0 0 1-2.992.002L6.21 6.79a.75.75 0 0 1 .75-.75h2.04Zm7.5 0a.75.75 0 0 1 .75.75l.04 1.54.996 5.024a1.5 1.5 0 0 1-2.992.002L13.71 6.79a.75.75 0 0 1 .75-.75h2.04ZM11.25 15a.75.75 0 0 1 .75.75l.04 1.54.996 5.024a1.5 1.5 0 0 1-2.992.002L8.21 17.29a.75.75 0 0 1 .75-.75h2.29Z"
      clipRule="evenodd"
    />
  </svg>
);

export default SparklesIcon;
