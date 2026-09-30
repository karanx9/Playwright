const { BasePage } = require('./BasePage');

/**
 * Checkout Step One — customer information form.
 */
class CheckoutPage extends BasePage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    super(page);

    this.firstNameInput  = page.locator('[data-test="firstName"]');
    this.lastNameInput   = page.locator('[data-test="lastName"]');
    this.zipCodeInput    = page.locator('[data-test="postalCode"]');
    this.continueButton  = page.locator('[data-test="continue"]');
    this.cancelButton    = page.locator('[data-test="cancel"]');
    this.errorContainer  = page.locator('[data-test="error"]');
    this.pageTitle       = page.locator('.title');
  }

  // ── Navigation ───────────────────────────────────────────────────────────

  async goto() {
    await this.navigate('/checkout-step-one.html');
    await this.waitForElement(this.firstNameInput);
  }

  // ── Actions ───────────────────────────────────────────────────────────────

  async fillInfo(firstName, lastName, zip) {
    await this.fill(this.firstNameInput, firstName);
    await this.fill(this.lastNameInput, lastName);
    await this.fill(this.zipCodeInput, zip);
  }

  async continue() {
    await this.click(this.continueButton);
  }

  async cancel() {
    await this.click(this.cancelButton);
    await this.waitForURL('**/cart.html');
  }

  async fillAndContinue(firstName, lastName, zip) {
    await this.fillInfo(firstName, lastName, zip);
    await this.continue();
  }

  // ── Getters ───────────────────────────────────────────────────────────────

  async getErrorMessage() {
    await this.waitForElement(this.errorContainer);
    return this.getText(this.errorContainer);
  }

  async isErrorVisible() {
    return this.isVisible(this.errorContainer);
  }

  async getPageTitle() {
    return this.getText(this.pageTitle);
  }
}

module.exports = { CheckoutPage };
