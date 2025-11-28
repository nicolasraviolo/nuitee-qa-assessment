import { Page, Locator, expect } from '@playwright/test';

export class HomePage {
  readonly page: Page;
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly acceptCookiesButton: Locator;

  constructor(page: Page) {
    this.page = page;

    // --- CAMBIO CRÍTICO AQUÍ ---
    // Dejamos de usar getByPlaceholder porque a veces falla en este sitio.
    // Usamos getByRole que coincide con lo que vimos en tu Snapshot.
    this.searchInput = page.getByRole('combobox', { name: 'Enter a destination' });
    
    this.searchButton = page.getByRole('button', { name: 'Search' });
    this.acceptCookiesButton = page.getByRole('button', { name: 'Accept' });
  }

  async navigate() {
    await this.page.goto('https://v3.nuitee.link/');
    await expect(this.page).toHaveURL(/v3.nuitee.link/);

    // Manejo de Cookies (Ya vimos que funciona, pero lo dejamos seguro)
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
    // Hacemos click primero para asegurar el foco (Best Practice para comboboxes)
    await this.searchInput.click();
    
    // Escribimos despacio para dar tiempo a que el JS de la web reaccione
    await this.searchInput.pressSequentially(city, { delay: 100 });

    // Esperamos a que aparezca la opción en el dropdown
    // Buscamos específicamente la opción que contenga el texto de la ciudad
    const option = this.page.getByRole('option').filter({ hasText: city }).first();
    
    await option.waitFor({ state: 'visible', timeout: 10000 });
    await option.click();
  }

  async clickSearch() {
    await this.searchButton.click();
  }
}