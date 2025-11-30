import { test, expect } from '@playwright/test';
import { HomePage } from '../../lib/ui/HomePage';

test.describe('Frontend Automation Strategy Implementation', () => {

  // --- SCENARIO 1: HAPPY PATH (P0) ---
  test('Search: User can search for a valid city (Paris) @happy', async ({ page }) => {
    const home = new HomePage(page);

    await test.step('Navigate to Home Page', async () => {
      await home.navigate();
    });

    await test.step('Search for "Paris"', async () => {
      await home.searchHotel('Paris');
      await home.clickSearch();
    });

    await test.step('Verify Search Results', async () => {
      // 1. Validate URL change to the results page
      await expect(page).toHaveURL(/.*hotels\?/);
      
      // 2. Validate content using Accessibility Roles (Heading Level 3 for Hotel Names)
      // This is more robust than CSS classes like '.hotel-card'
      const hotelHeaders = page.getByRole('heading', { level: 3 });
      
      // Wait for data to load (handling spinners/network latency)
      await expect(hotelHeaders.first()).toBeVisible({ timeout: 20000 });
      
      // 3. Report findings
      const count = await hotelHeaders.count();
      console.log(`@happy Search Success: Found ${count} hotels visible.`);
    });
  });

  // --- SCENARIO 2: EDGE CASE (P2) ---
  test('Search: System handles invalid city names gracefully @edge', async ({ page }) => {
    const home = new HomePage(page);

    await test.step('Navigate to Home Page', async () => {
      await home.navigate();
    });

  await test.step('Search for invalid city "InvalidCity123"', async () => {
       // We pass 'false' to hit Enter instead of clicking a dropdown option.
       // This usually triggers the search submission automatically.
       await home.searchHotel('InvalidCity123', false); 
       
       // REMOVED: await home.clickSearch(); 
       // Reason: Pressing Enter often submits the form. Clicking immediately after can cause race conditions.
    });

    await test.step('Verify No Results Message', async () => {
      // Expect the UI to show a friendly message, not crash
      await expect(home.noResultsMessage).toBeVisible({ timeout: 10000 });
      console.log('@edge Validation Success: "No results found" message displayed.');
    });
  });

  // --- SCENARIO 3: RESPONSIVENESS (P1) ---
  // We use test.use() to simulate a Mobile Viewport for this specific test
  test('Layout: Verify Search Bar visibility on Mobile (iPhone 12) @responsive', async ({ page }) => {
    // Override viewport for iPhone 12 Pro dimensions
    await page.setViewportSize({ width: 390, height: 844 });
    
    const home = new HomePage(page);

    await test.step('Navigate to Home Page on Mobile', async () => {
      await home.navigate();
    });

await test.step('Verify Core Elements are Visible', async () => {
       // On mobile, elements often stack or change. 
       // We delegate to the POM which handles the responsive DOM differences.
       await home.verifyMobileLayout();
       
       console.log('@responsive Check Success: Search elements visible on mobile viewport.');
    });
  });

});