import { Page, Locator } from '@playwright/test';

/**
 * Abstract base class for every Page Object in the framework.
 *
 * Responsibilities kept strictly here (and nowhere else):
 * - Owning the Playwright `Page` handle (encapsulation — subclasses never touch
 *   `page` directly for navigation/low-level actions, they use these helpers).
 * - Providing low-level, auto-waiting building blocks (`click`, `fill`, `getText`)
 *   so concrete page objects stay declarative.
 * - Defining the navigation contract via the Template Method pattern: `open()`
 *   is implemented once, here, and reused by every subclass; each subclass only
 *   supplies its own `path`, avoiding duplicated navigation logic.
 *
 * Page objects intentionally contain no assertions (`expect`) — that is the
 * test's responsibility. This keeps a single-responsibility boundary between
 * "how to interact with the page" (page objects) and "what should be true"
 * (tests).
 */
export abstract class BasePage {
  protected readonly page: Page;

  /** Route (relative to `baseURL`) this page lives at. Supplied by each subclass. */
  protected abstract readonly path: string;

  protected constructor(page: Page) {
    this.page = page;
  }

  /** Navigates directly to this page's own route. */
  public async open(): Promise<void> {
    await this.page.goto(this.path);
  }

  public async waitForUrl(pattern: string | RegExp): Promise<void> {
    await this.page.waitForURL(pattern);
  }

  public async takeScreenshot(name: string): Promise<void> {
    await this.page.screenshot({ path: `test-results/screenshots/${name}.png`, fullPage: true });
  }

  protected async click(locator: Locator): Promise<void> {
    await locator.waitFor({ state: 'visible' });
    await locator.click();
  }

  protected async fill(locator: Locator, value: string): Promise<void> {
    await locator.waitFor({ state: 'visible' });
    await locator.fill(value);
  }

  protected async getText(locator: Locator): Promise<string> {
    return (await locator.textContent())?.trim() ?? '';
  }

  protected async isVisible(locator: Locator): Promise<boolean> {
    return locator.isVisible();
  }
}
