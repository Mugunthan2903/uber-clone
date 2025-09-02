import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCurrentScreen } from '../store/slices/uiSlice';
import './PrintLoadingScreen.css';

const PrintLoadingScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setCurrentScreen('print-loading'));
    
    // Simulate print processing
    const timer = setTimeout(() => {
      navigate('/confirmation');
    }, 2500);

    return () => clearTimeout(timer);
  }, [dispatch, navigate]);

  return (
    <div className="print-loading-screen">
      <div className="print-loading-content">
        <h1 className="print-message">
          Printing your receipt
        </h1>
        
        <p className="print-subtitle">
          Please be patient. Do not attempt to take<br />
          your receipt until it has finished printing.
        </p>
        
        <div className="loading-dots">
          <div className="loading-dot"></div>
          <div className="loading-dot"></div>
          <div className="loading-dot"></div>
        </div>
      </div>
    </div>
  );
};

export default PrintLoadingScreen;