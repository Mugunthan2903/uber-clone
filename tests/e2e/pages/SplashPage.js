const BasePage = require('./BasePage');
const { expect } = require('@playwright/test');

class SplashPage extends BasePage {
  constructor(page) {
    super(page);
    
    // Selectors with data-testid for stable testing
    this.uberLogo = page.locator('[data-testid="uber-logo"]');
    this.whereToText = page.locator('[data-testid="where-to-text"]');
    this.carIllustration = page.locator('[data-testid="car-illustration"]');
    this.newRideButton = page.locator('[data-testid="new-ride-button"]');
    this.changeOfPlansButton = page.locator('[data-testid="change-of-plans-button"]');
    this.downArrow = page.locator('[data-testid="down-arrow"]');
    
    // Fallback selectors for elements without data-testid
    this.uberLogoFallback = page.locator('.uber-text');
    this.whereToTextFallback = page.locator('.where-to-text');
    this.carIllustrationFallback = page.locator('.car-graphic-img');
    this.newRideButtonFallback = page.locator('.action-item').first();
    this.changeOfPlansButtonFallback = page.locator('.action-item').last();
    this.downArrowFallback = page.locator('.down-arrow');
  }

  /**
   * Navigate to splash screen
   */
  async navigateToSplash() {
    await this.goto('/');
    await this.waitForPageLoad();
  }

  /**
   * Verify splash screen elements are visible
   */
  async verifySplashScreenElements() {
    // Try data-testid first, fallback to class selectors
    const uberLogo = await this.isElementVisible('[data-testid="uber-logo"]') 
      ? this.uberLogo 
      : this.uberLogoFallback;
    
    const whereToText = await this.isElementVisible('[data-testid="where-to-text"]') 
      ? this.whereToText 
      : this.whereToTextFallback;
    
    const carIllustration = await this.isElementVisible('[data-testid="car-illustration"]') 
      ? this.carIllustration 
      : this.carIllustrationFallback;
    
    await expect(uberLogo).toBeVisible();
    await expect(whereToText).toBeVisible();
    await expect(carIllustration).toBeVisible();
    
    // Verify text content
    await expect(uberLogo).toContainText('Uber');
    await expect(whereToText).toContainText('Where to?');
  }

  /**
   * Verify action buttons are present
   */
  async verifyActionButtons() {
    const newRideButton = await this.isElementVisible('[data-testid="new-ride-button"]') 
      ? this.newRideButton 
      : this.newRideButtonFallback;
    
    const changeOfPlansButton = await this.isElementVisible('[data-testid="change-of-plans-button"]') 
      ? this.changeOfPlansButton 
      : this.changeOfPlansButtonFallback;
    
    await expect(newRideButton).toBeVisible();
    await expect(changeOfPlansButton).toBeVisible();
    
    // Verify button text
    await expect(newRideButton).toContainText('Book a new ride');
    await expect(changeOfPlansButton).toContainText('Change of plans?');
  }

  /**
   * Click on "Book a new ride" button
   */
  async clickNewRideButton() {
    const newRideButton = await this.isElementVisible('[data-testid="new-ride-button"]') 
      ? this.newRideButton 
      : this.newRideButtonFallback;
    
    await newRideButton.click();
  }

  /**
   * Click on "Change of plans?" button
   */
  async clickChangeOfPlansButton() {
    const changeOfPlansButton = await this.isElementVisible('[data-testid="change-of-plans-button"]') 
      ? this.changeOfPlansButton 
      : this.changeOfPlansButtonFallback;
    
    await changeOfPlansButton.click();
  }

  /**
   * Wait for auto-navigation to search screen (after 3 seconds)
   */
  async waitForAutoNavigation() {
    await this.page.waitForURL('**/search', { timeout: 5000 });
  }

  /**
   * Verify splash screen loads completely
   */
  async verifySplashScreenLoaded() {
    await this.verifySplashScreenElements();
    await this.verifyActionButtons();
  }

  /**
   * Navigate to search by clicking new ride button
   */
  async navigateToSearchViaNewRide() {
    await this.waitForNavigation(async () => {
      await this.clickNewRideButton();
    });
  }

  /**
   * Navigate to search by clicking change of plans button
   */
  async navigateToSearchViaChangeOfPlans() {
    await this.waitForNavigation(async () => {
      await this.clickChangeOfPlansButton();
    });
  }

  /**
   * Verify header is present
   */
  async verifyHeader() {
    const header = await this.isElementVisible('[data-testid="header"]') 
      ? this.header 
      : this.page.locator('header, .header');
    
    await expect(header).toBeVisible();
  }

  /**
   * Check if page has loaded all images
   */
  async verifyImagesLoaded() {
    const carImage = await this.isElementVisible('[data-testid="car-illustration"]') 
      ? this.carIllustration 
      : this.carIllustrationFallback;
    
    await expect(carImage).toBeVisible();
    
    // Wait for image to actually load
    await this.page.waitForFunction(() => {
      const img = document.querySelector('.car-graphic-img');
      return img && img.complete && img.naturalHeight !== 0;
    });
  }
}

module.exports = SplashPage;