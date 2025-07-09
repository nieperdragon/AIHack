import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class PersonalDetailsPage extends BasePage {
    readonly pageTitle: Locator;
    readonly employeeNameHeader: Locator;
    readonly firstName: Locator;
    readonly middleName: Locator;
    readonly lastName: Locator;
    readonly employeeId: Locator;

    constructor(page: Page) {
        super(page);
        this.pageTitle = page.getByRole('heading', { name: 'Personal Details' });
        this.employeeNameHeader = page.locator('.orangehrm-edit-employee-name > h6'); // Top profile name
        this.firstName = page.getByPlaceholder('First Name');
        this.middleName = page.getByPlaceholder('Middle Name');
        this.lastName = page.getByPlaceholder('Last Name');
        this.employeeId = page.locator('input[name="employeeId"]');
    }

    async getDisplayedEmployeeName(): Promise<string> {
        return (await this.employeeNameHeader.textContent())?.trim() || '';
    }

    async isAtPersonalDetailsPage(): Promise<boolean> {
        return await this.pageTitle.isVisible();
    }
} 