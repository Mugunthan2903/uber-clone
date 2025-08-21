import { configureStore } from '@reduxjs/toolkit';
import locationReducer from './slices/locationSlice';
import bookingReducer from './slices/bookingSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    location: locationReducer,
    booking: bookingReducer,
    ui: uiReducer,
  },
});

export default store;