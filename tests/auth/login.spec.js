/**
 * Login test suite — authentication flows for SauceDemo.
 *
 * Tags:
 *   @smoke      — subset safe to run on every deployment
 *   @regression — full suite including edge/negative cases
 */

const { test, expect } = require('../../fixtures/index');
const { USERS, ERROR_MESSAGES } = require('../../utils/testData');

test.describe('Authentication — Login', () => {

  // ── Positive flows ────────────────────────────────────────────────────────

  test('valid credentials → redirects to inventory page @smoke', async ({ loginPage, page }) => {
    await loginPage.login(USERS.STANDARD.username, USERS.STANDARD.password);
    await expect(page).toHaveURL(/.*inventory\.html/);
    await loginPage.takeScreenshot('login-success');
  });

  test('page title is correct on load @smoke', async ({ loginPage, page }) => {
    await expect(page).toHaveTitle('Swag Labs');
  });

  test('login logo is visible on load @smoke', async ({ loginPage }) => {
    await expect(loginPage.loginLogo).toBeVisible();
  });

  // ── Negative flows ────────────────────────────────────────────────────────

  test('wrong password → shows error message @regression', async ({ loginPage }) => {
    await loginPage.login(USERS.STANDARD.username, 'wrong_password');
    const error = await loginPage.getErrorMessage();
    expect(error).toContain(ERROR_MESSAGES.WRONG_CREDS);
    await loginPage.takeScreenshot('login-wrong-password-error');
  });

  test('wrong username → shows error message @regression', async ({ loginPage }) => {
    await loginPage.login('not_a_user', USERS.STANDARD.password);
    const error = await loginPage.getErrorMessage();
    expect(error).toContain(ERROR_MESSAGES.WRONG_CREDS);
  });

  test('locked user → shows locked-out error @regression', async ({ loginPage }) => {
    await loginPage.login(USERS.LOCKED.username, USERS.LOCKED.password);
    const error = await loginPage.getErrorMessage();
    expect(error).toContain('locked out');
    await loginPage.takeScreenshot('login-locked-user-error');
  });

  test('empty username → shows username required error @regression', async ({ loginPage }) => {
    await loginPage.login('', USERS.STANDARD.password);
    const error = await loginPage.getErrorMessage();
    expect(error).toContain(ERROR_MESSAGES.EMPTY_USER);
  });

  test('empty password → shows password required error @regression', async ({ loginPage }) => {
    await loginPage.login(USERS.STANDARD.username, '');
    const error = await loginPage.getErrorMessage();
    expect(error).toContain(ERROR_MESSAGES.EMPTY_PASS);
  });

  test('both fields empty → shows username required first @regression', async ({ loginPage }) => {
    await loginPage.clearAndSubmit();
    const error = await loginPage.getErrorMessage();
    expect(error).toContain(ERROR_MESSAGES.EMPTY_USER);
  });

  test('error message dismisses on X click @regression', async ({ loginPage }) => {
    await loginPage.login('', '');
    expect(await loginPage.isErrorVisible()).toBe(true);
    await loginPage.dismissError();
    expect(await loginPage.isErrorVisible()).toBe(false);
  });

  // ── Parameterised: all test users can log in (except locked) @regression ─

  for (const [key, user] of Object.entries(USERS).filter(([k]) => k !== 'LOCKED')) {
    test(`user type "${user.description}" can reach inventory @regression`, async ({ loginPage, page }) => {
      await loginPage.login(user.username, user.password);
      await expect(page).toHaveURL(/.*inventory\.html/, { timeout: 10_000 });
    });
  }
});
