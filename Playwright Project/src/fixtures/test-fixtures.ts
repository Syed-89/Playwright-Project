import { test as base } from '@playwright/test';
import { LoginPage } from '@pages/LoginPage';
import { InventoryPage } from '@pages/InventoryPage';
import { CartPage, CheckoutPage } from '@pages/CartPage';
import { getUsers } from '@data/users';

interface Pages {
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
}

interface Auth {
  /** Provides a page that is already logged in as the standard user. */
  authenticatedPage: InventoryPage;
}

/**
 * Extends the base Playwright `test` with page-object fixtures.
 * Tests import `test` and `expect` from this module instead of '@playwright/test'
 * directly, so every test automatically gets typed, ready-to-use page objects.
 */
export const test = base.extend<Pages & Auth>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  inventoryPage: async ({ page }, use) => {
    await use(new InventoryPage(page));
  },

  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },

  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },

  // Composite fixture: performs login once so tests can skip repeating that setup.
  authenticatedPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    const testUsers = getUsers();
    await loginPage.open();
    await loginPage.login(testUsers.standard.username, testUsers.standard.password);
    await page.waitForURL(/inventory\.html/);
    await use(new InventoryPage(page));
  },
});

export { expect } from '@playwright/test';
