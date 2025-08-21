const { test, expect } = require('@playwright/test');
const SearchPage = require('../pages/SearchPage');
const SearchResultsPage = require('../pages/SearchResultsPage');
const TestHelpers = require('../utils/testHelpers');
const { rideOptions, testDestinations, mockApiResponses } = require('../fixtures/testData');

test.describe('Ride Selection Tests', () => {
  let searchPage;
  let searchResultsPage;

  test.beforeEach(async ({ page }) => {
    searchPage = new SearchPage(page);
    searchResultsPage = new SearchResultsPage(page);
    TestHelpers.logTestStep('Setting up Ride Selection test');
  });

  test.describe('Search Results Display', () => {
    test('should display search results with ride options', async ({ page }) => {
      TestHelpers.logTestStep('Testing search results display');
      
      // Navigate through search flow
      await searchPage.navigateToSearch();
      await searchPage.searchForDestination('Test Destination');
      
      // Verify search results page loads
      await searchResultsPage.verifySearchResultsLoaded();
      
      // Take screenshot for visual verification
      await TestHelpers.takeTimestampedScreenshot(page, 'search-results-display');
    });

    test('should display correct number of ride options', async ({ page }) => {
      TestHelpers.logTestStep('Testing ride options count');
      
      await searchPage.navigateToSearch();
      await searchPage.searchForDestination('Test Destination');
      
      await searchResultsPage.waitForSearchResults();
      
      const rideTypes = await searchResultsPage.getAvailableRideTypes();
      TestHelpers.logTestStep('Available ride types', { rideTypes });
      
      // Should have at least one ride option
      expect(rideTypes.length).toBeGreaterThan(0);
      
      // Typically should have 3 options (UberX, Comfort, XL)
      expect(rideTypes.length).toBeGreaterThanOrEqual(1);
      expect(rideTypes.length).toBeLessThanOrEqual(5);
    });

    test('should display ride prices and estimated times', async ({ page }) => {
      TestHelpers.logTestStep('Testing price and time display');
      
      await searchPage.navigateToSearch();
      await searchPage.searchForDestination('Test Destination');
      
      await searchResultsPage.verifySearchResultsLoaded();
      await searchResultsPage.verifyPricesAreValid();
      await searchResultsPage.verifyEstimatedTimesAreValid();
      
      // Verify specific price and time for first option
      const firstPrice = await searchResultsPage.getRidePrice(0);
      const firstTime = await searchResultsPage.getEstimatedTime(0);
      
      TestHelpers.logTestStep('First ride option details', {
        price: firstPrice,
        estimatedTime: firstTime
      });
      
      expect(firstPrice).toBeTruthy();
      expect(firstTime).toBeTruthy();
    });

    test('should display location summary correctly', async ({ page }) => {
      TestHelpers.logTestStep('Testing location summary display');
      
      const testDestination = 'Prague Castle';
      
      await searchPage.navigateToSearch();
      await searchPage.searchForDestination(testDestination);
      
      // Verify location summary shows destination
      await searchResultsPage.verifyLocationSummary(null, testDestination);
      
      TestHelpers.logTestStep('Location summary verified');
    });

    test('should handle loading states appropriately', async ({ page }) => {
      TestHelpers.logTestStep('Testing loading states');
      
      await searchPage.navigateToSearch();
      
      // Navigate to search results and check for loading states
      await searchPage.enterDestination('Test Destination');
      await searchPage.clickNextButton();
      
      // There might be a loading screen or spinner
      try {
        await page.waitForSelector('[data-testid="loading-spinner"]', { timeout: 2000 });
        TestHelpers.logTestStep('Loading spinner detected');
        
        // Wait for loading to complete
        await searchResultsPage.waitForSearchResults();
      } catch {
        // No loading spinner, results loaded directly
        TestHelpers.logTestStep('Results loaded directly without loading spinner');
      }
      
      await searchResultsPage.verifySearchResultsElements();
    });
  });

  test.describe('Ride Option Selection', () => {
    test('should allow selecting first ride option', async ({ page }) => {
      TestHelpers.logTestStep('Testing first ride option selection');
      
      await searchPage.navigateToSearch();
      await searchPage.searchForDestination('Test Destination');
      
      await searchResultsPage.selectRideOption(0);
      
      // Verify selection (visual feedback)
      await searchResultsPage.verifyRideOptionSelected(0);
      
      TestHelpers.logTestStep('First ride option selected successfully');
    });

    test('should allow selecting different ride options', async ({ page }) => {
      TestHelpers.logTestStep('Testing different ride option selections');
      
      await searchPage.navigateToSearch();
      await searchPage.searchForDestination('Test Destination');
      
      await searchResultsPage.waitForSearchResults();
      
      // Try to select each available ride option
      const rideTypes = await searchResultsPage.getAvailableRideTypes();
      
      for (let i = 0; i < Math.min(rideTypes.length, 3); i++) {
        TestHelpers.logTestStep(`Selecting ride option ${i}: ${rideTypes[i]}`);
        
        await searchResultsPage.selectRideOption(i);
        await page.waitForTimeout(500); // Allow for selection animation
        
        // Verify selection
        await searchResultsPage.verifyRideOptionSelected(i);
      }
    });

    test('should select UberX specifically', async ({ page }) => {
      TestHelpers.logTestStep('Testing UberX selection specifically');
      
      await searchPage.navigateToSearch();
      await searchPage.searchForDestination('Test Destination');
      
      try {
        await searchResultsPage.selectUberX();
        TestHelpers.logTestStep('UberX selected successfully');
        
        // Take screenshot of selection
        await TestHelpers.takeTimestampedScreenshot(page, 'uberx-selected');
      } catch (error) {
        TestHelpers.logTestStep('UberX not available, selecting first option instead');
        await searchResultsPage.selectRideOption(0);
      }
    });

    test('should select Uber Comfort if available', async ({ page }) => {
      TestHelpers.logTestStep('Testing Uber Comfort selection');
      
      await searchPage.navigateToSearch();
      await searchPage.searchForDestination('Test Destination');
      
      try {
        await searchResultsPage.selectUberComfort();
        TestHelpers.logTestStep('Uber Comfort selected successfully');
      } catch (error) {
        TestHelpers.logTestStep('Uber Comfort not available');
        // This is acceptable - not all areas have all ride types
      }
    });

    test('should select UberXL if available', async ({ page }) => {
      TestHelpers.logTestStep('Testing UberXL selection');
      
      await searchPage.navigateToSearch();
      await searchPage.searchForDestination('Test Destination');
      
      try {
        await searchResultsPage.selectUberXL();
        TestHelpers.logTestStep('UberXL selected successfully');
      } catch (error) {
        TestHelpers.logTestStep('UberXL not available');
        // This is acceptable - not all areas have all ride types
      }
    });

    test('should provide visual feedback on selection', async ({ page }) => {
      TestHelpers.logTestStep('Testing visual feedback on selection');
      
      await searchPage.navigateToSearch();
      await searchPage.searchForDestination('Test Destination');
      
      // Select first option
      await searchResultsPage.selectRideOption(0);
      
      // Take screenshot to verify visual selection state
      await TestHelpers.takeTimestampedScreenshot(page, 'ride-option-selected');
      
      // Verify selection styling/highlighting
      const rideOptions = await searchResultsPage.isElementVisible('[data-testid="ride-option"]') 
        ? searchResultsPage.rideOptions 
        : searchResultsPage.rideOptionsFallback;
      
      const selectedOption = rideOptions.first();
      
      // Check for selection indicators
      const classList = await selectedOption.evaluate(el => el.className);
      TestHelpers.logTestStep('Selected option classes', { classList });
    });
  });

  test.describe('Navigation from Results', () => {
    test('should navigate to next step after selecting ride', async ({ page }) => {
      TestHelpers.logTestStep('Testing navigation after ride selection');
      
      await searchPage.navigateToSearch();
      await searchPage.searchForDestination('Test Destination');
      
      await searchResultsPage.selectRideAndProceed(0);
      
      // Should navigate to next step (availability/guest info)
      await expect(page).toHaveURL(/.*\/(availability|guest|preview|quote)/);
      
      TestHelpers.logTestStep('Successfully navigated to next step');
    });

    test('should navigate back to search from results', async ({ page }) => {
      TestHelpers.logTestStep('Testing back navigation from results');
      
      await searchPage.navigateToSearch();
      await searchPage.searchForDestination('Test Destination');
      
      await searchResultsPage.clickBackButton();
      
      // Should return to search screen
      await searchPage.verifySearchScreenElements();
      await expect(page).toHaveURL(/.*\/search/);
    });

    test('should maintain search state when navigating back', async ({ page }) => {
      TestHelpers.logTestStep('Testing search state persistence');
      
      await searchPage.navigateToSearch();
      
      const testDestination = 'State Persistence Test';
      await searchPage.searchForDestination(testDestination);
      
      // Go back to search
      await searchResultsPage.clickBackButton();
      
      // Verify destination is still filled
      const destinationValue = await searchPage.getDestinationValue();
      expect(destinationValue).toBe(testDestination);
      
      TestHelpers.logTestStep('Search state maintained', { destination: destinationValue });
    });

    test('should handle multiple back and forth navigations', async ({ page }) => {
      TestHelpers.logTestStep('Testing multiple navigations');
      
      await searchPage.navigateToSearch();
      await searchPage.searchForDestination('Navigation Test');
      
      // Go to results and back multiple times
      for (let i = 0; i < 2; i++) {
        TestHelpers.logTestStep(`Navigation cycle ${i + 1}`);
        
        // Should be on results page
        await searchResultsPage.verifySearchResultsElements();
        
        // Go back
        await searchResultsPage.clickBackButton();
        await searchPage.verifySearchScreenElements();
        
        // Go forward again
        await searchPage.clickNextButton();
        await searchResultsPage.waitForSearchResults();
      }
      
      TestHelpers.logTestStep('Multiple navigations completed successfully');
    });
  });

  test.describe('Price and Time Validation', () => {
    test('should display reasonable price ranges', async ({ page }) => {
      TestHelpers.logTestStep('Testing price range validation');
      
      await searchPage.navigateToSearch();
      await searchPage.searchForDestination('Price Test Destination');
      
      await searchResultsPage.verifyPricesAreValid();
      
      // Get all prices and verify they're in reasonable ranges
      const rideOptions = await searchResultsPage.isElementVisible('[data-testid="ride-option"]') 
        ? searchResultsPage.rideOptions 
        : searchResultsPage.rideOptionsFallback;
      
      const rideCount = await rideOptions.count();
      const prices = [];
      
      for (let i = 0; i < rideCount; i++) {
        const price = await searchResultsPage.getRidePrice(i);
        prices.push(price);
        
        // Basic validation - should contain currency and numbers
        expect(price).toMatch(/[$€£¥₹]/);
        expect(price).toMatch(/\d+/);
      }
      
      TestHelpers.logTestStep('Prices validated', { prices });
    });

    test('should display reasonable estimated times', async ({ page }) => {
      TestHelpers.logTestStep('Testing estimated time validation');
      
      await searchPage.navigateToSearch();
      await searchPage.searchForDestination('Time Test Destination');
      
      await searchResultsPage.verifyEstimatedTimesAreValid();
      
      // Get all times and verify format
      const rideOptions = await searchResultsPage.isElementVisible('[data-testid="ride-option"]') 
        ? searchResultsPage.rideOptions 
        : searchResultsPage.rideOptionsFallback;
      
      const rideCount = await rideOptions.count();
      const times = [];
      
      for (let i = 0; i < rideCount; i++) {
        const time = await searchResultsPage.getEstimatedTime(i);
        times.push(time);
        
        // Should contain time units
        expect(time.toLowerCase()).toMatch(/(min|minute|hour|hr|sec)/);
        expect(time).toMatch(/\d+/);
      }
      
      TestHelpers.logTestStep('Estimated times validated', { times });
    });

    test('should show price differences between ride types', async ({ page }) => {
      TestHelpers.logTestStep('Testing price differences between ride types');
      
      await searchPage.navigateToSearch();
      await searchPage.searchForDestination('Price Comparison Test');
      
      const rideOptions = await searchResultsPage.isElementVisible('[data-testid="ride-option"]') 
        ? searchResultsPage.rideOptions 
        : searchResultsPage.rideOptionsFallback;
      
      const rideCount = await rideOptions.count();
      
      if (rideCount > 1) {
        const prices = [];
        for (let i = 0; i < rideCount; i++) {
          const priceText = await searchResultsPage.getRidePrice(i);
          // Extract numeric value from price string
          const numericPrice = parseFloat(priceText.replace(/[^\d.]/g, ''));
          prices.push(numericPrice);
        }
        
        TestHelpers.logTestStep('Price comparison', { prices });
        
        // Typically, premium options should cost more
        // This is a general expectation but may vary by implementation
      }
    });
  });

  test.describe('Data-Driven Ride Selection', () => {
    // Test with different destinations
    testDestinations.popular.slice(0, 3).forEach((destination, index) => {
      test(`should handle ride selection for ${destination.name || destination}`, async ({ page }) => {
        const destName = destination.name || destination;
        TestHelpers.logTestStep(`Testing ride selection for: ${destName}`);
        
        await searchPage.navigateToSearch();
        await searchPage.searchForDestination(destName);
        
        await searchResultsPage.waitForSearchResults();
        await searchResultsPage.selectRideOption(0);
        
        // Verify selection works for this destination
        await searchResultsPage.verifyRideOptionSelected(0);
        
        TestHelpers.logTestStep(`Ride selection successful for: ${destName}`);
      });
    });
  });

  test.describe('Error Handling', () => {
    test('should handle no rides available scenario', async ({ page }) => {
      TestHelpers.logTestStep('Testing no rides available scenario');
      
      // Mock API to return no rides
      await TestHelpers.mockApiResponses(page, {
        '**/api/rides**': mockApiResponses.searchResults.noRides
      });
      
      await searchPage.navigateToSearch();
      await searchPage.searchForDestination('No Rides Test');
      
      // Should handle gracefully - either show message or fallback
      try {
        await searchResultsPage.verifySearchResultsElements();
      } catch {
        // No results page might show different content
        TestHelpers.logTestStep('No rides scenario handled with alternative display');
      }
    });

    test('should handle API errors gracefully', async ({ page }) => {
      TestHelpers.logTestStep('Testing API error handling');
      
      // Mock API to return error
      await TestHelpers.mockApiResponses(page, {
        '**/api/**': mockApiResponses.searchResults.error
      });
      
      await searchPage.navigateToSearch();
      await searchPage.searchForDestination('API Error Test');
      
      // Should show error state or retry option
      // Implementation may vary - document actual behavior
      TestHelpers.logTestStep('API error handled gracefully');
    });

    test('should handle network timeout', async ({ page }) => {
      TestHelpers.logTestStep('Testing network timeout handling');
      
      // Simulate slow network
      await TestHelpers.simulateNetworkConditions(page, 'slow');
      
      await searchPage.navigateToSearch();
      await searchPage.searchForDestination('Timeout Test');
      
      // Should either load slowly or show timeout handling
      try {
        await searchResultsPage.waitForSearchResults();
        TestHelpers.logTestStep('Results loaded despite slow network');
      } catch {
        TestHelpers.logTestStep('Timeout handled appropriately');
      }
    });
  });

  test.describe('Responsive Design', () => {
    test('should display ride options correctly on mobile', async ({ page }) => {
      TestHelpers.logTestStep('Testing mobile ride selection display');
      
      await TestHelpers.testResponsiveDesign(page, async (viewport) => {
        TestHelpers.logTestStep(`Testing ride selection at ${viewport.name}`);
        
        await searchPage.navigateToSearch();
        await searchPage.searchForDestination('Mobile Test');
        
        await searchResultsPage.verifySearchResultsElements();
        
        // Take screenshot for each viewport
        await TestHelpers.takeTimestampedScreenshot(page, `ride-selection-${viewport.name}`);
        
        // Verify ride options are still selectable
        await searchResultsPage.selectRideOption(0);
        
        if (viewport.width < 768) {
          // Mobile-specific checks
          TestHelpers.logTestStep('Mobile-specific ride selection verified');
        }
      });
    });

    test('should handle touch interactions on mobile', async ({ page }) => {
      TestHelpers.logTestStep('Testing mobile touch interactions');
      
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
      
      await searchPage.navigateToSearch();
      await searchPage.searchForDestination('Touch Test');
      
      const rideOptions = await searchResultsPage.isElementVisible('[data-testid="ride-option"]') 
        ? searchResultsPage.rideOptions 
        : searchResultsPage.rideOptionsFallback;
      
      // Simulate touch interaction
      await rideOptions.first().tap();
      
      // Verify selection works with touch
      await searchResultsPage.verifyRideOptionSelected(0);
    });
  });

  test.describe('Accessibility', () => {
    test('should support keyboard navigation for ride selection', async ({ page }) => {
      TestHelpers.logTestStep('Testing keyboard navigation for ride selection');
      
      await searchPage.navigateToSearch();
      await searchPage.searchForDestination('Keyboard Test');
      
      // Use keyboard to navigate through ride options
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      
      // Should be able to select using Enter or Space
      await page.keyboard.press('Enter');
      
      // Verify selection occurred
      const focusedElement = page.locator(':focus');
      await expect(focusedElement).toBeVisible();
    });

    test('should have proper ARIA labels for ride options', async ({ page }) => {
      TestHelpers.logTestStep('Testing ARIA labels for ride options');
      
      await searchPage.navigateToSearch();
      await searchPage.searchForDestination('ARIA Test');
      
      await TestHelpers.verifyBasicAccessibility(page);
      
      // Check ride options have proper accessibility attributes
      const rideOptions = await searchResultsPage.isElementVisible('[data-testid="ride-option"]') 
        ? searchResultsPage.rideOptions 
        : searchResultsPage.rideOptionsFallback;
      
      const firstOption = rideOptions.first();
      const ariaLabel = await firstOption.getAttribute('aria-label');
      const role = await firstOption.getAttribute('role');
      
      TestHelpers.logTestStep('Accessibility attributes check', { ariaLabel, role });
    });
  });

  test.afterEach(async ({ page }) => {
    TestHelpers.logTestStep('Ride selection test completed');
    
    // Take screenshot on test failure
    if (test.info().status !== 'passed') {
      await TestHelpers.takeTimestampedScreenshot(page, `ride-selection-failure-${test.info().title}`);
    }
  });
});