import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setUserDetails, setQuote } from '../../store/slices/bookingSlice';
import Header from '../../components/common/Header';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import './QuoteScreen.css';

const QuoteScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { quote, userDetails, serviceType } = useSelector(state => state.booking);
  
  const [mobile, setMobile] = useState(userDetails.mobile || '');
  const [email, setEmail] = useState(userDetails.email || '');
  const [countryCode, setCountryCode] = useState('+44');
  const [timeLeft, setTimeLeft] = useState(179); // 2:59 in seconds
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Set quote validity timestamp
    const validUntil = Date.now() + (timeLeft * 1000);
    dispatch(setQuote({ validUntil }));

    // Timer countdown
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [dispatch, timeLeft]);

  const handleStartAgain = () => {
    navigate('/');
  };

  const handleBack = () => {
    navigate('/search');
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!mobile.trim()) {
      newErrors.mobile = 'Mobile number is required';
    } else if (mobile.length < 10) {
      newErrors.mobile = 'Please enter a valid mobile number';
    }
    
    if (!email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleReviewBooking = () => {
    if (validateForm()) {
      dispatch(setUserDetails({ mobile: `${countryCode}${mobile}`, email }));
      navigate('/booking-review');
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const isFormValid = mobile.trim() && email.trim() && /\S+@\S+\.\S+/.test(email) && mobile.length >= 10;

  return (
    <div className="quote-screen">
      <Header showStartAgain={true} onStartAgain={handleStartAgain} />
      
      <div className="quote-content">
        <div className="quote-section">
          <h2 className="section-title">Your quote</h2>
          
          <div className="service-card">
            <div className="service-info">
              <div className="service-icon">
                <img 
                  src="/assets/UberX.svg" 
                  alt="UberX" 
                  className="service-type-icon"
                />
              </div>
              <div className="service-details">
                <h3 className="service-name">{serviceType}</h3>
                <p className="service-description">Experienced Airport drivers</p>
                <div className="service-specs">
                  <span className="spec">
                    <img src="/assets/pin-user.svg" alt="Passengers" className="spec-icon" />
                    4
                  </span>
                  <span className="spec">
                    <img src="/assets/pin-suitcase.svg" alt="Luggage" className="spec-icon" />
                    2
                  </span>
                </div>
              </div>
            </div>
            
            <div className="price-info">
              <div className="price">{quote.total} Kč</div>
              <div className="price-note">Total price</div>
            </div>
          </div>
          
          <div className="quote-validity">
            <div className={`validity-timer ${timeLeft <= 30 ? 'validity-timer--warning' : ''}`}>
              Quote valid for {formatTime(timeLeft)}
            </div>
          </div>
        </div>

        <div className="details-section">
          <h2 className="section-title">Your details</h2>
          
          <div className="form-group">
            <label className="form-label">Mobile number*</label>
            <div className="mobile-input-container">
              <div className="country-selector">
                <img 
                  src="/assets/UKFlag.svg"
                  alt="UK Flag" 
                  className="flag-icon"
                />
                <select 
                  value={countryCode} 
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="country-select"
                >
                  <option value="+44">+44</option>
                  <option value="+1">+1</option>
                  <option value="+420">+420</option>
                </select>
              </div>
              <Input
                type="tel"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="Enter mobile number"
                error={errors.mobile}
                showVirtualKeyboard={true}
                keyboardType="numeric"
                className="mobile-input"
              />
            </div>
            {errors.mobile && <span className="error-text">{errors.mobile}</span>}
            <p className="input-help">
              By entering your phone number, you consent to receive text messages from Uber regarding your trip.
            </p>
          </div>

          <div className="form-group">
            <label className="form-label">Email address*</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              error={errors.email}
              showVirtualKeyboard={true}
              keyboardType="text"
              className="form-input"
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>
        </div>
      </div>

      <div className="quote-footer">
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
            onClick={handleReviewBooking}
            disabled={!isFormValid || timeLeft === 0}
          >
            Review booking →
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuoteScreen;