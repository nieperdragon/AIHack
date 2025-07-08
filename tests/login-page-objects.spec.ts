import { test, expect } from '@playwright/test';
import { LoginPage } from '../PageObjects/LoginPage';

test.describe('OrangeHRM Login Page Tests', () => {
    test('should verify page objects are accessible', async ({ page }) => {
        const loginPage = new LoginPage(page);
        
        // Navigate to the login page
        await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
        
        // Verify base page elements
        await expect(loginPage.logo).toBeVisible();
        await expect(loginPage.footerVersion).toBeVisible();
        await expect(loginPage.footerCopyright).toBeVisible();
        
        // Verify login page elements
        await expect(loginPage.usernameInput).toBeVisible();
        await expect(loginPage.passwordInput).toBeVisible();
        await expect(loginPage.loginButton).toBeVisible();
        await expect(loginPage.forgotPasswordLink).toBeVisible();
        
        // Verify credentials hint
        const credentials = await loginPage.getDefaultCredentials();
        expect(credentials.username).toBe('Admin');
        expect(credentials.password).toBe('admin123');
        
        // Test login functionality
        await loginPage.login(credentials.username, credentials.password);
        
        // Verify we've logged in successfully by checking the URL
        await expect(page).toHaveURL(/.*\/dashboard/);
    });
});
