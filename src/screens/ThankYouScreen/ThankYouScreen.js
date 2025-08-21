import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { resetLocationState } from '../../store/slices/locationSlice';
import { resetBookingState } from '../../store/slices/bookingSlice';
import { resetUiState } from '../../store/slices/uiSlice';
import Header from '../../components/common/Header';
import Button from '../../components/common/Button';
import './ThankYouScreen.css';

const ThankYouScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { pickupLocation, destination } = useSelector(state => state.location);
  const { serviceType, bookingReference } = useSelector(state => state.booking);

  const handleStartAgain = () => {
    navigate('/');
  };

  const handleReturnToStart = () => {
    dispatch(resetLocationState());
    dispatch(resetBookingState());
    dispatch(resetUiState());
    navigate('/');
  };

  return (
    <div className="thank-you-screen">
      <Header showStartAgain={true} onStartAgain={handleStartAgain} />
      
      <div className="thank-you-content">
        <div className="success-header">
          <div className="success-icon">✓</div>
          <h1 className="success-title">Uber has accepted your ride request</h1>
          <p className="success-subtitle">
            Please take your receipt which contains a unique PIN for your ride and details of your payment.
          </p>
        </div>
        
        <div className="booking-details-card">
          <div className="service-header">
            <span className="service-type">{serviceType}</span>
          </div>
          
          <div className="route-section">
            <div className="route-item">
              <div className="route-dot pickup-dot"></div>
              <div className="route-info">
                <div className="route-location">{pickupLocation}</div>
                <div className="route-address">161 00 Prague 6, Czechia</div>
              </div>
            </div>
            
            <div className="route-connector"></div>
            
            <div className="route-item">
              <div className="route-dot destination-dot"></div>
              <div className="route-info">
                <div className="route-location">{destination}</div>
                <div className="route-address">Karolíny Světlé 34, 110 00 Staré Město, Czechia</div>
              </div>
            </div>
          </div>
          
          <div className="map-section">
            <div className="map-placeholder">
              <div className="map-overlay">
                <div className="map-marker pickup-marker">A</div>
                <div className="map-marker destination-marker">B</div>
                <div className="map-route"></div>
              </div>
            </div>
          </div>
          
          <div className="booking-reference">
            <span className="reference-label">Booking reference:</span>
            <span className="reference-number">{bookingReference}</span>
          </div>
          
          <div className="instructions-section">
            <div className="instructions-header">
              <div className="warning-icon">⚠️</div>
              <h3>What happens next:</h3>
            </div>
            
            <div className="instruction-steps">
              <div className="step">
                <span className="step-number">1.</span>
                <span className="step-text">Check your receipt or SMS for a unique 6-digit PIN.</span>
              </div>
              <div className="step">
                <span className="step-number">2.</span>
                <span className="step-text">
                  Exit the terminal and wait at the Uber Airport Pick-Up Point for the next available driver.
                </span>
              </div>
              <div className="step">
                <span className="step-number">3.</span>
                <span className="step-text">Give the driver your 6-digit PIN to start your ride.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="thank-you-footer">
        <div className="uber-logo-footer">
          <span>Uber</span>
        </div>
        <Button 
          variant="primary" 
          size="large"
          onClick={handleReturnToStart}
        >
          🏠 Return to start
        </Button>
      </div>
    </div>
  );
};

export default ThankYouScreen;