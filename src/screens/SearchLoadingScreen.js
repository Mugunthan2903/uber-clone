import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getAvailability } from '../store/slices/apiSlice';
import { setCurrentScreen } from '../store/slices/uiSlice';
import './SearchLoadingScreen.css';

const SearchLoadingScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { pickup, destination } = useSelector(state => state.location);
  const { availability } = useSelector(state => state.api);

  useEffect(() => {
    dispatch(setCurrentScreen('search-loading'));

    // Prepare API request payload
    const availabilityRequest = {
      "Poscd": "SSM",
      "SSMId": "Witjune002",
      "Language": "en-GB",
      "Currency": "GBP",
      "SuppDtls": [
        {
          "SuppMapId": "BT",
          "JourneyTyp": "U",
          "ProductId": "4603"
        }
      ],
      "StopList": [
        {
          "Order": "1",
          "Address": pickup.address || "Delta Hotels Heathrow Windsor",
          "Postcode": pickup.postcode || "SL3 8PT",
          "Latitude": pickup.latitude || "51.492259000",
          "Longitude": pickup.longitude || "-0.546732000"
        },
        {
          "Order": "2", 
          "Address": destination.address || "Buckingham Palace, London",
          "Postcode": destination.postcode || "SW1A 1AA",
          "Latitude": destination.latitude || "51.501364",
          "Longitude": destination.longitude || "-0.14189"
        }
      ],
      "PickupTime": new Date().toISOString(),
      "BoltRateType": "FR",
      "Reserve": true
    };

    // Call the availability API
    const fetchAvailability = async () => {
      try {
        // Show loading for minimum 2 seconds for better UX
        const [apiResult] = await Promise.all([
          dispatch(getAvailability(availabilityRequest)),
          new Promise(resolve => setTimeout(resolve, 2000))
        ]);

        // Navigate to availability screen on success
        if (apiResult.type === 'api/getAvailability/fulfilled') {
          navigate('/availability');
        } else {
          // Handle error case - could show error screen or navigate back
          console.error('API call failed:', apiResult);
          // For now, navigate to availability with mock data
          navigate('/availability');
        }
      } catch (error) {
        console.error('Error during availability fetch:', error);
        // Navigate to availability anyway for demo purposes
        setTimeout(() => {
          navigate('/availability');
        }, 1000);
      }
    };

    fetchAvailability();
  }, [dispatch, navigate, pickup, destination]);

  return (
    <div className="search-loading-screen">
      <div className="loading-content">
        <h1 className="loading-message">
          One moment,<br />
          we're getting<br />
          your quote
        </h1>
        
        <div className="loading-dots">
          <div className="loading-dot"></div>
          <div className="loading-dot"></div>
          <div className="loading-dot"></div>
        </div>
      </div>
    </div>
  );
};

export default SearchLoadingScreen;