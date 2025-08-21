const BasePage = require('./BasePage');
const { expect } = require('@playwright/test');

class SearchResultsPage extends BasePage {
  constructor(page) {
    super(page);
    
    // Main selectors
    this.searchResultsContainer = page.locator('[data-testid="search-results"]');
    this.rideOptions = page.locator('[data-testid="ride-option"]');
    this.backButton = page.locator('[data-testid="back-button"]');
    this.selectButton = page.locator('[data-testid="select-ride-button"]');
    this.mapContainer = page.locator('[data-testid="map-container"]');
    this.routeInfo = page.locator('[data-testid="route-info"]');
    this.estimatedTime = page.locator('[data-testid="estimated-time"]');
    this.estimatedFare = page.locator('[data-testid="estimated-fare"]');
    
    // Ride type selectors
    this.uberXOption = page.locator('[data-testid="ride-option-uberx"]');
    this.uberXLOption = page.locator('[data-testid="ride-option-uberxl"]');
    this.uberBlackOption = page.locator('[data-testid="ride-option-black"]');
    
    // Fallback selectors
    this.searchResultsContainerFallback = page.locator('.search-results, .results-container');
    this.rideOptionsFallback = page.locator('.ride-option, .vehicle-option');
    this.backButtonFallback = page.locator('.back-button, .btn-back');
    this.selectButtonFallback = page.locator('.select-button, .btn-select, .btn-choose');
  }

  /**
   * Navigate to search results page
   */
  async navigateToSearchResults() {
    await this.goto('/search-results');
    await this.waitForPageLoad();
  }

  /**
   * Verify search results page elements are visible
   */
  async verifySearchResultsElements() {
    const container = await this.isElementVisible('[data-testid="search-results"]') 
      ? this.searchResultsContainer 
      : this.searchResultsContainerFallback;
    
    await expect(container).toBeVisible();
    
    // Verify ride options are present
    const rideOptions = await this.isElementVisible('[data-testid="ride-option"]') 
      ? this.rideOptions 
      : this.rideOptionsFallback;
    
    await expect(rideOptions.first()).toBeVisible();
  }

  /**
   * Get available ride options
   */
  async getAvailableRideOptions() {
    const rideOptions = await this.isElementVisible('[data-testid="ride-option"]') 
      ? this.rideOptions 
      : this.rideOptionsFallback;
    
    return await rideOptions.all();
  }

  /**
   * Select a specific ride type
   * @param {string} rideType - Type of ride (uberx, uberxl, black)
   */
  async selectRideType(rideType) {
    const rideSelectors = {
      'uberx': this.uberXOption,
      'uberxl': this.uberXLOption,
      'black': this.uberBlackOption
    };

    const selector = rideSelectors[rideType.toLowerCase()];
    if (selector) {
      await selector.click();
    } else {
      // Fallback to selecting first available option
      const rideOptions = await this.getAvailableRideOptions();
      if (rideOptions.length > 0) {
        await rideOptions[0].click();
      }
    }
  }

  /**
   * Verify ride pricing information
   */
  async verifyPricingInfo() {
    const fareElement = await this.isElementVisible('[data-testid="estimated-fare"]') 
      ? this.estimatedFare 
      : this.page.locator('.fare, .price, .cost');
    
    await expect(fareElement).toBeVisible();
    
    const fareText = await fareElement.textContent();
    expect(fareText).toMatch(/\$|€|£|\d+/); // Should contain currency or numbers
  }

  /**
   * Verify estimated time information
   */
  async verifyTimeEstimate() {
    const timeElement = await this.isElementVisible('[data-testid="estimated-time"]') 
      ? this.estimatedTime 
      : this.page.locator('.time, .duration, .eta');
    
    await expect(timeElement).toBeVisible();
    
    const timeText = await timeElement.textContent();
    expect(timeText).toMatch(/\d+\s*(min|minutes?|hr|hours?)/i);
  }

  /**
   * Click back button to return to search
   */
  async clickBackButton() {
    const backBtn = await this.isElementVisible('[data-testid="back-button"]') 
      ? this.backButton 
      : this.backButtonFallback;
    
    await backBtn.click();
  }

  /**
   * Click select button to proceed with chosen ride
   */
  async clickSelectButton() {
    const selectBtn = await this.isElementVisible('[data-testid="select-ride-button"]') 
      ? this.selectButton 
      : this.selectButtonFallback;
    
    await selectBtn.click();
  }

  /**
   * Verify map is displayed
   */
  async verifyMapDisplay() {
    const map = await this.isElementVisible('[data-testid="map-container"]') 
      ? this.mapContainer 
      : this.page.locator('.map, .map-container, #map');
    
    await expect(map).toBeVisible();
  }

  /**
   * Verify route information is displayed
   */
  async verifyRouteInfo() {
    const routeInfo = await this.isElementVisible('[data-testid="route-info"]') 
      ? this.routeInfo 
      : this.page.locator('.route, .trip-info');
    
    await expect(routeInfo).toBeVisible();
  }

  /**
   * Get ride option details
   * @param {number} index - Index of ride option
   */
  async getRideOptionDetails(index = 0) {
    const rideOptions = await this.getAvailableRideOptions();
    
    if (rideOptions[index]) {
      const option = rideOptions[index];
      const name = await option.locator('.ride-name, .vehicle-name').textContent();
      const price = await option.locator('.price, .fare').textContent();
      const time = await option.locator('.time, .eta').textContent();
      
      return { name, price, time };
    }
    
    return null;
  }

  /**
   * Verify all ride options have required information
   */
  async verifyRideOptionsComplete() {
    const rideOptions = await this.getAvailableRideOptions();
    
    for (let i = 0; i < rideOptions.length; i++) {
      const option = rideOptions[i];
      
      // Each option should have name, price, and time
      await expect(option.locator('.ride-name, .vehicle-name')).toBeVisible();
      await expect(option.locator('.price, .fare')).toBeVisible();
      await expect(option.locator('.time, .eta')).toBeVisible();
    }
  }

  /**
   * Select ride by index
   * @param {number} index - Index of ride to select
   */
  async selectRideByIndex(index = 0) {
    const rideOptions = await this.getAvailableRideOptions();
    
    if (rideOptions[index]) {
      await rideOptions[index].click();
    }
  }

  /**
   * Wait for search results to load
   */
  async waitForSearchResultsToLoad() {
    const container = await this.isElementVisible('[data-testid="search-results"]') 
      ? this.searchResultsContainer 
      : this.searchResultsContainerFallback;
    
    await container.waitFor({ state: 'visible' });
    
    // Wait for ride options to load
    const rideOptions = await this.isElementVisible('[data-testid="ride-option"]') 
      ? this.rideOptions 
      : this.rideOptionsFallback;
    
    await rideOptions.first().waitFor({ state: 'visible' });
  }

  /**
   * Verify search results page is fully loaded
   */
  async verifyPageFullyLoaded() {
    await this.verifySearchResultsElements();
    await this.verifyRideOptionsComplete();
    
    // Optional: verify map and route info if present
    const hasMap = await this.isElementVisible('[data-testid="map-container"]') ||
                   await this.isElementVisible('.map, .map-container, #map');
    
    if (hasMap) {
      await this.verifyMapDisplay();
    }
  }

  /**
   * Navigate to next screen after selecting ride
   */
  async proceedWithSelectedRide() {
    await this.waitForNavigation(async () => {
      await this.clickSelectButton();
    });
  }
}

module.exports = SearchResultsPage;