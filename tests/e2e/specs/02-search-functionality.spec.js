const { test, expect } = require('@playwright/test');
const SearchPage = require('../pages/SearchPage');
const SearchResultsPage = require('../pages/SearchResultsPage');
const TestHelpers = require('../utils/testHelpers');
const { testDestinations, validGuestData } = require('../fixtures/testData');

test.describe('Search Functionality Tests', () => {
  let searchPage;
  let searchResultsPage;

  test.beforeEach(async ({ page }) => {
    searchPage = new SearchPage(page);
    searchResultsPage = new SearchResultsPage(page);
    TestHelpers.logTestStep('Setting up Search Functionality test');
  });

  test.describe('Search Form Functionality', () => {
    test('should display search form with all required elements', async ({ page }) => {
      TestHelpers.logTestStep('Testing search form elements');
      
      await searchPage.navigateToSearch();
      await searchPage.verifySearchScreenLoaded();
      
      // Take screenshot for visual verification
      await TestHelpers.takeTimestampedScreenshot(page, 'search-form-elements');
    });

    test('should have pre-filled pickup location', async ({ page }) => {
      TestHelpers.logTestStep('Testing pre-filled pickup location');
      
      await searchPage.navigateToSearch();
      await searchPage.verifyPickupPreFilled();
      
      const pickupValue = await searchPage.getPickupValue();
      expect(pickupValue).toBeTruthy();
      expect(pickupValue.length).toBeGreaterThan(0);
      
      TestHelpers.logTestStep('Pickup location verified', { pickup: pickupValue });
    });

    test('should enable Next button when destination is entered', async ({ page }) => {
      TestHelpers.logTestStep('Testing Next button state changes');
      
      await searchPage.navigateToSearch();
      
      // Initially, Next button should be disabled
      await searchPage.verifyNextButtonState(false);
      
      // Enter destination
      const testDestination = 'Test Destination';
      await searchPage.enterDestination(testDestination);
      
      // Next button should now be enabled
      await searchPage.verifyNextButtonState(true);
      
      // Clear destination
      await searchPage.clearDestination();
      
      // Next button should be disabled again
      await searchPage.verifyNextButtonState(false);
    });

    test('should display popular destinations', async ({ page }) => {
      TestHelpers.logTestStep('Testing popular destinations display');
      
      await searchPage.navigateToSearch();
      await searchPage.verifyPopularDestinations();
      
      // Verify expected destinations are present
      const expectedDestinations = testDestinations.popular;
      for (const destination of expectedDestinations.slice(0, 2)) {
        const destinationName = typeof destination === 'string' ? destination : destination.name;
        const destinationItem = searchPage.destinationItemsFallback.filter({ hasText: destinationName });
        await expect(destinationItem.first()).toBeVisible();
      }
    });

    test('should allow typing destination manually', async ({ page }) => {
      TestHelpers.logTestStep('Testing manual destination entry');
      
      await searchPage.navigateToSearch();
      
      const testDestination = 'Custom Test Destination';
      await searchPage.typeDestinationSlowly(testDestination);
      
      // Verify destination was entered correctly
      const destinationValue = await searchPage.getDestinationValue();
      expect(destinationValue).toBe(testDestination);
      
      // Next button should be enabled
      await searchPage.verifyNextButtonState(true);
    });

    test('should clear destination input when cleared manually', async ({ page }) => {
      TestHelpers.logTestStep('Testing destination input clearing');
      
      await searchPage.navigateToSearch();
      
      await searchPage.enterDestination('Test Destination');
      await searchPage.verifyNextButtonState(true);
      
      await searchPage.clearDestination();
      
      const destinationValue = await searchPage.getDestinationValue();
      expect(destinationValue).toBe('');
      await searchPage.verifyNextButtonState(false);
    });
  });

  test.describe('Popular Destinations Interaction', () => {
    test('should select popular destination by clicking', async ({ page }) => {
      TestHelpers.logTestStep('Testing popular destination selection');
      
      await searchPage.navigateToSearch();
      
      // Select the first popular destination
      await searchPage.selectPopularDestination(0);
      
      // Verify destination was selected
      const destinationValue = await searchPage.getDestinationValue();
      expect(destinationValue).toBeTruthy();
      
      // Next button should be enabled
      await searchPage.verifyNextButtonState(true);
      
      TestHelpers.logTestStep('Destination selected', { destination: destinationValue });
    });

    test('should select specific popular destination by name', async ({ page }) => {
      TestHelpers.logTestStep('Testing destination selection by name');
      
      await searchPage.navigateToSearch();
      
      const targetDestination = 'The Mozart Prague';
      await searchPage.selectPopularDestinationByName(targetDestination);
      
      // Verify correct destination was selected
      const destinationValue = await searchPage.getDestinationValue();
      expect(destinationValue).toContain(targetDestination);
      
      await searchPage.verifyNextButtonState(true);
    });

    test('should handle clicking multiple popular destinations', async ({ page }) => {
      TestHelpers.logTestStep('Testing multiple destination selections');
      
      await searchPage.navigateToSearch();
      
      // Select first destination
      await searchPage.selectPopularDestination(0);
      const firstDestination = await searchPage.getDestinationValue();
      
      // Select second destination
      await searchPage.selectPopularDestination(1);
      const secondDestination = await searchPage.getDestinationValue();
      
      // Should update to the second destination
      expect(secondDestination).not.toBe(firstDestination);
      expect(secondDestination).toBeTruthy();
    });

    test('should display destination details on hover', async ({ page }) => {
      TestHelpers.logTestStep('Testing destination hover effects');
      
      await searchPage.navigateToSearch();
      
      const destinationItems = await searchPage.isElementVisible('[data-testid="destination-item"]') 
        ? searchPage.destinationItems 
        : searchPage.destinationItemsFallback;
      
      // Hover over first destination item
      await destinationItems.first().hover();
      
      // Take screenshot to verify hover effect
      await TestHelpers.takeTimestampedScreenshot(page, 'destination-hover-effect');
      
      // Verify item is still clickable after hover
      await expect(destinationItems.first()).toBeVisible();
    });
  });

  test.describe('Navigation Tests', () => {
    test('should navigate to search results with manual destination', async ({ page }) => {
      TestHelpers.logTestStep('Testing navigation with manual destination');
      
      await searchPage.navigateToSearch();
      
      const testDestination = 'Manual Test Destination';
      await searchPage.searchForDestination(testDestination);
      
      // Verify navigation to search results
      await searchResultsPage.verifySearchResultsElements();
      await expect(page).toHaveURL(/.*\/search-results/);
      
      TestHelpers.logTestStep('Successfully navigated to search results');
    });

    test('should navigate to search results with popular destination', async ({ page }) => {
      TestHelpers.logTestStep('Testing navigation with popular destination');
      
      await searchPage.navigateToSearch();
      await searchPage.searchWithPopularDestination(0);
      
      // Verify navigation to search results
      await searchResultsPage.verifySearchResultsElements();
      await expect(page).toHaveURL(/.*\/search-results/);
    });

    test('should navigate back to splash screen', async ({ page }) => {
      TestHelpers.logTestStep('Testing back navigation');
      
      await searchPage.navigateToSearch();
      await searchPage.clickBackButton();
      
      // Should navigate back to splash/home screen
      await expect(page).toHaveURL(/.*\/(|splash|$)/);
    });

    test('should handle start again functionality', async ({ page }) => {
      TestHelpers.logTestStep('Testing start again functionality');
      
      await searchPage.navigateToSearch();
      
      // Enter some destination first
      await searchPage.enterDestination('Test Destination');
      
      // Click start again
      await searchPage.clickStartAgainButton();
      
      // Should navigate back to home
      await expect(page).toHaveURL(/.*\/(|splash|$)/);
    });

    test('should prevent navigation without destination', async ({ page }) => {
      TestHelpers.logTestStep('Testing navigation prevention without destination');
      
      await searchPage.navigateToSearch();
      
      // Try to click Next without entering destination
      await searchPage.verifyNextButtonState(false);
      
      // Button should be disabled, so clicking shouldn't navigate
      const nextButton = await searchPage.isElementVisible('[data-testid="next-button"]') 
        ? searchPage.nextButton 
        : searchPage.nextButtonFallback;
      
      // This should not cause navigation since button is disabled
      await nextButton.click({ force: true });
      
      // Should still be on search page
      await expect(page).toHaveURL(/.*\/search/);
    });
  });

  test.describe('Form Validation', () => {
    test('should validate minimum destination length', async ({ page }) => {
      TestHelpers.logTestStep('Testing minimum destination length validation');
      
      await searchPage.navigateToSearch();
      
      // Enter very short destination
      await searchPage.enterDestination('A');
      
      // Next button might still be disabled for very short input
      const destinationValue = await searchPage.getDestinationValue();
      expect(destinationValue).toBe('A');
      
      // Button state depends on implementation - document current behavior
      TestHelpers.logTestStep('Short destination entered', { destination: destinationValue });
    });

    test('should handle special characters in destination', async ({ page }) => {
      TestHelpers.logTestStep('Testing special characters in destination');
      
      await searchPage.navigateToSearch();
      
      const specialDestination = 'Destination with Special Chars !@#$%^&*()';
      await searchPage.enterDestination(specialDestination);
      
      // Should handle special characters gracefully
      const destinationValue = await searchPage.getDestinationValue();
      expect(destinationValue).toBe(specialDestination);
      
      await searchPage.verifyNextButtonState(true);
      await searchPage.clickNextButton();
      
      // Should still navigate successfully
      await expect(page).toHaveURL(/.*\/search-results/);
    });

    test('should handle very long destination names', async ({ page }) => {
      TestHelpers.logTestStep('Testing long destination names');
      
      await searchPage.navigateToSearch();
      
      const longDestination = 'A'.repeat(200); // Very long destination
      await searchPage.enterDestination(longDestination);
      
      const destinationValue = await searchPage.getDestinationValue();
      
      // Should either accept the full string or truncate gracefully
      expect(destinationValue).toBeTruthy();
      expect(destinationValue.length).toBeGreaterThan(0);
      
      TestHelpers.logTestStep('Long destination handled', { 
        originalLength: longDestination.length,
        actualLength: destinationValue.length 
      });
    });

    test('should handle empty destination submission attempts', async ({ page }) => {
      TestHelpers.logTestStep('Testing empty destination handling');
      
      await searchPage.navigateToSearch();
      
      // Ensure destination is empty
      await searchPage.clearDestination();
      
      // Try to submit with Next button (should be disabled)
      await searchPage.verifyNextButtonState(false);
      
      // Verify we stay on the same page
      await expect(page).toHaveURL(/.*\/search/);
    });
  });

  test.describe('User Experience Tests', () => {
    test('should provide visual feedback on form interactions', async ({ page }) => {
      TestHelpers.logTestStep('Testing visual feedback on interactions');
      
      await searchPage.navigateToSearch();
      
      const destinationInput = await searchPage.isElementVisible('[data-testid="destination-input"]') 
        ? searchPage.destinationInput 
        : searchPage.destinationInputFallback;
      
      // Click on input and verify focus
      await destinationInput.click();
      
      // Take screenshot to verify focus state
      await TestHelpers.takeTimestampedScreenshot(page, 'input-focus-state');
      
      // Input should be focused
      await expect(destinationInput).toBeFocused();
    });

    test('should maintain state during user interactions', async ({ page }) => {
      TestHelpers.logTestStep('Testing state persistence');
      
      await searchPage.navigateToSearch();
      
      const testDestination = 'State Test Destination';
      await searchPage.enterDestination(testDestination);
      
      // Click elsewhere and verify destination is maintained
      await page.click('body');
      
      const destinationValue = await searchPage.getDestinationValue();
      expect(destinationValue).toBe(testDestination);
      
      // Next button should still be enabled
      await searchPage.verifyNextButtonState(true);
    });

    test('should handle rapid user interactions', async ({ page }) => {
      TestHelpers.logTestStep('Testing rapid user interactions');
      
      await searchPage.navigateToSearch();
      
      // Rapidly enter and clear destination
      for (let i = 0; i < 3; i++) {
        await searchPage.enterDestination(`Destination ${i}`);
        await page.waitForTimeout(100);
        await searchPage.clearDestination();
        await page.waitForTimeout(100);
      }
      
      // Enter final destination
      await searchPage.enterDestination('Final Destination');
      
      // Should still work correctly
      const destinationValue = await searchPage.getDestinationValue();
      expect(destinationValue).toBe('Final Destination');
      await searchPage.verifyNextButtonState(true);
    });

    test('should display footer elements correctly', async ({ page }) => {
      TestHelpers.logTestStep('Testing footer elements');
      
      await searchPage.navigateToSearch();
      await searchPage.verifyFooter();
      
      // Take screenshot of footer area
      await TestHelpers.takeTimestampedScreenshot(page, 'search-footer');
    });
  });

  test.describe('Data-Driven Tests', () => {
    // Test multiple destinations from test data
    testDestinations.custom.forEach((destination, index) => {
      test(`should search for destination: ${destination}`, async ({ page }) => {
        TestHelpers.logTestStep(`Testing search for destination: ${destination}`);
        
        await searchPage.navigateToSearch();
        await searchPage.searchForDestination(destination);
        
        // Verify navigation to search results
        await searchResultsPage.verifySearchResultsElements();
        await expect(page).toHaveURL(/.*\/search-results/);
        
        TestHelpers.logTestStep(`Successfully searched for: ${destination}`);
      });
    });

    // Test with international destinations
    testDestinations.international.slice(0, 2).forEach((destination) => {
      test(`should handle international destination: ${destination}`, async ({ page }) => {
        TestHelpers.logTestStep(`Testing international destination: ${destination}`);
        
        await searchPage.navigateToSearch();
        await searchPage.enterDestination(destination);
        
        const destinationValue = await searchPage.getDestinationValue();
        expect(destinationValue).toBe(destination);
        
        await searchPage.verifyNextButtonState(true);
        await searchPage.clickNextButton();
        
        await expect(page).toHaveURL(/.*\/search-results/);
      });
    });
  });

  test.describe('Accessibility Tests', () => {
    test('should support keyboard navigation', async ({ page }) => {
      TestHelpers.logTestStep('Testing keyboard navigation');
      
      await searchPage.navigateToSearch();
      
      // Use Tab to navigate through form elements
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      
      const destinationInput = await searchPage.isElementVisible('[data-testid="destination-input"]') 
        ? searchPage.destinationInput 
        : searchPage.destinationInputFallback;
      
      // One of the inputs should be focused
      const focusedElement = page.locator(':focus');
      await expect(focusedElement).toBeVisible();
      
      // Type using keyboard
      await page.keyboard.type('Keyboard Test Destination');
      
      // Navigate to Next button and press Enter
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      await page.keyboard.press('Enter');
      
      // Should navigate to search results
      await expect(page).toHaveURL(/.*\/search-results/);
    });

    test('should have proper ARIA labels', async ({ page }) => {
      TestHelpers.logTestStep('Testing ARIA labels');
      
      await searchPage.navigateToSearch();
      
      // Check input fields have proper labels
      const destinationInput = await searchPage.isElementVisible('[data-testid="destination-input"]') 
        ? searchPage.destinationInput 
        : searchPage.destinationInputFallback;
      
      const ariaLabel = await destinationInput.getAttribute('aria-label');
      const placeholder = await destinationInput.getAttribute('placeholder');
      
      // Should have either aria-label or placeholder for accessibility
      expect(ariaLabel || placeholder).toBeTruthy();
      
      // Verify basic accessibility
      await TestHelpers.verifyBasicAccessibility(page);
    });
  });

  test.describe('Error Handling', () => {
    test('should handle network errors gracefully', async ({ page }) => {
      TestHelpers.logTestStep('Testing network error handling');
      
      // Mock network failure for certain requests
      await page.route('**/api/**', route => {
        route.abort();
      });
      
      await searchPage.navigateToSearch();
      await searchPage.enterDestination('Network Test Destination');
      
      // Should still allow form interaction even with network issues
      await searchPage.verifyNextButtonState(true);
      
      TestHelpers.logTestStep('Form remains functional during network issues');
    });

    test('should recover from JavaScript errors', async ({ page }) => {
      TestHelpers.logTestStep('Testing JavaScript error recovery');
      
      // Listen for console errors
      const consoleErrors = [];
      page.on('console', msg => {
        if (msg.type() === 'error') {
          consoleErrors.push(msg.text());
        }
      });
      
      await searchPage.navigateToSearch();
      await searchPage.enterDestination('Error Test Destination');
      
      // Basic functionality should still work
      await searchPage.verifyNextButtonState(true);
      
      if (consoleErrors.length > 0) {
        TestHelpers.logTestStep('JavaScript errors detected but functionality maintained', consoleErrors);
      }
    });
  });

  test.afterEach(async ({ page }) => {
    TestHelpers.logTestStep('Search functionality test completed');
    
    // Take screenshot on test failure
    if (test.info().status !== 'passed') {
      await TestHelpers.takeTimestampedScreenshot(page, `search-test-failure-${test.info().title}`);
    }
  });
});