import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class MaintenancePage extends BasePage {
    readonly pageTitle: Locator;
    readonly accessForm: {
        password: Locator;
        confirmButton: Locator;
    };

    readonly purgeRecords: {
        employeeRecords: {
            pastEmployees: Locator;
            candidates: Locator;
            purgeButton: Locator;
            confirmDialog: {
                content: Locator;
                confirmButton: Locator;
                cancelButton: Locator;
            };
        };
    };

    readonly accessRecords: {
        search: {
            username: Locator;
            fromDate: Locator;
            toDate: Locator;
            searchButton: Locator;
        };
        table: {
            headers: Locator;
            rows: Locator;
        };
    };

    readonly candidateRecords: {
        vacancy: Locator;
        fromDate: Locator;
        toDate: Locator;
        searchButton: Locator;
        table: {
            headers: Locator;
            rows: Locator;
        };
    };

    constructor(page: Page) {
        super(page);
        
        this.pageTitle = page.getByRole('heading', { name: 'Maintenance' });

        this.accessForm = {
            password: page.getByRole('textbox', { name: 'Password' }),
            confirmButton: page.getByRole('button', { name: 'Confirm' })
        };

        this.purgeRecords = {
            employeeRecords: {
                pastEmployees: page.getByRole('checkbox', { name: 'Past Employee Records' }),
                candidates: page.getByRole('checkbox', { name: 'Candidate Records' }),
                purgeButton: page.getByRole('button', { name: 'Purge' }),
                confirmDialog: {
                    content: page.locator('.oxd-dialog-content'),
                    confirmButton: page.getByRole('button', { name: 'Yes, Purge' }),
                    cancelButton: page.getByRole('button', { name: 'No, Cancel' })
                }
            }
        };

        this.accessRecords = {
            search: {
                username: page.getByPlaceholder('Username'),
                fromDate: page.locator('input[placeholder="yyyy-mm-dd"]').first(),
                toDate: page.locator('input[placeholder="yyyy-mm-dd"]').last(),
                searchButton: page.getByRole('button', { name: 'Search' })
            },
            table: {
                headers: page.locator('.oxd-table-header'),
                rows: page.locator('.oxd-table-card')
            }
        };

        this.candidateRecords = {
            vacancy: page.getByRole('combobox', { name: 'Vacancy' }),
            fromDate: page.locator('input[placeholder="yyyy-mm-dd"]').first(),
            toDate: page.locator('input[placeholder="yyyy-mm-dd"]').last(),
            searchButton: page.getByRole('button', { name: 'Search' }),
            table: {
                headers: page.locator('.oxd-table-header'),
                rows: page.locator('.oxd-table-card')
            }
        };
    }

    async authorize(password: string): Promise<void> {
        await this.accessForm.password.fill(password);
        await this.accessForm.confirmButton.click();
    }

    async purgeEmployeeRecords(options: {
        pastEmployees?: boolean;
        candidates?: boolean;
    }): Promise<void> {
        if (options.pastEmployees) {
            await this.purgeRecords.employeeRecords.pastEmployees.check();
        }
        if (options.candidates) {
            await this.purgeRecords.employeeRecords.candidates.check();
        }
        await this.purgeRecords.employeeRecords.purgeButton.click();
        await this.purgeRecords.employeeRecords.confirmDialog.confirmButton.click();
    }

    async searchAccessRecords(criteria: {
        username?: string;
        fromDate?: string;
        toDate?: string;
    }): Promise<void> {
        if (criteria.username) {
            await this.accessRecords.search.username.fill(criteria.username);
        }
        if (criteria.fromDate) {
            await this.accessRecords.search.fromDate.fill(criteria.fromDate);
        }
        if (criteria.toDate) {
            await this.accessRecords.search.toDate.fill(criteria.toDate);
        }
        await this.accessRecords.search.searchButton.click();
    }

    async searchCandidateRecords(criteria: {
        vacancy?: string;
        fromDate?: string;
        toDate?: string;
    }): Promise<void> {
        if (criteria.vacancy) {
            await this.candidateRecords.vacancy.selectOption(criteria.vacancy);
        }
        if (criteria.fromDate) {
            await this.candidateRecords.fromDate.fill(criteria.fromDate);
        }
        if (criteria.toDate) {
            await this.candidateRecords.toDate.fill(criteria.toDate);
        }
        await this.candidateRecords.searchButton.click();
    }
}
