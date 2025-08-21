async function globalTeardown(config) {
  console.log('Running global teardown...');
  
  // Perform any global cleanup here
  // For example: cleanup test data, close external connections, etc.
  
  console.log('Global teardown completed successfully');
}

module.exports = globalTeardown;