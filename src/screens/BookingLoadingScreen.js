import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { bookTransfer } from '../store/slices/apiSlice';
import { setCurrentScreen } from '../store/slices/uiSlice';
import { updateBookingStatus } from '../store/slices/bookingSlice';
import './BookingLoadingScreen.css';

const BookingLoadingScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { pickup, destination } = useSelector(state => state.location);
  const { selectedVehicle, userDetails, pricing } = useSelector(state => state.booking);
  const { availability } = useSelector(state => state.api);

  useEffect(() => {
    dispatch(setCurrentScreen('booking-loading'));

    // Prepare booking request payload
    const bookingRequest = {
      "Poscd": "SSM",
      "SSMId": "Witjune002",
      "GstLname": userDetails.lastName || "Doe",
      "GstFname": userDetails.firstName || "John",
      "GstMobile": userDetails.mobile || "1234567890",
      "GstDialcd": userDetails.countryCode || "+44",
      "GstCntrycd": "GB",
      "GstEmail": userDetails.email || "user@example.com",
      "TotalAmt": pricing.total,
      "AuthRef": `AUTH_${Date.now()}`,
      "AuthChrgAmt": pricing.total,
      "AuthCrncy": pricing.currency,
      "CartDtls": [{
        "SuppMapId": "BT",
        "Amount": pricing.baseFare,
        "BkngFee": pricing.serviceFee,
        "TransferDtls": {
          "JourneyTyp": "U",
          "SsId": availability.sessionId || `session_${Date.now()}`,
          "PickUpDt": new Date().toISOString().split('T')[0],
          "PickUpTm": new Date().toLocaleTimeString(),
          "VhclId": selectedVehicle.vehicleId || "uber-airport",
          "NoOfPssngr": selectedVehicle.seats || 4,
          "Stops": [
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
          "BoltDtls": {
            "ProductId": selectedVehicle.productId || "4603",
            "JobPriceType": "Fare",
            "FareId": selectedVehicle.fareId || "fare123",
            "BoltRateType": "FR"
          }
        }
      }],
      "Language": "en-GB",
      "Currency": pricing.currency
    };

    // Call the booking API
    const makeBooking = async () => {
      try {
        dispatch(updateBookingStatus('confirmed'));
        
        // Show loading for minimum 2 seconds
        const [apiResult] = await Promise.all([
          dispatch(bookTransfer(bookingRequest)),
          new Promise(resolve => setTimeout(resolve, 2000))
        ]);

        // Navigate to print loading screen regardless of API result
        if (apiResult.type === 'api/bookTransfer/fulfilled') {
          dispatch(updateBookingStatus('completed'));
        }
        
        navigate('/print-loading');
      } catch (error) {
        console.error('Error during booking:', error);
        // Still navigate to print loading for demo purposes
        setTimeout(() => {
          navigate('/print-loading');
        }, 1000);
      }
    };

    makeBooking();
  }, [dispatch, navigate, pickup, destination, selectedVehicle, userDetails, pricing, availability.sessionId]);

  return (
    <div className="booking-loading-screen">
      <div className="booking-loading-content">
        <h1 className="booking-message">
          Please wait,<br />
          we're preparing<br />
          your booking
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

export default BookingLoadingScreen;