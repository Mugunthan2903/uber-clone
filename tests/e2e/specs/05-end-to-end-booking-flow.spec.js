const { test, expect } = require('@playwright/test');
const SplashPage = require('../pages/SplashPage');
const SearchPage = require('../pages/SearchPage');
const SearchResultsPage = require('../pages/SearchResultsPage');
const AvailabilityGuestPage = require('../pages/AvailabilityGuestPage');
const TestHelpers = require('../utils/testHelpers');

test.describe('End-to-End Booking Flow Tests', () => {
  let splashPage, searchPage, searchResultsPage, availabilityGuestPage;

  test.beforeEach(async ({ page }) => {
    // Initialize page objects
    splashPage = new SplashPage(page);
    searchPage = new SearchPage(page);
    searchResultsPage = new SearchResultsPage(page);
    availabilityGuestPage = new AvailabilityGuestPage(page);
    
    // Setup test environment
    await TestHelpers.setupTestEnvironment(page);
    TestHelpers.logTestStep('Setting up End-to-End booking flow test');
  });

  test.describe('Complete Booking Flow', () => {
    test('should complete full booking flow from splash to availability screen', async ({ page }) => {
      TestHelpers.logTestStep('Testing complete booking flow');
      
      // Step 1: Start from splash screen
      await splashPage.navigateToSplash();
      await splashPage.verifySplashScreenLoaded();
      await TestHelpers.takeTimestampedScreenshot(page, 'e2e-step1-splash');
      
      // Step 2: Navigate to search screen
      await splashPage.navigateToSearchViaNewRide();
      await searchPage.verifySearchScreenElements();
      await TestHelpers.takeTimestampedScreenshot(page, 'e2e-step2-search');
      
      // Step 3: Enter destination and search
      const testDestination = TestHelpers.generateTestData('location');
      await searchPage.enterDestination(testDestination);
      await searchPage.clickNextButton();
      
      // Step 4: Verify search results
      await TestHelpers.verifyNavigation(page, '/search-results');
      await searchResultsPage.verifySearchResultsElements();
      await TestHelpers.takeTimestampedScreenshot(page, 'e2e-step3-results');
      
      // Step 5: Select a ride option
      await searchResultsPage.selectRideByIndex(0);
      await searchResultsPage.proceedWithSelectedRide();
      
      // Step 6: Verify navigation to availability/guest screen
      await TestHelpers.verifyNavigation(page, '/availability');
      await availabilityGuestPage.verifyGuestScreenElements();
      await TestHelpers.takeTimestampedScreenshot(page, 'e2e-step4-guest-info');
      
      TestHelpers.logTestStep('Complete booking flow test passed');
    });

    test('should handle booking flow with popular destination selection', async ({ page }) => {
      TestHelpers.logTestStep('Testing booking flow with popular destination');
      
      await splashPage.navigateToSplash();
      await splashPage.navigateToSearchViaNewRide();
      
      // Select popular destination instead of typing
      await searchPage.selectPopularDestination(0);
      await searchPage.clickNextButton();
      
      await TestHelpers.verifyNavigation(page, '/search-results');
      await searchResultsPage.verifySearchResultsElements();
      
      // Continue with ride selection
      await searchResultsPage.selectRideByIndex(0);
      await searchResultsPage.proceedWithSelectedRide();
      
      await TestHelpers.verifyNavigation(page, '/availability');
    });

    test('should maintain state during navigation back and forth', async ({ page }) => {
      TestHelpers.logTestStep('Testing state persistence during navigation');
      
      await splashPage.navigateToSplash();
      await splashPage.navigateToSearchViaNewRide();
      
      const testDestination = 'Prague Castle';
      await searchPage.enterDestination(testDestination);
      await searchPage.clickNextButton();
      
      await searchResultsPage.verifySearchResultsElements();
      
      // Navigate back to search
      await searchResultsPage.clickBackButton();
      await TestHelpers.verifyNavigation(page, '/search');
      
      // Verify destination is still filled
      const currentDestination = await searchPage.getDestinationValue();
      expect(currentDestination).toBe(testDestination);
      
      // Navigate forward again
      await searchPage.clickNextButton();
      await searchResultsPage.verifySearchResultsElements();
    });
  });

  test.describe('Data-Driven Booking Tests', () => {
    const bookingTestData = TestHelpers.createTestDataSet('searchLocations');

    bookingTestData.forEach((testData, index) => {
      test(`should complete booking flow with test data set ${index + 1}`, async ({ page }) => {
        TestHelpers.logTestStep(`Testing booking flow with data: ${JSON.stringify(testData)}`);
        
        await splashPage.navigateToSplash();
        await splashPage.navigateToSearchViaNewRide();
        
        await searchPage.enterDestination(testData.destination);
        await searchPage.clickNextButton();
        
        await TestHelpers.verifyNavigation(page, `/${testData.expected}`);
        
        if (testData.expected === 'search-results') {
          await searchResultsPage.verifySearchResultsElements();
          await searchResultsPage.verifyPricingInfo();
          await searchResultsPage.verifyTimeEstimate();
        }
      });
    });
  });

  test.describe('Edge Cases and Error Handling', () => {
    test('should handle empty destination input gracefully', async ({ page }) => {
      TestHelpers.logTestStep('Testing empty destination handling');
      
      await splashPage.navigateToSplash();
      await splashPage.navigateToSearchViaNewRide();
      
      // Try to proceed without entering destination
      const nextButton = await searchPage.isNextButtonEnabled();
      expect(nextButton).toBe(false);
      
      // Verify user can't proceed
      await searchPage.clickNextButton();
      const currentUrl = page.url();
      expect(currentUrl).toContain('/search');
    });

    test('should handle very long destination input', async ({ page }) => {
      TestHelpers.logTestStep('Testing long destination input');
      
      await splashPage.navigateToSplash();
      await splashPage.navigateToSearchViaNewRide();
      
      const longDestination = 'A'.repeat(500);
      await searchPage.enterDestination(longDestination);
      
      // Verify field handles long input
      const inputValue = await searchPage.getDestinationValue();
      expect(inputValue.length).toBeGreaterThan(0);
      expect(inputValue.length).toBeLessThanOrEqual(500);
    });

    test('should handle network errors during booking flow', async ({ page }) => {
      TestHelpers.logTestStep('Testing network error handling');
      
      // Simulate network issues
      await TestHelpers.simulateNetworkConditions(page, 'slow');
      
      await splashPage.navigateToSplash();
      await splashPage.navigateToSearchViaNewRide();
      
      const testDestination = TestHelpers.generateTestData('location');
      await searchPage.enterDestination(testDestination);
      await searchPage.clickNextButton();
      
      // Should still navigate despite slow network
      await TestHelpers.verifyNavigation(page, '/search-results');
    });

    test('should handle rapid button clicking', async ({ page }) => {
      TestHelpers.logTestStep('Testing rapid button interactions');
      
      await splashPage.navigateToSplash();
      
      // Rapidly click new ride button multiple times
      for (let i = 0; i < 5; i++) {
        await splashPage.newRideButton.click({ force: true });
        await page.waitForTimeout(100);
      }
      
      // Should only navigate once
      await TestHelpers.verifyNavigation(page, '/search');
    });
  });

  test.describe('Accessibility in Booking Flow', () => {
    test('should support keyboard navigation through booking flow', async ({ page }) => {
      TestHelpers.logTestStep('Testing keyboard navigation');
      
      await splashPage.navigateToSplash();
      
      // Navigate using keyboard
      await page.keyboard.press('Tab'); // Focus first button
      await page.keyboard.press('Enter'); // Activate button
      
      await TestHelpers.verifyNavigation(page, '/search');
      
      // Tab to destination input
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      
      // Type destination
      await page.keyboard.type('Prague Castle');
      
      // Tab to next button and activate
      await page.keyboard.press('Tab');
      await page.keyboard.press('Enter');
      
      await TestHelpers.verifyNavigation(page, '/search-results');
    });

    test('should have proper focus management', async ({ page }) => {
      TestHelpers.logTestStep('Testing focus management');
      
      await splashPage.navigateToSplash();
      await splashPage.navigateToSearchViaNewRide();
      
      // Verify destination input receives focus
      const destinationInput = await searchPage.getDestinationInput();
      await expect(destinationInput).toBeFocused();
      
      await searchPage.enterDestination('Test destination');
      await searchPage.clickNextButton();
      
      await searchResultsPage.verifySearchResultsElements();
      
      // Verify proper focus on search results page
      const firstRideOption = await searchResultsPage.getAvailableRideOptions();
      if (firstRideOption.length > 0) {
        await firstRideOption[0].focus();
        await expect(firstRideOption[0]).toBeFocused();
      }
    });
  });

  test.describe('Performance in Booking Flow', () => {
    test('should complete booking flow within performance budget', async ({ page }) => {
      TestHelpers.logTestStep('Testing booking flow performance');
      
      const startTime = Date.now();
      
      await splashPage.navigateToSplash();
      await splashPage.navigateToSearchViaNewRide();
      
      const testDestination = TestHelpers.generateTestData('location');
      await searchPage.enterDestination(testDestination);
      await searchPage.clickNextButton();
      
      await searchResultsPage.verifySearchResultsElements();
      
      const totalTime = Date.now() - startTime;
      
      // Booking flow should complete in reasonable time
      expect(totalTime).toBeLessThan(10000); // 10 seconds max
      
      TestHelpers.logTestStep(`Booking flow completed in ${totalTime}ms`);
      
      // Verify performance metrics
      await TestHelpers.verifyPerformance(page, {
        loadTime: 3000,
        domContentLoaded: 2000
      });
    });

    test('should handle concurrent user interactions', async ({ page }) => {
      TestHelpers.logTestStep('Testing concurrent interactions');
      
      await splashPage.navigateToSplash();
      await splashPage.navigateToSearchViaNewRide();
      
      // Perform multiple actions simultaneously
      await Promise.all([
        searchPage.enterDestination('Prague Castle'),
        page.keyboard.press('Tab'),
        page.mouse.move(100, 100)
      ]);
      
      // Verify state is consistent
      const destinationValue = await searchPage.getDestinationValue();
      expect(destinationValue).toBe('Prague Castle');
      
      await searchPage.clickNextButton();
      await TestHelpers.verifyNavigation(page, '/search-results');
    });
  });

  test.describe('Responsive Booking Flow', () => {
    test('should work correctly across different screen sizes', async ({ page }) => {
      TestHelpers.logTestStep('Testing responsive booking flow');
      
      await TestHelpers.testResponsiveDesign(page, async (viewport) => {
        TestHelpers.logTestStep(`Testing booking flow at ${viewport.name} (${viewport.width}x${viewport.height})`);
        
        await splashPage.navigateToSplash();
        await splashPage.verifySplashScreenLoaded();
        
        await splashPage.navigateToSearchViaNewRide();
        await searchPage.verifySearchScreenElements();
        
        // Test destination input
        await searchPage.enterDestination('Test Location');
        await searchPage.clickNextButton();
        
        await TestHelpers.verifyNavigation(page, '/search-results');
        
        // Take screenshot for visual regression
        await TestHelpers.takeTimestampedScreenshot(page, `booking-flow-${viewport.name}`);
      });
    });
  });

  test.afterEach(async ({ page }) => {
    TestHelpers.logTestStep('End-to-End booking flow test completed');
    
    // Cleanup test environment
    await TestHelpers.cleanupTestEnvironment(page);
    
    // Take screenshot on test failure
    if (test.info().status !== 'passed') {
      await TestHelpers.takeTimestampedScreenshot(page, `e2e-booking-failure-${test.info().title}`);
    }
  });
});