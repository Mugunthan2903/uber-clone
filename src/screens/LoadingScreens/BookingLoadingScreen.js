import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { generateBookingReference, setBookingStatus } from '../../store/slices/bookingSlice';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import './LoadingScreen.css';

const BookingLoadingScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(generateBookingReference());
    
    const timer = setTimeout(() => {
      dispatch(setBookingStatus('confirmed'));
      navigate('/print-loading');
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigate, dispatch]);

  return (
    <div className="loading-screen loading-screen--blue">
      <div className="loading-content">
        <h2 className="loading-text">Please wait, we're preparing your booking</h2>
        <LoadingSpinner size="medium" color="white" />
      </div>
    </div>
  );
};

export default BookingLoadingScreen;