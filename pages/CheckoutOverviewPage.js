const { BasePage } = require('./BasePage');

/**
 * Checkout Step Two — order review / overview before payment.
 */
class CheckoutOverviewPage extends BasePage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    super(page);

    this.cartItems       = page.locator('.cart_item');
    this.cartItemNames   = page.locator('.inventory_item_name');
    this.itemTotal       = page.locator('.summary_subtotal_label');
    this.taxAmount       = page.locator('.summary_tax_label');
    this.orderTotal      = page.locator('.summary_total_label');
    this.finishButton    = page.locator('[data-test="finish"]');
    this.cancelButton    = page.locator('[data-test="cancel"]');
    this.pageTitle       = page.locator('.title');
    this.paymentInfo     = page.locator('.summary_value_label').first();
    this.shippingInfo    = page.locator('.summary_value_label').nth(1);
  }

  // ── Getters ───────────────────────────────────────────────────────────────

  async getOrderItemNames() {
    return this.cartItemNames.allInnerTexts();
  }

  async getOrderItemCount() {
    return this.cartItems.count();
  }

  async getItemTotalText() {
    return this.getText(this.itemTotal);
  }

  async getTaxText() {
    return this.getText(this.taxAmount);
  }

  async getOrderTotalText() {
    return this.getText(this.orderTotal);
  }

  async getItemTotal() {
    const text = await this.getItemTotalText();
    return parseFloat(text.replace('Item total: $', ''));
  }

  async getTax() {
    const text = await this.getTaxText();
    return parseFloat(text.replace('Tax: $', ''));
  }

  async getOrderTotal() {
    const text = await this.getOrderTotalText();
    return parseFloat(text.replace('Total: $', ''));
  }

  async getPaymentInfo() {
    return this.getText(this.paymentInfo);
  }

  async getShippingInfo() {
    return this.getText(this.shippingInfo);
  }

  async getPageTitle() {
    return this.getText(this.pageTitle);
  }

  // ── Actions ───────────────────────────────────────────────────────────────

  async finish() {
    await this.click(this.finishButton);
    await this.waitForURL('**/checkout-complete.html');
  }

  async cancel() {
    await this.click(this.cancelButton);
    await this.waitForURL('**/inventory.html');
  }
}

module.exports = { CheckoutOverviewPage };
