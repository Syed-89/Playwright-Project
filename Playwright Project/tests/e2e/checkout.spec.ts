import { test, expect } from '@fixtures/test-fixtures';
import { checkoutScenarios, customerData } from '@data/testData';

test.describe('End-to-End Checkout', () => {
  for (const scenario of checkoutScenarios) {
    test(`${scenario.name} ${scenario.tags.join(' ')}`, async ({
      authenticatedPage,
      cartPage,
      checkoutPage,
    }) => {
      for (const productName of scenario.productNames) {
        await authenticatedPage.addProductToCart(productName);
      }
      expect(await authenticatedPage.getCartCount()).toBe(scenario.expectedCartCount);

      await authenticatedPage.goToCart();
      await cartPage.proceedToCheckout();

      const customer = scenario.customerKey === 'empty' ? { firstName: '', lastName: '', postalCode: '' } : customerData;
      await checkoutPage.fillCustomerInfo(customer.firstName, customer.lastName, customer.postalCode);

      if (scenario.expectErrorVisible) {
        await expect(checkoutPage.error).toBeVisible();
      } else {
        await checkoutPage.finishOrder();

        const confirmation = await checkoutPage.getConfirmationText();
        expect(confirmation).toBe(scenario.expectedConfirmation);
      }
    });
  }
});
