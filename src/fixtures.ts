import { test as base, expect } from '@playwright/test';
import { config } from './config';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { Header } from './pages/Header';
import { InventoryPage } from './pages/InventoryPage';
import { LoginPage } from './pages/LoginPage';

interface Fixtures {
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
  header: Header;
  /** Logs in as the standard user through the UI. Each test gets a fresh browser context. */
  signedIn: void;
}

export const test = base.extend<Fixtures>({
  loginPage: async ({ page }, use) => use(new LoginPage(page)),
  inventoryPage: async ({ page }, use) => use(new InventoryPage(page)),
  cartPage: async ({ page }, use) => use(new CartPage(page)),
  checkoutPage: async ({ page }, use) => use(new CheckoutPage(page)),
  header: async ({ page }, use) => use(new Header(page)),
  signedIn: async ({ loginPage, inventoryPage }, use) => {
    await loginPage.goto();
    await loginPage.login(config.users.standard, config.password);
    await inventoryPage.expectLoaded();
    await use();
  },
});

export { expect };
