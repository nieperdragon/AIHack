import { test, expect } from '@playwright/test';
import { LoginPage } from '../PageObjects_new/LoginPage';
import { DashboardPage } from '../PageObjects_new/DashboardPage';
import { LeavePage } from '../PageObjects_new/LeavePage';

// Test data - Updated per 2025-07-05 Meeting Notes
const standardUser = { username: 'standard_user', password: 'password123' }; // Replace with real creds
const adminUser = { username: 'Admin', password: 'admin123' }; // Replace with real creds
const managerUser = { username: 'manager_user', password: 'manager123' }; // Added per meeting notes - Replace with real creds
const leaveData = {
    leaveType: 'Annual Leave',
    fromDate: '2025-07-01',
    toDate: '2025-07-03',
    comment: 'Vacation'
};

test.describe.configure({ mode: 'serial' }); // Run tests serially for clarity

test.describe('Leave Application - Updated per 2025-07-05 Meeting', () => {
    test('Standard user can apply for leave (positive scenario)', async ({ page, browserName }) => {
        test.skip(browserName !== 'chromium', 'Run only on Chromium');
        const loginPage = new LoginPage(page);
        await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
        await expect(loginPage.usernameInput).toBeVisible();
        await loginPage.login(standardUser.username, standardUser.password);

        const dashboardPage = new DashboardPage(page);
        await expect(dashboardPage.quickLaunch.applyLeave).toBeVisible();
        await dashboardPage.quickLaunch.applyLeave.click();

        const leavePage = new LeavePage(page);
        await expect(leavePage.applyLeaveForm.leaveType).toBeVisible();
        await leavePage.applyForLeave(leaveData);

        // Verify success message
        await expect(leavePage.applyLeaveForm.successMessage).toBeVisible();
    });

    test('Manager user can apply for leave (positive scenario) - Added per 2025-07-05 Meeting', async ({ page, browserName }) => {
        test.skip(browserName !== 'chromium', 'Run only on Chromium');
        const loginPage = new LoginPage(page);
        await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
        await expect(loginPage.usernameInput).toBeVisible();
        await loginPage.login(managerUser.username, managerUser.password);

        const dashboardPage = new DashboardPage(page);
        // Manager should have access to Apply Leave functionality
        await expect(dashboardPage.quickLaunch.applyLeave).toBeVisible();
        await dashboardPage.quickLaunch.applyLeave.click();

        const leavePage = new LeavePage(page);
        await expect(leavePage.applyLeaveForm.leaveType).toBeVisible();
        await leavePage.applyForLeave(leaveData);

        // Verify success message
        await expect(leavePage.applyLeaveForm.successMessage).toBeVisible();
    });

    test('Standard user cannot apply for leave with invalid data (negative scenario)', async ({ page, browserName }) => {
        test.skip(browserName !== 'chromium', 'Run only on Chromium');
        const loginPage = new LoginPage(page);
        await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
        await expect(loginPage.usernameInput).toBeVisible();
        await loginPage.login(standardUser.username, standardUser.password);

        const dashboardPage = new DashboardPage(page);
        await expect(dashboardPage.quickLaunch.applyLeave).toBeVisible();
        await dashboardPage.quickLaunch.applyLeave.click();

        const leavePage = new LeavePage(page);
        await expect(leavePage.applyLeaveForm.applyButton).toBeVisible();
        // Missing leave type and dates
        await leavePage.applyLeaveForm.applyButton.click();

        // Verify error message
        await expect(leavePage.applyLeaveForm.errorMessage).toBeVisible();
    });

    test('Manager user cannot apply for leave with invalid data (negative scenario) - Added per 2025-07-05 Meeting', async ({ page, browserName }) => {
        test.skip(browserName !== 'chromium', 'Run only on Chromium');
        const loginPage = new LoginPage(page);
        await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
        await expect(loginPage.usernameInput).toBeVisible();
        await loginPage.login(managerUser.username, managerUser.password);

        const dashboardPage = new DashboardPage(page);
        await expect(dashboardPage.quickLaunch.applyLeave).toBeVisible();
        await dashboardPage.quickLaunch.applyLeave.click();

        const leavePage = new LeavePage(page);
        await expect(leavePage.applyLeaveForm.applyButton).toBeVisible();
        // Missing leave type and dates - should fail for manager too
        await leavePage.applyLeaveForm.applyButton.click();

        // Verify error message
        await expect(leavePage.applyLeaveForm.errorMessage).toBeVisible();
    });

    test('Admin user cannot apply for leave (negative scenario)', async ({ page, browserName }) => {
        test.skip(browserName !== 'chromium', 'Run only on Chromium');
        const loginPage = new LoginPage(page);
        await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
        await expect(loginPage.usernameInput).toBeVisible();
        await loginPage.login(adminUser.username, adminUser.password);

        const dashboardPage = new DashboardPage(page);
        // Try to click Apply Leave (should not be visible or should fail)
        const isVisible = await dashboardPage.quickLaunch.applyLeave.isVisible();
        expect(isVisible).toBeFalsy();
    });

    // Additional test for comprehensive role validation per meeting notes
    test('Role-based access validation for all user types - Added per 2025-07-05 Meeting', async ({ page, browserName }) => {
        test.skip(browserName !== 'chromium', 'Run only on Chromium');
        
        // Test data for role validation
        const userRoles = [
            { user: standardUser, shouldHaveAccess: true, role: 'Standard User' },
            { user: managerUser, shouldHaveAccess: true, role: 'Manager User' },
            { user: adminUser, shouldHaveAccess: false, role: 'Admin User' }
        ];

        for (const roleTest of userRoles) {
            // Navigate to login page
            await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
            
            const loginPage = new LoginPage(page);
            await expect(loginPage.usernameInput).toBeVisible();
            await loginPage.login(roleTest.user.username, roleTest.user.password);

            const dashboardPage = new DashboardPage(page);
            
            // Check if Apply Leave is visible based on role
            const isApplyLeaveVisible = await dashboardPage.quickLaunch.applyLeave.isVisible();
            
            if (roleTest.shouldHaveAccess) {
                expect(isApplyLeaveVisible, `${roleTest.role} should have access to Apply Leave`).toBeTruthy();
            } else {
                expect(isApplyLeaveVisible, `${roleTest.role} should NOT have access to Apply Leave`).toBeFalsy();
            }

            // Logout for next iteration (if logout functionality exists)
            // await dashboardPage.logout(); // Uncomment if logout method exists
        }
    });
});
