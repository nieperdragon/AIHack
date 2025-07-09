import { test, expect } from '@playwright/test';
import { LoginPage } from '../PageObjects/LoginPage';
import { DashboardPage } from '../PageObjects/DashboardPage';
import { BasePage } from '../PageObjects/BasePage';

test.describe('OrangeHRM Logout Functionality', () => {
    let loginPage: LoginPage;
    let dashboardPage: DashboardPage;
    let basePage: BasePage;

    test.beforeEach(async ({ page }) => {
        // Setup page objects
        loginPage = new LoginPage(page);
        dashboardPage = new DashboardPage(page);
        basePage = new BasePage(page);

        // Mock API responses for consistent test behavior
        await page.route('**/api/auth/login', (route) => {
            route.fulfill({
                status: 200,
                body: JSON.stringify({ 
                    message: 'Login successful',
                    user: { username: 'Admin', role: 'Admin' }
                })
            });
        });

        await page.route('**/api/auth/logout', (route) => {
            route.fulfill({
                status: 200,
                body: JSON.stringify({ message: 'Logout successful' })
            });
        });

        // Navigate to login page
        await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
    });

    test('should successfully logout from dashboard', async ({ page }) => {
        // Login first
        const credentials = await loginPage.getDefaultCredentials();
        await loginPage.login(credentials.username, credentials.password);
        
        // Verify successful login by checking dashboard elements
        await expect(dashboardPage.timeAtWork.punchStatus).toBeVisible();
        
        // Perform logout
        await basePage.logout();
        
        // Verify logout was successful by checking login page elements
        await expect(loginPage.usernameInput).toBeVisible();
        await expect(loginPage.passwordInput).toBeVisible();
        await expect(loginPage.loginButton).toBeVisible();
        
        // Verify URL redirects to login page
        await expect(page).toHaveURL(/.*\/auth\/login/);
    });

    test('should logout from different modules and return to login page', async ({ page }) => {
        // Login first
        const credentials = await loginPage.getDefaultCredentials();
        await loginPage.login(credentials.username, credentials.password);
        
        // Navigate to different modules and test logout from each
        const modules = ['pim', 'leave', 'time', 'recruitment'] as const;
        
        for (const module of modules) {
            // Navigate to module
            await basePage.navigateTo(module);
            
            // Verify module page is loaded
            await expect(page).toHaveURL(new RegExp(`.*/${module}.*`));
            
            // Perform logout
            await basePage.logout();
            
            // Verify logout was successful
            await expect(loginPage.usernameInput).toBeVisible();
            await expect(page).toHaveURL(/.*\/auth\/login/);
            
            // Login again for next iteration
            await loginPage.login(credentials.username, credentials.password);
        }
    });

    test('should handle logout with pending actions gracefully', async ({ page }) => {
        // Login first
        const credentials = await loginPage.getDefaultCredentials();
        await loginPage.login(credentials.username, credentials.password);
        
        // Navigate to dashboard and verify pending actions are visible
        await expect(dashboardPage.myActions.pendingSelfReview).toBeVisible();
        await expect(dashboardPage.myActions.candidateToInterview).toBeVisible();
        
        // Perform logout
        await basePage.logout();
        
        // Verify logout was successful regardless of pending actions
        await expect(loginPage.usernameInput).toBeVisible();
        await expect(loginPage.passwordInput).toBeVisible();
        await expect(page).toHaveURL(/.*\/auth\/login/);
    });

    test('should verify user menu opens before logout', async ({ page }) => {
        // Login first
        const credentials = await loginPage.getDefaultCredentials();
        await loginPage.login(credentials.username, credentials.password);
        
        // Open user menu manually to verify it works
        await basePage.openUserMenu();
        
        // Verify logout option is visible in user menu
        await expect(page.getByRole('menuitem', { name: 'Logout' })).toBeVisible();
        
        // Perform logout
        await basePage.logout();
        
        // Verify logout was successful
        await expect(loginPage.usernameInput).toBeVisible();
        await expect(page).toHaveURL(/.*\/auth\/login/);
    });

    test('should prevent access to protected pages after logout', async ({ page }) => {
        // Login first
        const credentials = await loginPage.getDefaultCredentials();
        await loginPage.login(credentials.username, credentials.password);
        
        // Perform logout
        await basePage.logout();
        
        // Try to access dashboard directly after logout
        await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index');
        
        // Verify user is redirected to login page
        await expect(loginPage.usernameInput).toBeVisible();
        await expect(page).toHaveURL(/.*\/auth\/login/);
        
        // Verify dashboard elements are not accessible
        await expect(dashboardPage.timeAtWork.punchStatus).not.toBeVisible();
    });
}); 