import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentScreen: 'splash',
  showServiceFeeModal: false,
  isLoading: false,
  error: null,
  quoteExpiryTimer: 0
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setCurrentScreen: (state, action) => {
      state.currentScreen = action.payload;
    },
    toggleServiceFeeModal: (state) => {
      state.showServiceFeeModal = !state.showServiceFeeModal;
    },
    setServiceFeeModal: (state, action) => {
      state.showServiceFeeModal = action.payload;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    setQuoteExpiryTimer: (state, action) => {
      state.quoteExpiryTimer = action.payload;
    },
    decrementQuoteTimer: (state) => {
      if (state.quoteExpiryTimer > 0) {
        state.quoteExpiryTimer -= 1;
      }
    }
  }
});

export const { 
  setCurrentScreen, 
  toggleServiceFeeModal, 
  setServiceFeeModal, 
  setLoading, 
  setError, 
  clearError, 
  setQuoteExpiryTimer, 
  decrementQuoteTimer 
} = uiSlice.actions;
export default uiSlice.reducer;