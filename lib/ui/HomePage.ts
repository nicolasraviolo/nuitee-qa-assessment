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
    // Ensure focus
    await this.searchInput.click();
    
    // Type with delay to trigger JS event listeners for autocomplete
    await this.searchInput.pressSequentially(city, { delay: 100 });

    if (expectResults) {
        // Happy Path: Wait for the suggestion dropdown and click the first match
        const option = this.page.getByRole('option').filter({ hasText: city }).first();
        await option.waitFor({ state: 'visible', timeout: 10000 });
        await option.click();
    } else {
        // Edge Case: Just hit Enter if we don't expect valid suggestions (or testing invalid input)
        await this.page.keyboard.press('Enter');
    }
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
async selectFirstResult() {
    // Strategy: Find the first anchor tag that links to a hotel detail page
    const firstHotelCard = this.page.locator('a[href*="/hotels/"]').first();
    
    // Wait for the list to populate and the element to be interactive
    await firstHotelCard.waitFor({ state: 'visible', timeout: 15000 });
    
    // Click to navigate
    await firstHotelCard.click();
  }
}