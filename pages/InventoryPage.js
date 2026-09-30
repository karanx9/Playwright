const { BasePage } = require('./BasePage');

class InventoryPage extends BasePage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    super(page);

    this.productList        = page.locator('.inventory_item');
    this.productNames       = page.locator('.inventory_item_name');
    this.productPrices      = page.locator('.inventory_item_price');
    this.sortDropdown       = page.locator('[data-test="product-sort-container"]');
    this.shoppingCartBadge  = page.locator('.shopping_cart_badge');
    this.shoppingCartLink   = page.locator('.shopping_cart_link');
    this.pageTitle          = page.locator('.title');
    this.burgerMenuButton   = page.locator('#react-burger-menu-btn');
    this.logoutLink         = page.locator('#logout_sidebar_link');
    this.menuCloseButton    = page.locator('#react-burger-cross-btn');
  }

  // ── Navigation ──────────────────────────────────────────────────────────

  async goto() {
    await this.navigate('/inventory.html');
    await this.waitForElement(this.productList.first());
  }

  async goToCart() {
    await this.click(this.shoppingCartLink);
    await this.waitForURL('**/cart.html');
  }

  async logout() {
    await this.click(this.burgerMenuButton);
    await this.waitForElement(this.logoutLink);
    await this.click(this.logoutLink);
    await this.waitForURL('**/');
  }

  // ── Product listing ──────────────────────────────────────────────────────

  async getProductCount() {
    return this.productList.count();
  }

  async getAllProductNames() {
    return this.productNames.allInnerTexts();
  }

  async getAllProductPrices() {
    const rawPrices = await this.productPrices.allInnerTexts();
    return rawPrices.map(p => parseFloat(p.replace('$', '')));
  }

  async getPageTitle() {
    return this.getText(this.pageTitle);
  }

  // ── Sorting ──────────────────────────────────────────────────────────────

  async sortBy(option) {
    await this.selectOption(this.sortDropdown, option);
    // Wait for DOM to re-render after sort
    await this.page.waitForTimeout(300);
  }

  async getCurrentSortValue() {
    return this.sortDropdown.inputValue();
  }

  // ── Cart interactions ────────────────────────────────────────────────────

  async addToCartByName(productName) {
    const item = this.page
      .locator('.inventory_item')
      .filter({ hasText: productName });
    const addButton = item.locator('button[data-test^="add-to-cart"]');
    await this.click(addButton);
  }

  async removeFromCartByName(productName) {
    const item = this.page
      .locator('.inventory_item')
      .filter({ hasText: productName });
    const removeButton = item.locator('button[data-test^="remove"]');
    await this.click(removeButton);
  }

  async getCartBadgeCount() {
    const isVisible = await this.shoppingCartBadge.isVisible();
    if (!isVisible) return 0;
    const text = await this.getText(this.shoppingCartBadge);
    return parseInt(text, 10);
  }

  async getAddToCartButtonByName(productName) {
    return this.page
      .locator('.inventory_item')
      .filter({ hasText: productName })
      .locator('button[data-test^="add-to-cart"]');
  }

  async getRemoveButtonByName(productName) {
    return this.page
      .locator('.inventory_item')
      .filter({ hasText: productName })
      .locator('button[data-test^="remove"]');
  }

  // ── Product detail navigation ────────────────────────────────────────────

  async clickProduct(productName) {
    await this.page
      .locator('.inventory_item_name')
      .filter({ hasText: productName })
      .click();
    await this.waitForURL('**/inventory-item.html**');
  }

  async getProductImageSrc(productName) {
    const item = this.page
      .locator('.inventory_item')
      .filter({ hasText: productName });
    return item.locator('img').getAttribute('src');
  }
}

module.exports = { InventoryPage };
