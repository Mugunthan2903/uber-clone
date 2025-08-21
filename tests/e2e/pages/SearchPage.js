const BasePage = require('./BasePage');
const { expect } = require('@playwright/test');

class SearchPage extends BasePage {
  constructor(page) {
    super(page);
    
    // Selectors with data-testid for stable testing
    this.searchTitle = page.locator('[data-testid="search-title"]');
    this.pickupInput = page.locator('[data-testid="pickup-input"]');
    this.destinationInput = page.locator('[data-testid="destination-input"]');
    this.popularDestinationsSection = page.locator('[data-testid="popular-destinations"]');
    this.destinationItems = page.locator('[data-testid="destination-item"]');
    this.nextButton = page.locator('[data-testid="next-button"]');
    this.backButton = page.locator('[data-testid="back-button"]');
    this.startAgainButton = page.locator('[data-testid="start-again-button"]');
    this.uberLogoFooter = page.locator('[data-testid="uber-logo-footer"]');
    
    // Fallback selectors for elements without data-testid
    this.searchTitleFallback = page.locator('.search-title');
    this.pickupInputFallback = page.locator('input').first();
    this.destinationInputFallback = page.locator('input').last();
    this.popularDestinationsFallback = page.locator('.popular-destinations');
    this.destinationItemsFallback = page.locator('.destination-item');
    this.nextButtonFallback = page.locator('text=Next');
    this.backButtonFallback = page.locator('text=Back');
    this.startAgainButtonFallback = page.locator('text=Start again');
    this.uberLogoFooterFallback = page.locator('.uber-logo-footer');
  }

  /**
   * Navigate to search screen
   */
  async navigateToSearch() {
    await this.goto('/search');
    await this.waitForPageLoad();
  }

  /**
   * Verify search screen elements are visible
   */
  async verifySearchScreenElements() {
    const searchTitle = await this.isElementVisible('[data-testid="search-title"]') 
      ? this.searchTitle 
      : this.searchTitleFallback;
    
    const pickupInput = await this.isElementVisible('[data-testid="pickup-input"]') 
      ? this.pickupInput 
      : this.pickupInputFallback;
    
    const destinationInput = await this.isElementVisible('[data-testid="destination-input"]') 
      ? this.destinationInput 
      : this.destinationInputFallback;
    
    await expect(searchTitle).toBeVisible();
    await expect(pickupInput).toBeVisible();
    await expect(destinationInput).toBeVisible();
    
    // Verify title text
    await expect(searchTitle).toContainText('Ride with Uber');
  }

  /**
   * Verify popular destinations section
   */
  async verifyPopularDestinations() {
    const popularDestinations = await this.isElementVisible('[data-testid="popular-destinations"]') 
      ? this.popularDestinationsSection 
      : this.popularDestinationsFallback;
    
    const destinationItems = await this.isElementVisible('[data-testid="destination-item"]') 
      ? this.destinationItems 
      : this.destinationItemsFallback;
    
    await expect(popularDestinations).toBeVisible();
    await expect(destinationItems).toHaveCount(4); // Assuming 4 popular destinations
    
    // Verify first destination contains expected text
    await expect(destinationItems.first()).toContainText('The Mozart Prague');
  }

  /**
   * Enter destination manually
   * @param {string} destination - Destination to enter
   */
  async enterDestination(destination) {
    const destinationInput = await this.isElementVisible('[data-testid="destination-input"]') 
      ? this.destinationInput 
      : this.destinationInputFallback;
    
    await destinationInput.waitFor({ state: 'visible' });
    await destinationInput.clear();
    await destinationInput.fill(destination);
  }

  /**
   * Select a popular destination by index
   * @param {number} index - Index of destination to select (0-based)
   */
  async selectPopularDestination(index = 0) {
    const destinationItems = await this.isElementVisible('[data-testid="destination-item"]') 
      ? this.destinationItems 
      : this.destinationItemsFallback;
    
    await destinationItems.nth(index).click();
  }

  /**
   * Select a popular destination by name
   * @param {string} destinationName - Name of destination to select
   */
  async selectPopularDestinationByName(destinationName) {
    const destinationItems = await this.isElementVisible('[data-testid="destination-item"]') 
      ? this.destinationItems 
      : this.destinationItemsFallback;
    
    await destinationItems.filter({ hasText: destinationName }).first().click();
  }

  /**
   * Click the Next button
   */
  async clickNextButton() {
    const nextButton = await this.isElementVisible('[data-testid="next-button"]') 
      ? this.nextButton 
      : this.nextButtonFallback;
    
    await nextButton.click();
  }

