import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentScreen } from '../store/slices/uiSlice';
import { clearBooking } from '../store/slices/bookingSlice';
import { clearLocations } from '../store/slices/locationSlice';
import britishFlag from '../assets/British-Flag.jpg';
import weKnowLogo from '../assets/we-Know-logo.png';
import mapPreview from '../assets/pin-Rev-Book-Map.png';
import './ConfirmationScreen.css';

const ConfirmationScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { pickup, destination } = useSelector(state => state.location);
  const { selectedVehicle } = useSelector(state => state.booking);
  const { booking } = useSelector(state => state.api);

  // Generate booking reference if not available from API
  const bookingReference = booking.saleRef || '123456';
  const serviceRequestNo = booking.serviceRequestNo || 'SR789012';

  useEffect(() => {
    dispatch(setCurrentScreen('confirmation'));
  }, [dispatch]);

  const handleStartAgain = () => {
    navigate('/search');
  };

  const handleReturnToStart = () => {
    // Clear all booking and location data
    dispatch(clearBooking());
    dispatch(clearLocations());
    navigate('/');
  };

  return (
    <div className="confirmation-screen">
      {/* Header */}
      <div className="confirmation-header">
        <div className="language-selector">
          <img src={britishFlag} alt="UK Flag" className="flag-icon" />
          <span>English</span>
        </div>
        
        <button className="start-again-btn" onClick={handleStartAgain}>
          Start Again
        </button>
        
        <div className="we-know-logo">
          <img src={weKnowLogo} alt="WeKnow" />
        </div>
      </div>

      {/* Main Content */}
      <div className="confirmation-main">
        {/* Success Message */}
        <div className="success-section">
          <div className="success-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </div>
          
          <h1 className="success-title">
            Bolt has accepted<br />
            your ride request
          </h1>
          
          <p className="success-subtitle">
            Please take your receipt which contains a unique<br />
            PIN for your ride and details of your payment.
          </p>
        </div>

        {/* Service Details Card */}
        <div className="service-details-card">
          <div className="service-header">
            <h3 className="service-name">{selectedVehicle.name || 'Uber Airport'}</h3>
          </div>

          <div className="route-details">
            <div className="route-stop">
              <div className="stop-indicator pickup-dot"></div>
              <div className="stop-info">
                <div className="stop-name">{pickup.address || 'Pickup Location'}</div>
                <div className="stop-address">{pickup.postcode}</div>
              </div>
            </div>
            
            <div className="route-stop">
              <div className="stop-indicator destination-square"></div>
              <div className="stop-info">
                <div className="stop-name">{destination.address || 'Destination'}</div>
                <div className="stop-address">{destination.postcode}</div>
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="confirmation-map">
            <img src={mapPreview} alt="Route Map" className="route-map" />
          </div>

          {/* Booking Reference */}
          <div className="booking-reference">
            <span className="reference-label">Booking reference:</span>
            <span className="reference-number">{bookingReference}</span>
          </div>
        </div>

        {/* Instructions */}
        <div className="instructions-section">
          <div className="instructions-header">
            <div className="warning-icon">⚠</div>
            <h3 className="instructions-title">What happens next:</h3>
          </div>
          
          <div className="instructions-list">
            <div className="instruction-item">
              <span className="instruction-number">1.</span>
              <span className="instruction-text">Check your receipt or SMS for a unique 6-digit Pin.</span>
            </div>
            
            <div className="instruction-item">
              <span className="instruction-number">2.</span>
              <span className="instruction-text">
                Exit the terminal and wait at the Uber Airport<br />
                Pick-Up Point for the next available driver.
              </span>
            </div>
            
            <div className="instruction-item">
              <span className="instruction-number">3.</span>
              <span className="instruction-text">Give the driver your 6-digit PIN to start your ride.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="confirmation-footer">
        <div className="bolt-branding">
          <span className="bolt-text">Bolt</span>
        </div>
        
        <button className="return-btn" onClick={handleReturnToStart}>
          🏠 Return to start
        </button>
      </div>
    </div>
  );
};

export default ConfirmationScreen;