import { Page, Locator } from '@playwright/test';

export class PIMPage {
    readonly page: Page;
    
    // Page header
    readonly pageTitle: Locator;
    readonly addButton: Locator;
    
    // Search form
    readonly searchForm: {
        employeeNameInput: Locator;
        employeeIdInput: Locator;
        supervisorNameInput: Locator;
        employmentStatusDropdown: Locator;
        includeDropdown: Locator;
        jobTitleDropdown: Locator;
        subUnitDropdown: Locator;
        searchButton: Locator;
        resetButton: Locator;
    };
    
    // Employee list table
    readonly employeeTable: {
        table: Locator;
        headers: Locator;
        rows: Locator;
        firstRow: Locator;
        checkboxColumn: Locator;
        employeeIdColumn: Locator;
        nameColumn: Locator;
        jobTitleColumn: Locator;
        employmentStatusColumn: Locator;
        subUnitColumn: Locator;
        supervisorColumn: Locator;
        actionsColumn: Locator;
    };
    
    // Pagination
    readonly pagination: {
        info: Locator;
        previousButton: Locator;
        nextButton: Locator;
        pageNumbers: Locator;
    };
    
    // Bulk actions
    readonly bulkActions: {
        selectAllCheckbox: Locator;
        deleteSelectedButton: Locator;
        downloadButton: Locator;
    };

    constructor(page: Page) {
        this.page = page;
        
        // Page header
        this.pageTitle = page.getByRole('heading', { name: 'Employee Information' });
        this.addButton = page.getByRole('button', { name: 'Add' });
        
        // Search form
        this.searchForm = {
            employeeNameInput: page.getByPlaceholder('Type for hints...').first(),
            employeeIdInput: page.getByPlaceholder('Type for hints...').nth(1),
            supervisorNameInput: page.getByPlaceholder('Type for hints...').nth(2),
            employmentStatusDropdown: page.getByText('Employment Status').first(),
            includeDropdown: page.getByText('Include').first(),
            jobTitleDropdown: page.getByText('Job Title').first(),
            subUnitDropdown: page.getByText('Sub Unit').first(),
            searchButton: page.getByRole('button', { name: 'Search' }),
            resetButton: page.getByRole('button', { name: 'Reset' })
        };
        
        // Employee table
        this.employeeTable = {
            table: page.getByRole('table'),
            headers: page.getByRole('columnheader'),
            rows: page.getByRole('row'),
            firstRow: page.getByRole('row').nth(1),
            checkboxColumn: page.locator('.oxd-table-cell-radio'),
            employeeIdColumn: page.locator('.oxd-table-cell').filter({ hasText: /^\d+$/ }),
            nameColumn: page.locator('.oxd-table-cell').filter({ hasText: /^[A-Za-z\s]+$/ }),
            jobTitleColumn: page.locator('.oxd-table-cell').filter({ hasText: /^[A-Za-z\s]+$/ }),
            employmentStatusColumn: page.locator('.oxd-table-cell').filter({ hasText: /^(Full-Time|Part-Time|Contract|Freelance)$/ }),
            subUnitColumn: page.locator('.oxd-table-cell').filter({ hasText: /^[A-Za-z\s]+$/ }),
            supervisorColumn: page.locator('.oxd-table-cell').filter({ hasText: /^[A-Za-z\s]+$/ }),
            actionsColumn: page.locator('.oxd-table-cell-actions')
        };
        
        // Pagination
        this.pagination = {
            info: page.locator('.oxd-pagination-text'),
            previousButton: page.getByRole('button', { name: 'Previous' }),
            nextButton: page.getByRole('button', { name: 'Next' }),
            pageNumbers: page.locator('.oxd-pagination-page-item')
        };
        
        // Bulk actions
        this.bulkActions = {
            selectAllCheckbox: page.locator('.oxd-table-header-cell-radio input'),
            deleteSelectedButton: page.getByRole('button', { name: 'Delete Selected' }),
            downloadButton: page.getByRole('button', { name: 'Download' })
        };
    }

    async searchEmployees(criteria: {
        employeeName?: string;
        employeeId?: string;
        supervisorName?: string;
        employmentStatus?: string;
        include?: string;
        jobTitle?: string;
        subUnit?: string;
    }): Promise<void> {
        if (criteria.employeeName) {
            await this.searchForm.employeeNameInput.fill(criteria.employeeName);
        }
        
        if (criteria.employeeId) {
            await this.searchForm.employeeIdInput.fill(criteria.employeeId);
        }
        
        if (criteria.supervisorName) {
            await this.searchForm.supervisorNameInput.fill(criteria.supervisorName);
        }
        
        if (criteria.employmentStatus) {
            await this.searchForm.employmentStatusDropdown.click();
            await this.page.getByRole('option', { name: criteria.employmentStatus }).click();
        }
        
        if (criteria.include) {
            await this.searchForm.includeDropdown.click();
            await this.page.getByRole('option', { name: criteria.include }).click();
        }
        
        if (criteria.jobTitle) {
            await this.searchForm.jobTitleDropdown.click();
            await this.page.getByRole('option', { name: criteria.jobTitle }).click();
        }
        
        if (criteria.subUnit) {
            await this.searchForm.subUnitDropdown.click();
            await this.page.getByRole('option', { name: criteria.subUnit }).click();
        }
        
        await this.searchForm.searchButton.click();
    }

    async resetSearch(): Promise<void> {
        await this.searchForm.resetButton.click();
    }

    async addEmployee(): Promise<void> {
        await this.addButton.click();
    }

    async selectEmployeeByIndex(index: number): Promise<void> {
        const checkboxes = this.employeeTable.checkboxColumn;
        await checkboxes.nth(index).click();
    }

    async selectAllEmployees(): Promise<void> {
        await this.bulkActions.selectAllCheckbox.click();
    }

    async deleteSelectedEmployees(): Promise<void> {
        await this.bulkActions.deleteSelectedButton.click();
    }

    async getEmployeeCount(): Promise<number> {
        const rows = await this.employeeTable.rows.count();
        return Math.max(0, rows - 1); // Subtract header row
    }

    async getEmployeeData(index: number): Promise<{
        employeeId: string;
        name: string;
        jobTitle: string;
        employmentStatus: string;
        subUnit: string;
        supervisor: string;
    }> {
        const row = this.employeeTable.rows.nth(index + 1); // +1 for header row
        const cells = row.locator('.oxd-table-cell');
        
        return {
            employeeId: await cells.nth(1).textContent() || '',
            name: await cells.nth(2).textContent() || '',
            jobTitle: await cells.nth(3).textContent() || '',
            employmentStatus: await cells.nth(4).textContent() || '',
            subUnit: await cells.nth(5).textContent() || '',
            supervisor: await cells.nth(6).textContent() || ''
        };
    }

    async waitForPIMPage(): Promise<void> {
        await this.page.waitForURL('**/pim/viewEmployeeList');
        await this.pageTitle.waitFor({ state: 'visible' });
    }

    async isEmployeeTableVisible(): Promise<boolean> {
        return await this.employeeTable.table.isVisible();
    }
} 