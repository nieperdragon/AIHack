import { test, expect } from '@playwright/test';
import { LoginPage } from '../PageObjects/LoginPage';
import { DashboardPage } from '../PageObjects/DashboardPage';
import { AdminPage } from '../PageObjects/AdminPage';
import { PIMPage } from '../PageObjects/PIMPage';
import { LeavePage } from '../PageObjects/LeavePage';
import { TimePage } from '../PageObjects/TimePage';
import { RecruitmentPage } from '../PageObjects/RecruitmentPage';
import { PerformancePage } from '../PageObjects/PerformancePage';
import { DirectoryPage } from '../PageObjects/DirectoryPage';

test.describe('OrangeHRM Page Objects', () => {
    let loginPage: LoginPage;
    let dashboardPage: DashboardPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        dashboardPage = new DashboardPage(page);

        await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
        const credentials = await loginPage.getDefaultCredentials();
        await loginPage.login(credentials.username, credentials.password);
    });

    test('should validate Admin module', async ({ page }) => {
        const adminPage = new AdminPage(page);
        await dashboardPage.navigateTo('admin');

        await expect(adminPage.pageTitle).toBeVisible();

        // Test user management search
        await adminPage.searchUsers({
            username: 'Admin',
            userRole: 'Admin'
        });
        await expect(adminPage.userManagement.users.table.rows.first()).toBeVisible();

        // Test navigation to different sections
        await adminPage.navigateToJobSection('jobTitles');
        await adminPage.navigateToOrganization('generalInfo');
        await adminPage.navigateToQualifications('skills');
    });

    test('should validate PIM module', async ({ page }) => {
        const pimPage = new PIMPage(page);
        await dashboardPage.navigateTo('pim');

        await expect(pimPage.pageTitle).toBeVisible();

        // Test employee search
        await pimPage.searchEmployees({ name: 'Admin' });
        await expect(pimPage.employeeList.table.rows.first()).toBeVisible();

        await pimPage.resetSearch();
    });

    test('should validate Leave module', async ({ page }) => {
        const leavePage = new LeavePage(page);
        await dashboardPage.navigateTo('leave');

        await expect(leavePage.pageTitle).toBeVisible();

        // Test leave search
        await leavePage.searchLeave({
            fromDate: '2025-01-01',
            toDate: '2025-12-31',
            status: ['Pending Approval']
        });
    });

    test('should validate Time module', async ({ page }) => {
        const timePage = new TimePage(page);
        await dashboardPage.navigateTo('time');

        await expect(timePage.pageTitle).toBeVisible();

        // Test attendance records
        await timePage.viewAttendanceRecords('2025-06-20');
        
        // Test timesheets
        await timePage.viewMyTimesheet('2025-06-20');
    });

    test('should validate Recruitment module', async ({ page }) => {
        const recruitmentPage = new RecruitmentPage(page);
        await dashboardPage.navigateTo('recruitment');

        await expect(recruitmentPage.pageTitle).toBeVisible();

        // Test candidate search
        await recruitmentPage.searchCandidates({
            dateFrom: '2025-01-01',
            dateTo: '2025-12-31'
        });
        await recruitmentPage.resetCandidateSearch();

        // Test vacancy search
        await recruitmentPage.searchVacancies({});
        await recruitmentPage.resetVacancySearch();
    });

    test('should validate Performance module', async ({ page }) => {
        const performancePage = new PerformancePage(page);
        await dashboardPage.navigateTo('performance');

        await expect(performancePage.pageTitle).toBeVisible();

        // Test tracker search
        await performancePage.searchMyTrackers({
            fromDate: '2025-01-01',
            toDate: '2025-12-31'
        });
        await performancePage.resetMyTrackerSearch();

        // Test navigation
        await performancePage.navigateToConfiguration('kpis');
        await performancePage.navigateToReviews('myReviews');
    });

    test('should validate Directory module', async ({ page }) => {
        const directoryPage = new DirectoryPage(page);
        await dashboardPage.navigateTo('directory');

        await expect(directoryPage.pageTitle).toBeVisible();

        // Test directory search
        await directoryPage.searchEmployees({});
        const count = await directoryPage.getEmployeeCount();
        expect(count).toBeGreaterThan(0);

        // Test employee card details
        const details = await directoryPage.getEmployeeDetails(0);
        expect(details.name).toBeTruthy();
        expect(details.jobTitle).toBeTruthy();
    });

    test('should validate navigation and common elements', async ({ page }) => {
        // Test search functionality
        await dashboardPage.searchFor('Admin');

        // Test user menu
        await dashboardPage.openUserMenu();

        // Test version info
        const version = await dashboardPage.getVersion();
        expect(version).toContain('OrangeHRM OS');
    });
});
