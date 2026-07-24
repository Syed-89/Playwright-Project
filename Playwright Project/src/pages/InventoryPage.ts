import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class InventoryPage extends BasePage {
  protected readonly path = '/inventory.html';

  private readonly titleLocator: Locator;
  private readonly cartIcon: Locator;
  private readonly cartBadge: Locator;
  private readonly sortDropdown: Locator;
  private readonly inventoryItems: Locator;

  constructor(page: Page) {
    super(page);
    this.titleLocator = page.locator('.title');
    this.cartIcon = page.locator('.shopping_cart_link');
    this.cartBadge = page.locator('.shopping_cart_badge');
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');
    this.inventoryItems = page.locator('.inventory_item');
  }

  public get pageTitle(): Locator {
    return this.titleLocator;
  }

  public async addProductToCart(productName: string): Promise<void> {
    await this.click(this.addToCartButton(productName));
  }

  public async getCartCount(): Promise<number> {
    if (!(await this.isVisible(this.cartBadge))) return 0;
    const text = await this.getText(this.cartBadge);
    return Number(text);
  }

  public async goToCart(): Promise<void> {
    await this.click(this.cartIcon);
  }

  public async sortBy(option: 'az' | 'za' | 'lohi' | 'hilo'): Promise<void> {
    await this.sortDropdown.selectOption(option);
  }

  public async getProductNames(): Promise<string[]> {
  const productNames = await this.inventoryItems.locator('.inventory_item_name').allTextContents();
  console.log('Product names:', productNames); // Debugging line
  return productNames;
  }

  public async getProductPrices(): Promise<string[]> {
    return this.inventoryItems.locator('.inventory_item_price').allTextContents();
  }

  private addToCartButton(productName: string): Locator {
    return this.inventoryItems
      .filter({ hasText: productName })
      .getByRole('button', { name: /add to cart/i });
  }
}
