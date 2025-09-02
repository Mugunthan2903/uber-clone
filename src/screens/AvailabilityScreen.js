import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentScreen, setQuoteExpiryTimer, decrementQuoteTimer } from '../store/slices/uiSlice';
import { selectVehicle, updateUserDetails } from '../store/slices/bookingSlice';
import britishFlag from '../assets/British-Flag.jpg';
import weKnowLogo from '../assets/we-Know-logo.png';
import uberXLIcon from '../assets/UberXL.svg';
import './AvailabilityScreen.css';

const AvailabilityScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { availability } = useSelector(state => state.api);
  const { selectedVehicle, userDetails } = useSelector(state => state.booking);
  const { quoteExpiryTimer } = useSelector(state => state.ui);
  
  const [mobileNumber, setMobileNumber] = useState(userDetails.mobile || '');
  const [countryCode, setCountryCode] = useState(userDetails.countryCode || '+44');
  const [email, setEmail] = useState(userDetails.email || '');

  // Mock vehicle data when API is not available
  const mockVehicles = [
    {
      ProductId: "4603",
      VehicleId: "uber-airport",
      VehicleName: "Uber Airport",
      Description: "Experienced Airport drivers",
      NoOfSeats: 4,
      Price: "690",
      Currency: "Kč",
      FareId: "fare123",
      PickupEstimate: "300",
      FareExpAt: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
      FareExpInMin: 5
    }
  ];

  const vehicles = availability.vehicles && availability.vehicles.Vehicles
    ? availability.vehicles.Vehicles
    : mockVehicles;
 console.log('availability :', availability.vehicles);
  console.log('availability :', availability.vehicles.Vehicles);
  useEffect(() => {
    dispatch(setCurrentScreen('availability'));
    
    // Set initial timer (5 minutes = 300 seconds)
    if (vehicles.length > 0) {
      const expiryMinutes = vehicles[0].FareExpInMin || 5;
      dispatch(setQuoteExpiryTimer(expiryMinutes * 60));
    }

    // Start countdown timer
    const timer = setInterval(() => {
      dispatch(decrementQuoteTimer());
    }, 1000);

    return () => clearInterval(timer);
  }, [dispatch, vehicles]);

  const handleStartAgain = () => {
    navigate('/search');
  };

  const handleBack = () => {
    navigate('/search');
  };

  const handleVehicleSelect = (vehicle) => {
    dispatch(selectVehicle(vehicle));
  };

  const handleReviewBooking = () => {
    // Update user details in Redux
    dispatch(updateUserDetails({
      mobile: mobileNumber,
      countryCode: countryCode,
      email: email
    }));

    if (selectedVehicle.vehicleId && mobileNumber && email) {
      navigate('/booking-review');
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const isFormValid = selectedVehicle.vehicleId && mobileNumber.trim() && email.trim();

  return (
    <div className="availability-screen">
      {/* Header */}
      <div className="availability-header">
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
      <div className="availability-main">
        {/* Quote Section */}
        <div className="quote-section">
          <div className="section-header">
            <h2 className="section-title">Your quote</h2>
            <div className="quote-timer">
              Quote valid for {formatTime(quoteExpiryTimer)}
            </div>
          </div>

          <div className="vehicles-list">
            {vehicles.map((vehicle, index) => (
              <div 
                key={index}
                className={`vehicle-card ${selectedVehicle.vehicleId === vehicle.VehicleId ? 'selected' : ''}`}
                onClick={() => handleVehicleSelect(vehicle)}
              >
                <div className="vehicle-icon">
                  <img src={uberXLIcon} alt={vehicle.VehicleName} />
                </div>
                <div className="vehicle-info">
                  <h3 className="vehicle-name">{vehicle.VehicleName}</h3>
                  <p className="vehicle-description">{vehicle.Description}</p>
                  <div className="vehicle-capacity">
                    <span className="capacity-icon">👤</span>
                    <span>{vehicle.NoOfSeats}</span>
                    <span className="luggage-icon">💼</span>
                    <span>2</span>
                  </div>
                </div>
                <div className="vehicle-price">
                  <div className="price">{vehicle.Price} {vehicle.Currency}</div>
                  <div className="price-label">Total price</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Details Section */}
        <div className="details-section">
          <h2 className="section-title">Your details</h2>
          
          <div className="form-group">
            <label className="form-label">Mobile number*</label>
            <div className="phone-input">
              <div className="country-selector">
                <img src={britishFlag} alt="UK" className="country-flag" />
                <select 
                  value={countryCode} 
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="country-code"
                >
                  <option value="+44">+44</option>
                  <option value="+1">+1</option>
                  <option value="+33">+33</option>
                </select>
              </div>
              <input
                type="tel"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                className="phone-number"
                placeholder=""
              />
            </div>
            <p className="form-help">
              By entering your phone number, you consent to receive text messages from Uber regarding your trip.
            </p>
          </div>

          <div className="form-group">
            <label className="form-label">Email address*</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="email-input"
              placeholder="Enter your email address"
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="availability-footer">
        <div className="bolt-branding">
          <span className="bolt-text">Bolt</span>
        </div>
        
        <div className="footer-buttons">
          <button className="back-btn" onClick={handleBack}>
            ← Back
          </button>
          <button 
            className={`review-btn ${isFormValid ? 'enabled' : 'disabled'}`}
            onClick={handleReviewBooking}
            disabled={!isFormValid}
          >
            Review booking →
          </button>
        </div>
      </div>
    </div>
  );
};

export default AvailabilityScreen;