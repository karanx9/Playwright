/**
 * End-to-end checkout test suite — covers the complete purchase flow and
 * all form-validation paths on checkout step 1.
 *
 * Tags:
 *   @e2e        — full journey from login → order confirmation
 *   @regression — validation, navigation, order total math
 */

const { test, expect } = require('../../fixtures/index');
const { CHECKOUT_INFO, ERROR_MESSAGES, PRODUCTS } = require('../../utils/testData');
const { CheckoutCompletePage }  = require('../../pages/CheckoutCompletePage');
const { CheckoutOverviewPage }  = require('../../pages/CheckoutOverviewPage');

test.describe('E2E — Checkout Flow', () => {

  // ── Happy-path E2E ────────────────────────────────────────────────────────

  test('complete checkout flow → order confirmation displayed @e2e', async ({
    checkoutPage, page,
  }) => {
    // Step 1 — fill customer info
    await checkoutPage.fillAndContinue(
      CHECKOUT_INFO.VALID.firstName,
      CHECKOUT_INFO.VALID.lastName,
      CHECKOUT_INFO.VALID.zip,
    );
    await expect(page).toHaveURL(/.*checkout-step-two\.html/);
    await checkoutPage.takeScreenshot('checkout-step2-overview');

    // Step 2 — review & place order
    const overviewPage = new CheckoutOverviewPage(page);
    const title = await overviewPage.getPageTitle();
    expect(title).toBe('Checkout: Overview');
    await overviewPage.finish();

    // Confirmation
    await expect(page).toHaveURL(/.*checkout-complete\.html/);
    const completePage = new CheckoutCompletePage(page);
    const header = await completePage.getConfirmationHeader();
    expect(header).toBe('Thank you for your order!');
    await completePage.takeScreenshot('checkout-complete');
  });

  test('confirmation image is displayed after order @e2e', async ({ checkoutPage, page }) => {
    await checkoutPage.fillAndContinue(
      CHECKOUT_INFO.VALID.firstName,
      CHECKOUT_INFO.VALID.lastName,
      CHECKOUT_INFO.VALID.zip,
    );
    const overview = new CheckoutOverviewPage(page);
    await overview.finish();
    const complete = new CheckoutCompletePage(page);
    expect(await complete.isConfirmationImageVisible()).toBe(true);
  });

  test('Back Home from confirmation returns to inventory @e2e', async ({ checkoutPage, page }) => {
    await checkoutPage.fillAndContinue(
      CHECKOUT_INFO.VALID.firstName,
      CHECKOUT_INFO.VALID.lastName,
      CHECKOUT_INFO.VALID.zip,
    );
    const overview = new CheckoutOverviewPage(page);
    await overview.finish();
    const complete = new CheckoutCompletePage(page);
    await complete.backToProducts();
    await expect(page).toHaveURL(/.*inventory\.html/);
  });

  // ── Order overview assertions ─────────────────────────────────────────────

  test('overview lists the correct item that was added to cart @regression', async ({
    overviewPage,
  }) => {
    const names = await overviewPage.getOrderItemNames();
    expect(names).toContain(PRODUCTS.BACKPACK.name);
    await overviewPage.takeScreenshot('checkout-overview-items');
  });

  test('order total = item total + tax @regression', async ({ overviewPage }) => {
    const itemTotal = await overviewPage.getItemTotal();
    const tax       = await overviewPage.getTax();
    const total     = await overviewPage.getOrderTotal();
    // Floating-point safe comparison
    expect(total).toBeCloseTo(itemTotal + tax, 2);
  });

  test('item total matches expected product price @regression', async ({ overviewPage }) => {
    const itemTotal = await overviewPage.getItemTotal();
    expect(itemTotal).toBe(PRODUCTS.BACKPACK.price);
  });

  // ── Form validation ───────────────────────────────────────────────────────

  test('missing first name → shows First Name required error @regression', async ({
    checkoutPage,
  }) => {
    await checkoutPage.fillInfo(
      CHECKOUT_INFO.MISSING_FIRST.firstName,
      CHECKOUT_INFO.MISSING_FIRST.lastName,
      CHECKOUT_INFO.MISSING_FIRST.zip,
    );
    await checkoutPage.continue();
    const error = await checkoutPage.getErrorMessage();
    expect(error).toContain(ERROR_MESSAGES.CHECKOUT_FIRST_NAME);
    await checkoutPage.takeScreenshot('checkout-missing-first-name');
  });

  test('missing last name → shows Last Name required error @regression', async ({
    checkoutPage,
  }) => {
    await checkoutPage.fillInfo(
      CHECKOUT_INFO.MISSING_LAST.firstName,
      CHECKOUT_INFO.MISSING_LAST.lastName,
      CHECKOUT_INFO.MISSING_LAST.zip,
    );
    await checkoutPage.continue();
    const error = await checkoutPage.getErrorMessage();
    expect(error).toContain(ERROR_MESSAGES.CHECKOUT_LAST_NAME);
    await checkoutPage.takeScreenshot('checkout-missing-last-name');
  });

  test('missing zip code → shows Postal Code required error @regression', async ({
    checkoutPage,
  }) => {
    await checkoutPage.fillInfo(
      CHECKOUT_INFO.MISSING_ZIP.firstName,
      CHECKOUT_INFO.MISSING_ZIP.lastName,
      CHECKOUT_INFO.MISSING_ZIP.zip,
    );
    await checkoutPage.continue();
    const error = await checkoutPage.getErrorMessage();
    expect(error).toContain(ERROR_MESSAGES.CHECKOUT_ZIP);
    await checkoutPage.takeScreenshot('checkout-missing-zip');
  });

  test('Cancel from step 1 returns to cart @regression', async ({ checkoutPage, page }) => {
    await checkoutPage.cancel();
    await expect(page).toHaveURL(/.*cart\.html/);
  });

  test('Cancel from step 2 returns to inventory @regression', async ({ overviewPage, page }) => {
    await overviewPage.cancel();
    await expect(page).toHaveURL(/.*inventory\.html/);
  });
});
