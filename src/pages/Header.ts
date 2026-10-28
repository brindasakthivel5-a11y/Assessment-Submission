import { Locator, Page } from '@playwright/test';

/** Shared header: present on every logged-in page. */
export class Header {
  readonly cartLink: Locator;
  readonly cartBadge: Locator;

  constructor(page: Page) {
    this.cartLink = page.getByTestId('shopping-cart-link');
    this.cartBadge = page.getByTestId('shopping-cart-badge');
  }
}
