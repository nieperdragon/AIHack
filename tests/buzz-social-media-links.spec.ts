import { test } from '@playwright/test';
import { LoginPage } from '../PageObjects_new/LoginPage';
import { BuzzPage } from '../PageObjects_new/BuzzPage';

const demoUrl = 'https://opensource-demo.orangehrmlive.com/web/index.php/auth/login';
const username = 'Admin';
const password = 'admin123';
const expectedTwitterUrl = 'x.com/orangehrm';

test('Buzz page Twitter link should open correct URL', async ({ page }) => {
    // Login
    const loginPage = new LoginPage(page);
    await page.goto(demoUrl);
    await loginPage.login(username, password);
    // Navigate to Buzz
    await loginPage.navigateTo('buzz');
    const buzzPage = new BuzzPage(page);
    // Verify Twitter link
    await buzzPage.clickTwitterLinkAndVerifyUrl(expectedTwitterUrl);
}); 