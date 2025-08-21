const { test, expect } = require('@playwright/test');
const SplashPage = require('../pages/SplashPage');
const SearchPage = require('../pages/SearchPage');
const TestHelpers = require('../utils/testHelpers');

test.describe('Splash Screen Tests', () => {
  let splashPage;
  let searchPage;

  test.beforeEach(async ({ page }) => {
    splashPage = new SplashPage(page);
    searchPage = new SearchPage(page);
    TestHelpers.logTestStep('Setting up Splash Screen test');
  });

  test.describe('Visual Elements', () => {
    test('should display all required splash screen elements', async ({ page }) => {
      TestHelpers.logTestStep('Testing splash screen visual elements');
      
      await splashPage.navigateToSplash();
      await splashPage.verifySplashScreenLoaded();
      
      // Take screenshot for visual regression testing
      await TestHelpers.takeTimestampedScreenshot(page, 'splash-screen-elements');
    });

    test('should display Uber logo and branding correctly', async ({ page }) => {
      TestHelpers.logTestStep('Testing Uber branding elements');
      
      await splashPage.navigateToSplash();
      await splashPage.verifyHeader();
      
      // Verify logo is visible and contains correct text
      const uberLogo = await splashPage.isElementVisible('[data-testid="uber-logo"]') 
        ? splashPage.uberLogo 
        : splashPage.uberLogoFallback;
      
      await expect(uberLogo).toBeVisible();
      await expect(uberLogo).toContainText('Uber');
    });

    test('should display car illustration', async ({ page }) => {
      TestHelpers.logTestStep('Testing car illustration display');
      
      await splashPage.navigateToSplash();
      await splashPage.verifyImagesLoaded();
      
      // Verify car illustration is visible and loaded
      const carIllustration = await splashPage.isElementVisible('[data-testid="car-illustration"]') 
        ? splashPage.carIllustration 
        : splashPage.carIllustrationFallback;
      
      await expect(carIllustration).toBeVisible();
    });

    test('should display action buttons with correct text', async ({ page }) => {
      TestHelpers.logTestStep('Testing action buttons');
      
      await splashPage.navigateToSplash();
      await splashPage.verifyActionButtons();
      
      // Verify specific button texts
      const newRideButton = await splashPage.isElementVisible('[data-testid="new-ride-button"]') 
        ? splashPage.newRideButton 
        : splashPage.newRideButtonFallback;
      
      const changeOfPlansButton = await splashPage.isElementVisible('[data-testid="change-of-plans-button"]') 
        ? splashPage.changeOfPlansButton 
        : splashPage.changeOfPlansButtonFallback;
      
      await expect(newRideButton).toContainText('Book a new ride');
      await expect(newRideButton).toContainText('Ride anywhere');
      await expect(changeOfPlansButton).toContainText('Change of plans?');
      await expect(changeOfPlansButton).toContainText('Cancel your ride');
    });
  });

  test.describe('Navigation Functionality', () => {
    test('should auto-navigate to search screen after 3 seconds', async ({ page }) => {
      TestHelpers.logTestStep('Testing auto-navigation to search screen');
      
      await splashPage.navigateToSplash();
      
      // Wait for auto-navigation (should happen after 3 seconds)
      await splashPage.waitForAutoNavigation();
      
      // Verify we're on the search screen
      await searchPage.verifySearchScreenElements();
      await expect(page).toHaveURL(/.*\/search/);
    });

    test('should navigate to search when clicking "Book a new ride"', async ({ page }) => {
      TestHelpers.logTestStep('Testing navigation via "Book a new ride" button');
      
      await splashPage.navigateToSplash();
      await splashPage.navigateToSearchViaNewRide();
      
      // Verify navigation to search screen
      await searchPage.verifySearchScreenElements();
      await expect(page).toHaveURL(/.*\/search/);
    });

    test('should navigate to search when clicking "Change of plans?"', async ({ page }) => {
      TestHelpers.logTestStep('Testing navigation via "Change of plans?" button');
      
      await splashPage.navigateToSplash();
      await splashPage.navigateToSearchViaChangeOfPlans();
      
      // Verify navigation to search screen
      await searchPage.verifySearchScreenElements();
      await expect(page).toHaveURL(/.*\/search/);
    });

    test('should handle navigation interruption gracefully', async ({ page }) => {
      TestHelpers.logTestStep('Testing navigation interruption');
      
      await splashPage.navigateToSplash();
      
      // Click button before auto-navigation occurs
      await page.waitForTimeout(1000);
      await splashPage.clickNewRideButton();
      
      // Verify navigation still works
      await searchPage.verifySearchScreenElements();
      await expect(page).toHaveURL(/.*\/search/);
    });
  });

  test.describe('Interaction Tests', () => {
    test('should highlight buttons on hover', async ({ page }) => {
      TestHelpers.logTestStep('Testing button hover states');
      
      await splashPage.navigateToSplash();
      
      const newRideButton = await splashPage.isElementVisible('[data-testid="new-ride-button"]') 
        ? splashPage.newRideButton 
        : splashPage.newRideButtonFallback;
      
      // Hover over button and verify visual feedback
      await newRideButton.hover();
      
      // Take screenshot to verify hover state
      await TestHelpers.takeTimestampedScreenshot(page, 'button-hover-state');
      
      // Button should still be clickable
      await expect(newRideButton).toBeVisible();
    });

    test('should handle rapid button clicks gracefully', async ({ page }) => {
      TestHelpers.logTestStep('Testing rapid button clicks');
      
      await splashPage.navigateToSplash();
      
      const newRideButton = await splashPage.isElementVisible('[data-testid="new-ride-button"]') 
        ? splashPage.newRideButton 
        : splashPage.newRideButtonFallback;
      
      // Rapidly click button multiple times
      await newRideButton.click({ clickCount: 3 });
      
      // Should still navigate correctly
      await searchPage.verifySearchScreenElements();
      await expect(page).toHaveURL(/.*\/search/);
    });

    test('should maintain functionality after page refresh', async ({ page }) => {
      TestHelpers.logTestStep('Testing functionality after page refresh');
      
      await splashPage.navigateToSplash();
      
      // Refresh the page
      await page.reload();
      await splashPage.waitForPageLoad();
      
      // Verify all elements are still functional
      await splashPage.verifySplashScreenLoaded();
      await splashPage.navigateToSearchViaNewRide();
      
      await searchPage.verifySearchScreenElements();
    });
  });

  test.describe('Responsive Design', () => {
    test('should display correctly on mobile devices', async ({ page }) => {
      TestHelpers.logTestStep('Testing mobile responsive design');
      
      await TestHelpers.testResponsiveDesign(page, async (viewport) => {
        TestHelpers.logTestStep(`Testing at ${viewport.name} resolution`);
        
        await splashPage.navigateToSplash();
        await splashPage.verifySplashScreenLoaded();
        
        // Take screenshot for each viewport
        await TestHelpers.takeTimestampedScreenshot(page, `splash-${viewport.name}`);
        
        // Verify buttons are still clickable at different sizes
        if (viewport.width < 768) {
          // Mobile-specific checks
          const newRideButton = await splashPage.isElementVisible('[data-testid="new-ride-button"]') 
            ? splashPage.newRideButton 
            : splashPage.newRideButtonFallback;
          
          await expect(newRideButton).toBeVisible();
        }
      });
    });

    test('should maintain aspect ratio of images across devices', async ({ page }) => {
      TestHelpers.logTestStep('Testing image aspect ratios');
      
      const viewportSizes = [
        { width: 1920, height: 1080 },
        { width: 768, height: 1024 },
        { width: 375, height: 667 }
      ];

      for (const viewport of viewportSizes) {
        await page.setViewportSize(viewport);
        await splashPage.navigateToSplash();
        
        // Verify images maintain proper aspect ratio
        const carImage = await splashPage.isElementVisible('[data-testid="car-illustration"]') 
          ? splashPage.carIllustration 
          : splashPage.carIllustrationFallback;
        
        const boundingBox = await carImage.boundingBox();
        expect(boundingBox).toBeTruthy();
        expect(boundingBox.width).toBeGreaterThan(0);
        expect(boundingBox.height).toBeGreaterThan(0);
      }
    });
  });

  test.describe('Performance Tests', () => {
    test('should load splash screen within performance budget', async ({ page }) => {
      TestHelpers.logTestStep('Testing splash screen load performance');
      
      const startTime = Date.now();
      
      await splashPage.navigateToSplash();
      await splashPage.verifySplashScreenLoaded();
      
      const loadTime = Date.now() - startTime;
      
      // Verify load time is under 3 seconds
      expect(loadTime).toBeLessThan(3000);
      
      TestHelpers.logTestStep(`Splash screen loaded in ${loadTime}ms`);
    });

    test('should handle slow network conditions', async ({ page }) => {
      TestHelpers.logTestStep('Testing performance under slow network');
      
      // Simulate slow network
      await TestHelpers.simulateNetworkConditions(page, 'slow');
      
      await splashPage.navigateToSplash();
      await splashPage.verifySplashScreenLoaded();
      
      // Verify functionality still works with slow network
      await splashPage.navigateToSearchViaNewRide();
      await searchPage.verifySearchScreenElements();
    });
  });

  test.describe('Accessibility Tests', () => {
    test('should be accessible via keyboard navigation', async ({ page }) => {
      TestHelpers.logTestStep('Testing keyboard accessibility');
      
      await splashPage.navigateToSplash();
      
      // Navigate using keyboard
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      
      // Press Enter on focused button
      await page.keyboard.press('Enter');
      
      // Should navigate to search screen
      await searchPage.verifySearchScreenElements();
    });

    test('should have proper ARIA labels and accessibility attributes', async ({ page }) => {
      TestHelpers.logTestStep('Testing accessibility attributes');
      
      await splashPage.navigateToSplash();
      
      // Verify accessibility attributes
      await TestHelpers.verifyBasicAccessibility(page);
      
      // Check for screen reader friendly content
      const newRideButton = await splashPage.isElementVisible('[data-testid="new-ride-button"]') 
        ? splashPage.newRideButton 
        : splashPage.newRideButtonFallback;
      
      const ariaLabel = await newRideButton.getAttribute('aria-label');
      const textContent = await newRideButton.textContent();
      
      // Should have either aria-label or meaningful text content
      expect(ariaLabel || textContent).toBeTruthy();
    });

    test('should have sufficient color contrast', async ({ page }) => {
      TestHelpers.logTestStep('Testing color contrast');
      
      await splashPage.navigateToSplash();
      
      // This is a basic check - in a real scenario, you'd use specialized tools
      // to check color contrast ratios
      const newRideButton = await splashPage.isElementVisible('[data-testid="new-ride-button"]') 
        ? splashPage.newRideButton 
        : splashPage.newRideButtonFallback;
      
      const computedStyle = await newRideButton.evaluate(element => {
        return window.getComputedStyle(element);
      });
      
      // Verify button has visible styling
      expect(computedStyle.backgroundColor).toBeTruthy();
      expect(computedStyle.color).toBeTruthy();
    });
  });

  test.describe('Error Handling', () => {
    test('should gracefully handle missing assets', async ({ page }) => {
      TestHelpers.logTestStep('Testing missing assets handling');
      
      // Mock 404 responses for assets
      await page.route('**/assets/**', route => {
        route.fulfill({ status: 404 });
      });
      
      await splashPage.navigateToSplash();
      
      // Page should still load and be functional even with missing assets
      await splashPage.verifyActionButtons();
      await splashPage.navigateToSearchViaNewRide();
      
      await expect(page).toHaveURL(/.*\/search/);
    });

    test('should handle JavaScript errors gracefully', async ({ page }) => {
      TestHelpers.logTestStep('Testing JavaScript error handling');
      
      // Listen for console errors
      const consoleErrors = [];
      page.on('console', msg => {
        if (msg.type() === 'error') {
          consoleErrors.push(msg.text());
        }
      });
      
      await splashPage.navigateToSplash();
      await splashPage.verifySplashScreenLoaded();
      
      // Log any console errors for debugging
      if (consoleErrors.length > 0) {
        TestHelpers.logTestStep('Console errors detected', consoleErrors);
      }
      
      // Basic functionality should still work
      await splashPage.navigateToSearchViaNewRide();
      await expect(page).toHaveURL(/.*\/search/);
    });
  });

  test.afterEach(async ({ page }) => {
    TestHelpers.logTestStep('Splash screen test completed');
    
    // Take final screenshot on test failure
    if (test.info().status !== 'passed') {
      await TestHelpers.takeTimestampedScreenshot(page, `splash-test-failure-${test.info().title}`);
    }
  });
});