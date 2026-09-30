# SauceDemo — Playwright E2E Automation Suite

Production-grade web automation framework built with **Playwright** + **JavaScript**, covering authentication, inventory, cart, and end-to-end checkout flows for [SauceDemo](https://www.saucedemo.com/).

---

## Tech Stack

| Layer | Tool |
|---|---|
| Test runner | Playwright Test |
| Language | JavaScript (Node 20) |
| Architecture | Page Object Model (POM) |
| Fixtures | Playwright `test.extend()` |
| Browsers | Chromium · Firefox · WebKit · Mobile Chrome · Mobile Safari |
| CI/CD | GitHub Actions |
| Reporting | HTML report · JSON · List |
| Evidence | Screenshots on failure · Video (retain-on-failure) · Traces |

---

## Project Structure

```
├── .github/workflows/playwright.yml   # CI/CD pipeline (matrix per browser + nightly)
├── pages/
│   ├── BasePage.js                    # Common methods: click, fill, screenshot, assertions
│   ├── LoginPage.js
│   ├── InventoryPage.js
│   ├── ProductDetailPage.js
│   ├── CartPage.js
│   ├── CheckoutPage.js                # Step 1 — customer info
│   ├── CheckoutOverviewPage.js        # Step 2 — order review
│   └── CheckoutCompletePage.js        # Order confirmation
├── tests/
│   ├── auth/login.spec.js             # 10 tests — valid, invalid, locked, empty fields
│   ├── inventory/inventory.spec.js    # 12 tests — load, sort (4 options), product detail, cart badge
│   ├── cart/cart.spec.js              # 10 tests — add, remove, multi-item, navigation
│   └── e2e/checkout.spec.js           # 10 tests — happy path, form validation, order math
├── fixtures/index.js                  # Pre-wired page objects (authenticated, cart-loaded)
└── utils/
    ├── testData.js                    # Users, products, checkout data, expected error messages
    └── helpers.js                     # Sort order assertions, debug helpers
```

---

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Install all Playwright browser binaries
npx playwright install

# 3. Run all tests (all browsers)
npm test

# 4. Run only smoke tests on Chromium
npm run test:smoke

# 5. Run E2E checkout flow
npm run test:e2e

# 6. Open the HTML report after a run
npm run report
```

---

## Test Tags

| Tag | Purpose | Command |
|---|---|---|
| `@smoke` | Critical paths — safe for every deployment | `npm run test:smoke` |
| `@regression` | Full suite including edge cases | `npm run test:regression` |
| `@e2e` | End-to-end journeys (login → order placed) | `npm run test:e2e` |

---

## CI/CD Pipeline

```
Push / PR → main
  │
  ├── Smoke Check (Chromium only, ~2 min) ────────► pass/fail fast
  │
  └── Full Matrix (Chromium + Firefox + WebKit)
        ├── Install deps & browser
        ├── Run tests (retries: 2 on CI)
        └── Upload artifacts (HTML report + videos + screenshots)
              └── Retained 30 days
```

Nightly runs fire at **03:00 UTC Mon–Fri** to catch environmental regressions.

---

## Evidence Capture

- **Screenshots** — `only-on-failure` (auto) + explicit `takeScreenshot()` calls at key checkpoints
- **Video** — `retain-on-failure` — full browser recording saved when a test fails
- **Traces** — captured on first retry; open with `npx playwright show-trace`
- **HTML Report** — `playwright-report/index.html` — timeline, steps, network, attachments

---

## Test Coverage

| Suite | Tests | Highlights |
|---|---|---|
| Auth / Login | 10 | Valid login, all invalid paths, locked user, parameterised user types |
| Inventory | 12 | Product count, all 4 sort options with array-order assertions |
| Cart | 10 | Empty cart, add/remove, multi-item, quantity, navigation |
| E2E Checkout | 10 | Full happy-path, order math (total = items + tax), 3 form-validation paths |
| **Total** | **~42** | Across 5 browser/device configs = **~210 test runs per CI push** |
