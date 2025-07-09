import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class DirectoryPage extends BasePage {
    readonly pageTitle: Locator;
    readonly searchForm: {
        employeeName: Locator;
        jobTitle: Locator;
        location: Locator;
        searchButton: Locator;
        resetButton: Locator;
    };
    readonly employeeCards: {
        container: Locator;
        card: Locator;
        name: Locator;
        jobTitle: Locator;
        location: Locator;
    };

    constructor(page: Page) {
        super(page);
        
        this.pageTitle = page.getByRole('heading', { name: 'Directory' });

        this.searchForm = {
            employeeName: page.getByPlaceholder('Type for hints...').first(),
            jobTitle: page.getByRole('combobox').filter({ hasText: /Job Title/ }),
            location: page.getByRole('combobox').filter({ hasText: /Location/ }),
            searchButton: page.getByRole('button', { name: 'Search' }),
            resetButton: page.getByRole('button', { name: 'Reset' })
        };

        this.employeeCards = {
            container: page.locator('.oxd-grid-3'),
            card: page.locator('.orangehrm-directory-card'),
            name: page.locator('.orangehrm-directory-card-header'),
            jobTitle: page.locator('.orangehrm-directory-card-subtitle'),
            location: page.locator('.orangehrm-directory-card-location')
        };
    }

    async searchEmployees(criteria: {
        name?: string;
        jobTitle?: string;
        location?: string;
    }): Promise<void> {
        if (criteria.name) {
            await this.searchForm.employeeName.fill(criteria.name);
        }
        if (criteria.jobTitle) {
            await this.searchForm.jobTitle.selectOption(criteria.jobTitle);
        }
        if (criteria.location) {
            await this.searchForm.location.selectOption(criteria.location);
        }
        await this.searchForm.searchButton.click();
    }

    async resetSearch(): Promise<void> {
        await this.searchForm.resetButton.click();
    }

    async getEmployeeCount(): Promise<number> {
        const cards = await this.employeeCards.card.count();
        return cards;
    }

    async getEmployeeDetails(index: number): Promise<{
        name: string;
        jobTitle: string;
        location: string;
    }> {
        const cards = this.employeeCards.card.nth(index);
        return {
            name: await cards.locator('.orangehrm-directory-card-header').textContent() || '',
            jobTitle: await cards.locator('.orangehrm-directory-card-subtitle').textContent() || '',
            location: await cards.locator('.orangehrm-directory-card-location').textContent() || ''
        };
    }
}
