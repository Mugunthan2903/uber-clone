export const handleApiError = (error) => {
  if (error.code === 'ECONNABORTED') {
    return 'Request timeout - please try again';
  }
  
  if (error.response?.status === 400) {
    return 'Invalid request - please check your details';
  }
  
  if (error.response?.status === 404) {
    return 'Service not available at this time';
  }
  
  if (error.response?.status >= 500) {
    return 'Server error - please try again later';
  }
  
  return error.message || 'Something went wrong';
};