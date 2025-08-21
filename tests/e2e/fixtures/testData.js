/**
 * Test data fixtures for E2E tests
 */

/**
 * Valid guest information for testing
 */
const validGuestData = {
  standard: {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1234567890'
  },
  international: {
    name: 'María García',
    email: 'maria.garcia@ejemplo.com',
    phone: '+34612345678'
  },
  business: {
    name: 'Business User',
    email: 'business@company.com',
    phone: '+14155552345'
  },
  longName: {
    name: 'Christopher Alexander Wellington-Smith',
    email: 'christopher.smith@example.co.uk',
    phone: '+442071234567'
  }
};

/**
 * Invalid guest information for validation testing
 */
const invalidGuestData = {
  emptyFields: {
    name: '',
    email: '',
    phone: ''
  },
  invalidEmail: [
    {
      name: 'Valid Name',
      email: 'invalid-email',
      phone: '+1234567890',
      expectedError: 'Please enter a valid email address'
    },
    {
      name: 'Valid Name',
      email: '@example.com',
      phone: '+1234567890',
      expectedError: 'Please enter a valid email address'
    },
    {
      name: 'Valid Name',
      email: 'test@',
      phone: '+1234567890',
      expectedError: 'Please enter a valid email address'
    }
  ],
  invalidPhone: [
    {
      name: 'Valid Name',
      email: 'valid@example.com',
      phone: '123',
      expectedError: 'Please enter a valid phone number'
    },
    {
      name: 'Valid Name',
      email: 'valid@example.com',
      phone: 'abc-def-ghij',
      expectedError: 'Please enter a valid phone number'
    }
  ],
  invalidName: [
    {
      name: 'A',
      email: 'valid@example.com',
      phone: '+1234567890',
      expectedError: 'Name must be at least 2 characters long'
    },
    {
      name: 'x'.repeat(101),
      email: 'valid@example.com',
      phone: '+1234567890',
      expectedError: 'Name must be less than 100 characters'
    }
  ]
};

/**
 * Test destinations for search functionality
 */
const testDestinations = {
  popular: [
    {
      name: 'The Mozart Prague',
      address: 'Karolíny Světlé 34, 110 00 Staré Město, Czechia',
      type: 'hotel'
    },
    {
      name: 'Prague Castle',
      address: '119 08 Prague 1, Czechia',
      type: 'tourist_attraction'
    },
    {
      name: 'Old Town Square',
      address: 'Staroměstské nám., 110 00 Josefov, Czechia',
      type: 'tourist_attraction'
    },
    {
      name: 'Charles Bridge',
      address: 'Karlův most, 110 00 Praha 1, Czechia',
      type: 'landmark'
    }
  ],
  custom: [
    'Custom Destination 1',
    'Test Location ABC',
    'Sample Address 123',
    'Demo Place XYZ'
  ],
  international: [
    'London, UK',
    'Paris, France',
    'New York, USA',
    'Tokyo, Japan'
  ],
  specialCharacters: [
    'Destination with Special Chars !@#$%',
    'Address-with-dashes',
    "Place with 'quotes'",
    'Location (with parentheses)'
  ]
};

/**
 * Ride options test data
 */
const rideOptions = {
  uberX: {
    name: 'UberX',
    description: 'Affordable, everyday rides',
    capacity: 4,
    estimatedTime: '2-5 min',
    priceRange: '$8-12'
  },
  uberComfort: {
    name: 'Uber Comfort',
    description: 'Newer cars with extra legroom',
    capacity: 4,
    estimatedTime: '3-7 min',
    priceRange: '$10-15'
  },
  uberXL: {
    name: 'UberXL',
    description: 'Affordable rides for groups up to 6',
    capacity: 6,
    estimatedTime: '4-8 min',
    priceRange: '$12-18'
  }
};

/**
 * Browser and device configurations for cross-platform testing
 */
