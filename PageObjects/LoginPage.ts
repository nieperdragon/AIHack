import { Page, Locator } from '@playwright/test';
import { testAccessibility } from '../utilities/axeHelper';

export class LoginPage {
    readonly page: Page;
    // Define all locators at the top
    readonly usernameInput: Locator;
    readonly passwordInput: Locator;
    readonly loginButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.usernameInput = page.locator('input[name="username"]');
        this.passwordInput = page.locator('input[name="password"]');
        this.loginButton = page.locator('input[value="Log In"]');
    }

    async navigateToLoginPage(): Promise<void> {
        await this.page.goto('https://parabank.parasoft.com');
    }

    async login(username: string, password: string): Promise<void> {
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
    }

    async checkAccessibility(): Promise<void> {
        await testAccessibility(this.page);
    }
}
