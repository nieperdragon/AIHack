import { test, expect } from '@playwright/test';
import { LoginPage } from '../PageObjects/LoginPage';
import { DashboardPage } from '../PageObjects/DashboardPage';
import { PIMPage } from '../PageObjects/PIMPage';

test.describe('Page Objects Validation', () => {
    let loginPage: LoginPage;
    let dashboardPage: DashboardPage;
    let pimPage: PIMPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        dashboardPage = new DashboardPage(page);
        pimPage = new PIMPage(page);
    });

    test('should validate LoginPage functionality', async ({ page }) => {
        await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
        
        // Test login page elements
        await expect(loginPage.usernameInput).toBeVisible();
        await expect(loginPage.passwordInput).toBeVisible();
        await expect(loginPage.loginButton).toBeVisible();
        await expect(loginPage.forgotPasswordLink).toBeVisible();
        
        // Test login functionality
        const credentials = await loginPage.getDefaultCredentials();
        await loginPage.login(credentials.username, credentials.password);
        
        // Verify successful login
        await expect(page).toHaveURL(/.*\/dashboard\/index/);
    });

    test('should validate DashboardPage functionality', async ({ page }) => {
        // Login first
        await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
        const credentials = await loginPage.getDefaultCredentials();
        await loginPage.login(credentials.username, credentials.password);
        
        // Wait for dashboard to load
        await dashboardPage.waitForDashboard();
        
        // Test navigation elements
        await expect(dashboardPage.navigation.pim).toBeVisible();
        await expect(dashboardPage.navigation.leave).toBeVisible();
        await expect(dashboardPage.navigation.time).toBeVisible();
        
        // Test top bar elements
        await expect(dashboardPage.topBar.searchBox).toBeVisible();
        await expect(dashboardPage.topBar.userProfileButton).toBeVisible();
        
        // Test dashboard content
        await expect(dashboardPage.timeAtWork.punchStatus).toBeVisible();
        await expect(dashboardPage.quickLaunch.assignLeave).toBeVisible();
        
        // Test navigation functionality
        await dashboardPage.navigateTo('pim');
        await expect(page).toHaveURL(/.*\/pim\/viewEmployeeList/);
    });

    test('should validate PIMPage functionality', async ({ page }) => {
        // Login and navigate to PIM
        await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
        const credentials = await loginPage.getDefaultCredentials();
        await loginPage.login(credentials.username, credentials.password);
        
        await dashboardPage.navigateTo('pim');
        await pimPage.waitForPIMPage();
        
        // Test PIM page elements
        await expect(pimPage.pageTitle).toBeVisible();
        await expect(pimPage.addButton).toBeVisible();
        await expect(pimPage.searchForm.searchButton).toBeVisible();
        await expect(pimPage.searchForm.resetButton).toBeVisible();
        
        // Test search functionality
        await pimPage.searchEmployees({ employeeName: 'Admin' });
        await expect(pimPage.employeeTable.table).toBeVisible();
        
        // Test reset functionality
        await pimPage.resetSearch();
        
        // Test employee table
        const employeeCount = await pimPage.getEmployeeCount();
        expect(employeeCount).toBeGreaterThan(0);
    });

    test('should validate logout functionality', async ({ page }) => {
        // Login first
        await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
        const credentials = await loginPage.getDefaultCredentials();
        await loginPage.login(credentials.username, credentials.password);
        
        await dashboardPage.waitForDashboard();
        
        // Test logout
        await dashboardPage.logout();
        
        // Verify logout was successful
        await expect(loginPage.usernameInput).toBeVisible();
        await expect(page).toHaveURL(/.*\/auth\/login/);
    });

    test('should validate complete workflow', async ({ page }) => {
        // Complete workflow: Login -> Dashboard -> PIM -> Logout
        await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
        
        // Step 1: Login
        const credentials = await loginPage.getDefaultCredentials();
        await loginPage.login(credentials.username, credentials.password);
        await dashboardPage.waitForDashboard();
        
        // Step 2: Navigate to PIM
        await dashboardPage.navigateTo('pim');
        await pimPage.waitForPIMPage();
        
        // Step 3: Search for employees
        await pimPage.searchEmployees({ employeeName: 'Admin' });
        await expect(pimPage.employeeTable.table).toBeVisible();
        
        // Step 4: Navigate back to dashboard
        await dashboardPage.navigateTo('dashboard');
        await dashboardPage.waitForDashboard();
        
        // Step 5: Logout
        await dashboardPage.logout();
        await expect(loginPage.usernameInput).toBeVisible();
    });
}); 