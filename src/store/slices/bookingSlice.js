import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  serviceType: 'UberX',
  bookingDetails: {
    passengers: 1,
    luggage: 1,
    date: '',
    time: '',
    pickupLocation: '',
    destination: ''
  },
  quote: {
    basePrice: 450,
    serviceFee: 25,
    total: 475,
    validUntil: null,
  },
  userDetails: {
    mobile: '',
    email: '',
  },
  paymentStatus: 'pending',
  bookingReference: '',
  bookingStatus: 'draft',
};

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    setServiceType: (state, action) => {
      state.serviceType = action.payload;
    },
    setBookingDetails: (state, action) => {
      state.bookingDetails = { ...state.bookingDetails, ...action.payload };
    },
    setQuote: (state, action) => {
      state.quote = { ...state.quote, ...action.payload };
    },
    setUserDetails: (state, action) => {
      state.userDetails = { ...state.userDetails, ...action.payload };
    },
    setPaymentStatus: (state, action) => {
      state.paymentStatus = action.payload;
    },
    setBookingReference: (state, action) => {
      state.bookingReference = action.payload;
    },
    setBookingStatus: (state, action) => {
      state.bookingStatus = action.payload;
    },
    generateBookingReference: (state) => {
      state.bookingReference = Math.floor(100000 + Math.random() * 900000).toString();
    },
    resetBookingState: (state) => {
      return initialState;
    },
  },
});

export const {
  setServiceType,
  setBookingDetails,
  setQuote,
  setUserDetails,
  setPaymentStatus,
  setBookingReference,
  setBookingStatus,
  generateBookingReference,
  resetBookingState,
} = bookingSlice.actions;

export default bookingSlice.reducer;