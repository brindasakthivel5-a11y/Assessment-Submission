import { PRODUCTS } from '../src/data';
import { expect, test } from '../src/fixtures';

test.describe('Cart', () => {
  test('TC09 add two items and remove one: badge and cart contents update', async ({
    signedIn, inventoryPage, header, cartPage,
  }) => {
    await inventoryPage.add(PRODUCTS.backpack);
    await inventoryPage.add(PRODUCTS.bikeLight);
    await expect(header.cartBadge).toHaveText('2');

    await header.cartLink.click();
    await cartPage.expectItems([PRODUCTS.backpack.name, PRODUCTS.bikeLight.name]);

    await cartPage.remove(PRODUCTS.backpack);
    await expect(header.cartBadge).toHaveText('1');
    await cartPage.expectItems([PRODUCTS.bikeLight.name]);
  });

  test('TC10 remove from the products page resets the button and badge', async ({
    signedIn, inventoryPage, header,
  }) => {
    await inventoryPage.add(PRODUCTS.backpack);
    await expect(header.cartBadge).toHaveText('1');
    await expect(inventoryPage.removeButton(PRODUCTS.backpack)).toBeVisible();

    await inventoryPage.remove(PRODUCTS.backpack);
    await expect(header.cartBadge).toHaveCount(0);
    await expect(inventoryPage.addButton(PRODUCTS.backpack)).toBeVisible();
  });
});
