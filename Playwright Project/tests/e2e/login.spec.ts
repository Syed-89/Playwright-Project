import { test, expect } from '@fixtures/test-fixtures';
import { getUsers, invalidUser } from '@data/users';
import * as allure from 'allure-js-commons';

test.describe('Login', () => {
  test.beforeEach(async ({ loginPage }) => {
    await allure.epic('Authentication');
    await allure.feature('Login');
    await loginPage.open();
  });

  test('standard user can log in successfully @smoke', async ({
    loginPage,
    inventoryPage,
    page,
  }) => {
    await allure.severity('blocker');
    await allure.story('Successful login');

    const users = getUsers();
    await allure.step('Log in with valid standard-user credentials', async () => {
      await loginPage.login(users.standard.username, users.standard.password);
    });

    await allure.step('Verify redirect to the inventory page', async () => {
      await expect(page).toHaveURL(/inventory\.html/);
      await expect(inventoryPage.pageTitle).toHaveText('Products');
    });
  });

  test('locked out user sees an error message @regression', async ({ loginPage }) => {
    await allure.severity('critical');
    await allure.story('Blocked accounts');

    const users = getUsers();
    await allure.step('Attempt login with a locked-out account', async () => {
      await loginPage.login(users.lockedOut.username, users.lockedOut.password);
    });

    await allure.step('Verify the lockout error is shown', async () => {
      await expect(loginPage.error).toBeVisible();
      await expect(loginPage.error).toContainText('locked out');
    });
  });

  test('invalid credentials are rejected @regression', async ({ loginPage }) => {
    await loginPage.login(invalidUser.username, invalidUser.password);

    const error = await loginPage.getErrorMessage();
    expect(error).toContain('do not match');
  });

  test('empty credentials show a validation error @regression', async ({ loginPage }) => {
    await loginPage.login('', '');

    await expect(loginPage.error).toBeVisible();
  });

  test('user "problem" can log in @regression', async ({ loginPage, page }) => {
    const users = getUsers();
    await loginPage.login(users.problem.username, users.problem.password);
    await expect(page).toHaveURL(/inventory\.html/);
  });

  test('user "performanceGlitch" can log in @regression', async ({ loginPage, page }) => {
    const users = getUsers();
    await loginPage.login(users.performanceGlitch.username, users.performanceGlitch.password);
    await expect(page).toHaveURL(/inventory\.html/);
  });

  test('user "standard" can log in @regression', async ({ loginPage, page }) => {
    const users = getUsers();
    await loginPage.login(users.standard.username, users.standard.password);
    await expect(page).toHaveURL(/inventory\.html/);
  });
});
