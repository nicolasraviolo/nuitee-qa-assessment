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
      // 1. URL validation
      await expect(page).toHaveURL(/.*hotels\?/);
      
      // 2. Check that hotel results are visible
      const hotelHeaders = page.getByRole('heading', { level: 3 });
      
      // Esperamos a que aparezca el primer nombre de hotel
      await expect(hotelHeaders.first()).toBeVisible({ timeout: 20000 });
      
      // 3. Count visible hotels
      const count = await hotelHeaders.count();
      console.log(`Frontend Search: Success! Found ${count} hotels visible.`);
      
      // Optional: Log the name of the first hotel found
      console.log(`First hotel found: ${await hotelHeaders.first().innerText()}`);
    });
  });
});