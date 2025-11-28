import { test, expect } from '@playwright/test';
import { LiteApiClient } from '../../lib/api/LiteApiClient';

test.describe('Part 1: LiteAPI Real Workflow', () => {

  test('E2E Booking Lifecycle (Live Sandbox)', async ({ request }) => { // <--- 1. Inyectamos 'request' AQUÍ
    
    const api = new LiteApiClient(request); 

    let hotelId: string;
    let rateId: string;
    let prebookId: string;
    let bookingId: string;

    await test.step('1. Fetch list of hotels from New York (US)', async () => {
      const response = await api.getHotels('US', 'New York');
      expect(response.data).toBeDefined();
      expect(response.data.length).toBeGreaterThan(0);
      hotelId = response.data[0].id;
      console.log(`Selected Hotel ID: ${hotelId}`);
    });

   await test.step('2. Fetch rates for the selected hotel', async () => {
      const today = new Date();
      const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1);
      const dayAfter = new Date(today); dayAfter.setDate(today.getDate() + 2);
      const checkin = tomorrow.toISOString().split('T')[0];
      const checkout = dayAfter.toISOString().split('T')[0];

      const response = await api.getRates([hotelId], checkin, checkout);
      
      expect(response.data).toBeDefined();
      
      rateId = response.data[0].roomTypes[0].offerId; 
      
      console.log(`Found Offer ID: ${rateId.substring(0, 20)}...`);
    });

    await test.step('3. Pre-Book (Generate Session)', async () => {
      const response = await api.preBook(rateId);
      expect(response.data?.prebookId).toBeDefined();
      prebookId = response.data.prebookId;
      console.log(`Prebook ID: ${prebookId}`);
    });

    await test.step('4. Confirm Booking', async () => {
      const response = await api.book(prebookId);
      expect(response.data?.bookingId).toBeDefined();
      bookingId = response.data.bookingId;
      console.log(`🎉 Booking Confirmed! ID: ${bookingId}`);
    });
  });
});