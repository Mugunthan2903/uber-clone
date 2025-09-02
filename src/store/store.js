import { configureStore } from '@reduxjs/toolkit';
import apiReducer from './slices/apiSlice';
import locationReducer from './slices/locationSlice';
import bookingReducer from './slices/bookingSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    api: apiReducer,
    location: locationReducer,
    booking: bookingReducer,
    ui: uiReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST']
      }
    })
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;