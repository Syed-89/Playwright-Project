import { test, expect } from '@fixtures/test-fixtures';
import { cartScenarios, sortingScenarios } from '@data/testData';
import { isSorted, parsePrice } from '@utils/helpers';

test.describe('Cart & Sorting', () => {
  for (const scenario of cartScenarios) {
    test(`${scenario.name} ${scenario.tags.join(' ')}`, async ({ authenticatedPage, cartPage }) => {
      for (const productName of scenario.productNames) {
        await authenticatedPage.addProductToCart(productName);
      }

      if (scenario.goToCart) {
        await authenticatedPage.goToCart();

        const itemNames = await cartPage.getItemNames();

        expect(itemNames).toEqual(expect.arrayContaining(scenario.expectedItems ?? []));
        expect(itemNames).toHaveLength(scenario.expectedItems?.length ?? 0);
      } else {
        expect(await authenticatedPage.getCartCount()).toBe(scenario.expectedCartCount);
      }
    });
  }

  for (const scenario of sortingScenarios) {
    test(`${scenario.name} ${scenario.tags.join(' ')}`, async ({ authenticatedPage }) => {
      await authenticatedPage.sortBy(scenario.sortBy);

      if (scenario.valueType === 'price') {
        const prices = await authenticatedPage.getProductPrices();
        const parsed = prices.map(parsePrice);

        expect(isSorted(parsed, (a, b) => a - b)).toBe(true);
      } else {
        const names = await authenticatedPage.getProductNames();

        expect(isSorted(names, (a, b) => a.localeCompare(b))).toBe(true);
      }
    });
  }
});
