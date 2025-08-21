const { expect } = require('@playwright/test');

class BasePage {
  constructor(page) {
    this.page = page;
    this.header = page.locator('[data-testid="header"]');
    this.loadingSpinner = page.locator('[data-testid="loading-spinner"]');
  }

  /**
   * Navigate to a specific URL
   * @param {string} url - The URL to navigate to
   */
  async goto(url) {
    await this.page.goto(url);
  }

  /**
   * Wait for page to be loaded
   */
  async waitForPageLoad() {
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Wait for loading spinner to disappear
   */
  async waitForLoadingToComplete() {
    await this.loadingSpinner.waitFor({ state: 'detached', timeout: 10000 });
  }

  /**
   * Take a screenshot
   * @param {string} name - Screenshot name
   */
  async takeScreenshot(name) {
    await this.page.screenshot({ path: `screenshots/${name}.png`, fullPage: true });
  }

  /**
   * Wait for an element to be visible
   * @param {string} selector - Element selector
   */
  async waitForElement(selector) {
    await this.page.waitForSelector(selector, { state: 'visible' });
  }

  /**
   * Wait for navigation to complete
   * @param {Function} action - The action that triggers navigation
   */
  async waitForNavigation(action) {
    await Promise.all([
      this.page.waitForNavigation({ waitUntil: 'networkidle' }),
      action()
    ]);
  }

  /**
   * Get current URL
   */
  async getCurrentUrl() {
    return this.page.url();
  }

  /**
   * Verify page title
   * @param {string} expectedTitle - Expected page title
   */
  async verifyPageTitle(expectedTitle) {
    await expect(this.page).toHaveTitle(expectedTitle);
  }

  /**
   * Wait for element to be clickable and click it
   * @param {string} selector - Element selector
   */
  async clickElement(selector) {
    const element = this.page.locator(selector);
    await element.waitFor({ state: 'visible' });
    await element.click();
  }

  /**
   * Type text into an input field
   * @param {string} selector - Input field selector
   * @param {string} text - Text to type
   */
  async typeText(selector, text) {
    const element = this.page.locator(selector);
    await element.waitFor({ state: 'visible' });
    await element.clear();
    await element.fill(text);
  }

  /**
   * Verify element is visible
   * @param {string} selector - Element selector
   */
  async verifyElementVisible(selector) {
    await expect(this.page.locator(selector)).toBeVisible();
  }

  /**
   * Verify element contains text
   * @param {string} selector - Element selector
   * @param {string} text - Expected text
   */
  async verifyElementText(selector, text) {
    await expect(this.page.locator(selector)).toContainText(text);
  }

  /**
   * Wait for a specific amount of time
   * @param {number} ms - Milliseconds to wait
   */
  async wait(ms) {
    await this.page.waitForTimeout(ms);
  }

  /**
   * Scroll to element
   * @param {string} selector - Element selector
   */
  async scrollToElement(selector) {
    await this.page.locator(selector).scrollIntoViewIfNeeded();
  }

  /**
   * Get element text content
   * @param {string} selector - Element selector
   */
  async getElementText(selector) {
    return await this.page.locator(selector).textContent();
  }

  /**
   * Check if element is visible
   * @param {string} selector - Element selector
   */
  async isElementVisible(selector) {
    try {
      await this.page.locator(selector).waitFor({ state: 'visible', timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Verify URL contains specific path
   * @param {string} path - Expected path in URL
   */
  async verifyUrlContains(path) {
    await expect(this.page).toHaveURL(new RegExp(path));
  }
}

module.exports = BasePage;