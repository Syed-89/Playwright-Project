import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  protected readonly path = '/';

  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;
  private readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameInput = page.getByPlaceholder('Username');
    this.passwordInput = page.getByPlaceholder('Password');
    this.loginButton = page.getByRole('button', { name: /login/i });
    this.errorMessage = page.locator('[data-test="error"]');
  }

  /**
   * Read-only accessor for the error locator. Kept as a `Locator` (rather than
   * a resolved boolean/string) so tests can use Playwright's auto-retrying
   * `expect(loginPage.error).toBeVisible()` instead of a single point-in-time check.
   */
  public get error(): Locator {
    return this.errorMessage;
  }

  public async login(username: string, password: string): Promise<void> {
    await this.fill(this.usernameInput, username);
    await this.fill(this.passwordInput, password);
    await this.click(this.loginButton);
  }

  public async getErrorMessage(): Promise<string> {
    return this.getText(this.errorMessage);
  }
}
