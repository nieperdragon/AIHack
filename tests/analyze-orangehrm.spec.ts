import { test, expect } from '@playwright/test';

test.describe('OrangeHRM Page Analysis', () => {
    test('analyze login page elements', async ({ page }) => {
        await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
        
        // Analyze login page elements
        const loginElements = {
            usernameInput: await page.getByPlaceholder('Username').isVisible(),
            passwordInput: await page.getByPlaceholder('Password').isVisible(),
            loginButton: await page.getByRole('button', { name: 'Login' }).isVisible(),
            forgotPasswordLink: await page.getByText('Forgot your password?').isVisible(),
            credentialsHint: await page.getByText('Username : Admin').isVisible()
        };
        
        console.log('Login Page Elements:', loginElements);
        
        // Login to access other pages
        await page.getByPlaceholder('Username').fill('Admin');
        await page.getByPlaceholder('Password').fill('admin123');
        await page.getByRole('button', { name: 'Login' }).click();
        
        // Wait for dashboard to load
        await page.waitForURL('**/dashboard/index');
    });

    test('analyze dashboard page elements', async ({ page }) => {
        // Login first
        await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
        await page.getByPlaceholder('Username').fill('Admin');
        await page.getByPlaceholder('Password').fill('admin123');
        await page.getByRole('button', { name: 'Login' }).click();
        
        // Wait for dashboard to load
        await page.waitForURL('**/dashboard/index');
        
        // Analyze dashboard elements
        const dashboardElements = {
            // Navigation elements
            adminLink: await page.getByRole('link', { name: 'Admin' }).isVisible(),
            pimLink: await page.getByRole('link', { name: 'PIM' }).isVisible(),
            leaveLink: await page.getByRole('link', { name: 'Leave' }).isVisible(),
            timeLink: await page.getByRole('link', { name: 'Time' }).isVisible(),
            recruitmentLink: await page.getByRole('link', { name: 'Recruitment' }).isVisible(),
            myInfoLink: await page.getByRole('link', { name: 'My Info' }).isVisible(),
            performanceLink: await page.getByRole('link', { name: 'Performance' }).isVisible(),
            dashboardLink: await page.getByRole('link', { name: 'Dashboard' }).isVisible(),
            directoryLink: await page.getByRole('link', { name: 'Directory' }).isVisible(),
            maintenanceLink: await page.getByRole('link', { name: 'Maintenance' }).isVisible(),
            claimLink: await page.getByRole('link', { name: 'Claim' }).isVisible(),
            buzzLink: await page.getByRole('link', { name: 'Buzz' }).isVisible(),
            
            // Top bar elements
            searchBox: await page.getByPlaceholder('Search').isVisible(),
            userProfileButton: await page.getByAltText('profile picture').isVisible(),
            
            // Dashboard content
            timeAtWork: await page.getByText('Punched Out').first().isVisible(),
            quickLaunch: await page.getByRole('button', { name: 'Assign Leave' }).isVisible(),
            myActions: await page.getByText(/\(\d+\) Pending Self Review/).isVisible()
        };
        
        console.log('Dashboard Page Elements:', dashboardElements);
    });

    test('analyze PIM page elements', async ({ page }) => {
        // Login first
        await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
        await page.getByPlaceholder('Username').fill('Admin');
        await page.getByPlaceholder('Password').fill('admin123');
        await page.getByRole('button', { name: 'Login' }).click();
        
        // Navigate to PIM
        await page.getByRole('link', { name: 'PIM' }).click();
        await page.waitForURL('**/pim/viewEmployeeList');
        
        // Analyze PIM elements
        const pimElements = {
            // Page title
            pageTitle: await page.getByRole('heading', { name: 'Employee Information' }).isVisible(),
            
            // Search form
            employeeNameInput: await page.getByPlaceholder('Type for hints...').first().isVisible(),
            employeeIdInput: await page.getByPlaceholder('Type for hints...').nth(1).isVisible(),
            supervisorNameInput: await page.getByPlaceholder('Type for hints...').nth(2).isVisible(),
            searchButton: await page.getByRole('button', { name: 'Search' }).isVisible(),
            resetButton: await page.getByRole('button', { name: 'Reset' }).isVisible(),
            
            // Add employee
            addButton: await page.getByRole('button', { name: 'Add' }).isVisible(),
            
            // Employee list
            employeeTable: await page.getByRole('table').isVisible(),
            tableHeaders: await page.getByRole('columnheader').count()
        };
        
        console.log('PIM Page Elements:', pimElements);
    });

    test('analyze logout functionality', async ({ page }) => {
        // Login first
        await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
        await page.getByPlaceholder('Username').fill('Admin');
        await page.getByPlaceholder('Password').fill('admin123');
        await page.getByRole('button', { name: 'Login' }).click();
        
        // Wait for dashboard to load
        await page.waitForURL('**/dashboard/index');
        
        // Analyze logout elements
        const logoutElements = {
            userProfileButton: await page.getByAltText('profile picture').isVisible(),
            userDropdown: await page.locator('[class*="userdropdown"]').isVisible()
        };
        
        console.log('Logout Elements:', logoutElements);
        
        // Test logout functionality
        await page.getByAltText('profile picture').click();
        
        // Check if logout option appears
        const logoutOption = await page.getByRole('menuitem', { name: 'Logout' }).isVisible();
        console.log('Logout option visible:', logoutOption);
    });
}); 