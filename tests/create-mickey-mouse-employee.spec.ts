import { test, expect } from '@playwright/test';
import { LoginPage } from '../PageObjects/LoginPage';
import { DashboardPage } from '../PageObjects/DashboardPage';
import { PIMPage } from '../PageObjects/PIMPage';

test.describe('Create Mickey Mouse Employee', () => {
    test('should create Mickey Mouse as a new employee', async ({ page }) => {
        // Initialize page objects
        const loginPage = new LoginPage(page);
        const dashboardPage = new DashboardPage(page);
        const pimPage = new PIMPage(page);

        // Navigate and login
        await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
        await loginPage.login('Admin', 'admin123');

        // Verify successful login
        await expect(page).toHaveURL(/.*\/dashboard/);
        
        // Navigate to PIM module and wait for it to load
        await pimPage.navigateTo('pim');
        await page.waitForLoadState('networkidle');        // Create a new employee
        console.log('Creating new employee: Mickey The Mouse');
        const employeeId = await pimPage.addNewEmployee({
            firstName: 'Mickey',
            middleName: 'The',
            lastName: 'Mouse'
        });
        
        console.log('=== Employee Creation Result ===');
        console.log('Generated employee ID:', employeeId);

        // Set personal details
        await pimPage.setPersonalDetails({
            nationality: 'British',
            maritalStatus: 'Single',
            dateOfBirth: '1985-06-06',
            gender: 'Male'
        });
        
        // Get the employee ID from the personal details page as verification
        const personalDetailsId = await pimPage.getEmployeeIdFromPersonalDetails();
        console.log('ID from personal details:', personalDetailsId);
        
        // Verify we have matching IDs
        await expect(employeeId).toBeTruthy();
        await expect(personalDetailsId).toBeTruthy();
        await expect(employeeId).toBe(personalDetailsId);

        // Navigate back to employee list and wait for page load
        console.log('Navigating back to PIM page');
        await pimPage.navigateTo('pim');
        await page.waitForLoadState('networkidle');
        await pimPage.pageTitle.waitFor({ state: 'visible' });
        
        // Use the page object method to search
        console.log('=== Starting Employee Search ===');
        console.log('Employee ID to search for:', employeeId);
        await pimPage.searchEmployee({ employeeId });
          // Get and verify search results with retries
        console.log('=== Verifying Search Results ===');
        let retryCount = 0;
        const maxRetries = 3;
        let found = false;

        while (retryCount < maxRetries && !found) {
            const results = await pimPage.getSearchResults();
            const count = await results.count();
            
            console.log(`Attempt ${retryCount + 1}: Found ${count} results`);
            
            if (count === 1) {
                const row = results.first();
                const rowContent = await row.textContent();
                console.log('Row content:', rowContent);

                // Verify employee details
                await expect(row).toContainText(employeeId);
                await expect(row).toContainText('Mickey');
                await expect(row).toContainText('Mouse');
                found = true;
                console.log('Found correct employee record');
                break;
            }
            
            // If not found, reset and try search again
            console.log('Employee not found, retrying search...');
            await pimPage.searchEmployee({ employeeId });
            retryCount++;
            await page.waitForTimeout(2000);
        }

        // Final verification
        await expect(found, 'Employee should be found in the search results').toBeTruthy();
        console.log('Test completed successfully');
    });
});
