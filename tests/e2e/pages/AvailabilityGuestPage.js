const BasePage = require('./BasePage');
const { expect } = require('@playwright/test');

class AvailabilityGuestPage extends BasePage {
  constructor(page) {
    super(page);
    
    // Main selectors with data-testid
    this.availabilityContainer = page.locator('[data-testid="availability-screen"]');
    this.guestInfoSection = page.locator('[data-testid="guest-info-section"]');
    this.guestCountSelector = page.locator('[data-testid="guest-count-selector"]');
    this.increaseGuestButton = page.locator('[data-testid="increase-guests"]');
    this.decreaseGuestButton = page.locator('[data-testid="decrease-guests"]');
    this.continueButton = page.locator('[data-testid="continue-button"]');
    this.backButton = page.locator('[data-testid="back-button"]');
    
    // Date/time selectors
    this.dateSelector = page.locator('[data-testid="date-selector"]');
    this.timeSelector = page.locator('[data-testid="time-selector"]');
    this.nowButton = page.locator('[data-testid="now-button"]');
    this.scheduleButton = page.locator('[data-testid="schedule-button"]');
    
    // Guest details
    this.guestCountDisplay = page.locator('[data-testid="guest-count-display"]');
    
    // Fallback selectors
    this.availabilityContainerFallback = page.locator('.availability-screen, .guest-screen');
    this.guestInfoSectionFallback = page.locator('.guest-info, .availability-info');
    this.guestCountSelectorFallback = page.locator('.guest-selector, .passenger-count');
    this.increaseGuestButtonFallback = page.locator('.increase, .plus, [data-action="increase"]');
    this.decreaseGuestButtonFallback = page.locator('.decrease, .minus, [data-action="decrease"]');
    this.continueButtonFallback = page.locator('.continue-btn, .next-btn, text=Continue');
    this.backButtonFallback = page.locator('.back-btn, text=Back');
  }

  /**
   * Navigate to availability/guest screen
   */
  async navigateToAvailability() {
    await this.goto('/availability');
    await this.waitForPageLoad();
  }

  /**
   * Verify guest screen elements are visible
   */
  async verifyGuestScreenElements() {
    const container = await this.isElementVisible('[data-testid="availability-screen"]') 
      ? this.availabilityContainer 
      : this.availabilityContainerFallback;
    
    await expect(container).toBeVisible();
    
    const guestInfo = await this.isElementVisible('[data-testid="guest-info-section"]') 
      ? this.guestInfoSection 
      : this.guestInfoSectionFallback;
    
    await expect(guestInfo).toBeVisible();
    
    // Verify continue button is present
    const continueBtn = await this.isElementVisible('[data-testid="continue-button"]') 
      ? this.continueButton 
      : this.continueButtonFallback;
    
    await expect(continueBtn).toBeVisible();
  }

  /**
   * Verify guest count selector is present and functional
   */
  async verifyGuestCountSelector() {
    const guestSelector = await this.isElementVisible('[data-testid="guest-count-selector"]') 
      ? this.guestCountSelector 
      : this.guestCountSelectorFallback;
    
    await expect(guestSelector).toBeVisible();
    
    const increaseBtn = await this.isElementVisible('[data-testid="increase-guests"]') 
      ? this.increaseGuestButton 
      : this.increaseGuestButtonFallback;
    
    const decreaseBtn = await this.isElementVisible('[data-testid="decrease-guests"]') 
      ? this.decreaseGuestButton 
      : this.decreaseGuestButtonFallback;
    
    await expect(increaseBtn).toBeVisible();
    await expect(decreaseBtn).toBeVisible();
  }

  /**
   * Increase guest count
   */
  async increaseGuestCount() {
    const increaseBtn = await this.isElementVisible('[data-testid="increase-guests"]') 
      ? this.increaseGuestButton 
      : this.increaseGuestButtonFallback;
    
    await increaseBtn.click();
  }

  /**
   * Decrease guest count
   */
  async decreaseGuestCount() {
    const decreaseBtn = await this.isElementVisible('[data-testid="decrease-guests"]') 
      ? this.decreaseGuestButton 
      : this.decreaseGuestButtonFallback;
    
    await decreaseBtn.click();
  }

  /**
   * Get current guest count
   * @returns {number} Current guest count
   */
  async getCurrentGuestCount() {
    const guestDisplay = await this.isElementVisible('[data-testid="guest-count-display"]') 
      ? this.guestCountDisplay 
      : this.page.locator('.guest-count, .passenger-count');
    
    const countText = await guestDisplay.textContent();
    return parseInt(countText.match(/\d+/)?.[0] || '1');
  }

  /**
   * Set guest count to specific number
   * @param {number} targetCount - Target guest count
   */
  async setGuestCount(targetCount) {
    const currentCount = await this.getCurrentGuestCount();
    
    if (targetCount > currentCount) {
      for (let i = currentCount; i < targetCount; i++) {
        await this.increaseGuestCount();
        await this.page.waitForTimeout(200);
      }
    } else if (targetCount < currentCount) {
      for (let i = currentCount; i > targetCount; i--) {
        await this.decreaseGuestCount();
        await this.page.waitForTimeout(200);
      }
    }
  }

