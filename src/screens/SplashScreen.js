import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCurrentScreen } from '../store/slices/uiSlice';
import britishFlag from '../assets/British-Flag.jpg';
import weKnowLogo from '../assets/we-Know-logo.png';
import downwardArrow from '../assets/downward-white-arrow.svg';
import bannerGirl from '../assets/banner-girl.png';
import './SplashScreen.css';

const SplashScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setCurrentScreen('splash'));
    
    // Auto-navigate to search screen after 5 seconds
    const timer = setTimeout(() => {
      navigate('/search');
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate, dispatch]);

  const handleBookNewRide = () => {
    navigate('/search');
  };

  const handleChangeOfPlans = () => {
    // For now, just navigate to search - could implement different flow later
    navigate('/search');
  };

  return (
    <div className="splash-screen">
      {/* Header */}
      <div className="splash-header">
        <div className="language-selector">
          <img src={britishFlag} alt="UK Flag" className="flag-icon" />
          <span>English</span>
        </div>
        <div className="we-know-logo">
          <img src={weKnowLogo} alt="WeKnow" />
        </div>
      </div>

      {/* Main Content */}
      <div className="splash-main">
        <div className="brand-section">
          <h1 className="brand-title">Bolt</h1>
          <img src={downwardArrow} alt="Down Arrow" className="down-arrow" />
          <p className="where-to-text">Where to?</p>
        </div>
        
        <div className="illustration">
          <img src={bannerGirl} alt="Car Illustration" className="car-illustration" />
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="splash-actions">
        <button className="action-button new-ride-btn" onClick={handleBookNewRide}>
          <div className="action-icon plus-icon">+</div>
          <div className="action-text">
            <div className="action-title">Book a new ride</div>
            <div className="action-subtitle">Ride anywhere</div>
          </div>
          <div className="chevron-right">›</div>
        </button>
        
        <button className="action-button change-plans-btn" onClick={handleChangeOfPlans}>
          <div className="action-icon cancel-icon">×</div>
          <div className="action-text">
            <div className="action-title">Change of plans?</div>
            <div className="action-subtitle">Cancel your ride</div>
          </div>
          <div className="chevron-right">›</div>
        </button>
      </div>
    </div>
  );
};

export default SplashScreen;