  /**
   * Click the Back button
   */
  async clickBackButton() {
    const backButton = await this.isElementVisible('[data-testid="back-button"]') 
      ? this.backButton 
      : this.backButtonFallback;
    
    await backButton.click();
  }

  /**
   * Click the Start Again button
   */
  async clickStartAgainButton() {
    const startAgainButton = await this.isElementVisible('[data-testid="start-again-button"]') 
      ? this.startAgainButton 
      : this.startAgainButtonFallback;
    
    await startAgainButton.click();
  }

  /**
   * Verify Next button is enabled/disabled
   * @param {boolean} shouldBeEnabled - Whether button should be enabled
   */
  async verifyNextButtonState(shouldBeEnabled = true) {
    const nextButton = await this.isElementVisible('[data-testid="next-button"]') 
      ? this.nextButton 
      : this.nextButtonFallback;
    
    if (shouldBeEnabled) {
      await expect(nextButton).toBeEnabled();
    } else {
      await expect(nextButton).toBeDisabled();
    }
  }

  /**
   * Get current destination input value
   */
  async getDestinationValue() {
    const destinationInput = await this.isElementVisible('[data-testid="destination-input"]') 
      ? this.destinationInput 
      : this.destinationInputFallback;
    
    return await destinationInput.inputValue();
  }

  /**
   * Get current pickup input value
   */
  async getPickupValue() {
    const pickupInput = await this.isElementVisible('[data-testid="pickup-input"]') 
      ? this.pickupInput 
      : this.pickupInputFallback;
    
    return await pickupInput.inputValue();
  }

  /**
   * Verify pickup location is pre-filled
   */
  async verifyPickupPreFilled() {
    const pickupValue = await this.getPickupValue();
    expect(pickupValue).toBeTruthy();
    expect(pickupValue.length).toBeGreaterThan(0);
  }

  /**
   * Navigate to search results by filling destination and clicking next
   * @param {string} destination - Destination to enter
   */
  async searchForDestination(destination) {
    await this.enterDestination(destination);
    await this.verifyNextButtonState(true);
    
    await this.waitForNavigation(async () => {
      await this.clickNextButton();
    });
  }

  /**
   * Navigate to search results by selecting popular destination
   * @param {number} index - Index of popular destination to select
   */
  async searchWithPopularDestination(index = 0) {
    await this.selectPopularDestination(index);
    await this.verifyNextButtonState(true);
    
    await this.waitForNavigation(async () => {
      await this.clickNextButton();
    });
  }

  /**
   * Verify all search screen elements are loaded
   */
  async verifySearchScreenLoaded() {
    await this.verifySearchScreenElements();
    await this.verifyPopularDestinations();
    await this.verifyPickupPreFilled();
    await this.verifyNextButtonState(false); // Should be disabled initially
  }

  /**
   * Clear destination input
   */
  async clearDestination() {
    const destinationInput = await this.isElementVisible('[data-testid="destination-input"]') 
      ? this.destinationInput 
      : this.destinationInputFallback;
    
    await destinationInput.clear();
  }

  /**
   * Verify footer elements
   */
  async verifyFooter() {
    const uberLogoFooter = await this.isElementVisible('[data-testid="uber-logo-footer"]') 
      ? this.uberLogoFooter 
      : this.uberLogoFooterFallback;
    
    const backButton = await this.isElementVisible('[data-testid="back-button"]') 
      ? this.backButton 
      : this.backButtonFallback;
    
    const nextButton = await this.isElementVisible('[data-testid="next-button"]') 
      ? this.nextButton 
      : this.nextButtonFallback;
    
    await expect(uberLogoFooter).toBeVisible();
    await expect(backButton).toBeVisible();
    await expect(nextButton).toBeVisible();
  }

  /**
   * Type destination with typing simulation
   * @param {string} destination - Destination to type
   */
  async typeDestinationSlowly(destination) {
    const destinationInput = await this.isElementVisible('[data-testid="destination-input"]') 
      ? this.destinationInput 
      : this.destinationInputFallback;
    
    await destinationInput.click();
    await destinationInput.clear();
    await destinationInput.type(destination, { delay: 100 });
  }

  /**
   * Check if next button is enabled
   * @returns {boolean} Whether next button is enabled
   */
  async isNextButtonEnabled() {
    const nextButton = await this.isElementVisible('[data-testid="next-button"]') 
      ? this.nextButton 
      : this.nextButtonFallback;
    
    return await nextButton.isEnabled();
  }

  /**
   * Get destination input element
   * @returns {Locator} Destination input element
   */
  async getDestinationInput() {
    return await this.isElementVisible('[data-testid="destination-input"]') 
      ? this.destinationInput 
      : this.destinationInputFallback;
  }
}

module.exports = SearchPage;