import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { testAccessibility } from '../utilities/axeHelper';

export class LoginPage extends BasePage {
    readonly usernameInput: Locator;
    readonly passwordInput: Locator;
    readonly loginButton: Locator;
    readonly forgotPasswordLink: Locator;
    readonly credentialsHint: {
        username: Locator;
        password: Locator;
    };
    readonly errorMessage: Locator;

    constructor(page: Page) {
        super(page);
        this.usernameInput = page.getByPlaceholder('Username');
        this.passwordInput = page.getByPlaceholder('Password');
        this.loginButton = page.getByRole('button', { name: 'Login' });
        this.forgotPasswordLink = page.getByText('Forgot your password?');
        this.credentialsHint = {
            username: page.getByText('Username : Admin'),
            password: page.getByText('Password : admin123')
        };
        this.errorMessage = page.locator('.oxd-alert-content-text');
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
            username: usernameText.split(':')[1].trim(),
            password: passwordText.split(':')[1].trim()
        };
    }

    async assertLoginErrorVisible(): Promise<void> {
        await expect(this.errorMessage).toBeVisible();
    }

    /**
     * Runs an accessibility check on the login page using axeHelper.
     * Returns the accessibility results.
     */
    async checkAccessibility() {
        return await testAccessibility(this.page);
    }
}
