const { expect } = require('@playwright/test');

/**
 * Asserts that an array of strings is sorted alphabetically.
 * @param {string[]} arr
 * @param {'asc'|'desc'} direction
 */
function assertAlphaOrder(arr, direction = 'asc') {
  const sorted = [...arr].sort((a, b) =>
    direction === 'asc' ? a.localeCompare(b) : b.localeCompare(a),
  );
  expect(arr, `Expected array to be sorted ${direction}`).toEqual(sorted);
}

/**
 * Asserts that an array of numbers is sorted.
 * @param {number[]} arr
 * @param {'asc'|'desc'} direction
 */
function assertNumericOrder(arr, direction = 'asc') {
  const sorted = [...arr].sort((a, b) =>
    direction === 'asc' ? a - b : b - a,
  );
  expect(arr, `Expected prices to be sorted ${direction}`).toEqual(sorted);
}

/**
 * Pauses execution — use ONLY when debugging locally; never leave in committed tests.
 * @param {import('@playwright/test').Page} page
 */
async function debugPause(page) {
  if (!process.env.CI) {
    await page.pause();
  }
}

/**
 * Returns today's date as YYYY-MM-DD.
 */
function todayStr() {
  return new Date().toISOString().split('T')[0];
}

module.exports = { assertAlphaOrder, assertNumericOrder, debugPause, todayStr };
