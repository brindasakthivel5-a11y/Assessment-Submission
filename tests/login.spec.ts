import { config } from '../src/config';
import { expect, test } from '../src/fixtures';

test.describe('Login', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test('TC01 standard user logs in and sees the products page', async ({ loginPage, inventoryPage }) => {
    await loginPage.login(config.users.standard, config.password);
    await inventoryPage.expectLoaded();
  });

  test('TC02 locked-out user sees a locked-out error', async ({ loginPage, page }) => {
    await loginPage.login(config.users.lockedOut, config.password);
    await expect(loginPage.error).toContainText('this user has been locked out');
    await expect(page).not.toHaveURL(/inventory/);
  });

  test('TC03 wrong password is rejected', async ({ loginPage, page }) => {
    await loginPage.login(config.users.standard, 'wrong_password');
    await expect(loginPage.error).toContainText('do not match any user');
    await expect(page).not.toHaveURL(/inventory/);
  });
});
