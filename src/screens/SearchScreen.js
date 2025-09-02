import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentScreen } from '../store/slices/uiSlice';
import { setPickupLocation, setDestination } from '../store/slices/locationSlice';
import britishFlag from '../assets/British-Flag.jpg';
import weKnowLogo from '../assets/we-Know-logo.png';
import locationBlue from '../assets/location-blue.svg';
import './SearchScreen.css';

const SearchScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { pickup, destination } = useSelector(state => state.location);
  
  const [pickupInput, setPickupInput] = useState(pickup.address || '');
  const [destinationInput, setDestinationInput] = useState(destination.address || '');

  // Popular destinations with real coordinates
  const popularDestinations = [
    {
      name: "Heathrow Airport",
      address: "London Heathrow Airport, Hounslow TW6",
      postcode: "TW6 1AP",
      latitude: "51.4700223",
      longitude: "-0.4542955"
    },
    {
      name: "Gatwick Airport", 
      address: "London Gatwick Airport, West Sussex RH6",
      postcode: "RH6 0NP",
      latitude: "51.1560600",
      longitude: "-0.1762500"
    },
    {
      name: "Buckingham Palace",
      address: "Buckingham Palace, London SW1A",
      postcode: "SW1A 1AA", 
      latitude: "51.501364",
      longitude: "-0.14189"
    },
    {
      name: "London Bridge Station",
      address: "London Bridge Station, Railway Approach SE1",
      postcode: "SE1 9SP",
      latitude: "51.5049375",
      longitude: "-0.0864736"
    }
  ];

  useEffect(() => {
    dispatch(setCurrentScreen('search'));
    
    // Set default pickup location if not already set
    if (!pickup.address) {
      const defaultPickup = {
        address: "Delta Hotels Heathrow Windsor",
        postcode: "SL3 8PT", 
        latitude: "51.492259000",
        longitude: "-0.546732000"
      };
      dispatch(setPickupLocation(defaultPickup));
      setPickupInput(defaultPickup.address);
    }
  }, [dispatch, pickup.address]);

  const handleStartAgain = () => {
    // Reset form and navigate back to splash
    setPickupInput('');
    setDestinationInput('');
    navigate('/');
  };

  const handleBack = () => {
    navigate('/');
  };

  const handleNext = () => {
    if (pickupInput && destinationInput) {
      // Update Redux store with current input values
      if (pickupInput !== pickup.address) {
        dispatch(setPickupLocation({
          address: pickupInput,
          postcode: '',
          latitude: '',
          longitude: ''
        }));
      }
      
      if (destinationInput !== destination.address) {
        dispatch(setDestination({
          address: destinationInput,
          postcode: '',
          latitude: '',
          longitude: ''
        }));
      }
      
      navigate('/search-loading');
    }
  };

  const handlePopularDestinationClick = (dest) => {
    setDestinationInput(dest.address);
    dispatch(setDestination({
      address: dest.address,
      postcode: dest.postcode,
      latitude: dest.latitude,
      longitude: dest.longitude
    }));
  };

  const isNextEnabled = pickupInput.trim() && destinationInput.trim();

  return (
    <div className="search-screen">
      {/* Header */}
      <div className="search-header">
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
      <div className="search-main">
        <h1 className="search-title">Ride with Bolt</h1>
        
        <div className="location-inputs">
          <div className="input-group pickup-group">
            <div className="location-indicator pickup-dot"></div>
            <input
              type="text"
              className="location-input"
              value={pickupInput}
              onChange={(e) => setPickupInput(e.target.value)}
              placeholder="Pickup location"
            />
          </div>
          
          <div className="connector-line">
            <div className="connector-dots">
              <div className="dot"></div>
              <div className="dot"></div>
              <div className="dot"></div>
            </div>
          </div>
          
          <div className="input-group destination-group">
            <div className="location-indicator destination-square"></div>
            <input
              type="text"
              className="location-input"
              value={destinationInput}
              onChange={(e) => setDestinationInput(e.target.value)}
              placeholder="Where to?"
            />
          </div>
        </div>

        <div className="popular-destinations">
          <h3 className="popular-title">Or, select from popular destinations</h3>
          
          <div className="destinations-list">
            {popularDestinations.map((dest, index) => (
              <button
                key={index}
                className="destination-item"
                onClick={() => handlePopularDestinationClick(dest)}
              >
                <img src={locationBlue} alt="Location" className="destination-icon" />
                <div className="destination-text">
                  <div className="destination-name">{dest.name}</div>
                  <div className="destination-address">{dest.address}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="search-footer">
        <div className="bolt-branding">
          <span className="bolt-text">Bolt</span>
        </div>
        
        <div className="footer-buttons">
          <button className="back-btn" onClick={handleBack}>
            ← Back
          </button>
          <button 
            className={`next-btn ${isNextEnabled ? 'enabled' : 'disabled'}`}
            onClick={handleNext}
            disabled={!isNextEnabled}
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchScreen;