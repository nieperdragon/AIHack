import { Page, expect } from '@playwright/test';

export class LoginPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto('https://automationintesting.online');
    // Click the Admin tab to open the login form
    await this.page.click('text=Admin');
    await this.page.waitForSelector('#username');
  }

  async login(username: string, password: string) {
    await this.page.fill('#username', username);
    await this.page.fill('#password', password);
    await this.page.click('button[type="submit"]');
  }

  async isLoggedIn() {
    // Check for a reasonable indicator of successful login
    // e.g., presence of a logout button or user greeting
    return this.page.isVisible('text=Logout');
  }
} 