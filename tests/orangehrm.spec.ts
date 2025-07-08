import { test, expect } from '@playwright/test';
import { LoginPage } from '../PageObjects/LoginPage';
import { DashboardPage } from '../PageObjects/DashboardPage';
import { PIMPage } from '../PageObjects/PIMPage';
import { LeavePage } from '../PageObjects/LeavePage';

test.describe('OrangeHRM Page Objects', () => {
    test('should validate login and navigation', async ({ page }) => {
        const loginPage = new LoginPage(page);
        await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
        
        const credentials = await loginPage.getDefaultCredentials();
        await loginPage.login(credentials.username, credentials.password);
        
        // Verify login successful by checking dashboard
        const dashboardPage = new DashboardPage(page);
        await expect(dashboardPage.timeAtWork.punchStatus).toBeVisible();
    });

    test('should validate dashboard elements', async ({ page }) => {
        const loginPage = new LoginPage(page);
        const dashboardPage = new DashboardPage(page);

        await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
        const credentials = await loginPage.getDefaultCredentials();
        await loginPage.login(credentials.username, credentials.password);

        await expect(dashboardPage.quickLaunch.assignLeave).toBeVisible();
        await expect(dashboardPage.quickLaunch.leaveList).toBeVisible();
        
        const timeAtWork = await dashboardPage.getTimeAtWorkSummary();
        expect(timeAtWork.status).toBeDefined();
        expect(timeAtWork.todayHours).toBeDefined();
        
        const pendingActions = await dashboardPage.getPendingActions();
        expect(pendingActions.reviews).toBeGreaterThanOrEqual(0);
        expect(pendingActions.interviews).toBeGreaterThanOrEqual(0);
    });

    test('should validate PIM module', async ({ page }) => {
        const loginPage = new LoginPage(page);
        const dashboardPage = new DashboardPage(page);
        const pimPage = new PIMPage(page);

        await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
        const credentials = await loginPage.getDefaultCredentials();
        await loginPage.login(credentials.username, credentials.password);

        await dashboardPage.navigateTo('pim');
        await expect(pimPage.pageTitle).toBeVisible();
        
        // Test search functionality
        await pimPage.searchEmployees({ name: 'Admin' });
        await expect(pimPage.employeeList.table.rows).toBeVisible();
        
        // Test reset functionality
        await pimPage.resetSearch();
    });

    test('should validate Leave module', async ({ page }) => {
        const loginPage = new LoginPage(page);
        const dashboardPage = new DashboardPage(page);
        const leavePage = new LeavePage(page);

        await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
        const credentials = await loginPage.getDefaultCredentials();
        await loginPage.login(credentials.username, credentials.password);

        await dashboardPage.navigateTo('leave');
        await expect(leavePage.pageTitle).toBeVisible();
        
        // Test leave list search
        await leavePage.searchLeave({
            status: ['Pending Approval'],
            fromDate: '2025-01-01',
            toDate: '2025-12-31'
        });
        
        // Verify search form elements
        await expect(leavePage.leaveList.searchForm.fromDate).toBeVisible();
        await expect(leavePage.leaveList.searchForm.toDate).toBeVisible();
    });
});
