import { test, expect } from '@playwright/test';
import { HomePage } from '../../lib/ui/HomePage';

test.describe('Part 2: Frontend Automation', () => {
  
  test('User can search for hotels in Paris', async ({ page }) => {
    const home = new HomePage(page);

    await test.step('Navigate to Home Page', async () => {
      await home.navigate();
    });

    await test.step('Search for "Paris"', async () => {
      await home.searchHotel('Paris');
      await home.clickSearch();
    });

await test.step('Verify Search Results', async () => {
      // 1. Validamos la URL (Esto ya vimos que funciona)
      await expect(page).toHaveURL(/.*hotels\?/);
      
      // 2. CORRECCIÓN SENIOR: Usamos Roles Semánticos
      // En lugar de buscar una clase CSS que puede cambiar o no existir,
      // buscamos los encabezados H3 que contienen los nombres de los hoteles.
      const hotelHeaders = page.getByRole('heading', { level: 3 });
      
      // Esperamos a que aparezca el primer nombre de hotel
      await expect(hotelHeaders.first()).toBeVisible({ timeout: 20000 });
      
      // 3. Reporting: Contamos y mostramos cuántos hoteles se encontraron
      const count = await hotelHeaders.count();
      console.log(`Frontend Search: Success! Found ${count} hotels visible.`);
      
      // Opcional: Imprimir el nombre del primero para confirmar
      console.log(`First hotel found: ${await hotelHeaders.first().innerText()}`);
    });
  });
});