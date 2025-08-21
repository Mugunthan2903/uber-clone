import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';

import SplashScreen from './screens/SplashScreen/SplashScreen';
import SearchScreen from './screens/SearchScreen/SearchScreen';
import SearchResults from './screens/SearchResults/SearchResults';
import SearchLoadingScreen from './screens/LoadingScreens/SearchLoadingScreen';
import AvailabilityGuestScreen from './screens/AvailabilityGuestScreen/AvailabilityGuestScreen';
import PreviewScreen from './screens/PreviewScreen/PreviewScreen';
import QuoteScreen from './screens/QuoteScreen/QuoteScreen';
import BookingReviewScreen from './screens/BookingReviewScreen/BookingReviewScreen';
import PaymentLoadingScreen from './screens/LoadingScreens/PaymentLoadingScreen';
import BookingLoadingScreen from './screens/LoadingScreens/BookingLoadingScreen';
import PrintLoadingScreen from './screens/LoadingScreens/PrintLoadingScreen';
import ThankYouScreen from './screens/ThankYouScreen/ThankYouScreen';

import './App.css';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<SplashScreen />} />
            <Route path="/search" element={<SearchScreen />} />
            <Route path="/search-results" element={<SearchResults />} />
            <Route path="/search-loading" element={<SearchLoadingScreen />} />
            <Route path="/availability" element={<AvailabilityGuestScreen />} />
            <Route path="/preview" element={<PreviewScreen />} />
            <Route path="/quote" element={<QuoteScreen />} />
            <Route path="/booking-review" element={<BookingReviewScreen />} />
            <Route path="/payment-loading" element={<PaymentLoadingScreen />} />
            <Route path="/booking-loading" element={<BookingLoadingScreen />} />
            <Route path="/print-loading" element={<PrintLoadingScreen />} />
            <Route path="/thank-you" element={<ThankYouScreen />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </Provider>
  );
}

export default App;
