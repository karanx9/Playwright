const { BasePage } = require('./BasePage');

/**
 * Checkout Complete — order confirmation screen.
 */
class CheckoutCompletePage extends BasePage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    super(page);

    this.confirmationHeader  = page.locator('.complete-header');
    this.confirmationText    = page.locator('.complete-text');
    this.ponyExpressImage    = page.locator('.pony_express');
    this.backHomeButton      = page.locator('[data-test="back-to-products"]');
    this.pageTitle           = page.locator('.title');
  }

  // ── Getters ───────────────────────────────────────────────────────────────

  async getConfirmationHeader() {
    return this.getText(this.confirmationHeader);
  }

  async getConfirmationText() {
    return this.getText(this.confirmationText);
  }

  async isConfirmationImageVisible() {
    try {
      await this.ponyExpressImage.waitFor({ state: 'visible', timeout: 5_000 });
      return true;
    } catch {
      return false;
    }
  }

  async getPageTitle() {
    return this.getText(this.pageTitle);
  }

  // ── Actions ───────────────────────────────────────────────────────────────

  async backToProducts() {
    await this.click(this.backHomeButton);
    await this.waitForURL('**/inventory.html');
  }
}

module.exports = { CheckoutCompletePage };
