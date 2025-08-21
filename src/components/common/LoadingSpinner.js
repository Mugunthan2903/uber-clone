import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = ({ size = 'medium', color = 'white' }) => {
  return (
    <div className="loading-spinner-container">
      <div className={`loading-dots loading-dots--${size} loading-dots--${color}`}>
        <div className="dot dot1"></div>
        <div className="dot dot2"></div>
        <div className="dot dot3"></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;