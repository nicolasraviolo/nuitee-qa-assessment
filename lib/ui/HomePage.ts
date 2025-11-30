import { Page, Locator, expect } from '@playwright/test';

export class HomePage {
  readonly page: Page;
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly acceptCookiesButton: Locator;
  readonly noResultsMessage: Locator;

  constructor(page: Page) {
    this.page = page;

    this.searchInput = page.getByRole('combobox', { name: 'Enter a destination' });
    this.searchButton = page.getByRole('button', { name: 'Search' });
    this.acceptCookiesButton = page.getByRole('button', { name: 'Accept' });
    this.noResultsMessage = page.getByRole('heading', { name: 'No results found' });
  }

  /**
   * Navigates to the application and handles the cookie consent banner if present.
   */
  async navigate() {
    await this.page.goto('https://v3.nuitee.link/');

    // Validate URL to ensure we are on the right environment
    await expect(this.page).toHaveURL(/v3.nuitee.link/);

    // Defensive Coding: Handle Cookie Banner
    // The banner might not appear if the session is reused or in some geographical regions.
    try {
      if (await this.acceptCookiesButton.isVisible({ timeout: 3000 })) {
        await this.acceptCookiesButton.click();
        await expect(this.acceptCookiesButton).toBeHidden();
      }
    } catch (error) {
      // Log info but do not fail the test, as this is a non-critical UI state
      console.log("Info: Cookie banner not found or already handled.");
    }
  }

  /**
   * Performs a search for a specific city.
   * @param city - The name of the destination (e.g., "Paris")
   * @param expectResults - Boolean flag. If true, waits for autosuggest. If false, just types.
   */
  async searchHotel(city: string, expectResults: boolean = true) {
    await this.performSearchType(city);

    if (expectResults) {

      const option = this.page.getByRole('option').filter({ hasText: city }).first();


      await option.click();
    } else {
      await this.page.keyboard.press('Enter');
    }
  }

  private async performSearchType(city: string) {
    await this.searchInput.click();
    await this.searchInput.fill('');
    await this.searchInput.pressSequentially(city, { delay: 100 });
  }

  async clickSearch() {
    await this.searchButton.click();
  }

  async verifyMobileLayout() {
    // We verify the text is visible to the user.
    await expect(this.page.getByText('Enter a destination')).toBeVisible();

    // Verify search button is also visible
    await expect(this.searchButton).toBeVisible();
  }
  /**
     * Selects the first hotel from the results list.
     */
  async selectFirstResult() {
    const firstHotelTitle = this.page.locator('a[href*="/hotels/"] h3').first();

    // Wait for the specific element we want to click
    await firstHotelTitle.waitFor({ state: 'visible', timeout: 30000 });

    // Click the title to navigate
    await firstHotelTitle.click();
  }
}