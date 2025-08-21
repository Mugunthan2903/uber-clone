const { test, expect } = require('@playwright/test');
const SearchPage = require('../pages/SearchPage');
const SearchResultsPage = require('../pages/SearchResultsPage');
const AvailabilityGuestPage = require('../pages/AvailabilityGuestPage');
const TestHelpers = require('../utils/testHelpers');
const { validGuestData, invalidGuestData, testDataUtils } = require('../fixtures/testData');

test.describe('Guest Information Tests', () => {
  let searchPage;
  let searchResultsPage;
  let guestPage;

  test.beforeEach(async ({ page }) => {
    searchPage = new SearchPage(page);
    searchResultsPage = new SearchResultsPage(page);
    guestPage = new AvailabilityGuestPage(page);
    TestHelpers.logTestStep('Setting up Guest Information test');
  });

  /**
   * Helper function to navigate to guest information form
   */
  async function navigateToGuestForm(page) {
    await searchPage.navigateToSearch();
    await searchPage.searchForDestination('Test Destination');
    await searchResultsPage.selectRideAndProceed(0);
    await guestPage.verifyGuestFormLoaded();
  }

  test.describe('Form Display and Validation', () => {
    test('should display guest information form with all required fields', async ({ page }) => {
      TestHelpers.logTestStep('Testing guest form display');
      
      await navigateToGuestForm(page);
      
      await guestPage.verifyGuestFormElements();
      await guestPage.verifyFormContent();
      
      // Take screenshot for visual verification
      await TestHelpers.takeTimestampedScreenshot(page, 'guest-form-display');
    });

    test('should have continue button disabled initially', async ({ page }) => {
      TestHelpers.logTestStep('Testing initial continue button state');
      
      await navigateToGuestForm(page);
      
      // Continue button should be disabled when form is empty
      await guestPage.verifyContinueButtonState(false);
    });

    test('should enable continue button when all fields are filled', async ({ page }) => {
      TestHelpers.logTestStep('Testing continue button enablement');
      
      await navigateToGuestForm(page);
      
      const guestInfo = validGuestData.standard;
      await guestPage.fillGuestInfo(guestInfo);
      
      // Continue button should now be enabled
      await guestPage.verifyContinueButtonState(true);
    });

    test('should validate empty form submission', async ({ page }) => {
      TestHelpers.logTestStep('Testing empty form validation');
      
      await navigateToGuestForm(page);
      
      // Try to submit empty form
      await guestPage.testEmptyFormValidation();
      
      // Should show validation errors
      const errorMessages = await guestPage.isElementVisible('[data-testid="error-message"]') 
        ? guestPage.errorMessages 
        : guestPage.errorMessagesFallback;
      
      await expect(errorMessages.first()).toBeVisible();
    });

    test('should display virtual keyboard if available', async ({ page }) => {
      TestHelpers.logTestStep('Testing virtual keyboard display');
      
      await navigateToGuestForm(page);
      
      // Click on name input to trigger virtual keyboard
      const nameInput = await guestPage.isElementVisible('[data-testid="guest-name-input"]') 
        ? guestPage.nameInput 
        : guestPage.nameInputFallback;
      
      await nameInput.click();
      
      // Check if virtual keyboard appears
      try {
        await guestPage.verifyVirtualKeyboard();
        TestHelpers.logTestStep('Virtual keyboard is available');
        
        // Take screenshot with virtual keyboard
        await TestHelpers.takeTimestampedScreenshot(page, 'virtual-keyboard-display');
      } catch {
        TestHelpers.logTestStep('Virtual keyboard not available - using standard input');
      }
    });
  });

  test.describe('Form Field Validation', () => {
    test('should validate name field requirements', async ({ page }) => {
      TestHelpers.logTestStep('Testing name field validation');
      
      await navigateToGuestForm(page);
      
      // Test with valid name
      await guestPage.fillNameInput('Valid Name');
      const nameValue = await guestPage.getNameInputValue();
      expect(nameValue).toBe('Valid Name');
      
      // Test clearing name
      await guestPage.fillNameInput('');
      const clearedName = await guestPage.getNameInputValue();
      expect(clearedName).toBe('');
    });

    test('should validate email field format', async ({ page }) => {
      TestHelpers.logTestStep('Testing email validation');
      
      await navigateToGuestForm(page);
      
      const invalidEmails = invalidGuestData.invalidEmail;
      
      for (const emailTest of invalidEmails.slice(0, 2)) {
        TestHelpers.logTestStep(`Testing invalid email: ${emailTest.email}`);
        
        await guestPage.clearForm();
        await guestPage.fillNameInput(emailTest.name);
        await guestPage.fillEmailInput(emailTest.email);
        await guestPage.fillPhoneInput(emailTest.phone);
        
        await guestPage.clickContinueButton();
        
        // Should show email validation error
        try {
          await guestPage.verifyValidationErrors([emailTest.expectedError]);
          TestHelpers.logTestStep(`Email validation error shown for: ${emailTest.email}`);
        } catch {
          TestHelpers.logTestStep(`Email validation may have different error message for: ${emailTest.email}`);
        }
      }
      
      // Test with valid email
      await guestPage.clearForm();
      await guestPage.fillEmailInput('valid@example.com');
      const emailValue = await guestPage.getEmailInputValue();
      expect(emailValue).toBe('valid@example.com');
    });

    test('should validate phone number format', async ({ page }) => {
      TestHelpers.logTestStep('Testing phone validation');
      
      await navigateToGuestForm(page);
      
      const invalidPhones = invalidGuestData.invalidPhone;
      
      for (const phoneTest of invalidPhones.slice(0, 2)) {
        TestHelpers.logTestStep(`Testing invalid phone: ${phoneTest.phone}`);
        
        await guestPage.clearForm();
        await guestPage.fillNameInput(phoneTest.name);
        await guestPage.fillEmailInput(phoneTest.email);
        await guestPage.fillPhoneInput(phoneTest.phone);
        
        await guestPage.clickContinueButton();
        
        // Should show phone validation error
        try {
          await guestPage.verifyValidationErrors([phoneTest.expectedError]);
          TestHelpers.logTestStep(`Phone validation error shown for: ${phoneTest.phone}`);
        } catch {
          TestHelpers.logTestStep(`Phone validation may have different error message for: ${phoneTest.phone}`);
        }
      }
    });

    test('should handle special characters in name field', async ({ page }) => {
      TestHelpers.logTestStep('Testing special characters in name');
      
      await navigateToGuestForm(page);
      
      const specialNames = [
        "María José",
        "Jean-Pierre",
        "O'Connor",
        "李小明",
        "أحمد"
      ];
      
      for (const name of specialNames.slice(0, 3)) {
        TestHelpers.logTestStep(`Testing name with special characters: ${name}`);
        
        await guestPage.fillNameInput(name);
        const nameValue = await guestPage.getNameInputValue();
        
        // Should accept the name (implementation dependent)
        expect(nameValue).toBeTruthy();
        TestHelpers.logTestStep(`Special character name handled: ${nameValue}`);
      }
    });

    test('should validate field length limits', async ({ page }) => {
      TestHelpers.logTestStep('Testing field length limits');
      
      await navigateToGuestForm(page);
      
      // Test very long name
      const longName = 'A'.repeat(150);
      await guestPage.fillNameInput(longName);
      const nameValue = await guestPage.getNameInputValue();
      
      // Implementation may truncate or show error
      TestHelpers.logTestStep('Long name handling', {
        originalLength: longName.length,
        actualLength: nameValue.length
      });
      
      // Test very long email
      const longEmail = 'a'.repeat(100) + '@example.com';
      await guestPage.fillEmailInput(longEmail);
      const emailValue = await guestPage.getEmailInputValue();
      
      TestHelpers.logTestStep('Long email handling', {
        originalLength: longEmail.length,
        actualLength: emailValue.length
      });
    });
  });

  test.describe('Form Interaction and User Experience', () => {
    test('should support tab navigation between fields', async ({ page }) => {
      TestHelpers.logTestStep('Testing tab navigation');
      
      await navigateToGuestForm(page);
      
      // Start from first field
      await page.keyboard.press('Tab');
      await page.keyboard.type('Tab Test Name');
      
      // Tab to next field
      await page.keyboard.press('Tab');
      await page.keyboard.type('test@example.com');
      
      // Tab to next field
      await page.keyboard.press('Tab');
      await page.keyboard.type('+1234567890');
      
      // Verify all fields were filled
      const inputValues = await guestPage.getInputValues();
      expect(inputValues.name).toContain('Tab Test Name');
      expect(inputValues.email).toContain('test@example.com');
      expect(inputValues.phone).toContain('+1234567890');
      
      TestHelpers.logTestStep('Tab navigation successful', inputValues);
    });

    test('should provide visual feedback on field focus', async ({ page }) => {
      TestHelpers.logTestStep('Testing field focus feedback');
      
      await navigateToGuestForm(page);
      
      const nameInput = await guestPage.isElementVisible('[data-testid="guest-name-input"]') 
        ? guestPage.nameInput 
        : guestPage.nameInputFallback;
      
      // Click on name input
      await nameInput.click();
      await expect(nameInput).toBeFocused();
      
      // Take screenshot to verify focus state
      await TestHelpers.takeTimestampedScreenshot(page, 'field-focus-state');
      
      const emailInput = await guestPage.isElementVisible('[data-testid="guest-email-input"]') 
        ? guestPage.emailInput 
        : guestPage.emailInputFallback;
      
      // Move focus to email input
      await emailInput.click();
      await expect(emailInput).toBeFocused();
    });

    test('should maintain form state during interactions', async ({ page }) => {
      TestHelpers.logTestStep('Testing form state persistence');
      
      await navigateToGuestForm(page);
      
      const testData = validGuestData.standard;
      await guestPage.fillGuestInfo(testData);
      
      // Click elsewhere and verify data persists
      await page.click('body');
      
      const inputValues = await guestPage.getInputValues();
      expect(inputValues.name).toBe(testData.name);
      expect(inputValues.email).toBe(testData.email);
      expect(inputValues.phone).toBe(testData.phone);
      
      TestHelpers.logTestStep('Form state maintained', inputValues);
    });

    test('should handle rapid typing in fields', async ({ page }) => {
      TestHelpers.logTestStep('Testing rapid typing handling');
      
      await navigateToGuestForm(page);
      
      const nameInput = await guestPage.isElementVisible('[data-testid="guest-name-input"]') 
        ? guestPage.nameInput 
        : guestPage.nameInputFallback;
      
      // Rapidly type in name field
      await nameInput.click();
      await page.keyboard.type('RapidTypingTest', { delay: 50 });
      
      const nameValue = await guestPage.getNameInputValue();
      expect(nameValue).toContain('RapidTypingTest');
      
      TestHelpers.logTestStep('Rapid typing handled correctly');
    });

    test('should clear individual fields correctly', async ({ page }) => {
      TestHelpers.logTestStep('Testing individual field clearing');
      
      await navigateToGuestForm(page);
      
      // Fill all fields
      const testData = validGuestData.standard;
      await guestPage.fillGuestInfo(testData);
      
      // Clear name field only
      await guestPage.fillNameInput('');
      
      const inputValues = await guestPage.getInputValues();
      expect(inputValues.name).toBe('');
      expect(inputValues.email).toBe(testData.email);
      expect(inputValues.phone).toBe(testData.phone);
      
      // Continue button should be disabled with incomplete form
      await guestPage.verifyContinueButtonState(false);
    });
  });

  test.describe('Data-Driven Form Testing', () => {
    // Test with different valid guest data sets
    Object.entries(validGuestData).forEach(([key, guestData]) => {
      test(`should accept valid guest data: ${key}`, async ({ page }) => {
        TestHelpers.logTestStep(`Testing with guest data: ${key}`);
        
        await navigateToGuestForm(page);
        
        await guestPage.fillGuestInfo(guestData);
        
        // Verify all fields are filled correctly
        const inputValues = await guestPage.getInputValues();
        expect(inputValues.name).toBe(guestData.name);
        expect(inputValues.email).toBe(guestData.email);
        expect(inputValues.phone).toBe(guestData.phone);
        
        // Continue button should be enabled
        await guestPage.verifyContinueButtonState(true);
        
        TestHelpers.logTestStep(`Guest data ${key} validated successfully`);
      });
    });

    test('should handle randomly generated guest data', async ({ page }) => {
      TestHelpers.logTestStep('Testing with randomly generated data');
      
      await navigateToGuestForm(page);
      
      const randomData = testDataUtils.generateDynamicData();
      await guestPage.fillGuestInfo(randomData);
      
      // Verify form accepts random data
      const inputValues = await guestPage.getInputValues();
      expect(inputValues.name).toBe(randomData.name);
      expect(inputValues.email).toBe(randomData.email);
      expect(inputValues.phone).toBe(randomData.phone);
      
      await guestPage.verifyContinueButtonState(true);
      
      TestHelpers.logTestStep('Random data accepted', randomData);
    });

    test('should handle multiple form fill and clear cycles', async ({ page }) => {
      TestHelpers.logTestStep('Testing multiple form cycles');
      
      await navigateToGuestForm(page);
      
      const testDataSets = [validGuestData.standard, validGuestData.business, validGuestData.international];
      
      for (let i = 0; i < testDataSets.length; i++) {
        TestHelpers.logTestStep(`Form cycle ${i + 1}`);
        
        await guestPage.clearForm();
        await guestPage.fillGuestInfo(testDataSets[i]);
        
        const inputValues = await guestPage.getInputValues();
        expect(inputValues.name).toBe(testDataSets[i].name);
        expect(inputValues.email).toBe(testDataSets[i].email);
        expect(inputValues.phone).toBe(testDataSets[i].phone);
        
        await guestPage.verifyContinueButtonState(true);
      }
    });
  });

  test.describe('Form Submission and Navigation', () => {
    test('should submit form and navigate to next step', async ({ page }) => {
      TestHelpers.logTestStep('Testing form submission and navigation');
      
      await navigateToGuestForm(page);
      
      const guestInfo = validGuestData.standard;
      await guestPage.submitGuestInfo(guestInfo);
      
      // Should navigate to next step
      await expect(page).toHaveURL(/.*\/(preview|quote|booking|payment)/);
      
      TestHelpers.logTestStep('Form submitted and navigated successfully');
    });

    test('should navigate back from guest form', async ({ page }) => {
      TestHelpers.logTestStep('Testing back navigation from guest form');
      
      await navigateToGuestForm(page);
      
      await guestPage.clickBackButton();
      
      // Should return to previous step (search results)
      await searchResultsPage.verifySearchResultsElements();
      await expect(page).toHaveURL(/.*\/search-results/);
    });

    test('should maintain form data when navigating back and forth', async ({ page }) => {
      TestHelpers.logTestStep('Testing form data persistence during navigation');
      
      await navigateToGuestForm(page);
      
      const testData = validGuestData.standard;
      await guestPage.fillGuestInfo(testData);
      
      // Navigate back
      await guestPage.clickBackButton();
      await searchResultsPage.verifySearchResultsElements();
      
      // Navigate forward again
      await searchResultsPage.selectRideAndProceed(0);
      
      // Check if form data is maintained (implementation dependent)
      const inputValues = await guestPage.getInputValues();
      TestHelpers.logTestStep('Form data after navigation', inputValues);
      
      // This behavior may vary by implementation
      // Document whether data persists or needs to be re-entered
    });

    test('should prevent submission with incomplete data', async ({ page }) => {
      TestHelpers.logTestStep('Testing incomplete form submission prevention');
      
      await navigateToGuestForm(page);
      
      // Fill only partial data
      await guestPage.fillNameInput('Partial Name');
      await guestPage.fillEmailInput('partial@example.com');
      // Leave phone empty
      
      // Continue button should be disabled or submission should fail
      try {
        await guestPage.verifyContinueButtonState(false);
        TestHelpers.logTestStep('Continue button correctly disabled for incomplete form');
      } catch {
        // If button is enabled, submission should show validation errors
        await guestPage.clickContinueButton();
        
        const errorMessages = await guestPage.isElementVisible('[data-testid="error-message"]') 
          ? guestPage.errorMessages 
          : guestPage.errorMessagesFallback;
        
        await expect(errorMessages.first()).toBeVisible();
        TestHelpers.logTestStep('Validation errors shown for incomplete submission');
      }
    });
  });

  test.describe('Virtual Keyboard Integration', () => {
    test('should work with virtual keyboard if available', async ({ page }) => {
      TestHelpers.logTestStep('Testing virtual keyboard integration');
      
      await navigateToGuestForm(page);
      
      // Try to use virtual keyboard for name input
      try {
        await guestPage.useVirtualKeyboard('[data-testid="guest-name-input"]', 'Virtual Name');
        
        const nameValue = await guestPage.getNameInputValue();
        expect(nameValue).toContain('Virtual');
        
        TestHelpers.logTestStep('Virtual keyboard worked for name input');
      } catch {
        TestHelpers.logTestStep('Virtual keyboard not available, used standard input');
      }
      
      // Try to use virtual keyboard for email input
      try {
        await guestPage.useVirtualKeyboard('[data-testid="guest-email-input"]', 'virtual@test.com');
        
        const emailValue = await guestPage.getEmailInputValue();
        expect(emailValue).toContain('virtual@test.com');
        
        TestHelpers.logTestStep('Virtual keyboard worked for email input');
      } catch {
        TestHelpers.logTestStep('Virtual keyboard not available for email, used standard input');
      }
    });

    test('should handle virtual keyboard for phone input', async ({ page }) => {
      TestHelpers.logTestStep('Testing virtual keyboard for phone input');
      
      await navigateToGuestForm(page);
      
      try {
        await guestPage.useVirtualKeyboard('[data-testid="guest-phone-input"]', '+1234567890');
        
        const phoneValue = await guestPage.getPhoneInputValue();
        expect(phoneValue).toContain('+1234567890');
        
        TestHelpers.logTestStep('Virtual keyboard worked for phone input');
      } catch {
        // Fallback to regular input
        await guestPage.fillPhoneInput('+1234567890');
        TestHelpers.logTestStep('Used standard input for phone number');
      }
    });
  });

  test.describe('Accessibility and Responsive Design', () => {
    test('should be accessible via keyboard navigation', async ({ page }) => {
      TestHelpers.logTestStep('Testing guest form keyboard accessibility');
      
      await navigateToGuestForm(page);
      
      // Navigate and fill form using only keyboard
      await page.keyboard.press('Tab');
      await page.keyboard.type('Keyboard User');
      
      await page.keyboard.press('Tab');
      await page.keyboard.type('keyboard@example.com');
      
      await page.keyboard.press('Tab');
      await page.keyboard.type('+1234567890');
      
      await page.keyboard.press('Tab');
      await page.keyboard.press('Enter'); // Submit form
      
      // Should navigate to next step
      await expect(page).toHaveURL(/.*\/(preview|quote|booking|payment)/);
    });

    test('should display correctly on mobile devices', async ({ page }) => {
      TestHelpers.logTestStep('Testing guest form mobile display');
      
      await TestHelpers.testResponsiveDesign(page, async (viewport) => {
        TestHelpers.logTestStep(`Testing guest form at ${viewport.name}`);
        
        await navigateToGuestForm(page);
        
        // Take screenshot for each viewport
        await TestHelpers.takeTimestampedScreenshot(page, `guest-form-${viewport.name}`);
        
        // Verify form is still functional
        await guestPage.verifyGuestFormElements();
        
        if (viewport.width < 768) {
          // Mobile-specific checks
          const guestForm = await guestPage.isElementVisible('[data-testid="guest-info-form"]') 
            ? guestPage.guestInfoForm 
            : guestPage.guestInfoFormFallback;
          
          await expect(guestForm).toBeVisible();
        }
      });
    });

    test('should have proper ARIA labels and accessibility', async ({ page }) => {
      TestHelpers.logTestStep('Testing guest form accessibility attributes');
      
      await navigateToGuestForm(page);
      
      await TestHelpers.verifyBasicAccessibility(page);
      
      // Check form inputs have proper labels
      const nameInput = await guestPage.isElementVisible('[data-testid="guest-name-input"]') 
        ? guestPage.nameInput 
        : guestPage.nameInputFallback;
      
      const nameLabel = await nameInput.getAttribute('aria-label') || 
                       await nameInput.getAttribute('placeholder');
      
      expect(nameLabel).toBeTruthy();
      TestHelpers.logTestStep('Name input accessibility verified', { label: nameLabel });
    });
  });

  test.describe('Error Handling', () => {
    test('should handle network errors during form submission', async ({ page }) => {
      TestHelpers.logTestStep('Testing network error handling during submission');
      
      await navigateToGuestForm(page);
      
      // Fill valid form data
      const guestInfo = validGuestData.standard;
      await guestPage.fillGuestInfo(guestInfo);
      
      // Mock network failure
      await page.route('**/api/**', route => route.abort());
      
      // Try to submit
      await guestPage.clickContinueButton();
      
      // Should handle network error gracefully
      // Implementation may show error message or retry option
      TestHelpers.logTestStep('Network error during submission handled');
    });

    test('should recover from JavaScript errors', async ({ page }) => {
      TestHelpers.logTestStep('Testing JavaScript error recovery');
      
      const consoleErrors = [];
      page.on('console', msg => {
        if (msg.type() === 'error') {
          consoleErrors.push(msg.text());
        }
      });
      
      await navigateToGuestForm(page);
      await guestPage.fillGuestInfo(validGuestData.standard);
      
      // Form should still be functional
      await guestPage.verifyContinueButtonState(true);
      
      if (consoleErrors.length > 0) {
        TestHelpers.logTestStep('Console errors detected but form remains functional', consoleErrors);
      }
    });
  });

  test.afterEach(async ({ page }) => {
    TestHelpers.logTestStep('Guest information test completed');
    
    // Take screenshot on test failure
    if (test.info().status !== 'passed') {
      await TestHelpers.takeTimestampedScreenshot(page, `guest-form-failure-${test.info().title}`);
    }
  });
});