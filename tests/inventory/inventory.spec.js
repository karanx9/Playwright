/**
 * Inventory / product-listing test suite.
 *
 * Tags:
 *   @smoke      — page load + basic product count
 *   @regression — sorting, navigation, cart badge
 */

const { test, expect } = require('../../fixtures/index');
const { SORT_OPTIONS, EXPECTED_PRODUCT_COUNT, PRODUCTS } = require('../../utils/testData');
const { assertAlphaOrder, assertNumericOrder } = require('../../utils/helpers');
const { ProductDetailPage } = require('../../pages/ProductDetailPage');

test.describe('Inventory — Product Listing', () => {

  // ── Page load ────────────────────────────────────────────────────────────

  test('inventory page loads with correct title @smoke', async ({ inventoryPage }) => {
    const title = await inventoryPage.getPageTitle();
    expect(title).toBe('Products');
  });

  test(`inventory page shows ${EXPECTED_PRODUCT_COUNT} products @smoke`, async ({ inventoryPage }) => {
    const count = await inventoryPage.getProductCount();
    expect(count).toBe(EXPECTED_PRODUCT_COUNT);
    await inventoryPage.takeScreenshot('inventory-page-load');
  });

  test('default sort is A to Z @smoke', async ({ inventoryPage }) => {
    const value = await inventoryPage.getCurrentSortValue();
    expect(value).toBe(SORT_OPTIONS.AZ.value);
  });

  // ── Sorting ──────────────────────────────────────────────────────────────

  test('sort Name A→Z produces alphabetically ascending list @regression', async ({ inventoryPage }) => {
    await inventoryPage.sortBy(SORT_OPTIONS.AZ.value);
    const names = await inventoryPage.getAllProductNames();
    assertAlphaOrder(names, 'asc');
    await inventoryPage.takeScreenshot('sort-az');
  });

  test('sort Name Z→A produces alphabetically descending list @regression', async ({ inventoryPage }) => {
    await inventoryPage.sortBy(SORT_OPTIONS.ZA.value);
    const names = await inventoryPage.getAllProductNames();
    assertAlphaOrder(names, 'desc');
    await inventoryPage.takeScreenshot('sort-za');
  });

  test('sort Price Low→High produces ascending price list @regression', async ({ inventoryPage }) => {
    await inventoryPage.sortBy(SORT_OPTIONS.LOW_HIGH.value);
    const prices = await inventoryPage.getAllProductPrices();
    assertNumericOrder(prices, 'asc');
    await inventoryPage.takeScreenshot('sort-price-low-high');
  });

  test('sort Price High→Low produces descending price list @regression', async ({ inventoryPage }) => {
    await inventoryPage.sortBy(SORT_OPTIONS.HIGH_LOW.value);
    const prices = await inventoryPage.getAllProductPrices();
    assertNumericOrder(prices, 'desc');
    await inventoryPage.takeScreenshot('sort-price-high-low');
  });

  // ── Product detail navigation ─────────────────────────────────────────────

  test('clicking product name navigates to detail page @smoke', async ({ inventoryPage, page }) => {
    await inventoryPage.clickProduct(PRODUCTS.BACKPACK.name);
    await expect(page).toHaveURL(/.*inventory-item\.html/);

    const detailPage = new ProductDetailPage(page);
    const name = await detailPage.getName();
    expect(name).toBe(PRODUCTS.BACKPACK.name);
    await detailPage.takeScreenshot('product-detail-backpack');
  });

  test('product detail shows correct price @regression', async ({ inventoryPage, page }) => {
    await inventoryPage.clickProduct(PRODUCTS.BACKPACK.name);
    const detailPage = new ProductDetailPage(page);
    const price = await detailPage.getPrice();
    expect(price).toBe(PRODUCTS.BACKPACK.price);
  });

  test('back-to-products from detail returns to inventory @regression', async ({ inventoryPage, page }) => {
    await inventoryPage.clickProduct(PRODUCTS.BACKPACK.name);
    const detailPage = new ProductDetailPage(page);
    await detailPage.backToProducts();
    await expect(page).toHaveURL(/.*inventory\.html/);
  });

  // ── Cart badge ───────────────────────────────────────────────────────────

  test('cart badge is absent when nothing is added @smoke', async ({ inventoryPage }) => {
    const count = await inventoryPage.getCartBadgeCount();
    expect(count).toBe(0);
  });

  test('add one item → cart badge shows 1 @smoke', async ({ inventoryPage }) => {
    await inventoryPage.addToCartByName(PRODUCTS.BACKPACK.name);
    const count = await inventoryPage.getCartBadgeCount();
    expect(count).toBe(1);
  });

  test('add two items → cart badge shows 2 @regression', async ({ inventoryPage }) => {
    await inventoryPage.addToCartByName(PRODUCTS.BACKPACK.name);
    await inventoryPage.addToCartByName(PRODUCTS.BIKE_LIGHT.name);
    const count = await inventoryPage.getCartBadgeCount();
    expect(count).toBe(2);
    await inventoryPage.takeScreenshot('cart-badge-2');
  });

  test('button changes to Remove after adding to cart @regression', async ({ inventoryPage }) => {
    await inventoryPage.addToCartByName(PRODUCTS.BACKPACK.name);
    const removeBtn = await inventoryPage.getRemoveButtonByName(PRODUCTS.BACKPACK.name);
    await expect(removeBtn).toBeVisible();
  });

  test('remove from inventory decrements badge @regression', async ({ inventoryPage }) => {
    await inventoryPage.addToCartByName(PRODUCTS.BACKPACK.name);
    await inventoryPage.removeFromCartByName(PRODUCTS.BACKPACK.name);
    const count = await inventoryPage.getCartBadgeCount();
    expect(count).toBe(0);
  });
});