  /**
   * Click continue button
   */
  async clickContinueButton() {
    const continueBtn = await this.isElementVisible('[data-testid="continue-button"]') 
      ? this.continueButton 
      : this.continueButtonFallback;
    
    await continueBtn.click();
  }

  /**
   * Click back button
   */
  async clickBackButton() {
    const backBtn = await this.isElementVisible('[data-testid="back-button"]') 
      ? this.backButton 
      : this.backButtonFallback;
    
    await backBtn.click();
  }

  /**
   * Select 'Now' for ride time
   */
  async selectRideNow() {
    const nowBtn = await this.isElementVisible('[data-testid="now-button"]') 
      ? this.nowButton 
      : this.page.locator('.now-btn, text=Now');
    
    if (await nowBtn.isVisible()) {
      await nowBtn.click();
    }
  }

  /**
   * Select 'Schedule' for ride time
   */
  async selectScheduleRide() {
    const scheduleBtn = await this.isElementVisible('[data-testid="schedule-button"]') 
      ? this.scheduleButton 
      : this.page.locator('.schedule-btn, text=Schedule');
    
    if (await scheduleBtn.isVisible()) {
      await scheduleBtn.click();
    }
  }

  /**
   * Verify date/time selectors if present
   */
  async verifyDateTimeSelectors() {
    const dateSelector = await this.isElementVisible('[data-testid="date-selector"]') 
      ? this.dateSelector 
      : this.page.locator('.date-picker, .date-selector');
    
    const timeSelector = await this.isElementVisible('[data-testid="time-selector"]') 
      ? this.timeSelector 
      : this.page.locator('.time-picker, .time-selector');
    
    // Only verify if they exist on the page
    if (await dateSelector.count() > 0) {
      await expect(dateSelector).toBeVisible();
    }
    
    if (await timeSelector.count() > 0) {
      await expect(timeSelector).toBeVisible();
    }
  }

  /**
   * Fill guest information and proceed
   * @param {number} guestCount - Number of guests
   * @param {boolean} scheduleRide - Whether to schedule ride or book now
   */
  async fillGuestInfoAndProceed(guestCount = 1, scheduleRide = false) {
    await this.setGuestCount(guestCount);
    
    if (scheduleRide) {
      await this.selectScheduleRide();
      await this.verifyDateTimeSelectors();
    } else {
      await this.selectRideNow();
    }
    
    await this.waitForNavigation(async () => {
      await this.clickContinueButton();
    });
  }

  /**
   * Verify complete guest screen functionality
   */
  async verifyCompleteGuestScreen() {
    await this.verifyGuestScreenElements();
    await this.verifyGuestCountSelector();
    
    // Test guest count functionality
    const initialCount = await this.getCurrentGuestCount();
    
    await this.increaseGuestCount();
    const increasedCount = await this.getCurrentGuestCount();
    expect(increasedCount).toBe(initialCount + 1);
    
    await this.decreaseGuestCount();
    const decreasedCount = await this.getCurrentGuestCount();
    expect(decreasedCount).toBe(initialCount);
    
    // Test continue button is enabled
    const continueBtn = await this.isElementVisible('[data-testid="continue-button"]') 
      ? this.continueButton 
      : this.continueButtonFallback;
    
    await expect(continueBtn).toBeEnabled();
  }

  /**
   * Verify minimum guest count constraint
   */
  async verifyMinimumGuestCount() {
    // Decrease guest count to minimum
    for (let i = 0; i < 10; i++) {
      const currentCount = await this.getCurrentGuestCount();
      if (currentCount <= 1) break;
      
      await this.decreaseGuestCount();
      await this.page.waitForTimeout(200);
    }
    
    const finalCount = await this.getCurrentGuestCount();
    expect(finalCount).toBeGreaterThanOrEqual(1);
  }

  /**
   * Verify maximum guest count constraint
   */
  async verifyMaximumGuestCount() {
    // Increase guest count to test maximum
    let previousCount = await this.getCurrentGuestCount();
    
    for (let i = 0; i < 20; i++) {
      await this.increaseGuestCount();
      await this.page.waitForTimeout(200);
      
      const currentCount = await this.getCurrentGuestCount();
      
      // If count didn't change, we've hit the maximum
      if (currentCount === previousCount) {
        break;
      }
      
      previousCount = currentCount;
    }
    
    // Maximum should be reasonable (typically 6-8 for rideshare)
    const maxCount = await this.getCurrentGuestCount();
    expect(maxCount).toBeLessThanOrEqual(8);
  }

  /**
   * Wait for availability screen to load completely
   */
  async waitForAvailabilityScreenToLoad() {
    const container = await this.isElementVisible('[data-testid="availability-screen"]') 
      ? this.availabilityContainer 
      : this.availabilityContainerFallback;
    
    await container.waitFor({ state: 'visible' });
    await this.waitForPageLoad();
  }
}

module.exports = AvailabilityGuestPage;