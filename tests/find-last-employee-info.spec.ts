import { test, expect } from '@playwright/test';
import { LoginPage } from '../PageObjects_new/LoginPage';
import { DashboardPage } from '../PageObjects_new/DashboardPage';
import { PIMPage } from '../PageObjects_new/PIMPage';
import { PersonalDetailsPage } from '../PageObjects_new/PersonalDetailsPage';

// You may want to update these credentials as needed
const ADMIN_USERNAME = 'Admin';
const ADMIN_PASSWORD = 'admin123';

test('Find and view info of the last employee added', async ({ page }) => {
    // Login
    const loginPage = new LoginPage(page);
    await page.goto('/web/index.php/auth/login');
    await loginPage.login(ADMIN_USERNAME, ADMIN_PASSWORD);

    // Navigate to PIM (Employee List)
    const dashboardPage = new DashboardPage(page);
    // Assume navigation to PIM is via URL or menu, update as needed
    await page.goto('/web/index.php/pim/viewEmployeeList');
    const pimPage = new PIMPage(page);
    await expect(pimPage.pageTitle).toBeVisible();

    // Wait for employee list to load and view last employee details
    await pimPage.viewLastEmployeeDetails();

    // Validate that the personal details page is shown
    const personalDetailsPage = new PersonalDetailsPage(page);
    expect(await personalDetailsPage.isAtPersonalDetailsPage()).toBeTruthy();
    const employeeName = await personalDetailsPage.getDisplayedEmployeeName();
    console.log('Last employee name:', employeeName);
    expect(employeeName).not.toBe('');
}); 