import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SplashScreen from './screens/SplashScreen';
import SearchScreen from './screens/SearchScreen';
import SearchLoadingScreen from './screens/SearchLoadingScreen';
import AvailabilityScreen from './screens/AvailabilityScreen';
import BookingReviewScreen from './screens/BookingReviewScreen';
import PaymentLoadingScreen from './screens/PaymentLoadingScreen';
import BookingLoadingScreen from './screens/BookingLoadingScreen';
import PrintLoadingScreen from './screens/PrintLoadingScreen';
import ConfirmationScreen from './screens/ConfirmationScreen';
import ServiceFeeModal from './components/ServiceFeeModal';
import './styles/App.css';

function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<SplashScreen />} />
        <Route path="/search" element={<SearchScreen />} />
        <Route path="/search-loading" element={<SearchLoadingScreen />} />
        <Route path="/availability" element={<AvailabilityScreen />} />
        <Route path="/booking-review" element={<BookingReviewScreen />} />
        <Route path="/payment-loading" element={<PaymentLoadingScreen />} />
        <Route path="/booking-loading" element={<BookingLoadingScreen />} />
        <Route path="/print-loading" element={<PrintLoadingScreen />} />
        <Route path="/confirmation" element={<ConfirmationScreen />} />
      </Routes>
      <ServiceFeeModal />
    </div>
  );
}

export default App;