import { expect, test } from '../src/fixtures';

test.describe('Sorting', () => {
  test('TC06 price low to high orders the whole list', async ({ signedIn, inventoryPage }) => {
    const before = await inventoryPage.prices();
    const expected = [...before].sort((a, b) => a - b);

    await inventoryPage.sortBy('lohi');

    // poll: re-reads the whole list until the sort has been applied
    await expect.poll(() => inventoryPage.prices()).toEqual(expected);
    expect(expected).toHaveLength(before.length); // nothing lost or duplicated
  });

  test('TC07 price high to low orders the whole list', async ({ signedIn, inventoryPage }) => {
    const before = await inventoryPage.prices();
    const expected = [...before].sort((a, b) => b - a);

    await inventoryPage.sortBy('hilo');

    await expect.poll(() => inventoryPage.prices()).toEqual(expected);
  });

  const byName = [
    { option: 'az', label: 'A to Z', compare: (a: string, b: string) => (a < b ? -1 : a > b ? 1 : 0) },
    { option: 'za', label: 'Z to A', compare: (a: string, b: string) => (a < b ? 1 : a > b ? -1 : 0) },
  ] as const;

  for (const { option, label, compare } of byName) {
    test(`TC08 name ${label} orders the whole list`, async ({ signedIn, inventoryPage }) => {
      const before = await inventoryPage.names();
      const expected = [...before].sort(compare);

      await inventoryPage.sortBy(option);

      await expect.poll(() => inventoryPage.names()).toEqual(expected);
    });
  }
});
