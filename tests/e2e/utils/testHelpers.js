const { expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

class TestHelpers {
  /**
   * Log test step with timestamp
   * @param {string} message - The message to log
   * @param {any} data - Optional data to log
   */
  static logTestStep(message, data = null) {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${message}`);
    if (data) {
      console.log(data);
    }
  }

  /**
   * Take a timestamped screenshot
   * @param {Page} page - Playwright page object
   * @param {string} name - Screenshot name
   */
  static async takeTimestampedScreenshot(page, name) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const screenshotPath = `screenshots/${name}-${timestamp}.png`;
    
    // Ensure screenshots directory exists
    const dir = path.dirname(screenshotPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    await page.screenshot({ 
      path: screenshotPath, 
      fullPage: true,
      quality: 90
    });
    
    console.log(`Screenshot saved: ${screenshotPath}`);
    return screenshotPath;
  }

  /**
   * Simulate different network conditions
   * @param {Page} page - Playwright page object
   * @param {string} condition - Network condition ('slow', 'fast', 'offline')
   */
  static async simulateNetworkConditions(page, condition) {
    const conditions = {
      slow: { downloadThroughput: 50 * 1024, uploadThroughput: 20 * 1024, latency: 2000 },
      fast: { downloadThroughput: 100 * 1024 * 1024, uploadThroughput: 15 * 1024 * 1024, latency: 10 },
      offline: { offline: true }
    };
    
    const cdpSession = await page.context().newCDPSession(page);
    await cdpSession.send('Network.emulateNetworkConditions', conditions[condition] || conditions.slow);
  }

  /**
   * Test responsive design across multiple viewports
   * @param {Page} page - Playwright page object
   * @param {Function} testFunction - Function to execute for each viewport
   */
  static async testResponsiveDesign(page, testFunction) {
    const viewports = [
      { name: 'mobile', width: 375, height: 667 },
      { name: 'tablet', width: 768, height: 1024 },
      { name: 'desktop', width: 1440, height: 900 },
      { name: 'large-desktop', width: 1920, height: 1080 }
    ];

    for (const viewport of viewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await testFunction(viewport);
      
      // Small delay between viewport changes
      await page.waitForTimeout(500);
    }
  }

  /**
   * Verify basic accessibility attributes
   * @param {Page} page - Playwright page object
   */
  static async verifyBasicAccessibility(page) {
    // Check for basic ARIA attributes and semantic HTML
    const title = await page.title();
    expect(title).toBeTruthy();
    
    // Check for alt text on images
    const images = await page.locator('img').all();
    for (const img of images) {
      const alt = await img.getAttribute('alt');
      const src = await img.getAttribute('src');
      if (src && !src.startsWith('data:')) {
        expect(alt).toBeTruthy();
      }
    }

    // Check for proper heading hierarchy
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();
    if (headings.length > 0) {
      const firstHeading = await headings[0].tagName();
      expect(firstHeading.toLowerCase()).toBe('h1');
    }
  }

  /**
   * Wait for element with custom timeout and retry logic
   * @param {Page} page - Playwright page object
   * @param {string} selector - Element selector
   * @param {Object} options - Wait options
   */
  static async waitForElementWithRetry(page, selector, options = {}) {
    const { timeout = 10000, retries = 3, state = 'visible' } = options;
    
    let lastError;
    for (let i = 0; i < retries; i++) {
      try {
        await page.locator(selector).waitFor({ state, timeout: timeout / retries });
        return true;
      } catch (error) {
        lastError = error;
        TestHelpers.logTestStep(`Retry ${i + 1}/${retries} for selector: ${selector}`);
        await page.waitForTimeout(1000);
      }
    }
    
    throw lastError;
  }

  /**
   * Generate random test data
   * @param {string} type - Type of data to generate
   */
  static generateTestData(type) {
    const data = {
      location: [
        'Prague Castle, Prague, Czech Republic',
        'Charles Bridge, Prague, Czech Republic',
        'Old Town Square, Prague, Czech Republic',
        'Wenceslas Square, Prague, Czech Republic',
        'Prague Airport, Czech Republic'
      ],
      name: [
        'John Smith',
        'Jane Doe',
        'Michael Johnson',
        'Sarah Williams',
        'David Brown'
      ],
      phone: [
        '+420123456789',
        '+420987654321',
        '+420555123456',
        '+420777888999',
        '+420111222333'
      ],
      email: [
        'test1@example.com',
        'test2@example.com',
        'test3@example.com',
        'user@test.com',
        'demo@example.com'
      ]
    };
    
    if (data[type]) {
      return data[type][Math.floor(Math.random() * data[type].length)];
    }
    
    return `test-${Date.now()}`;
  }

  /**
   * Mock API responses
   * @param {Page} page - Playwright page object
   * @param {string} url - URL pattern to mock
   * @param {Object} response - Mock response data
   */
  static async mockApiResponse(page, url, response) {
    await page.route(url, async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(response)
      });
    });
  }

  /**
   * Verify URL navigation
   * @param {Page} page - Playwright page object
   * @param {string} expectedPath - Expected URL path
   */
  static async verifyNavigation(page, expectedPath) {
    await page.waitForURL(expectedPath, { timeout: 10000 });
    expect(page.url()).toContain(expectedPath);
  }

  /**
   * Fill form field with retry logic
   * @param {Page} page - Playwright page object
   * @param {string} selector - Input field selector
   * @param {string} value - Value to fill
   */
  static async fillFieldWithRetry(page, selector, value) {
    const element = page.locator(selector);
    await element.waitFor({ state: 'visible' });
    
    // Clear field first
    await element.click();
    await page.keyboard.press('Control+A');
    await page.keyboard.press('Delete');
    
    // Fill with value
    await element.fill(value);
    
    // Verify value was set
    const actualValue = await element.inputValue();
    expect(actualValue).toBe(value);
  }

  /**
   * Test drag and drop functionality
   * @param {Page} page - Playwright page object
   * @param {string} sourceSelector - Source element selector
   * @param {string} targetSelector - Target element selector
   */
  static async performDragAndDrop(page, sourceSelector, targetSelector) {
    const source = page.locator(sourceSelector);
    const target = page.locator(targetSelector);
    
    await source.dragTo(target);
  }

  /**
   * Verify element animations
   * @param {Page} page - Playwright page object
   * @param {string} selector - Element selector
   */
  static async verifyAnimations(page, selector) {
    const element = page.locator(selector);
    
    // Check for CSS transitions
    const hasTransition = await element.evaluate(el => {
      const style = window.getComputedStyle(el);
      return style.transition !== 'none' && style.transition !== '';
    });
    
    return hasTransition;
  }

  /**
   * Create test data for data-driven tests
   * @param {string} testType - Type of test data needed
   */
  static createTestDataSet(testType) {
    const dataSets = {
      searchLocations: [
        { pickup: 'Prague Airport', destination: 'Prague Castle', expected: 'search-results' },
        { pickup: 'Charles Bridge', destination: 'Old Town Square', expected: 'search-results' },
        { pickup: 'Wenceslas Square', destination: 'Prague Airport', expected: 'search-results' }
      ],
      userProfiles: [
        { name: 'John Doe', phone: '+420123456789', email: 'john@test.com' },
        { name: 'Jane Smith', phone: '+420987654321', email: 'jane@test.com' },
        { name: 'Mike Johnson', phone: '+420555123456', email: 'mike@test.com' }
      ],
      invalidInputs: [
        { input: '', expected: 'error' },
        { input: '   ', expected: 'error' },
        { input: '123', expected: 'error' },
        { input: 'a'.repeat(1000), expected: 'error' }
      ]
    };
    
    return dataSets[testType] || [];
  }

  /**
   * Verify performance metrics
   * @param {Page} page - Playwright page object
   * @param {Object} thresholds - Performance thresholds
   */
  static async verifyPerformance(page, thresholds = {}) {
    const metrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0];
      return {
        loadTime: navigation.loadEventEnd - navigation.loadEventStart,
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        firstPaint: performance.getEntriesByName('first-paint')[0]?.startTime || 0,
        firstContentfulPaint: performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 0
      };
    });
    
    const defaultThresholds = {
      loadTime: 3000,
      domContentLoaded: 2000,
      firstPaint: 1500,
      firstContentfulPaint: 2000
    };
    
    const finalThresholds = { ...defaultThresholds, ...thresholds };
    
    Object.keys(metrics).forEach(key => {
      if (finalThresholds[key] && metrics[key] > finalThresholds[key]) {
        console.warn(`Performance warning: ${key} (${metrics[key]}ms) exceeds threshold (${finalThresholds[key]}ms)`);
      }
    });
    
    return metrics;
  }

  /**
   * Setup test environment
   * @param {Page} page - Playwright page object
   */
  static async setupTestEnvironment(page) {
    // Clear local storage and session storage
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
    
    // Set up console error logging
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.error('Console error:', msg.text());
      }
    });
    
    // Set up page error logging
    page.on('pageerror', error => {
      console.error('Page error:', error);
    });
  }

  /**
   * Cleanup test environment
   * @param {Page} page - Playwright page object
   */
  static async cleanupTestEnvironment(page) {
    // Clear all storage
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
      
      // Clear cookies
      document.cookie.split(";").forEach(c => {
        const eqPos = c.indexOf("=");
        const name = eqPos > -1 ? c.substr(0, eqPos) : c;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
      });
    });
  }
}

module.exports = TestHelpers;