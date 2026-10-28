import { expect, test } from '../src/fixtures';

test.describe('Access control', () => {
  test('TC20 logged-out user cannot open the products page by URL', async ({ page, loginPage }) => {
    await page.goto('/inventory.html');

    await expect(loginPage.error).toContainText("You can only access '/inventory.html' when you are logged in");
    await expect(loginPage.loginButton).toBeVisible();
    await expect(page).not.toHaveURL(/inventory/);
  });

  const innerPages = ['/cart.html', '/checkout-step-one.html', '/checkout-complete.html'];

  for (const path of innerPages) {
    test(`TC21 logged-out user cannot open ${path} by URL`, async ({ page, loginPage }) => {
      await page.goto(path);

      await expect(loginPage.error).toContainText(`You can only access '${path}' when you are logged in`);
      await expect(loginPage.loginButton).toBeVisible();
    });
  }
});
