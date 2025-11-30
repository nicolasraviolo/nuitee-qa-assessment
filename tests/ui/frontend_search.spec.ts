import { test, expect } from '@playwright/test';
import { HomePage } from '../../lib/ui/HomePage';
import { HotelDetailsPage } from '../../lib/ui/HotelDetailsPage';

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

      // 2. Validate content using Accessibility Roles
      const hotelHeaders = page.getByRole('heading', { level: 3 });

      // Wait for data to load
      await expect(hotelHeaders.first()).toBeVisible({ timeout: 20000 });

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
      // Pass false to indicate we don't expect a dropdown selection
      await home.searchHotel('InvalidCity123', false);
    });

    await test.step('Verify No Results Message', async () => {
      await expect(home.noResultsMessage).toBeVisible({ timeout: 10000 });
      console.log('@edge Validation Success: "No results found" message displayed.');
    });
  });

  // --- SCENARIO 3: BOOKING FLOW START (P0) ---
  test('Booking: User can select a hotel and proceed to details @booking', async ({ page }) => {
    const home = new HomePage(page);

    await test.step('Navigate to Home Page', async () => {
      await home.navigate();
      // Wait for Recommended hotels to ensure page readiness without relying on search
      await expect(page.getByRole('heading', { name: 'Recommended hotels' })).toBeVisible();
    });

    await test.step('Select First Available Hotel', async () => {
      // Prepare for the new tab (popup) opening
      const popupPromise = page.waitForEvent('popup');

      // Click on the first hotel card link found
      await page.locator('a[href^="/hotels/"]').first().click();

      // Get the new page reference
      const newPage = await popupPromise;

      // Ensure the new page is ready
      await newPage.waitForLoadState('domcontentloaded');

      // Use the POM with the NEW page context
      const details = new HotelDetailsPage(newPage);
      await details.verifyPageLoaded();

      console.log('Info: Booking flow navigation successful on new tab.');

      // Close the tab (optional cleanup)
      await newPage.close();
    });
  });

  // --- SCENARIO 4: RESPONSIVENESS (P1) ---
  test.describe('Mobile Tests', () => {
    test.use({ viewport: { width: 390, height: 844 }, isMobile: true });

    test('Layout: Verify Search Bar visibility on Mobile (iPhone 12) @responsive', async ({ page }) => {
      const home = new HomePage(page);

      await test.step('Navigate to Home Page on Mobile', async () => {
        await home.navigate();
      });

      await test.step('Verify Core Elements are Visible', async () => {
        // On mobile, assertions might differ
        await home.verifyMobileLayout();
        console.log('@responsive Check Success: Search elements visible on mobile viewport.');
      });
    });
  });

});