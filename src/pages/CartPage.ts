import { expect, Locator, Page } from '@playwright/test';
import { Product } from '../data';

export class CartPage {
  readonly items: Locator;
  readonly itemNames: Locator;
  readonly checkoutButton: Locator;

  constructor(private readonly page: Page) {
    this.items = page.getByTestId('inventory-item');
    this.itemNames = page.getByTestId('inventory-item-name');
    this.checkoutButton = page.getByTestId('checkout');
  }

  async remove(p: Product) {
    await this.page.getByTestId(`remove-${p.slug}`).click();
  }

  async expectItems(names: string[]) {
    await expect(this.itemNames).toHaveText(names);
  }

  async expectEmpty() {
    await expect(this.items).toHaveCount(0);
  }

  async checkout() {
    await this.checkoutButton.click();
  }
}
