const { chromium } = require('@playwright/test');

async function globalSetup(config) {
  console.log('Setting up global test environment...');
  
  // You can perform any global setup here
  // For example: database seeding, external service setup, etc.
  
  // Create a browser instance for any pre-test setup
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    // Wait for the application to be available
    await page.goto(config.use.baseURL, { timeout: 60000 });
    console.log('Application is ready for testing');
  } catch (error) {
    console.error('Failed to access application during global setup:', error);
    throw error;
  } finally {
    await browser.close();
  }
  
  console.log('Global setup completed successfully');
}

module.exports = globalSetup;