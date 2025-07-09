import { Page, Locator } from '@playwright/test';

export class AddEmployeePage {
    readonly page: Page;
    readonly pageTitle: Locator;
    readonly firstNameInput: Locator;
    readonly middleNameInput: Locator;
    readonly lastNameInput: Locator;
    readonly employeeIdInput: Locator;
    readonly photographInput: Locator;
    readonly saveButton: Locator;
    readonly cancelButton: Locator;
    readonly loginDetailsSwitch: Locator;
    readonly usernameInput: Locator;
    readonly passwordInput: Locator;
    readonly confirmPasswordInput: Locator;
    readonly statusDropdown: Locator;
    readonly successToast: Locator;

    constructor(page: Page) {
        this.page = page;
        this.pageTitle = page.getByRole('heading', { name: 'Add Employee' });
        this.firstNameInput = page.getByPlaceholder('First Name');
        this.middleNameInput = page.getByPlaceholder('Middle Name');
        this.lastNameInput = page.getByPlaceholder('Last Name');
        this.employeeIdInput = page.locator('input[autocomplete="off"]').nth(1); // usually the second input
        this.photographInput = page.locator('input[type="file"]');
        this.saveButton = page.getByRole('button', { name: 'Save' });
        this.cancelButton = page.getByRole('button', { name: 'Cancel' });
        this.loginDetailsSwitch = page.getByText('Create Login Details');
        this.usernameInput = page.getByPlaceholder('Username');
        this.passwordInput = page.getByPlaceholder('Password');
        this.confirmPasswordInput = page.getByPlaceholder('Confirm Password');
        this.statusDropdown = page.getByText('Status');
        this.successToast = page.locator('.oxd-toast');
    }

    async fillEmployeeDetails(details: {
        firstName: string;
        middleName?: string;
        lastName: string;
        employeeId?: string;
        photographPath?: string;
    }) {
        await this.firstNameInput.fill(details.firstName);
        if (details.middleName) {
            await this.middleNameInput.fill(details.middleName);
        }
        await this.lastNameInput.fill(details.lastName);
        if (details.employeeId) {
            await this.employeeIdInput.fill(details.employeeId);
        }
        if (details.photographPath) {
            await this.photographInput.setInputFiles(details.photographPath);
        }
    }

    async enableLoginDetails(username: string, password: string, status: 'Enabled' | 'Disabled' = 'Enabled') {
        await this.loginDetailsSwitch.click();
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.confirmPasswordInput.fill(password);
        await this.statusDropdown.click();
        await this.page.getByRole('option', { name: status }).click();
    }

    async save() {
        await this.saveButton.click();
    }

    async cancel() {
        await this.cancelButton.click();
    }

    async waitForSuccessToast() {
        await this.successToast.waitFor({ state: 'visible' });
    }
} 