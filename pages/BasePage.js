const { expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

/**
 * BasePage — root of the Page Object Model hierarchy.
 *
 * Every page class extends this to get common browser interactions,
 * screenshot helpers, and assertion utilities in one place.
 */
class BasePage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;
  }

  // ── Navigation ───────────────────────────────────────────────────────────

  async navigate(path = '/') {
    await this.page.goto(path);
    await this.page.waitForLoadState('domcontentloaded');
  }

  async getTitle() {
    return this.page.title();
  }

  async getCurrentURL() {
    return this.page.url();
  }

  // ── Element interactions ─────────────────────────────────────────────────

  async click(locator) {
    await locator.waitFor({ state: 'visible' });
    await locator.click();
  }

  async fill(locator, value) {
    await locator.waitFor({ state: 'visible' });
    await locator.clear();
    await locator.fill(value);
  }

  async getText(locator) {
    await locator.waitFor({ state: 'visible' });
    return locator.innerText();
  }

  async isVisible(locator) {
    return locator.isVisible();
  }

  async selectOption(locator, value) {
    await locator.waitFor({ state: 'visible' });
    await locator.selectOption(value);
  }

  async waitForURL(urlPattern) {
    await this.page.waitForURL(urlPattern);
  }

  async waitForElement(locator, state = 'visible') {
    await locator.waitFor({ state });
  }

  // ── Screenshot helpers ───────────────────────────────────────────────────

  /**
   * Saves a full-page screenshot to ./screenshots/<date>/<name>-<ts>.png.
   * Call this from any test for manual capture checkpoints.
   */
  async takeScreenshot(name) {
    const dir = path.join('screenshots', new Date().toISOString().split('T')[0]);
    fs.mkdirSync(dir, { recursive: true });
    const filePath = path.join(dir, `${name}-${Date.now()}.png`);
    await this.page.screenshot({ path: filePath, fullPage: true });
    console.log(`📸  Screenshot saved → ${filePath}`);
    return filePath;
  }

  /**
   * Saves a screenshot cropped to a specific element.
   */
  async takeElementScreenshot(locator, name) {
    const dir = path.join('screenshots', new Date().toISOString().split('T')[0]);
    fs.mkdirSync(dir, { recursive: true });
    const filePath = path.join(dir, `${name}-element-${Date.now()}.png`);
    await locator.screenshot({ path: filePath });
    return filePath;
  }

  // ── Common assertions ────────────────────────────────────────────────────

  async assertURL(expected) {
    await expect(this.page).toHaveURL(expected);
  }

  async assertTitle(expected) {
    await expect(this.page).toHaveTitle(expected);
  }

  async assertVisible(locator, message) {
    await expect(locator, message).toBeVisible();
  }

  async assertText(locator, expected) {
    await expect(locator).toHaveText(expected);
  }

  async assertCount(locator, count) {
    await expect(locator).toHaveCount(count);
  }
}

module.exports = { BasePage };
