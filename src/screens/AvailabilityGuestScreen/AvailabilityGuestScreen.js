import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setBookingDetails } from '../../store/slices/bookingSlice';
import Header from '../../components/common/Header';
import Button from '../../components/common/Button';
import './AvailabilityGuestScreen.css';

const AvailabilityGuestScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { pickupLocation, destination } = useSelector(state => state.location);
  
  const [passengers, setPassengers] = useState(1);
  const [luggage, setLuggage] = useState(1);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  const handleStartAgain = () => {
    navigate('/');
  };

  const handleBack = () => {
    navigate('/search-results');
  };

  const handlePassengerChange = (increment) => {
    setPassengers(Math.max(1, Math.min(8, passengers + increment)));
  };

  const handleLuggageChange = (increment) => {
    setLuggage(Math.max(0, Math.min(6, luggage + increment)));
  };

  const handleContinue = () => {
    if (selectedDate && selectedTime) {
      dispatch(setBookingDetails({
        passengers,
        luggage,
        date: selectedDate,
        time: selectedTime,
        pickupLocation,
        destination
      }));
      navigate('/preview');
    }
  };

  const getCurrentDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const getTimeSlots = () => {
    const slots = [];
    for (let hour = 6; hour <= 23; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push(timeString);
      }
    }
    return slots;
  };

  const isFormValid = selectedDate && selectedTime;

  return (
    <div className="availability-guest-screen">
      <Header showStartAgain={true} onStartAgain={handleStartAgain} />
      
      <div className="availability-content">
        <div className="trip-summary">
          <h1 className="screen-title">Trip Details</h1>
          <div className="route-info">
            <div className="route-item">
              <img src="/assets/location-blue.svg" alt="Pickup" className="route-icon" />
              <span className="route-text">From: {pickupLocation}</span>
            </div>
            <div className="route-item">
              <img src="/assets/location-grey.svg" alt="Destination" className="route-icon" />
              <span className="route-text">To: {destination}</span>
            </div>
          </div>
        </div>

        <div className="booking-details">
          <div className="detail-section">
            <h3 className="section-title">
              <img src="/assets/pin-user.svg" alt="Passengers" className="section-icon" />
              Passengers
            </h3>
            <div className="counter-control">
              <button 
                className="counter-btn" 
                onClick={() => handlePassengerChange(-1)}
                disabled={passengers <= 1}
              >
                <img src="/assets/Minus-Icon.svg" alt="Decrease" />
              </button>
              <span className="counter-value">{passengers}</span>
              <button 
                className="counter-btn" 
                onClick={() => handlePassengerChange(1)}
                disabled={passengers >= 8}
              >
                <img src="/assets/Plus-Icon.svg" alt="Increase" />
              </button>
            </div>
          </div>

          <div className="detail-section">
            <h3 className="section-title">
              <img src="/assets/pin-suitcase.svg" alt="Luggage" className="section-icon" />
              Luggage
            </h3>
            <div className="counter-control">
              <button 
                className="counter-btn" 
                onClick={() => handleLuggageChange(-1)}
                disabled={luggage <= 0}
              >
                <img src="/assets/Minus-Icon.svg" alt="Decrease" />
              </button>
              <span className="counter-value">{luggage}</span>
              <button 
                className="counter-btn" 
                onClick={() => handleLuggageChange(1)}
                disabled={luggage >= 6}
              >
                <img src="/assets/Plus-Icon.svg" alt="Increase" />
              </button>
            </div>
          </div>

          <div className="detail-section">
            <h3 className="section-title">
              <img src="/assets/Calendar-Icon-Black.svg" alt="Date" className="section-icon" />
              Date
            </h3>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={getCurrentDate()}
              className="date-input"
            />
          </div>

          <div className="detail-section">
            <h3 className="section-title">
              <img src="/assets/Time-Icon.svg" alt="Time" className="section-icon" />
              Time
            </h3>
            <select
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="time-select"
            >
              <option value="">Select time</option>
              {getTimeSlots().map(time => (
                <option key={time} value={time}>{time}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="availability-status">
          <div className="status-indicator">
            <img src="/assets/tick-green.svg" alt="Available" className="status-icon" />
            <span className="status-text">Service available for selected time</span>
          </div>
        </div>
      </div>
      
      <div className="availability-footer">
        <div className="uber-logo-footer">
          <img 
            src="/assets/uber-logo.svg" 
            alt="Uber Logo" 
            className="uber-logo-footer-img"
          />
        </div>
        <div className="footer-buttons">
          <Button variant="secondary" onClick={handleBack}>
            ← Back
          </Button>
          <Button 
            variant="primary" 
            onClick={handleContinue}
            disabled={!isFormValid}
          >
            Continue →
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AvailabilityGuestScreen;