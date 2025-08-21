import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentScreen: 'splash',
  isLoading: false,
  showServiceFeeModal: false,
  error: null,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setCurrentScreen: (state, action) => {
      state.currentScreen = action.payload;
    },
    setIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setShowServiceFeeModal: (state, action) => {
      state.showServiceFeeModal = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    resetUiState: (state) => {
      return initialState;
    },
  },
});

export const {
  setCurrentScreen,
  setIsLoading,
  setShowServiceFeeModal,
  setError,
  clearError,
  resetUiState,
} = uiSlice.actions;

export default uiSlice.reducer;