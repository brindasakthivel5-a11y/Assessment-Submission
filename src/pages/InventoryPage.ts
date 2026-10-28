import { expect, Locator, Page } from '@playwright/test';
import { Product, toMoney } from '../data';

export type SortOption = 'az' | 'za' | 'lohi' | 'hilo';

export class InventoryPage {
  readonly title: Locator;
  readonly sortSelect: Locator;
  readonly items: Locator;
  readonly itemNames: Locator;
  readonly itemPrices: Locator;

  constructor(private readonly page: Page) {
    this.title = page.getByTestId('title');
    this.sortSelect = page.getByTestId('product-sort-container');
    this.items = page.getByTestId('inventory-item');
    this.itemNames = page.getByTestId('inventory-item-name');
    this.itemPrices = page.getByTestId('inventory-item-price');
  }

  async expectLoaded() {
    await expect(this.page).toHaveURL(/inventory\.html$/);
    await expect(this.title).toHaveText('Products');
  }

  async sortBy(option: SortOption) {
    await this.sortSelect.selectOption(option);
  }

  async prices(): Promise<number[]> {
    await expect(this.items.first()).toBeVisible();
    return (await this.itemPrices.allTextContents()).map(toMoney);
  }

  async names(): Promise<string[]> {
    await expect(this.items.first()).toBeVisible();
    return this.itemNames.allTextContents();
  }

  addButton(p: Product): Locator {
    return this.page.getByTestId(`add-to-cart-${p.slug}`);
  }

  removeButton(p: Product): Locator {
    return this.page.getByTestId(`remove-${p.slug}`);
  }

  async add(p: Product) {
    await this.addButton(p).click();
  }

  async remove(p: Product) {
    await this.removeButton(p).click();
  }
}
