export interface Product {
  name: string;
  slug: string; // used in data-test ids: add-to-cart-<slug>
}

export const PRODUCTS = {
  backpack: { name: 'Sauce Labs Backpack', slug: 'sauce-labs-backpack' },
  bikeLight: { name: 'Sauce Labs Bike Light', slug: 'sauce-labs-bike-light' },
  boltShirt: { name: 'Sauce Labs Bolt T-Shirt', slug: 'sauce-labs-bolt-t-shirt' },
  fleeceJacket: { name: 'Sauce Labs Fleece Jacket', slug: 'sauce-labs-fleece-jacket' },
  onesie: { name: 'Sauce Labs Onesie', slug: 'sauce-labs-onesie' },
  redShirt: {
    name: 'Test.allTheThings() T-Shirt (Red)',
    slug: 'test.allthethings()-t-shirt-(red)',
  },
} satisfies Record<string, Product>;

export const CHECKOUT_INFO = { firstName: 'Jane', lastName: 'Doe', postalCode: '600001' };

/** "Item total: $39.98" -> 39.98 */
export const toMoney = (text: string): number => parseFloat(text.replace(/[^0-9.]/g, ''));
