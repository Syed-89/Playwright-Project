# Playwright TypeScript Test Framework

End-to-end test framework for [SauceDemo](https://www.saucedemo.com), built with
[Playwright](https://playwright.dev) and TypeScript. The framework uses page objects,
typed fixtures, environment-based configuration, and HTML, JUnit, and Allure reports.

## Requirements

- Node.js 20 or later
- npm

## Setup

Install dependencies and browser binaries:

```bash
npm install
npx playwright install
```

The repository includes a local `.env` file for the SauceDemo demo accounts. For another
environment, create or update `.env` with the following variables:

```dotenv
BASE_URL=https://www.saucedemo.com
ENV=dev
TEST_USER_STANDARD=standard_user
TEST_PASSWORD_STANDARD=secret_sauce
TEST_USER_LOCKED_OUT=locked_out_user
TEST_PASSWORD_LOCKED_OUT=secret_sauce
TEST_USER_PROBLEM=problem_user
TEST_PASSWORD_PROBLEM=secret_sauce
TEST_USER_PERFORMANCE_GLITCH=performance_glitch_user
TEST_PASSWORD_PERFORMANCE_GLITCH=secret_sauce
```

Do not commit real credentials. In CI, provide them through environment variables or secrets.

## Project structure

```text
src/
  data/       Test accounts and checkout data
  fixtures/   Custom Playwright fixtures
  pages/      Page Object Model classes
  utils/      Shared utility functions
tests/
  e2e/        Login, cart, and checkout tests
playwright.config.ts
tsconfig.json
```

Tests should import `test` and `expect` from `@fixtures/test-fixtures`. The custom fixtures
provide `loginPage`, `inventoryPage`, `cartPage`, `checkoutPage`, and `authenticatedPage`.

## Run tests

```bash
npm test                 # Run all tests
npm run test:chromium    # Run the enabled Chromium project
npm run test:headed      # Run with a visible browser
npm run test:ui          # Open Playwright UI mode
npm run test:debug       # Run with the Playwright debugger
npm run test:smoke       # Run tests tagged @smoke
npm run test:regression  # Run tests tagged @regression
```

The current `playwright.config.ts` enables the Chromium project. The Firefox, WebKit, and
mobile project definitions are currently commented out. Uncomment and configure those
projects before using their corresponding commands or CI jobs.

## Quality checks

```bash
npm run typecheck        # TypeScript validation
npm run lint             # ESLint validation
npm run format:check     # Check Prettier formatting
npm run format           # Format TypeScript, JSON, and Markdown files
```

## Reports and failure artifacts

Test runs produce:

- `playwright-report/`: HTML report
- `test-results/`: JUnit results and failure artifacts such as traces, videos, and screenshots
- `allure-results/`: Raw Allure results

Open the HTML report with:

```bash
npm run report
```

Generate or open an Allure report with:

```bash
npm run allure:serve     # Generate a temporary report and open it
npm run allure:report    # Generate ./allure-report and open it
npm run allure:generate  # Generate ./allure-report only
```

## Adding tests

1. Add or update a page object in `src/pages`.
2. Add reusable setup to `src/fixtures/test-fixtures.ts` when needed.
3. Add the spec under `tests/e2e`.
4. Use page-object methods for interactions and keep assertions in the spec.
5. Add `@smoke` or `@regression` to the test title when appropriate.

Example:

```ts
import { expect, test } from '@fixtures/test-fixtures';

test('adds a product to the cart @smoke', async ({ authenticatedPage }) => {
  await authenticatedPage.addProductToCart('Sauce Labs Backpack');
  expect(await authenticatedPage.getCartCount()).toBe(1);
});
```

## CI

The GitHub Actions workflow runs type checking, linting, browser installation, and Playwright
tests, then uploads HTML, failure, and Allure artifacts. It currently requests Chromium,
Firefox, and WebKit jobs; those projects must be enabled in `playwright.config.ts` for the
full CI matrix to run successfully.
