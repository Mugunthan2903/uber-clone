import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import './LoadingScreen.css';

const SearchLoadingScreen = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/quote');
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="loading-screen loading-screen--blue">
      <div className="loading-content">
        <h2 className="loading-text">One moment, we're getting your quote</h2>
        <LoadingSpinner size="medium" color="white" />
      </div>
    </div>
  );
};

export default SearchLoadingScreen;