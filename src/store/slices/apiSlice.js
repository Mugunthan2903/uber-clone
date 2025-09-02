import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { boltService } from '../../api/boltService';

// Async thunk for getting availability
export const getAvailability = createAsyncThunk(
  'api/getAvailability',
  async (availabilityRequest, { rejectWithValue }) => {
    try {
      const response = await boltService.getAvailability(availabilityRequest);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for booking transfer
export const bookTransfer = createAsyncThunk(
  'api/bookTransfer',
  async (bookingRequest, { rejectWithValue }) => {
    try {
      const response = await boltService.bookTransfer(bookingRequest);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  availability: {
    sessionId: null,
    vehicles: [],
    isLoading: false,
    error: null
  },
  booking: {
    confirmed: false,
    saleRef: null,
    ticketNo: null,
    serviceRequestNo: null,
    isLoading: false,
    error: null
  }
};

const apiSlice = createSlice({
  name: 'api',
  initialState,
  reducers: {
    clearAvailability: (state) => {
      state.availability = initialState.availability;
    },
    clearBooking: (state) => {
      state.booking = initialState.booking;
    },
    clearApiErrors: (state) => {
      state.availability.error = null;
      state.booking.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Get availability cases
      .addCase(getAvailability.pending, (state) => {
        state.availability.isLoading = true;
        state.availability.error = null;
      })
      .addCase(getAvailability.fulfilled, (state, action) => {
        state.availability.isLoading = false;
        state.availability.sessionId = action.payload.Ssin;
        state.availability.vehicles = action.payload.TransferAvailabilityRS.SupplierVehicles[0] || [];
      })
      .addCase(getAvailability.rejected, (state, action) => {
        state.availability.isLoading = false;
        state.availability.error = action.payload;
      })
      // Book transfer cases
      .addCase(bookTransfer.pending, (state) => {
        state.booking.isLoading = true;
        state.booking.error = null;
      })
      .addCase(bookTransfer.fulfilled, (state, action) => {
        state.booking.isLoading = false;
        state.booking.confirmed = true;
        state.booking.saleRef = action.payload.CartDtls?.SaleRef;
        state.booking.ticketNo = action.payload.CartDtls?.Item?.[0]?.TicketNo;
        state.booking.serviceRequestNo = action.payload.CartDtls?.Item?.[0]?.OthSrvRqstNo;
      })
      .addCase(bookTransfer.rejected, (state, action) => {
        state.booking.isLoading = false;
        state.booking.error = action.payload;
      });
  }
});

export const { clearAvailability, clearBooking, clearApiErrors } = apiSlice.actions;
export default apiSlice.reducer;