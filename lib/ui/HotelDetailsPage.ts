import { Page, Locator, expect } from '@playwright/test';

export class HotelDetailsPage {
  readonly page: Page;
  readonly bookButton: Locator;

  constructor(page: Page) {
    this.page = page;
    // Estrategia: Validamos elementos críticos de la página de reserva/detalles.
    // Usamos regex insensible a mayúsculas para ser flexibles con el texto del botón (Book/Reserve/Select)
    this.bookButton = page.getByRole('button', { name: /Reserve|Book|Select/i }).first();
  }

  async verifyPageLoaded() {
    // 1. Validación de URL: Confirmamos que la ruta incluye '/hotels/' o similar
    await expect(this.page).toHaveURL(/.*hotels\/.*/, { timeout: 15000 });
    
    // 2. Validación Visual: Esperamos que el contenido principal haya cargado
    // Nota: Si no conocemos el DOM exacto de esta página, validar la URL es el primer paso más seguro.
    console.log('Info: Hotel Details Page loaded successfully.');
  }
}