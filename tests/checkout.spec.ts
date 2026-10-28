import { CHECKOUT_INFO, PRODUCTS } from '../src/data';
import { expect, test } from '../src/fixtures';

test.describe('Checkout', () => {
  test('TC12 full checkout: total = item total + tax, order placed, cart emptied', async ({
    signedIn, inventoryPage, header, cartPage, checkoutPage,
  }) => {
    await inventoryPage.add(PRODUCTS.backpack);
    await inventoryPage.add(PRODUCTS.bikeLight);
    await header.cartLink.click();
    await cartPage.checkout();
    await checkoutPage.fillInfo(CHECKOUT_INFO);
    await checkoutPage.continue();

    const { itemTotal, tax, total } = await checkoutPage.readTotals();
    expect(tax).toBeGreaterThan(0);
    expect(total).toBeCloseTo(itemTotal + tax, 2);

    await checkoutPage.finish();
    await expect(checkoutPage.completeHeader).toHaveText('Thank you for your order!');

    await expect(header.cartBadge).toHaveCount(0);
    await header.cartLink.click();
    await cartPage.expectEmpty();
  });

  test('TC13 item total matches the prices of all six products added', async ({
    signedIn, inventoryPage, header, cartPage, checkoutPage,
  }) => {
    const allPrices = await inventoryPage.prices();
    const expectedSum = allPrices.reduce((a, b) => a + b, 0);

    for (const product of Object.values(PRODUCTS)) {
      await inventoryPage.add(product);
    }
    await expect(header.cartBadge).toHaveText('6');

    await header.cartLink.click();
    await cartPage.checkout();
    await checkoutPage.fillInfo(CHECKOUT_INFO);
    await checkoutPage.continue();

    const { itemTotal, tax, total } = await checkoutPage.readTotals();
    expect(itemTotal).toBeCloseTo(expectedSum, 2);
    expect(total).toBeCloseTo(itemTotal + tax, 2);
  });

  // One parameterized test: TC14 first name, TC15 last name, TC16 postal code
  const missingField = [
    { id: 'TC14', field: 'first name', info: { ...CHECKOUT_INFO, firstName: '' }, error: 'First Name is required' },
    { id: 'TC15', field: 'last name', info: { ...CHECKOUT_INFO, lastName: '' }, error: 'Last Name is required' },
    { id: 'TC16', field: 'postal code', info: { ...CHECKOUT_INFO, postalCode: '' }, error: 'Postal Code is required' },
  ];

  for (const { id, field, info, error } of missingField) {
    test(`${id} missing ${field} shows "${error}"`, async ({
      signedIn, inventoryPage, header, cartPage, checkoutPage, page,
    }) => {
      await inventoryPage.add(PRODUCTS.backpack);
      await header.cartLink.click();
      await cartPage.checkout();
      await checkoutPage.fillInfo(info);
      await checkoutPage.continue();

      await expect(checkoutPage.error).toContainText(error);
      await expect(page).toHaveURL(/checkout-step-one\.html$/);
    });
  }

  test('TC19 cancel on the overview page returns without placing the order', async ({
    signedIn, inventoryPage, header, cartPage, checkoutPage, page,
  }) => {
    await inventoryPage.add(PRODUCTS.backpack);
    await header.cartLink.click();
    await cartPage.checkout();
    await checkoutPage.fillInfo(CHECKOUT_INFO);
    await checkoutPage.continue();
    await expect(checkoutPage.total).toBeVisible();

    await checkoutPage.cancelButton.click();

    await expect(page).toHaveURL(/inventory\.html$/);
    await expect(header.cartBadge).toHaveText('1'); // order not placed, cart kept
    await expect(checkoutPage.completeHeader).toHaveCount(0);
  });
});
