const { BasePage } = require('./BasePage');

class LoginPage extends BasePage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    super(page);

    // Locators — defined once, reused across all methods
    this.usernameInput  = page.locator('[data-test="username"]');
    this.passwordInput  = page.locator('[data-test="password"]');
    this.loginButton    = page.locator('[data-test="login-button"]');
    this.errorContainer = page.locator('[data-test="error"]');
    this.errorButton    = page.locator('.error-button');
    this.loginLogo      = page.locator('.login_logo');
  }

  // ── Navigation ──────────────────────────────────────────────────────────

  async goto() {
    await this.navigate('/');
    await this.waitForElement(this.loginButton);
  }

  // ── Actions ──────────────────────────────────────────────────────────────

  async login(username, password) {
    await this.fill(this.usernameInput, username);
    await this.fill(this.passwordInput, password);
    await this.click(this.loginButton);
  }

  async loginAndWaitForInventory(username, password) {
    await this.login(username, password);
    await this.waitForURL('**/inventory.html');
  }

  async clearAndSubmit() {
    await this.click(this.loginButton);
  }

  async dismissError() {
    await this.click(this.errorButton);
  }

  // ── Getters ───────────────────────────────────────────────────────────────

  async getErrorMessage() {
    await this.waitForElement(this.errorContainer);
    return this.getText(this.errorContainer);
  }

  async isErrorVisible() {
    return this.isVisible(this.errorContainer);
  }

  async isLoginFormVisible() {
    return this.isVisible(this.loginButton);
  }
}

module.exports = { LoginPage };
