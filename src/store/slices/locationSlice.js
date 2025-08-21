import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  pickupLocation: 'Letiště Václava Havla Praha, T1',
  destination: '',
  searchResults: [],
  isSearching: false,
};

const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    setPickupLocation: (state, action) => {
      state.pickupLocation = action.payload;
    },
    setDestination: (state, action) => {
      state.destination = action.payload;
    },
    setSearchResults: (state, action) => {
      state.searchResults = action.payload;
    },
    setIsSearching: (state, action) => {
      state.isSearching = action.payload;
    },
    resetLocationState: (state) => {
      return initialState;
    },
  },
});

export const {
  setPickupLocation,
  setDestination,
  setSearchResults,
  setIsSearching,
  resetLocationState,
} = locationSlice.actions;

export default locationSlice.reducer;