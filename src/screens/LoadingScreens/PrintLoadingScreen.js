import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import './LoadingScreen.css';

const PrintLoadingScreen = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/thank-you');
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="loading-screen loading-screen--blue">
      <div className="loading-content">
        <h2 className="loading-text">Printing your receipt</h2>
        <p className="loading-subtitle">
          Please be patient. Do not attempt to take your receipt until it has finished printing.
        </p>
        <LoadingSpinner size="medium" color="white" />
      </div>
    </div>
  );
};

export default PrintLoadingScreen;