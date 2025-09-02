import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentScreen } from '../store/slices/uiSlice';
import { updatePaymentStatus } from '../store/slices/bookingSlice';
import rightArrow from '../assets/right-white-arrow.svg';
import './PaymentLoadingScreen.css';

const PaymentLoadingScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { pricing } = useSelector(state => state.booking);

  useEffect(() => {
    dispatch(setCurrentScreen('payment-loading'));
    
    // Simulate payment processing
    const processPayment = async () => {
      dispatch(updatePaymentStatus('processing'));
      
      // Simulate payment processing time
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      dispatch(updatePaymentStatus('completed'));
      navigate('/booking-loading');
    };

    processPayment();
  }, [dispatch, navigate]);

  return (
    <div className="payment-loading-screen">
      <div className="payment-loading-content">
        <h1 className="payment-message">
          Complete payment on<br />
          chip & pin device
        </h1>
        
        <div className="payment-amount">
          {pricing.total} {pricing.currency}
        </div>
        
        <div className="payment-arrow">
          <img src={rightArrow} alt="Right Arrow" />
        </div>
      </div>
    </div>
  );
};

export default PaymentLoadingScreen;