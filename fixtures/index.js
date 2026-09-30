const { test: base, expect } = require('@playwright/test');
const { LoginPage }           = require('../pages/LoginPage');
const { InventoryPage }       = require('../pages/InventoryPage');
const { CartPage }            = require('../pages/CartPage');
const { CheckoutPage }        = require('../pages/CheckoutPage');
const { CheckoutOverviewPage }= require('../pages/CheckoutOverviewPage');
const { CheckoutCompletePage }= require('../pages/CheckoutCompletePage');
const { ProductDetailPage }   = require('../pages/ProductDetailPage');
const { USERS }               = require('../utils/testData');

/**
 * Extended test fixtures — import `test` and `expect` from here
 * instead of '@playwright/test' to get pre-wired page objects.
 *
 * Fixtures:
 *   loginPage         — bare login page (not logged in)
 *   inventoryPage     — logged in as standard_user, on inventory
 *   cartPage          — logged in, on cart page
 *   checkoutPage      — logged in, 1 item in cart, on checkout step 1
 *   overviewPage      — logged in, 1 item, on checkout step 2
 *   completePage      — logged in, order placed
 *   productDetailPage — logged in, on first product detail page
 */
const test = base.extend({

  // ── Bare login page (unauthenticated) ────────────────────────────────────
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await use(loginPage);
  },

  // ── Inventory page (authenticated) ───────────────────────────────────────
  inventoryPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.loginAndWaitForInventory(USERS.STANDARD.username, USERS.STANDARD.password);
    const inv = new InventoryPage(page);
    // Wait for at least one product card to render before handing off
    await inv.waitForElement(inv.productList.first());
    await use(inv);
  },

  // ── Cart page (authenticated, empty cart) ────────────────────────────────
  cartPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.loginAndWaitForInventory(USERS.STANDARD.username, USERS.STANDARD.password);
    const inventoryPage = new InventoryPage(page);
    await inventoryPage.goToCart();
    const cart = new CartPage(page);
    // Wait for cart chrome to render before handing off
    await cart.waitForElement(cart.continueShoppingButton);
    await use(cart);
  },

  // ── Cart page pre-loaded with one item ───────────────────────────────────
  cartWithItems: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.loginAndWaitForInventory(USERS.STANDARD.username, USERS.STANDARD.password);
    const inv = new InventoryPage(page);
    await inv.waitForElement(inv.productList.first());
    await inv.addToCartByName('Sauce Labs Backpack');
    await inv.goToCart();
    const cart = new CartPage(page);
    // Wait for the item to render before handing off
    await cart.waitForElement(cart.cartItems.first());
    await use(cart);
  },

  // ── Checkout step 1 (one item already in cart) ───────────────────────────
  checkoutPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.loginAndWaitForInventory(USERS.STANDARD.username, USERS.STANDARD.password);
    const inv = new InventoryPage(page);
    await inv.waitForElement(inv.productList.first());
    await inv.addToCartByName('Sauce Labs Backpack');
    await inv.goToCart();
    const cartPage = new CartPage(page);
    await cartPage.waitForElement(cartPage.cartItems.first());
    await cartPage.proceedToCheckout();
    await use(new CheckoutPage(page));
  },

  // ── Checkout overview / step 2 ───────────────────────────────────────────
  overviewPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.loginAndWaitForInventory(USERS.STANDARD.username, USERS.STANDARD.password);
    const inventoryPage = new InventoryPage(page);
    await inventoryPage.addToCartByName('Sauce Labs Backpack');
    await inventoryPage.goToCart();
    const cartPage = new CartPage(page);
    await cartPage.proceedToCheckout();
    const checkoutPage = new CheckoutPage(page);
    await checkoutPage.fillAndContinue('John', 'Doe', '10001');
    await page.waitForURL('**/checkout-step-two.html');
    await use(new CheckoutOverviewPage(page));
  },

  // ── Product detail page ───────────────────────────────────────────────────
  productDetailPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.loginAndWaitForInventory(USERS.STANDARD.username, USERS.STANDARD.password);
    const inventoryPage = new InventoryPage(page);
    await inventoryPage.clickProduct('Sauce Labs Backpack');
    await use(new ProductDetailPage(page));
  },
});

module.exports = { test, expect };
