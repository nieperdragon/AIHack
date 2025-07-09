import { test, expect } from '@playwright/test';
import { LoginPage } from '../RestFulBooker/LoginPage';

test.describe('Restful Booker Login', () => {
  test('should log in with valid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('admin', 'password');
    const loggedIn = await loginPage.isLoggedIn();
    expect(loggedIn).toBeTruthy();
  });
}); 