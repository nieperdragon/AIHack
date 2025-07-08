import { test, expect } from '@playwright/test';
import { LoginPage } from '../PageObjects/LoginPage';
import { DashboardPage } from '../PageObjects/DashboardPage';
import { PIMPage } from '../PageObjects/PIMPage';
import { LeavePage } from '../PageObjects/LeavePage';

test.describe('OrangeHRM Page Objects Test Suite', () => {
    test('should verify all page objects are working', async ({ page }) => {
        // Start with login
        const loginPage = new LoginPage(page);
        await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
        
        // Get default credentials and login
        const credentials = await loginPage.getDefaultCredentials();
        await loginPage.login(credentials.username, credentials.password);
        
        // Verify dashboard page objects
        const dashboardPage = new DashboardPage(page);
        await expect(dashboardPage.quickLaunch.assignLeave).toBeVisible();
        await expect(dashboardPage.quickLaunch.leaveList).toBeVisible();
        
        // Get time at work summary
        const timeAtWork = await dashboardPage.getTimeAtWorkSummary();
        expect(timeAtWork).toBeDefined();
        
        // Get pending actions
        const pendingActions = await dashboardPage.getPendingActions();
        expect(pendingActions).toBeDefined();
        
        // Navigate to PIM and test PIM page objects
        await dashboardPage.navigateTo('pim');
        const pimPage = new PIMPage(page);
        
        await expect(pimPage.pageTitle).toBeVisible();
        await expect(pimPage.addEmployee.button).toBeVisible();
        
        // Test employee search
        await pimPage.searchEmployees({
            name: 'Admin'
        });
        await page.waitForTimeout(1000); // Wait for search results
        
        // Reset search
        await pimPage.resetSearch();
        await page.waitForTimeout(1000); // Wait for reset
        
        // Test add employee form (without actually saving)        await pimPage.addEmployee.button.click();
        await expect(pimPage.addEmployee.form.firstName).toBeVisible();
        await expect(pimPage.addEmployee.form.lastName).toBeVisible();
        await pimPage.addEmployee.form.cancelButton.click();
        
        // Navigate to Leave and test Leave page objects
        await dashboardPage.navigateTo('leave');
        const leavePage = new LeavePage(page);
        
        await expect(leavePage.pageTitle).toBeVisible();
        
        // Test leave list search
        await leavePage.searchLeave({
            status: ['Pending Approval'],
            fromDate: '2025-01-01',
            toDate: '2025-12-31'
        });
        await page.waitForTimeout(1000); // Wait for search results
        
        // Test apply leave form (without actually applying)
        await leavePage.applyLeave.button.click();
        await expect(leavePage.applyLeave.form.leaveType).toBeVisible();
        await expect(leavePage.applyLeave.form.fromDate).toBeVisible();
        await expect(leavePage.applyLeave.form.toDate).toBeVisible();
    });
});
