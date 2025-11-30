import { APIRequestContext, APIResponse } from '@playwright/test';

export class LiteApiClient {
  readonly request: APIRequestContext;
  readonly baseUrl: string;

  constructor(request: APIRequestContext) {
    this.request = request;
    this.baseUrl = process.env.BASE_URL || 'https://api.liteapi.travel/v3.0';
  }

  // Helper: Generates headers. Accepts a custom key for negative testing (Security Scenarios).
  private async getHeaders(customKey?: string) {
    return {
      'Content-Type': 'application/json',
      'X-API-Key': customKey ?? (process.env.API_KEY || '')
    };
  }

  // 1. Fetch Hotels Endpoint
  async getHotels(countryCode: string, cityName: string, apiKey?: string): Promise<APIResponse> {
    return await this.request.get(`${this.baseUrl}/data/hotels`, {
      headers: await this.getHeaders(apiKey),
      params: { 
        countryCode: countryCode, 
        cityName: cityName,
        limit: '10' 
      }
    });
  }

  // 2. Get Rates Endpoint
  async getRates(hotelIds: string[], checkin: string, checkout: string): Promise<APIResponse> {
    return await this.request.post(`${this.baseUrl}/hotels/rates`, {
      headers: await this.getHeaders(),
      data: {
        hotelIds: hotelIds,
        checkin: checkin,
        checkout: checkout,
        occupancies: [{ adults: 2, children: [] }],
        currency: "USD",
        guestNationality: "US"
      }
    });
  }

  // 3. PreBook Endpoint
  async preBook(offerId: string): Promise<APIResponse> {
    return await this.request.post(`${this.baseUrl}/rates/prebook`, {
      headers: await this.getHeaders(),
      data: { offerId: offerId }
    });
  }

  // 4. Book Endpoint
  async book(prebookId: string, holder?: any): Promise<APIResponse> {
    // Default guest data for Happy Path if no specific holder is provided
    const defaultHolder = {
        firstName: "Test",
        lastName: "QA",
        email: "qa@example.com"
    };

    return await this.request.post(`${this.baseUrl}/rates/book`, {
      headers: await this.getHeaders(),
      data: {
        prebookId: prebookId,
        holder: holder || defaultHolder,
        payment: { method: "ACC_CREDIT_CARD" }
      }
    });
  }

  // 5. Cancel Endpoint
  async cancelBooking(bookingId: string): Promise<APIResponse> {
    return await this.request.delete(`${this.baseUrl}/bookings/${bookingId}`, {
      headers: await this.getHeaders()
    });
  }
}