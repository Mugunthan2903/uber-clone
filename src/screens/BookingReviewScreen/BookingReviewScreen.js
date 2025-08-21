import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setShowServiceFeeModal } from '../../store/slices/uiSlice';
import Header from '../../components/common/Header';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import './BookingReviewScreen.css';

const BookingReviewScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { pickupLocation, destination } = useSelector(state => state.location);
  const { quote, serviceType } = useSelector(state => state.booking);
  const { showServiceFeeModal } = useSelector(state => state.ui);
  
  const [showTerms, setShowTerms] = useState(false);

  const handleStartAgain = () => {
    navigate('/');
  };

  const handleBack = () => {
    navigate('/quote');
  };

  const handlePay = () => {
    navigate('/payment-loading');
  };

  const handleServiceFeeClick = () => {
    dispatch(setShowServiceFeeModal(true));
  };

  const handleCloseServiceFeeModal = () => {
    dispatch(setShowServiceFeeModal(false));
  };

  const toggleTerms = () => {
    setShowTerms(!showTerms);
  };

  return (
    <div className="booking-review-screen">
      <Header showStartAgain={true} onStartAgain={handleStartAgain} />
      
      <div className="review-content">
        <h1 className="review-title">Review your booking</h1>
        
        <div className="booking-card">
          <div className="service-header">
            <span className="service-type">{serviceType}</span>
            <div className="service-specs">
              <span className="spec">👤 4</span>
              <span className="spec">🧳 2</span>
            </div>
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
            <div className="quote-validity-badge">
              Quote valid for 2:59
            </div>
          </div>
          
          <div className="pricing-section">
            <div className="price-row">
              <span className="price-label">Uber Fare</span>
              <span className="price-value">{quote.basePrice} Kč</span>
            </div>
            <div className="price-row">
              <span className="price-label">
                WeKnow Service Fee 
                <button className="info-btn" onClick={handleServiceFeeClick}>ⓘ</button>
              </span>
              <span className="price-value">{quote.serviceFee} Kč</span>
            </div>
            <div className="price-row total-row">
              <span className="price-label total-label">Total to pay</span>
              <span className="price-value total-value">{quote.total} Kč</span>
            </div>
            <div className="vat-note">Inclusive of VAT (21%): XX Kč</div>
          </div>
          
          <div className="terms-section">
            <button className="terms-toggle" onClick={toggleTerms}>
              + See Terms
            </button>
            {showTerms && (
              <div className="terms-content">
                <p>Terms and conditions content would go here...</p>
              </div>
            )}
          </div>
          
          <div className="privacy-notice">
            <p>Your booking and payment will be made under We Know Technology CZ. By making this booking you agree to the Terms & Conditions and Privacy Policy.</p>
          </div>
        </div>
      </div>

      <div className="review-footer">
        <div className="uber-logo-footer">
          <span>Uber</span>
        </div>
        <div className="footer-buttons">
          <Button variant="secondary" onClick={handleBack}>
            ← Back
          </Button>
          <Button variant="primary" onClick={handlePay}>
            Pay {quote.total} Kč →
          </Button>
        </div>
      </div>

      <Modal 
        isOpen={showServiceFeeModal} 
        onClose={handleCloseServiceFeeModal}
        className="service-fee-modal"
      >
        <div className="modal-header">
          <h3>Service Fees</h3>
        </div>
        <div className="modal-body">
          <p>
            We Know Group charges a Service Fee on bookings. This Service Fee covers the costs 
            associated with running and maintaining the Self-Service Machines. Service Fees are 
            non-refundable on cancellation. By making your booking you agree to pay this charge.
          </p>
        </div>
        <div className="modal-footer">
          <Button variant="primary" onClick={handleCloseServiceFeeModal}>
            Close
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default BookingReviewScreen;