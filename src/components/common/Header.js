import React from 'react';
import './Header.css';

const Header = ({ showStartAgain = false, onStartAgain }) => {
  return (
    <header className="header">
      <div className="header-left">
        <div className="language-selector">
          <img 
            src="/assets/UKFlag.svg"
            alt="UK Flag" 
            className="flag-icon" 
          />
          <span>English</span>
        </div>
      </div>
      
      <div className="header-center">
        {showStartAgain && (
          <button className="start-again-btn" onClick={onStartAgain}>
            Start Again
          </button>
        )}
      </div>
      
      <div className="header-right">
        <div className="weknow-logo">
          <img 
            src="/assets/we-Know-logo.png" 
            alt="WeKnow Logo" 
            className="weknow-logo-img"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;