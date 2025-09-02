import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedVehicle: {
    productId: '',
    vehicleId: '',
    name: '',
    description: '',
    seats: 0,
    price: '',
    currency: '',
    fareId: ''
  },
  userDetails: {
    firstName: '',
    lastName: '',
    mobile: '',
    countryCode: '+44',
    email: ''
  },
  pricing: {
    baseFare: 0,
    serviceFee: 0,
    total: 0,
    currency: 'GBP'
  },
  paymentStatus: 'pending', // 'pending' | 'processing' | 'completed'
  bookingStatus: 'draft' // 'draft' | 'confirmed' | 'completed'
};

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    selectVehicle: (state, action) => {
      const vehicle = action.payload;
      state.selectedVehicle = {
        productId: vehicle.ProductId,
        vehicleId: vehicle.VehicleId,
        name: vehicle.VehicleName,
        description: vehicle.Description,
        seats: vehicle.NoOfSeats,
        price: vehicle.Price,
        currency: vehicle.Currency,
        fareId: vehicle.FareId
      };
      // Update pricing
      state.pricing.baseFare = parseFloat(vehicle.Price);
      state.pricing.currency = vehicle.Currency;
      state.pricing.serviceFee = Math.round(state.pricing.baseFare * 0.1 * 100) / 100; // 10% service fee
      state.pricing.total = state.pricing.baseFare + state.pricing.serviceFee;
    },
    updateUserDetails: (state, action) => {
      state.userDetails = { ...state.userDetails, ...action.payload };
    },
    updatePaymentStatus: (state, action) => {
      state.paymentStatus = action.payload;
    },
    updateBookingStatus: (state, action) => {
      state.bookingStatus = action.payload;
    },
    clearBooking: (state) => {
      return initialState;
    }
  }
});

export const { 
  selectVehicle, 
  updateUserDetails, 
  updatePaymentStatus, 
  updateBookingStatus, 
  clearBooking 
} = bookingSlice.actions;
export default bookingSlice.reducer;