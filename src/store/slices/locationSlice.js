import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  pickup: {
    address: '',
    postcode: '',
    latitude: '',
    longitude: ''
  },
  destination: {
    address: '',
    postcode: '',
    latitude: '',
    longitude: ''
  }
};

const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    setPickupLocation: (state, action) => {
      state.pickup = action.payload;
    },
    setDestination: (state, action) => {
      state.destination = action.payload;
    },
    clearLocations: (state) => {
      state.pickup = initialState.pickup;
      state.destination = initialState.destination;
    }
  }
});

export const { setPickupLocation, setDestination, clearLocations } = locationSlice.actions;
export default locationSlice.reducer;