Repository: https://github.com/brindasakthivel5-a11y/Assessment-Submission

# Sauce Demo – Shop and Check Out test suite

Playwright + TypeScript. Manual design is in `TEST_CASES.md`, written answers in `ANSWERS.md`, AI use in `AI_USAGE.md`. Target: https://www.saucedemo.com (public practice site only).

## Setup

Requires Node.js 18 or newer.

```bash
npm install
npx playwright install chromium
cp .env.example .env   # optional: defaults already point at Sauce Demo
```

## Run

```bash
npm test                 # all tests, headless
npm run test:headed      # watch the browser
npx playwright test tests/checkout.spec.ts   # one file
npm run report           # open the HTML report
```

Outputs: `reports/html` (HTML report), `reports/junit.xml` (JUnit XML), and `reports/artifacts` (screenshot and trace for each failed test).

## Structure

- `src/pages/` – page objects. All locators live here, none in the tests.
- `src/fixtures.ts` – page objects as fixtures plus a `signedIn` login fixture.
- `src/config.ts` – base URL, password and users from environment variables.
- `tests/` – specs. Each test name starts with its manual case ID.

Every test opens its own browser context and logs in for itself, so tests run alone or in any order. There are no fixed sleeps: Playwright's auto-waiting and `expect` / `expect.poll` do the waiting.

## Traceability: manual case to automated test

| Manual case | Automated test | File |
|-------------|----------------|------|
| TC01 | `TC01 standard user logs in and sees the products page` | tests/login.spec.ts |
| TC02 | `TC02 locked-out user sees a locked-out error` | tests/login.spec.ts |
| TC03 | `TC03 wrong password is rejected` | tests/login.spec.ts |
| TC04 | manual only | – |
| TC05 | manual only | – |
| TC06 | `TC06 price low to high orders the whole list` | tests/sorting.spec.ts |
| TC07 | `TC07 price high to low orders the whole list` | tests/sorting.spec.ts |
| TC08 | `TC08 name A to Z ...` and `TC08 name Z to A ...` | tests/sorting.spec.ts |
| TC09 | `TC09 add two items and remove one ...` | tests/cart.spec.ts |
| TC10 | `TC10 remove from the products page ...` | tests/cart.spec.ts |
| TC11 | manual only (covered inside TC13) | – |
| TC12 | `TC12 full checkout ...` | tests/checkout.spec.ts |
| TC13 | `TC13 item total matches the prices of all six products added` | tests/checkout.spec.ts |
| TC14 | `TC14 missing first name ...` (parameterized) | tests/checkout.spec.ts |
| TC15 | `TC15 missing last name ...` (parameterized) | tests/checkout.spec.ts |
| TC16 | `TC16 missing postal code ...` (parameterized) | tests/checkout.spec.ts |
| TC17, TC18 | manual only | – |
| TC19 | `TC19 cancel on the overview page ...` | tests/checkout.spec.ts |
| TC20 | `TC20 logged-out user cannot open the products page by URL` | tests/security.spec.ts |
| TC21 | `TC21 logged-out user cannot open <path> by URL` (3 pages) | tests/security.spec.ts |
| TC22 to TC25 | manual only | – |

## Assumptions

- Sauce Demo's published behaviour is the expected behaviour (no spec exists). Questions and assumptions are listed in `TEST_CASES.md`.
- Tax is checked by arithmetic (total = item total + tax, tax above zero), not against a fixed rate, because the rate is not defined.
- Chromium only for now.

## Growing the suite to 200 tests

Keep the three layers apart: page objects for screens, fixtures for setup, specs for intent. Log in once in a setup project and reuse `storageState`, and create test data through APIs rather than clicking, so tests stay short. Tag tests (`@smoke`, `@regression`) so every pull request runs the smoke set in about two minutes and the full set runs nightly, sharded across CI machines with `--shard`. Add Firefox and WebKit as nightly projects. Track flaky tests in a quarantine list with an owner and a deadline, rather than adding retries. Keep the manual-to-automated ID mapping in a test management tool, linked by test annotations, and review the suite regularly to delete tests that no longer pay for their upkeep.
