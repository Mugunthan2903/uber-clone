import { apiClient } from './config';

export const boltService = {
  async getAvailability(availabilityRequest) {
    try {
      console.log('Sending availability request:', availabilityRequest);
      const response = await apiClient.post('/api/Transfer/GetAvailability', availabilityRequest);
      console.log('Sending availability response:', response);
      return response.data;
    } catch (error) {
      throw new Error(`Availability request failed: ${error.message}`);
    }
  },

  async bookTransfer(bookingRequest) {
    try {
       console.log('bookingRequest:', bookingRequest);
      const response = await apiClient.post('/api/Cart/BookCart', bookingRequest);
      console.log('Response:', response);
      return response.data;
    } catch (error) {
      throw new Error(`Booking request failed: ${error.message}`);
    }
  }
};