const testConfigurations = {
  browsers: [
    { name: 'chromium', displayName: 'Chrome' },
    { name: 'firefox', displayName: 'Firefox' },
    { name: 'webkit', displayName: 'Safari' }
  ],
  devices: [
    { name: 'Desktop Chrome', width: 1920, height: 1080 },
    { name: 'Desktop Firefox', width: 1366, height: 768 },
    { name: 'iPad', width: 768, height: 1024 },
    { name: 'iPhone 12', width: 390, height: 844 },
    { name: 'Pixel 5', width: 393, height: 851 }
  ],
  networkConditions: [
    { name: 'fast', description: 'Fast 3G' },
    { name: 'slow', description: 'Slow 3G' },
    { name: 'offline', description: 'Offline' }
  ]
};

/**
 * API mock responses for testing
 */
const mockApiResponses = {
  searchResults: {
    success: {
      status: 200,
      data: {
        rides: [
          {
            id: 'uberx-123',
            type: 'UberX',
            price: '$10.50',
            estimatedTime: '3 min',
            capacity: 4
          },
          {
            id: 'comfort-456',
            type: 'Uber Comfort',
            price: '$13.25',
            estimatedTime: '5 min',
            capacity: 4
          },
          {
            id: 'xl-789',
            type: 'UberXL',
            price: '$15.75',
            estimatedTime: '7 min',
            capacity: 6
          }
        ]
      }
    },
    error: {
      status: 500,
      data: {
        error: 'Service temporarily unavailable'
      }
    },
    noRides: {
      status: 200,
      data: {
        rides: [],
        message: 'No rides available in this area'
      }
    }
  },
  booking: {
    success: {
      status: 200,
      data: {
        bookingId: 'booking-123456',
        status: 'confirmed',
        driverId: 'driver-789',
        estimatedArrival: '2024-01-01T10:15:00Z'
      }
    },
    error: {
      status: 400,
      data: {
        error: 'Unable to confirm booking'
      }
    }
  }
};

/**
 * Test user stories and scenarios
 */
const testScenarios = {
  happyPath: {
    name: 'Complete ride booking flow',
    description: 'User successfully books a ride from start to finish',
    steps: [
      'Navigate to splash screen',
      'Click "Book a new ride"',
      'Enter destination',
      'Select ride type',
      'Enter guest information',
      'Confirm booking',
      'View confirmation screen'
    ]
  },
  errorHandling: {
    name: 'Error handling scenarios',
    description: 'Test various error conditions',
    scenarios: [
      'Network timeout',
      'Invalid form data',
      'No rides available',
      'Payment failure',
      'Server error'
    ]
  },
  accessibility: {
    name: 'Accessibility testing',
    description: 'Verify app is accessible to all users',
    checks: [
      'Keyboard navigation',
      'Screen reader compatibility',
      'Color contrast',
      'Focus indicators',
      'ARIA labels'
    ]
  }
};

/**
 * Test timeouts and intervals
 */
const testTimeouts = {
  pageLoad: 30000,
  elementVisible: 10000,
  apiResponse: 15000,
  navigation: 20000,
  formSubmission: 10000,
  loadingScreen: 15000
};

/**
 * Utility functions for test data
 */
const testDataUtils = {
  /**
   * Get random guest data
   */
  getRandomGuestData() {
    const guests = Object.values(validGuestData);
    return guests[Math.floor(Math.random() * guests.length)];
  },

  /**
   * Get random destination
   */
  getRandomDestination() {
    const destinations = testDestinations.popular.concat(testDestinations.custom);
    return destinations[Math.floor(Math.random() * destinations.length)];
  },

  /**
   * Get test data by category
   * @param {string} category - Data category
   * @param {string} type - Data type within category
   */
  getTestData(category, type) {
    const categories = {
      guest: validGuestData,
      destinations: testDestinations,
      rides: rideOptions,
      invalid: invalidGuestData
    };

    return categories[category]?.[type];
  },

  /**
   * Generate dynamic test data
   */
  generateDynamicData() {
    const timestamp = Date.now();
    return {
      name: `Test User ${timestamp}`,
      email: `test${timestamp}@example.com`,
      phone: `+1${timestamp.toString().slice(-10)}`,
      destination: `Test Destination ${timestamp}`
    };
  }
};

module.exports = {
  validGuestData,
  invalidGuestData,
  testDestinations,
  rideOptions,
  testConfigurations,
  mockApiResponses,
  testScenarios,
  testTimeouts,
  testDataUtils
};