import React from 'react';
import './LocationInput.css';

const LocationInput = ({ 
  pickupValue, 
  destinationValue, 
  onPickupChange, 
  onDestinationChange,
  pickupPlaceholder = "Pickup location",
  destinationPlaceholder = "Where to?"
}) => {
  return (
    <div className="location-input-container">
      <div className="location-input-wrapper">
        <div className="location-icon pickup-icon">
          <div className="location-dot"></div>
        </div>
        <input
          type="text"
          className="location-input pickup-input"
          value={pickupValue}
          onChange={(e) => onPickupChange(e.target.value)}
          placeholder={pickupPlaceholder}
        />
      </div>
      
      <div className="location-connector">
        <div className="connector-line"></div>
      </div>
      
      <div className="location-input-wrapper">
        <div className="location-icon destination-icon">
          <div className="location-square"></div>
        </div>
        <input
          type="text"
          className="location-input destination-input"
          value={destinationValue}
          onChange={(e) => onDestinationChange(e.target.value)}
          placeholder={destinationPlaceholder}
        />
      </div>
    </div>
  );
};

export default LocationInput;