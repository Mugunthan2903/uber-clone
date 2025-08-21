const { test, expect } = require('@playwright/test');
const SplashPage = require('../pages/SplashPage');
const SearchPage = require('../pages/SearchPage');
const SearchResultsPage = require('../pages/SearchResultsPage');
const TestHelpers = require('../utils/testHelpers');

test.describe('Advanced User Flow Tests', () => {
  let splashPage, searchPage, searchResultsPage;

  test.beforeEach(async ({ page }) => {
    splashPage = new SplashPage(page);
    searchPage = new SearchPage(page);
    searchResultsPage = new SearchResultsPage(page);
    
    await TestHelpers.setupTestEnvironment(page);
    TestHelpers.logTestStep('Setting up advanced user flow tests');
  });

  test.describe('Complex Navigation Patterns', () => {
    test('should handle deep linking and direct URL access', async ({ page }) => {
      TestHelpers.logTestStep('Testing deep linking functionality');
      
      // Test direct navigation to search results without going through flow
      await page.goto('/search-results');
      
      // Should redirect or handle gracefully
      const currentUrl = page.url();
      
      if (currentUrl.includes('/search-results')) {
        // If stays on search results, verify it handles missing state
        await searchResultsPage.verifySearchResultsElements();
      } else {
        // If redirects, verify it goes to appropriate screen
        expect(currentUrl).toContain('/search');
      }
    });

    test('should maintain application state across page refresh', async ({ page }) => {
      TestHelpers.logTestStep('Testing state persistence across refresh');
      
      await splashPage.navigateToSplash();
      await splashPage.navigateToSearchViaNewRide();
      
      const testDestination = 'Prague Airport';
      await searchPage.enterDestination(testDestination);
      
      // Refresh page
      await page.reload();
      
      // Verify application recovers gracefully
      await searchPage.verifySearchScreenElements();
      
      // Test if Redux state is properly restored or reset
      const destinationValue = await searchPage.getDestinationValue();
      TestHelpers.logTestStep(`Destination after refresh: ${destinationValue}`);
    });

    test('should handle browser back/forward navigation correctly', async ({ page }) => {
      TestHelpers.logTestStep('Testing browser navigation buttons');
      
      await splashPage.navigateToSplash();
      await splashPage.navigateToSearchViaNewRide();
      
      const testDestination = 'Charles Bridge';
      await searchPage.enterDestination(testDestination);
      await searchPage.clickNextButton();
      
      await searchResultsPage.verifySearchResultsElements();
      
      // Use browser back button
      await page.goBack();
      await TestHelpers.verifyNavigation(page, '/search');
      
      // Verify state is maintained
      const destinationValue = await searchPage.getDestinationValue();
      expect(destinationValue).toBe(testDestination);
      
      // Use browser forward button
      await page.goForward();
      await TestHelpers.verifyNavigation(page, '/search-results');
      await searchResultsPage.verifySearchResultsElements();
    });
  });

  test.describe('User Input Validation and Edge Cases', () => {
    test('should validate special characters in destination input', async ({ page }) => {
      TestHelpers.logTestStep('Testing special character input validation');
      
      await splashPage.navigateToSplash();
      await splashPage.navigateToSearchViaNewRide();
      
      const specialCharInputs = [
        'Café Prague', // Accented characters
        'Prague & Vienna', // Ampersand
        'Location "Test"', // Quotes
        'Address <123>', // Angle brackets
        'Test/Location', // Forward slash
        'Location\\Path', // Backslash
        'Test@Location', // At symbol
        'Location #1' // Hash symbol
      ];
      
      for (const input of specialCharInputs) {
        TestHelpers.logTestStep(`Testing input: ${input}`);
        
        await searchPage.clearDestination();
        await searchPage.enterDestination(input);
        
        const inputValue = await searchPage.getDestinationValue();
        expect(inputValue.length).toBeGreaterThan(0);
        
        // Verify next button is enabled for valid input
        const isEnabled = await searchPage.isNextButtonEnabled();
        expect(isEnabled).toBe(true);
      }
    });

    test('should handle Unicode and international characters', async ({ page }) => {
      TestHelpers.logTestStep('Testing Unicode character support');
      
      await splashPage.navigateToSplash();
      await splashPage.navigateToSearchViaNewRide();
      
      const unicodeInputs = [
        'Москва Россия', // Cyrillic
        '北京中国', // Chinese
        'العربية', // Arabic
        'Ελλάδα', // Greek
        'हिंदी भारत', // Hindi
        'にほんご', // Japanese
        '한국어' // Korean
      ];
      
      for (const input of unicodeInputs) {
        await searchPage.clearDestination();
        await searchPage.enterDestination(input);
        
        const inputValue = await searchPage.getDestinationValue();
        expect(inputValue).toBe(input);
      }
    });

    test('should handle input field boundaries and limits', async ({ page }) => {
      TestHelpers.logTestStep('Testing input field boundaries');
      
      await splashPage.navigateToSplash();
      await splashPage.navigateToSearchViaNewRide();
      
      // Test maximum length handling
      const veryLongInput = 'A'.repeat(1000);
      await searchPage.enterDestination(veryLongInput);
      
      const inputValue = await searchPage.getDestinationValue();
      TestHelpers.logTestStep(`Input length after entering 1000 chars: ${inputValue.length}`);
      
      // Test minimum length for enabling next button
      await searchPage.clearDestination();
      await searchPage.enterDestination('A');
      
      const isEnabled = await searchPage.isNextButtonEnabled();
      expect(isEnabled).toBe(true);
    });

    test('should sanitize and handle potentially dangerous inputs', async ({ page }) => {
      TestHelpers.logTestStep('Testing input sanitization');
      
      await splashPage.navigateToSplash();
      await splashPage.navigateToSearchViaNewRide();
      
      const potentiallyDangerousInputs = [
        '<script>alert("xss")</script>',
        'javascript:alert("xss")',
        '${7*7}',
        '{{7*7}}',
        '<img src=x onerror=alert("xss")>',
        'SELECT * FROM users;'
      ];
      
      for (const input of potentiallyDangerousInputs) {
        await searchPage.clearDestination();
        await searchPage.enterDestination(input);
        
        const inputValue = await searchPage.getDestinationValue();
        
        // Verify input is handled safely (not executed as code)
        expect(inputValue).not.toBe('');
        
        // Verify no alert dialogs appeared
        const dialogs = [];
        page.on('dialog', dialog => {
          dialogs.push(dialog);
          dialog.dismiss();
        });
        
        await page.waitForTimeout(1000);
        expect(dialogs.length).toBe(0);
      }
    });
  });

  test.describe('Real-World Usage Scenarios', () => {
    test('should handle rapid user interactions during peak usage', async ({ page }) => {
      TestHelpers.logTestStep('Testing rapid user interactions');
      
      await splashPage.navigateToSplash();
      
      // Simulate rapid clicking and navigation
      const promises = [];
      for (let i = 0; i < 10; i++) {
        promises.push(
          (async () => {
            await page.waitForTimeout(i * 100);
            try {
              await splashPage.newRideButton.click({ timeout: 1000 });
            } catch (error) {
              // Expected - multiple clicks might fail
            }
          })()
        );
      }
      
      await Promise.allSettled(promises);
      
      // Verify final state is consistent
      await TestHelpers.verifyNavigation(page, '/search');
      await searchPage.verifySearchScreenElements();
    });

    test('should simulate realistic user typing patterns', async ({ page }) => {
      TestHelpers.logTestStep('Testing realistic typing patterns');
      
      await splashPage.navigateToSplash();
      await splashPage.navigateToSearchViaNewRide();
      
      const destination = 'Prague Castle, Czech Republic';
      
      // Simulate human-like typing with pauses and corrections
      for (let i = 0; i < destination.length; i++) {
        await page.keyboard.type(destination[i]);
        await page.waitForTimeout(Math.random() * 100 + 50); // Random typing speed
        
        // Occasionally simulate backspace/correction
        if (Math.random() < 0.1 && i > 5) {
          await page.keyboard.press('Backspace');
          await page.waitForTimeout(200);
          await page.keyboard.type(destination[i]);
        }
      }
      
      const inputValue = await searchPage.getDestinationValue();
      expect(inputValue).toBe(destination);
    });

    test('should handle session timeout and recovery', async ({ page }) => {
      TestHelpers.logTestStep('Testing session timeout handling');
      
      await splashPage.navigateToSplash();
      await splashPage.navigateToSearchViaNewRide();
      
      const testDestination = 'Prague Airport';
      await searchPage.enterDestination(testDestination);
      
      // Simulate session timeout by clearing storage
      await page.evaluate(() => {
        localStorage.clear();
        sessionStorage.clear();
      });
      
      await searchPage.clickNextButton();
      
      // Application should handle session loss gracefully
      const currentUrl = page.url();
      
      // Either stay on search with error handling or redirect appropriately
      if (currentUrl.includes('/search-results')) {
        await searchResultsPage.verifySearchResultsElements();
      } else {
        await searchPage.verifySearchScreenElements();
      }
    });
  });

  test.describe('Multi-Device and Cross-Platform Testing', () => {
    test('should work consistently across different user agents', async ({ page }) => {
      TestHelpers.logTestStep('Testing different user agents');
      
      const userAgents = [
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1'
      ];
      
      for (const userAgent of userAgents) {
        await page.setExtraHTTPHeaders({
          'User-Agent': userAgent
        });
        
        TestHelpers.logTestStep(`Testing with user agent: ${userAgent.split(' ')[0]}`);
        
        await splashPage.navigateToSplash();
        await splashPage.verifySplashScreenLoaded();
        
        await splashPage.navigateToSearchViaNewRide();
        await searchPage.verifySearchScreenElements();
        
        await TestHelpers.takeTimestampedScreenshot(page, `user-agent-${userAgent.split(' ')[0].replace(/[^a-zA-Z0-9]/g, '')}`);
      }
    });

    test('should handle different screen orientations on mobile', async ({ page }) => {
      TestHelpers.logTestStep('Testing screen orientation changes');
      
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
      
      await splashPage.navigateToSplash();
      await splashPage.verifySplashScreenLoaded();
      await TestHelpers.takeTimestampedScreenshot(page, 'mobile-portrait');
      
      // Change to landscape
      await page.setViewportSize({ width: 667, height: 375 });
      await page.waitForTimeout(1000); // Allow layout to adjust
      
      await splashPage.verifySplashScreenLoaded();
      await TestHelpers.takeTimestampedScreenshot(page, 'mobile-landscape');
      
      // Verify functionality still works
      await splashPage.navigateToSearchViaNewRide();
      await searchPage.verifySearchScreenElements();
    });
  });

  test.describe('Error Recovery and Resilience', () => {
    test('should recover from JavaScript errors', async ({ page }) => {
      TestHelpers.logTestStep('Testing JavaScript error recovery');
      
      const consoleErrors = [];
      page.on('console', msg => {
        if (msg.type() === 'error') {
          consoleErrors.push(msg.text());
        }
      });
      
      const pageErrors = [];
      page.on('pageerror', error => {
        pageErrors.push(error.message);
      });
      
      await splashPage.navigateToSplash();
      
      // Inject a JavaScript error
      await page.evaluate(() => {
        window.setTimeout(() => {
          throw new Error('Test error for resilience testing');
        }, 100);
      });
      
      await page.waitForTimeout(500);
      
      // Verify application still functions despite error
      await splashPage.verifySplashScreenLoaded();
      await splashPage.navigateToSearchViaNewRide();
      await searchPage.verifySearchScreenElements();
      
      // Log errors for debugging
      if (consoleErrors.length > 0) {
        TestHelpers.logTestStep('Console errors detected', consoleErrors);
      }
      if (pageErrors.length > 0) {
        TestHelpers.logTestStep('Page errors detected', pageErrors);
      }
    });

    test('should handle network interruptions gracefully', async ({ page }) => {
      TestHelpers.logTestStep('Testing network interruption handling');
      
      await splashPage.navigateToSplash();
      await splashPage.navigateToSearchViaNewRide();
      
      // Simulate network going offline
      await page.context().setOffline(true);
      
      const testDestination = 'Prague Castle';
      await searchPage.enterDestination(testDestination);
      
      // Try to proceed while offline
      await searchPage.clickNextButton();
      
      // Application should handle offline state gracefully
      await page.waitForTimeout(2000);
      
      // Restore network
      await page.context().setOffline(false);
      
      // Verify application recovers when network is restored
      await page.reload();
      await searchPage.verifySearchScreenElements();
    });
  });

  test.afterEach(async ({ page }) => {
    TestHelpers.logTestStep('Advanced user flow test completed');
    
    await TestHelpers.cleanupTestEnvironment(page);
    
    if (test.info().status !== 'passed') {
      await TestHelpers.takeTimestampedScreenshot(page, `advanced-flow-failure-${test.info().title}`);
    }
  });
});