const { BasePage } = require('./BasePage');

class ProductDetailPage extends BasePage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    super(page);

    this.productName        = page.locator('.inventory_details_name');
    this.productDescription = page.locator('.inventory_details_desc');
    this.productPrice       = page.locator('.inventory_details_price');
    this.productImage       = page.locator('.inventory_details_img');
    this.addToCartButton    = page.locator('[data-test^="add-to-cart"]');
    this.removeButton       = page.locator('[data-test^="remove"]');
    this.backButton         = page.locator('[data-test="back-to-products"]');
    this.shoppingCartBadge  = page.locator('.shopping_cart_badge');
    this.shoppingCartLink   = page.locator('.shopping_cart_link');
  }

  // ── Getters ───────────────────────────────────────────────────────────────

  async getName() {
    return this.getText(this.productName);
  }

  async getDescription() {
    return this.getText(this.productDescription);
  }

  async getPrice() {
    const text = await this.getText(this.productPrice);
    return parseFloat(text.replace('$', ''));
  }

  async getImageSrc() {
    return this.productImage.getAttribute('src');
  }

  async isAddToCartVisible() {
    return this.isVisible(this.addToCartButton);
  }

  async isRemoveButtonVisible() {
    return this.isVisible(this.removeButton);
  }

  async getCartBadgeCount() {
    const isVisible = await this.shoppingCartBadge.isVisible();
    if (!isVisible) return 0;
    return parseInt(await this.getText(this.shoppingCartBadge), 10);
  }

  // ── Actions ───────────────────────────────────────────────────────────────

  async addToCart() {
    await this.click(this.addToCartButton);
    await this.waitForElement(this.removeButton);
  }

  async removeFromCart() {
    await this.click(this.removeButton);
    await this.waitForElement(this.addToCartButton);
  }

  async backToProducts() {
    await this.click(this.backButton);
    await this.waitForURL('**/inventory.html');
  }

  async goToCart() {
    await this.click(this.shoppingCartLink);
    await this.waitForURL('**/cart.html');
  }
}

module.exports = { ProductDetailPage };
