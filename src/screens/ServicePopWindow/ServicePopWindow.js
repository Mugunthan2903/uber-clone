import React from 'react';
import './ServicePopWindow.css';

const ServicePopWindow = ({ isVisible, selectedService, onServiceSelect, onClose }) => {
  if (!isVisible) return null;

  const services = [
    {
      id: 'UberX',
      name: 'UberX',
      description: 'Affordable rides',
      price: 450,
      icon: '/assets/UberX.svg',
      capacity: 4,
      eta: '3-5 min'
    },
    {
      id: 'UberComfort',
      name: 'Uber Comfort',
      description: 'Extra legroom and highly rated drivers',
      price: 520,
      icon: '/assets/UberComfort.svg',
      capacity: 4,
      eta: '4-7 min'
    },
    {
      id: 'UberXL',
      name: 'UberXL',
      description: 'Extra seats for groups up to 6',
      price: 680,
      icon: '/assets/UberXL.svg',
      capacity: 6,
      eta: '5-8 min'
    },
    {
      id: 'UberGreen',
      name: 'Uber Green',
      description: 'Eco-friendly rides in hybrid vehicles',
      price: 475,
      icon: '/assets/UberGreen.svg',
      capacity: 4,
      eta: '6-10 min'
    },
    {
      id: 'UberLux',
      name: 'Uber Lux',
      description: 'Premium rides in luxury vehicles',
      price: 850,
      icon: '/assets/UberLux.svg',
      capacity: 4,
      eta: '8-12 min'
    },
    {
      id: 'UberACCESS',
      name: 'UberACCESS',
      description: 'Wheelchair accessible vehicles',
      price: 450,
      icon: '/assets/UberACCESS.svg',
      capacity: 4,
      eta: '10-15 min'
    },
    {
      id: 'UberPet',
      name: 'Uber Pet',
      description: 'Pet-friendly rides',
      price: 500,
      icon: '/assets/UberPet.svg',
      capacity: 4,
      eta: '5-8 min'
    }
  ];

  const handleServiceClick = (serviceId) => {
    onServiceSelect(serviceId);
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="service-popup-overlay" onClick={handleOverlayClick}>
      <div className="service-popup">
        <div className="service-popup-header">
          <h2 className="popup-title">Choose your ride</h2>
          <button className="close-button" onClick={onClose}>
            <img src="/assets/Cross-Icon.svg" alt="Close" />
          </button>
        </div>
        
        <div className="services-list">
          {services.map((service) => (
            <div
              key={service.id}
              className={`service-option ${selectedService === service.id ? 'service-option--selected' : ''}`}
              onClick={() => handleServiceClick(service.id)}
            >
              <div className="service-option-main">
                <div className="service-option-info">
                  <img src={service.icon} alt={service.name} className="service-option-icon" />
                  <div className="service-option-details">
                    <h3 className="service-option-name">{service.name}</h3>
                    <p className="service-option-description">{service.description}</p>
                    <div className="service-option-specs">
                      <span className="spec">
                        <img src="/assets/pin-user.svg" alt="Capacity" className="spec-icon" />
                        {service.capacity}
                      </span>
                      <span className="spec">
                        <img src="/assets/clock-blue.svg" alt="ETA" className="spec-icon" />
                        {service.eta}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="service-option-price">
                  <span className="price">{service.price} Kč</span>
                  {selectedService === service.id && (
                    <div className="selected-indicator">
                      <img src="/assets/tick-green.svg" alt="Selected" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="service-popup-footer">
          <div className="service-info-note">
            <img src="/assets/info.svg" alt="Info" className="info-icon" />
            <span>Prices may vary based on demand and distance</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicePopWindow;