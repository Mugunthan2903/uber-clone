import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setPaymentStatus } from '../../store/slices/bookingSlice';
import './LoadingScreen.css';

const PaymentLoadingScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(setPaymentStatus('completed'));
      navigate('/booking-loading');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate, dispatch]);

  return (
    <div className="loading-screen loading-screen--blue">
      <div className="loading-content">
        <h2 className="loading-text">Complete payment on chip & pin device</h2>
        <div className="payment-amount">Total: 690 Kč</div>
        <div className="loading-arrow">→</div>
      </div>
    </div>
  );
};

export default PaymentLoadingScreen;