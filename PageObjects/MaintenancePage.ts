import { Page, Locator } from '@playwright/test';

export class MaintenancePage {
    readonly page: Page;
    readonly adminPasswordInput: Locator;
    readonly confirmButton: Locator;
    readonly cancelButton: Locator;
    readonly purgeRecordsTab: Locator;
    readonly accessRecordsTab: Locator;
    readonly employeeNameInput: Locator;
    readonly searchButton: Locator;
    readonly resetButton: Locator;
    readonly resultsTable: Locator;
    readonly notificationMessage: Locator;

    constructor(page: Page) {
        this.page = page;
        this.adminPasswordInput = page.locator('input[type="password"]');
        this.confirmButton = page.getByRole('button', { name: 'Confirm' });
        this.cancelButton = page.getByRole('button', { name: 'Cancel' });
        this.purgeRecordsTab = page.getByRole('tab', { name: 'Purge Records' });
        this.accessRecordsTab = page.getByRole('tab', { name: 'Access Records' });
        this.employeeNameInput = page.getByPlaceholder('Type for hints...');
        this.searchButton = page.getByRole('button', { name: 'Search' });
        this.resetButton = page.getByRole('button', { name: 'Reset' });
        this.resultsTable = page.locator('div.oxd-table');
        this.notificationMessage = page.locator('div.oxd-toast-content');
    }

    async enterAdminPassword(password: string): Promise<void> {
        await this.adminPasswordInput.fill(password);
    }

    async confirmAccess(): Promise<void> {
        await this.confirmButton.click();
    }

    async cancelAccess(): Promise<void> {
        await this.cancelButton.click();
    }

    async switchToPurgeRecordsTab(): Promise<void> {
        await this.purgeRecordsTab.click();
    }

    async switchToAccessRecordsTab(): Promise<void> {
        await this.accessRecordsTab.click();
    }

    async searchEmployee(name: string): Promise<void> {
        await this.employeeNameInput.fill(name);
        await this.searchButton.click();
    }

    async resetSearch(): Promise<void> {
        await this.resetButton.click();
    }

    async getNotificationMessage(): Promise<string> {
        return await this.notificationMessage.textContent() || '';
    }
} 