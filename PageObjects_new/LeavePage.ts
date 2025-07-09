import { Page, Locator } from '@playwright/test';

export class LeavePage {
    readonly page: Page;
    readonly fromDateInput: Locator;
    readonly toDateInput: Locator;
    readonly statusDropdown: Locator;
    readonly leaveTypeDropdown: Locator;
    readonly employeeNameInput: Locator;
    readonly subUnitDropdown: Locator;
    readonly includePastEmployeesCheckbox: Locator;
    readonly resetButton: Locator;
    readonly searchButton: Locator;
    readonly leaveTable: Locator;
    readonly applyLeaveForm: {
        leaveType: Locator;
        fromDate: Locator;
        toDate: Locator;
        comment: Locator;
        applyButton: Locator;
        errorMessage: Locator;
        successMessage: Locator;
        requiredFieldErrors: Locator;
        validationMessages: Locator;
    };

    constructor(page: Page) {
        this.page = page;
        this.fromDateInput = page.locator('input[placeholder="yyyy-dd-mm"]').first();
        this.toDateInput = page.locator('input[placeholder="yyyy-dd-mm"]').nth(1);
        this.statusDropdown = page.locator('label:has-text("Show Leave with Status")').locator('..').locator('div[role="listbox"]');
        this.leaveTypeDropdown = page.locator('label:has-text("Leave Type")').locator('..').locator('div[role="listbox"]');
        this.employeeNameInput = page.getByPlaceholder('Type for hints...');
        this.subUnitDropdown = page.locator('label:has-text("Sub Unit")').locator('..').locator('div[role="listbox"]');
        this.includePastEmployeesCheckbox = page.locator('label:has-text("Include Past Employees")').locator('input[type="checkbox"]');
        this.resetButton = page.getByRole('button', { name: 'Reset' });
        this.searchButton = page.getByRole('button', { name: 'Search' });
        this.leaveTable = page.locator('table');

        // Enhanced Apply Leave form locators - Updated per 2025-07-05 Meeting Notes
        this.applyLeaveForm = {
            leaveType: page.locator('label:has-text("Leave Type")').locator('..').locator('div[role="listbox"]'),
            fromDate: page.locator('input[placeholder="yyyy-mm-dd"]').first(),
            toDate: page.locator('input[placeholder="yyyy-mm-dd"]').nth(1),
            comment: page.getByPlaceholder('Comment'),
            applyButton: page.getByRole('button', { name: /Apply|Submit/ }),
            errorMessage: page.locator('.oxd-input-field-error-message, .oxd-alert-content-text'),
            successMessage: page.locator('.oxd-toast-content, .oxd-alert-content-text'),
            // Enhanced error handling per meeting requirements
            requiredFieldErrors: page.locator('.oxd-input-field-error-message'),
            validationMessages: page.locator('.oxd-form-row .oxd-text--span')
        };
    }

    async searchLeave(params: {
        fromDate?: string;
        toDate?: string;
        status?: string;
        leaveType?: string;
        employeeName?: string;
        subUnit?: string;
        includePastEmployees?: boolean;
    }) {
        if (params.fromDate) await this.fromDateInput.fill(params.fromDate);
        if (params.toDate) await this.toDateInput.fill(params.toDate);
        if (params.status) await this.statusDropdown.selectOption({ label: params.status });
        if (params.leaveType) await this.leaveTypeDropdown.selectOption({ label: params.leaveType });
        if (params.employeeName) await this.employeeNameInput.fill(params.employeeName);
        if (params.subUnit) await this.subUnitDropdown.selectOption({ label: params.subUnit });
        if (params.includePastEmployees !== undefined) {
            const checked = await this.includePastEmployeesCheckbox.isChecked();
            if (checked !== params.includePastEmployees) {
                await this.includePastEmployeesCheckbox.click();
            }
        }
        await this.searchButton.click();
    }

    async resetFilters() {
        await this.resetButton.click();
    }

    /**
     * Apply for leave with comprehensive validation
     * Enhanced per 2025-07-05 Meeting Notes for multiple user types
     */
    async applyForLeave(params: {
        leaveType: string;
        fromDate: string;
        toDate: string;
        comment?: string;
    }): Promise<void> {
        await this.applyLeaveForm.leaveType.click();
        await this.page.getByRole('option', { name: params.leaveType }).click();
        await this.applyLeaveForm.fromDate.fill(params.fromDate);
        await this.applyLeaveForm.toDate.fill(params.toDate);
        if (params.comment) {
            await this.applyLeaveForm.comment.fill(params.comment);
        }
        await this.applyLeaveForm.applyButton.click();
    }

    /**
     * Apply for leave with incomplete data to test validation
     * Added per meeting requirements for comprehensive testing
     */
    async applyForLeaveWithIncompleteData(params?: {
        leaveType?: string;
        fromDate?: string;
        toDate?: string;
        comment?: string;
    }): Promise<void> {
        if (params?.leaveType) {
            await this.applyLeaveForm.leaveType.click();
            await this.page.getByRole('option', { name: params.leaveType }).click();
        }
        if (params?.fromDate) {
            await this.applyLeaveForm.fromDate.fill(params.fromDate);
        }
        if (params?.toDate) {
            await this.applyLeaveForm.toDate.fill(params.toDate);
        }
        if (params?.comment) {
            await this.applyLeaveForm.comment.fill(params.comment);
        }
        await this.applyLeaveForm.applyButton.click();
    }

    /**
     * Validate that required field errors are displayed
     * Added per 2025-07-05 Meeting Notes
     */
    async validateRequiredFieldErrors(): Promise<boolean> {
        const errorCount = await this.applyLeaveForm.requiredFieldErrors.count();
        return errorCount > 0;
    }

    /**
     * Get all validation error messages
     * Enhanced error handling per meeting requirements
     */
    async getValidationErrors(): Promise<string[]> {
        const errors: string[] = [];
        const errorElements = await this.applyLeaveForm.requiredFieldErrors.all();
        
        for (const element of errorElements) {
            const text = await element.textContent();
            if (text) {
                errors.push(text.trim());
            }
        }
        
        return errors;
    }

    /**
     * Check if Apply Leave functionality is accessible for current user
     * Added per 2025-07-05 Meeting Notes for role-based testing
     */
    async isApplyLeaveAccessible(): Promise<boolean> {
        try {
            await this.applyLeaveForm.leaveType.waitFor({ state: 'visible', timeout: 5000 });
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Verify success message after leave application
     * Enhanced per meeting requirements
     */
    async verifySuccessMessage(): Promise<boolean> {
        try {
            await this.applyLeaveForm.successMessage.waitFor({ state: 'visible', timeout: 10000 });
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Verify error message after failed leave application
     * Enhanced per meeting requirements
     */
    async verifyErrorMessage(): Promise<boolean> {
        try {
            await this.applyLeaveForm.errorMessage.waitFor({ state: 'visible', timeout: 5000 });
            return true;
        } catch {
            return false;
        }
    }
}
