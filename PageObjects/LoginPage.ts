import { Page, Locator } from '@playwright/test';
import { testAccessibility } from '../utilities/axeHelper';

export class LoginPage {
    readonly page: Page;
    readonly usernameInput: Locator;
    readonly passwordInput: Locator;
    readonly loginButton: Locator;
    readonly forgotPasswordLink: Locator;
    readonly credentialsHint: {
        username: Locator;
        password: Locator;
    };
    readonly logo: Locator;
    readonly loginForm: Locator;

    constructor(page: Page) {
        this.page = page;
        this.usernameInput = page.getByPlaceholder('Username');
        this.passwordInput = page.getByPlaceholder('Password');
        this.loginButton = page.getByRole('button', { name: 'Login' });
        this.forgotPasswordLink = page.getByText('Forgot your password?');
        this.logo = page.getByAltText('client brand banner');
        this.loginForm = page.locator('.oxd-form');
        
        this.credentialsHint = {
            username: page.getByText('Username : Admin'),
            password: page.getByText('Password : admin123')
        };
    }

    async login(username: string, password: string): Promise<void> {
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
    }

    async clickForgotPassword(): Promise<void> {
        await this.forgotPasswordLink.click();
    }

    async getDefaultCredentials(): Promise<{ username: string; password: string }> {
        const usernameText = await this.credentialsHint.username.textContent() || '';
        const passwordText = await this.credentialsHint.password.textContent() || '';
        
        return {
            username: usernameText.split(':')[1]?.trim() || 'Admin',
            password: passwordText.split(':')[1]?.trim() || 'admin123'
        };
    }

    async isLoginPageVisible(): Promise<boolean> {
        return await this.usernameInput.isVisible();
    }

    async waitForLoginPage(): Promise<void> {
        await this.page.waitForURL('**/auth/login');
        await this.usernameInput.waitFor({ state: 'visible' });
    }

    /**
     * Runs an accessibility check on the login form using axeHelper.
     */
    async checkAccessibility(): Promise<void> {
        await testAccessibility(this.page, '.oxd-form');
    }
}