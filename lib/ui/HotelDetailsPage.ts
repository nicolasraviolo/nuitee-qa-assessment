import { Page, Locator, expect } from '@playwright/test';

export class HotelDetailsPage {
    readonly page: Page;
    readonly bookButton: Locator;

    constructor(page: Page) {
        this.page = page;

        this.bookButton = page.getByRole('button', { name: /Reserve|Book|Select/i }).first();
    }

    async verifyPageLoaded() {
        await expect(this.page).toHaveURL(/.*hotels\/.*/, { timeout: 15000 });


        console.log('Info: Hotel Details Page loaded successfully.');
    }
}