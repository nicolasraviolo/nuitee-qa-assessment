import { APIRequestContext, expect } from '@playwright/test';

export class LiteApiClient {
  readonly request: APIRequestContext;
  readonly baseUrl: string;

  constructor(request: APIRequestContext) {
    this.request = request;
    this.baseUrl = process.env.BASE_URL || 'https://api.liteapi.travel/v3.0';
  }

  private async getHeaders() {
    return {
      'Content-Type': 'application/json',
      'X-API-Key': process.env.API_KEY || ''
    };
  }

  // 1. Fetch Hotels (Endpoint Real: /data/hotels)
  async getHotels(countryCode: string, cityName: string) {
    const response = await this.request.get(`${this.baseUrl}/data/hotels`, {
      headers: await this.getHeaders(),
      params: { 
        countryCode: countryCode, 
        cityName: cityName,
        limit: '10' 
      }
    });
    
    // Debug
    if (!response.ok()) {
      console.log('Error GetHotels:', await response.text());
    }
    expect(response.status()).toBe(200);
    return await response.json();
  }

  // 2. Get Rates (Endpoint Real: /hotels/rates)
  async getRates(hotelIds: string[], checkin: string, checkout: string) {
    const response = await this.request.post(`${this.baseUrl}/hotels/rates`, {
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

    // Debugging Vital: if 400, prints error details
    if (!response.ok()) {
        console.log(`Error GetRates (${response.status()}):`, await response.text());
    }

    expect(response.status()).toBe(200);
    return await response.json();
  }

// 3. PreBook (Endpoint Real: /rates/prebook)
  async preBook(rateId: string) {
    const response = await this.request.post(`${this.baseUrl}/rates/prebook`, {
      headers: await this.getHeaders(),
      data: { 
        offerId: rateId  
      }
    });

    if (!response.ok()) {
      console.log(`Error PreBook (${response.status()}):`, await response.text());
    }

    expect(response.status()).toBe(200);
    return await response.json();
  }

  // 4. Book (Endpoint Real: /rates/book)
  async book(prebookId: string) {
    const response = await this.request.post(`${this.baseUrl}/rates/book`, {
      headers: await this.getHeaders(),
      data: {
        prebookId: prebookId,
        holder: {
            firstName: "Test",
            lastName: "QA",
            email: "qa@example.com"
        },
        payment: {
            method: "ACC_CREDIT_CARD"
        }
      }
    });

    // Debugging Vital: if not ok, prints error details
    if (!response.ok()) {
      console.log(`Error Book (${response.status()}):`, await response.text());
    }
    // ---------------------

    expect([200, 201]).toContain(response.status());
    return await response.json();
  }}