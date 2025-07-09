import { test, expect } from '@playwright/test';
import { LoginPage } from '../PageObjects_new/LoginPage';
import { DashboardPage } from '../PageObjects_new/DashboardPage';
import { PIMPage } from '../PageObjects_new/PIMPage';
import { PersonalDetailsPage } from '../PageObjects_new/PersonalDetailsPage';
import fs from 'fs';
import { parse } from 'csv-parse/sync';

// Credentials are now sourced from environment variables. Set ORANGEHRM_USERNAME and ORANGEHRM_PASSWORD in your environment or .env file.
const demoUrl = process.env.ORANGEHRM_URL || 'https://opensource-demo.orangehrmlive.com/';
const username = process.env.ORANGEHRM_USERNAME;
const password = process.env.ORANGEHRM_PASSWORD;

if (!username || !password) {
  throw new Error('Environment variables ORANGEHRM_USERNAME and ORANGEHRM_PASSWORD must be set.');
}

// Read and parse CSV data for delete employee test
const csvData = fs.readFileSync('./testData.csv', 'utf-8');
const employees = parse(csvData, {
  columns: true,
  skip_empty_lines: true,
});

test.describe('OrangeHRM Login, Logout, and Delete Employee Flow', () => {
  test('should login successfully', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await page.goto(demoUrl);
    await loginPage.login(username, password);
    await expect(page).toHaveURL(/dashboard/);
  });

  test('should logout successfully after login', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    await page.goto(demoUrl);
    await loginPage.login(username, password);
    await expect(page).toHaveURL(/dashboard/);
    await dashboardPage.logout();
    await expect(page).toHaveURL(/auth\/login/);
  });

  for (const employee of employees) {
    test(`should create and delete employee: ${employee.firstName} ${employee.lastName}`, async ({ page }) => {
      // Instantiate page objects
      const loginPage = new LoginPage(page);
      const dashboardPage = new DashboardPage(page);
      const pimPage = new PIMPage(page);
      const personalDetailsPage = new PersonalDetailsPage(page);

      // 1. Navigate to login page
      await page.goto(demoUrl);

      // 2. Login
      await loginPage.login(username, password);
      await expect(page).toHaveURL(/dashboard/);

      // 3. Navigate to PIM
      await dashboardPage.navigateTo('pim');
      await expect(pimPage.pageTitle).toBeVisible();

      // 4. Add a new employee
      const employeeId = await pimPage.addNewEmployee({
        firstName: employee.firstName,
        lastName: employee.lastName,
      });
      await expect(personalDetailsPage.isAtPersonalDetailsPage()).resolves.toBeTruthy();

      // 5. Go back to PIM and search for the employee
      await dashboardPage.navigateTo('pim');
      await pimPage.searchEmployee({ employeeId });
      const results = await pimPage.getSearchResults();
      await expect(await results.count()).toBeGreaterThan(0);

      // 6. Select and delete the employee
      await pimPage.selectFirstEmployeeRowCheckbox();
      await pimPage.deleteSelectedEmployees();
      // Confirm the deletion in the dialog
      await page.getByRole('button', { name: 'Yes, Delete' }).click();
      // Wait for deletion to complete
      await expect(page.getByText('Successfully Deleted')).toBeVisible();

      // 7. Search again to verify deletion
      await pimPage.searchEmployee({ employeeId });
      const resultsAfterDelete = await pimPage.getSearchResults();
      // Should show 'No Records Found'
      await expect(page.locator('span.oxd-text.oxd-text--span', { hasText: 'No Records Found' })).toBeVisible();

      // 8. Logout
      await dashboardPage.logout();
      await expect(page).toHaveURL(/auth\/login/);
    });
  }
}); 