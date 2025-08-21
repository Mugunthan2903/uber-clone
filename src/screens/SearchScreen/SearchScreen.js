import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setDestination } from '../../store/slices/locationSlice';
import Header from '../../components/common/Header';
import LocationInput from '../../components/forms/LocationInput';
import Button from '../../components/common/Button';
import './SearchScreen.css';

const SearchScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { pickupLocation, destination } = useSelector(state => state.location);

  const popularDestinations = [
    { name: 'The Mozart Prague', address: 'Karolíny Světlé 34, 110 00 Staré Město, Czechia' },
    { name: 'Lorem Ipsum', address: 'Karolíny Světlé 34, 110 00 Staré Město, Czechia' },
    { name: 'Lorem Ipsum', address: 'Karolíny Světlé 34, 110 00 Staré Město, Czechia' },
    { name: 'Lorem Ipsum', address: 'Karolíny Světlé 34, 110 00 Staré Město, Czechia' }
  ];

  const handleStartAgain = () => {
    navigate('/');
  };

  const handleDestinationChange = (value) => {
    dispatch(setDestination(value));
  };

  const handleDestinationSelect = (destinationName) => {
    dispatch(setDestination(destinationName));
  };

  const handleNext = () => {
    if (destination.trim()) {
      navigate('/search-results');
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  const isNextEnabled = destination.trim().length > 0;

  return (
    <div className="search-screen" data-testid="search-screen">
      <Header showStartAgain={true} onStartAgain={handleStartAgain} />
      
      <div className="search-content" data-testid="search-content">
        <h1 className="search-title" data-testid="search-title">Ride with Uber</h1>
        
        <div className="search-form" data-testid="search-form">
          <LocationInput
            pickupValue={pickupLocation}
            destinationValue={destination}
            onPickupChange={() => {}} // Pickup is pre-filled and not editable
            onDestinationChange={handleDestinationChange}
            pickupPlaceholder="Pickup location"
            destinationPlaceholder="Where to?"
          />
        </div>
        
        <div className="popular-destinations" data-testid="popular-destinations">
          <h3 className="destinations-title" data-testid="destinations-title">Or, select from popular destinations</h3>
          <div className="destinations-list" data-testid="destinations-list">
            {popularDestinations.map((dest, index) => (
              <div 
                key={index} 
                className="destination-item"
                data-testid={`destination-item-${index}`}
                onClick={() => handleDestinationSelect(dest.name)}
              >
                <div className="destination-icon">
                  <img 
                    src="/assets/location-blue.svg" 
                    alt="Location" 
                    className="location-icon"
                  />
                </div>
                <div className="destination-info">
                  <div className="destination-name">{dest.name}</div>
                  <div className="destination-address">{dest.address}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="search-footer" data-testid="search-footer">
        <div className="uber-logo-footer">
          <img 
            src="/assets/uber-logo.svg" 
            alt="Uber Logo" 
            className="uber-logo-footer-img"
          />
        </div>
        <div className="footer-buttons" data-testid="footer-buttons">
          <Button variant="secondary" onClick={handleBack} data-testid="back-button">
            ← Back
          </Button>
          <Button 
            variant="primary" 
            onClick={handleNext}
            disabled={!isNextEnabled}
            data-testid="next-button"
          >
            Next →
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SearchScreen;