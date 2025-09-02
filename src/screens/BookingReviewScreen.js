import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentScreen, setQuoteExpiryTimer, decrementQuoteTimer, setServiceFeeModal } from '../store/slices/uiSlice';
import britishFlag from '../assets/British-Flag.jpg';
import weKnowLogo from '../assets/we-Know-logo.png';
import uberXLIcon from '../assets/UberXL.svg';
import mapPreview from '../assets/pin-Rev-Book-Map.png';
import './BookingReviewScreen.css';

const BookingReviewScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { pickup, destination } = useSelector(state => state.location);
  const { selectedVehicle, pricing } = useSelector(state => state.booking);
  const { quoteExpiryTimer } = useSelector(state => state.ui);
  
  const [showTerms, setShowTerms] = useState(false);

  useEffect(() => {
    dispatch(setCurrentScreen('booking-review'));
    
    // Continue countdown timer
    const timer = setInterval(() => {
      dispatch(decrementQuoteTimer());
    }, 1000);

    return () => clearInterval(timer);
  }, [dispatch]);

  const handleStartAgain = () => {
    navigate('/search');
  };

  const handleBack = () => {
    navigate('/availability');
  };

  const handleServiceFeeInfo = () => {
    dispatch(setServiceFeeModal(true));
  };

  const handlePayment = () => {
    navigate('/payment-loading');
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const toggleTerms = () => {
    setShowTerms(!showTerms);
  };

  return (
    <div className="booking-review-screen">
      {/* Header */}
      <div className="booking-review-header">
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
      <div className="booking-review-main">
        <h1 className="page-title">Review your booking</h1>

        {/* Vehicle and Route Info */}
        <div className="booking-info-card">
          <div className="vehicle-header">
            <div className="vehicle-summary">
              <img src={uberXLIcon} alt={selectedVehicle.name} className="vehicle-icon-small" />
              <span className="vehicle-name">{selectedVehicle.name}</span>
              <span className="capacity-info">
                <span className="capacity-icon">👤</span>
                <span>{selectedVehicle.seats}</span>
                <span className="luggage-icon">💼</span>
                <span>2</span>
              </span>
            </div>
          </div>

          <div className="route-info">
            <div className="route-stop">
              <div className="stop-indicator pickup-dot"></div>
              <div className="stop-details">
                <div className="stop-name">{pickup.address || 'Pickup Location'}</div>
                <div className="stop-address">{pickup.postcode}</div>
              </div>
            </div>
            
            <div className="route-connector"></div>
            
            <div className="route-stop">
              <div className="stop-indicator destination-square"></div>
              <div className="stop-details">
                <div className="stop-name">{destination.address || 'Destination'}</div>
                <div className="stop-address">{destination.postcode}</div>
              </div>
            </div>
          </div>

          {/* Map Preview */}
          <div className="map-preview">
            <img src={mapPreview} alt="Route Map" className="route-map" />
            <div className="quote-timer">
              Quote valid for {formatTime(quoteExpiryTimer)}
            </div>
          </div>
        </div>

        {/* Pricing Breakdown */}
        <div className="pricing-section">
          <div className="pricing-row">
            <span className="pricing-label">Uber Fare</span>
            <span className="pricing-value">{pricing.baseFare} {pricing.currency}</span>
          </div>
          
          <div className="pricing-row service-fee-row" onClick={handleServiceFeeInfo}>
            <span className="pricing-label">
              WeKnow Service Fee
              <span className="info-icon">ℹ</span>
            </span>
            <span className="pricing-value">{pricing.serviceFee} {pricing.currency}</span>
          </div>
          
          <div className="pricing-divider"></div>
          
          <div className="pricing-row total-row">
            <span className="pricing-label total-label">Total to pay</span>
            <span className="pricing-value total-value">{pricing.total} {pricing.currency}</span>
          </div>
          
          <div className="vat-notice">
            Inclusive of VAT (21%): XX {pricing.currency}
          </div>
        </div>

        {/* Terms Section */}
        <div className="terms-section">
          <button className="terms-toggle" onClick={toggleTerms}>
            <span className="plus-icon">{showTerms ? '−' : '+'}</span>
            <span>See Terms</span>
          </button>
          
          {showTerms && (
            <div className="terms-content">
              <p>Your booking and payment will be made under We Know Technology CZ. By making this booking you agree to the Terms & Conditions and Privacy Policy.</p>
            </div>
          )}
        </div>

        <div className="privacy-notice">
          <p>Your booking and payment will be made under We Know Technology CZ. By making this booking you agree to the Terms & Conditions and Privacy Policy.</p>
        </div>
      </div>

      {/* Footer */}
      <div className="booking-review-footer">
        <div className="bolt-branding">
          <span className="bolt-text">Bolt</span>
        </div>
        
        <div className="footer-buttons">
          <button className="back-btn" onClick={handleBack}>
            ← Back
          </button>
          <button className="pay-btn" onClick={handlePayment}>
            Pay {pricing.total} {pricing.currency} →
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingReviewScreen;