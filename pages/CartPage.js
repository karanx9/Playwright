const { BasePage } = require('./BasePage');

class CartPage extends BasePage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    super(page);

    this.cartItems          = page.locator('.cart_item');
    this.cartItemNames      = page.locator('.inventory_item_name');
    this.cartItemPrices     = page.locator('.inventory_item_price');
    this.cartItemQuantities = page.locator('.cart_quantity');
    this.checkoutButton     = page.locator('[data-test="checkout"]');
    this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
    this.pageTitle          = page.locator('.title');
  }

  // ── Navigation ───────────────────────────────────────────────────────────

  async goto() {
    await this.navigate('/cart.html');
    await this.waitForElement(this.continueShoppingButton);
  }

  async continueShopping() {
    await this.click(this.continueShoppingButton);
    await this.waitForURL('**/inventory.html');
  }

  async proceedToCheckout() {
    await this.click(this.checkoutButton);
    await this.waitForURL('**/checkout-step-one.html');
  }

  // ── Cart inspection ──────────────────────────────────────────────────────

  async getCartItemCount() {
    return this.cartItems.count();
  }

  async getCartItemNames() {
    return this.cartItemNames.allInnerTexts();
  }

  async getCartItemPrices() {
    const raw = await this.cartItemPrices.allInnerTexts();
    return raw.map(p => parseFloat(p.replace('$', '')));
  }

  async getItemQuantity(productName) {
    const item = this.cartItems.filter({ hasText: productName });
    return item.locator('.cart_quantity').innerText();
  }

  async isItemInCart(productName) {
    const item = this.cartItems.filter({ hasText: productName });
    return item.isVisible();
  }

  async isEmpty() {
    return (await this.cartItems.count()) === 0;
  }

  // ── Remove items ──────────────────────────────────────────────────────────

  async removeItem(productName) {
    const item = this.cartItems.filter({ hasText: productName });
    const removeBtn = item.locator('[data-test^="remove"]');
    await this.click(removeBtn);
  }

  async removeAllItems() {
    const count = await this.cartItems.count();
    for (let i = 0; i < count; i++) {
      // Always target index 0 — list shrinks after each removal
      const removeBtn = this.cartItems.first().locator('[data-test^="remove"]');
      await this.click(removeBtn);
    }
  }

  async getPageTitle() {
    return this.getText(this.pageTitle);
  }
}

module.exports = { CartPage };
