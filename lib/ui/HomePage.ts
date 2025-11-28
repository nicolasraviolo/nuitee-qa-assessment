import { Page, Locator, expect } from '@playwright/test';

export class HomePage {
  readonly page: Page;
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly acceptCookiesButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.searchInput = page.getByRole('combobox', { name: 'Enter a destination' });
    
    this.searchButton = page.getByRole('button', { name: 'Search' });
    this.acceptCookiesButton = page.getByRole('button', { name: 'Accept' });
  }

  async navigate() {
    await this.page.goto('https://v3.nuitee.link/');
    await expect(this.page).toHaveURL(/v3.nuitee.link/);

   //cookies
    try {
      if (await this.acceptCookiesButton.isVisible({ timeout: 5000 })) {
        await this.acceptCookiesButton.click();
        await expect(this.acceptCookiesButton).toBeHidden();
      }
    } catch (error) {
      console.log("Cookies banner no apareció o ya estaba cerrado.");
    }
  }

  async searchHotel(city: string) {
    // click to ensure focus
    await this.searchInput.click();
    
    
    await this.searchInput.pressSequentially(city, { delay: 100 });

    // wait for options to load
    // search for the option that matches the city
    const option = this.page.getByRole('option').filter({ hasText: city }).first();
    
    await option.waitFor({ state: 'visible', timeout: 10000 });
    await option.click();
  }

  async clickSearch() {
    await this.searchButton.click();
  }
}