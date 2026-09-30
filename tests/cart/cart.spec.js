/**
 * Shopping cart test suite.
 *
 * Tags:
 *   @smoke      — items in cart, proceed to checkout
 *   @regression — remove, quantity, multi-item, persistence
 */

const { test, expect } = require('../../fixtures/index');
const { PRODUCTS } = require('../../utils/testData');
const { InventoryPage } = require('../../pages/InventoryPage');

test.describe('Cart — Shopping Cart Behaviour', () => {

  // ── Empty cart ────────────────────────────────────────────────────────────

  test('cart is empty on first visit @smoke', async ({ cartPage }) => {
    const isEmpty = await cartPage.isEmpty();
    expect(isEmpty).toBe(true);
    await cartPage.takeScreenshot('cart-empty');
  });

  test('cart page title is "Your Cart" @smoke', async ({ cartPage }) => {
    const title = await cartPage.getPageTitle();
    expect(title).toBe('Your Cart');
  });

  // ── Add items ─────────────────────────────────────────────────────────────

  test('item added from inventory appears in cart @smoke', async ({ cartWithItems }) => {
    const names = await cartWithItems.getCartItemNames();
    expect(names).toContain(PRODUCTS.BACKPACK.name);
    await cartWithItems.takeScreenshot('cart-one-item');
  });

  test('cart shows correct item count @smoke', async ({ cartWithItems }) => {
    const count = await cartWithItems.getCartItemCount();
    expect(count).toBe(1);
  });

  test('item price in cart matches inventory price @regression', async ({ cartWithItems }) => {
    const prices = await cartWithItems.getCartItemPrices();
    expect(prices[0]).toBe(PRODUCTS.BACKPACK.price);
  });

  test('item quantity defaults to 1 @regression', async ({ cartWithItems }) => {
    const qty = await cartWithItems.getItemQuantity(PRODUCTS.BACKPACK.name);
    expect(qty.trim()).toBe('1');
  });

  // ── Multiple items ────────────────────────────────────────────────────────

  test('multiple items appear in cart @regression', async ({ page }) => {
    // Manual setup so we can add 3 specific items
    const { LoginPage } = require('../../pages/LoginPage');
    const { USERS } = require('../../utils/testData');
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.loginAndWaitForInventory(USERS.STANDARD.username, USERS.STANDARD.password);

    const inventoryPage = new InventoryPage(page);
    await inventoryPage.waitForElement(inventoryPage.productList.first());
    await inventoryPage.addToCartByName(PRODUCTS.BACKPACK.name);
    await inventoryPage.addToCartByName(PRODUCTS.BIKE_LIGHT.name);
    await inventoryPage.addToCartByName(PRODUCTS.ONESIE.name);
    await inventoryPage.goToCart();

    const { CartPage } = require('../../pages/CartPage');
    const cartPage = new CartPage(page);
    // Wait for at least one item to render after navigation
    await cartPage.waitForElement(cartPage.cartItems.first());
    const count = await cartPage.getCartItemCount();
    expect(count).toBe(3);

    const names = await cartPage.getCartItemNames();
    expect(names).toContain(PRODUCTS.BACKPACK.name);
    expect(names).toContain(PRODUCTS.BIKE_LIGHT.name);
    expect(names).toContain(PRODUCTS.ONESIE.name);
    await cartPage.takeScreenshot('cart-three-items');
  });

  // ── Remove items ──────────────────────────────────────────────────────────

  test('removing an item empties the cart @smoke', async ({ cartWithItems }) => {
    await cartWithItems.removeItem(PRODUCTS.BACKPACK.name);
    const isEmpty = await cartWithItems.isEmpty();
    expect(isEmpty).toBe(true);
  });

  test('item removed from cart no longer appears @regression', async ({ cartWithItems }) => {
    await cartWithItems.removeItem(PRODUCTS.BACKPACK.name);
    const inCart = await cartWithItems.isItemInCart(PRODUCTS.BACKPACK.name);
    expect(inCart).toBe(false);
  });

  // ── Navigation ────────────────────────────────────────────────────────────

  test('Continue Shopping returns to inventory @smoke', async ({ cartPage, page }) => {
    await cartPage.continueShopping();
    await expect(page).toHaveURL(/.*inventory\.html/);
  });

  test('Checkout button navigates to checkout step 1 @smoke', async ({ cartWithItems, page }) => {
    await cartWithItems.proceedToCheckout();
    await expect(page).toHaveURL(/.*checkout-step-one\.html/);
  });
});
