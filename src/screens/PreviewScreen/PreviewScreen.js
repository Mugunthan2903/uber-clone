import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setQuote, setServiceType } from '../../store/slices/bookingSlice';
import Header from '../../components/common/Header';
import Button from '../../components/common/Button';
import ServicePopWindow from '../ServicePopWindow/ServicePopWindow';
import './PreviewScreen.css';

const PreviewScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { pickupLocation, destination } = useSelector(state => state.location);
  const { bookingDetails, serviceType = 'UberX' } = useSelector(state => state.booking);
  const [showServiceSelection, setShowServiceSelection] = useState(false);

  const serviceOptions = {
    'UberX': { price: 450, icon: '/assets/UberX.svg', description: 'Affordable rides' },
    'UberComfort': { price: 520, icon: '/assets/UberComfort.svg', description: 'Extra legroom' },
    'UberXL': { price: 680, icon: '/assets/UberXL.svg', description: 'Extra seats' },
    'UberGreen': { price: 475, icon: '/assets/UberGreen.svg', description: 'Eco-friendly' },
    'UberLux': { price: 850, icon: '/assets/UberLux.svg', description: 'Premium rides' }
  };

  const currentService = serviceOptions[serviceType];
  const estimatedPrice = currentService?.price || 450;
  const bookingFee = 25;
  const totalPrice = estimatedPrice + bookingFee;

  const handleStartAgain = () => {
    navigate('/');
  };

  const handleBack = () => {
    navigate('/availability');
  };

  const handleServiceSelect = (selectedService) => {
    dispatch(setServiceType(selectedService));
    setShowServiceSelection(false);
  };

  const handleConfirmBooking = () => {
    dispatch(setQuote({
      service: serviceType,
      basePrice: estimatedPrice,
      bookingFee,
      total: totalPrice,
      currency: 'Kč'
    }));
    navigate('/quote');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="preview-screen">
      <Header showStartAgain={true} onStartAgain={handleStartAgain} />
      
      <div className="preview-content">
        <h1 className="preview-title">Review Your Trip</h1>
        
        <div className="trip-details-card">
          <div className="trip-route">
            <div className="route-point">
              <img src="/assets/location-blue.svg" alt="Pickup" className="route-icon" />
              <div className="route-info">
                <span className="route-label">Pickup</span>
                <span className="route-address">{bookingDetails?.pickupLocation || pickupLocation}</span>
              </div>
            </div>
            
            <div className="route-line"></div>
            
            <div className="route-point">
              <img src="/assets/location-grey.svg" alt="Destination" className="route-icon" />
              <div className="route-info">
                <span className="route-label">Destination</span>
                <span className="route-address">{bookingDetails?.destination || destination}</span>
              </div>
            </div>
          </div>

          <div className="trip-datetime">
            <div className="datetime-item">
              <img src="/assets/Calendar-Icon-Black.svg" alt="Date" className="datetime-icon" />
              <span>{formatDate(bookingDetails?.date)}</span>
            </div>
            <div className="datetime-item">
              <img src="/assets/Time-Icon.svg" alt="Time" className="datetime-icon" />
              <span>{bookingDetails?.time}</span>
            </div>
          </div>

          <div className="trip-passengers">
            <div className="passenger-info">
              <img src="/assets/pin-user.svg" alt="Passengers" className="passenger-icon" />
              <span>{bookingDetails?.passengers || 1} Passenger{(bookingDetails?.passengers || 1) > 1 ? 's' : ''}</span>
            </div>
            <div className="passenger-info">
              <img src="/assets/pin-suitcase.svg" alt="Luggage" className="passenger-icon" />
              <span>{bookingDetails?.luggage || 1} Luggage</span>
            </div>
          </div>
        </div>

        <div className="service-selection-card">
          <h3 className="card-title">Selected Service</h3>
          <div 
            className="selected-service"
            onClick={() => setShowServiceSelection(true)}
          >
            <div className="service-info">
              <img src={currentService.icon} alt={serviceType} className="service-icon" />
              <div className="service-details">
                <h4 className="service-name">{serviceType}</h4>
                <p className="service-description">{currentService.description}</p>
              </div>
            </div>
            <div className="service-price">
              <span className="price-amount">{estimatedPrice} Kč</span>
              <img src="/assets/Right-Chevron-Icon.svg" alt="Change" className="chevron-icon" />
            </div>
          </div>
        </div>

        <div className="price-breakdown-card">
          <h3 className="card-title">Price Breakdown</h3>
          <div className="price-items">
            <div className="price-item">
              <span className="price-label">Trip fare</span>
              <span className="price-value">{estimatedPrice} Kč</span>
            </div>
            <div className="price-item">
              <span className="price-label">Booking fee</span>
              <span className="price-value">{bookingFee} Kč</span>
            </div>
            <div className="price-separator"></div>
            <div className="price-item price-total">
              <span className="price-label">Total</span>
              <span className="price-value">{totalPrice} Kč</span>
            </div>
          </div>
        </div>

        <div className="terms-card">
          <h3 className="card-title">Terms & Conditions</h3>
          <div className="terms-content">
            <div className="terms-item">
              <img src="/assets/tick-green.svg" alt="Check" className="check-icon" />
              <span>Free cancellation up to 1 hour before pickup</span>
            </div>
            <div className="terms-item">
              <img src="/assets/tick-green.svg" alt="Check" className="check-icon" />
              <span>Driver will wait up to 15 minutes at pickup location</span>
            </div>
            <div className="terms-item">
              <img src="/assets/tick-green.svg" alt="Check" className="check-icon" />
              <span>Price includes all taxes and fees</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="preview-footer">
        <div className="uber-logo-footer">
          <img 
            src="/assets/uber-logo.svg" 
            alt="Uber Logo" 
            className="uber-logo-footer-img"
          />
        </div>
        <div className="footer-buttons">
          <Button variant="secondary" onClick={handleBack}>
            ← Edit Trip
          </Button>
          <Button variant="primary" onClick={handleConfirmBooking}>
            Confirm Booking →
          </Button>
        </div>
      </div>

      {showServiceSelection && (
        <ServicePopWindow
          isVisible={showServiceSelection}
          selectedService={serviceType}
          onServiceSelect={handleServiceSelect}
          onClose={() => setShowServiceSelection(false)}
        />
      )}
    </div>
  );
};

export default PreviewScreen;