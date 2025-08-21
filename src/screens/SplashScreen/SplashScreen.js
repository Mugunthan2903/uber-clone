import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/common/Header';
import './SplashScreen.css';

const SplashScreen = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/search');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  const handleNewRide = () => {
    navigate('/search');
  };

  const handleChangeOfPlans = () => {
    navigate('/search');
  };

  return (
    <div className="splash-screen">
      <Header />
      
      <div className="splash-content">
        <div className="uber-logo">
          <h1 className="uber-text">Uber</h1>
          <div className="down-arrow">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 12L16 20L24 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <p className="where-to-text">Where to?</p>
        </div>
        
        <div className="car-illustration">
          <img 
            src="/assets/banner-girl.png" 
            alt="Car with Driver Illustration" 
            className="car-graphic-img"
          />
        </div>
      </div>
      
      <div className="splash-footer">
        <div className="action-item" onClick={handleNewRide}>
          <div className="action-icon action-icon--blue">+</div>
          <div className="action-text">
            <div className="action-title">Book a new ride</div>
            <div className="action-subtitle">Ride anywhere</div>
          </div>
          <div className="action-arrow">›</div>
        </div>
        
        <div className="action-item" onClick={handleChangeOfPlans}>
          <div className="action-icon action-icon--red">×</div>
          <div className="action-text">
            <div className="action-title">Change of plans?</div>
            <div className="action-subtitle">Cancel your ride</div>
          </div>
          <div className="action-arrow">›</div>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;