import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class PerformancePage extends BasePage {
    readonly pageTitle: Locator;
    readonly configure: {
        kpis: Locator;
        trackers: Locator;
    };

    readonly manageReviews: {
        manageReviews: Locator;
        myReviews: Locator;
        employeeReviews: Locator;
    };

    readonly myTrackers: {
        searchForm: {
            tracker: Locator;
            employeeName: Locator;
            reviewPeriod: {
                from: Locator;
                to: Locator;
            };
            searchButton: Locator;
            resetButton: Locator;
        };
        table: {
            headers: Locator;
            rows: Locator;
        };
    };

    readonly employeeTrackers: {
        searchForm: {
            employeeName: Locator;
            includeEmployees: Locator;
            jobTitle: Locator;
            reviewer: Locator;
            fromDate: Locator;
            toDate: Locator;
            searchButton: Locator;
            resetButton: Locator;
        };
        table: {
            headers: Locator;
            rows: Locator;
        };
    };

    constructor(page: Page) {
        super(page);
        
        this.pageTitle = page.getByRole('heading', { name: 'Performance' });

        this.configure = {
            kpis: page.getByRole('link', { name: 'KPIs' }),
            trackers: page.getByRole('link', { name: 'Trackers' })
        };

        this.manageReviews = {
            manageReviews: page.getByRole('link', { name: 'Manage Reviews' }),
            myReviews: page.getByRole('link', { name: 'My Reviews' }),
            employeeReviews: page.getByRole('link', { name: 'Employee Reviews' })
        };

        this.myTrackers = {
            searchForm: {
                tracker: page.getByRole('combobox').filter({ hasText: /Tracker/ }),
                employeeName: page.getByPlaceholder('Type for hints...').first(),
                reviewPeriod: {
                    from: page.locator('input[placeholder="yyyy-mm-dd"]').first(),
                    to: page.locator('input[placeholder="yyyy-mm-dd"]').last()
                },
                searchButton: page.getByRole('button', { name: 'Search' }),
                resetButton: page.getByRole('button', { name: 'Reset' })
            },
            table: {
                headers: page.locator('.oxd-table-header'),
                rows: page.locator('.oxd-table-card')
            }
        };

        this.employeeTrackers = {
            searchForm: {
                employeeName: page.getByPlaceholder('Type for hints...').first(),
                includeEmployees: page.getByRole('combobox').filter({ hasText: /Include/ }),
                jobTitle: page.getByRole('combobox').filter({ hasText: /Job Title/ }),
                reviewer: page.getByPlaceholder('Type for hints...').last(),
                fromDate: page.locator('input[placeholder="yyyy-mm-dd"]').first(),
                toDate: page.locator('input[placeholder="yyyy-mm-dd"]').last(),
                searchButton: page.getByRole('button', { name: 'Search' }),
                resetButton: page.getByRole('button', { name: 'Reset' })
            },
            table: {
                headers: page.locator('.oxd-table-header'),
                rows: page.locator('.oxd-table-card')
            }
        };
    }

    async navigateToConfiguration(section: keyof PerformancePage['configure']): Promise<void> {
        await this.configure[section].click();
    }

    async navigateToReviews(section: keyof PerformancePage['manageReviews']): Promise<void> {
        await this.manageReviews[section].click();
    }

    async searchMyTrackers(criteria: {
        tracker?: string;
        employeeName?: string;
        fromDate?: string;
        toDate?: string;
    }): Promise<void> {
        if (criteria.tracker) {
            await this.myTrackers.searchForm.tracker.selectOption(criteria.tracker);
        }
        if (criteria.employeeName) {
            await this.myTrackers.searchForm.employeeName.fill(criteria.employeeName);
        }
        if (criteria.fromDate) {
            await this.myTrackers.searchForm.reviewPeriod.from.fill(criteria.fromDate);
        }
        if (criteria.toDate) {
            await this.myTrackers.searchForm.reviewPeriod.to.fill(criteria.toDate);
        }
        await this.myTrackers.searchForm.searchButton.click();
    }

    async searchEmployeeTrackers(criteria: {
        employeeName?: string;
        includeEmployees?: string;
        jobTitle?: string;
        reviewer?: string;
        fromDate?: string;
        toDate?: string;
    }): Promise<void> {
        const form = this.employeeTrackers.searchForm;
        
        if (criteria.employeeName) await form.employeeName.fill(criteria.employeeName);
        if (criteria.includeEmployees) await form.includeEmployees.selectOption(criteria.includeEmployees);
        if (criteria.jobTitle) await form.jobTitle.selectOption(criteria.jobTitle);
        if (criteria.reviewer) await form.reviewer.fill(criteria.reviewer);
        if (criteria.fromDate) await form.fromDate.fill(criteria.fromDate);
        if (criteria.toDate) await form.toDate.fill(criteria.toDate);
        
        await form.searchButton.click();
    }

    async resetMyTrackerSearch(): Promise<void> {
        await this.myTrackers.searchForm.resetButton.click();
    }

    async resetEmployeeTrackerSearch(): Promise<void> {
        await this.employeeTrackers.searchForm.resetButton.click();
    }
}
