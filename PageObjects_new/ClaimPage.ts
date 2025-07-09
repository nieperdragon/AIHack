import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class ClaimPage extends BasePage {
    readonly pageTitle: Locator;
    readonly addButton: Locator;
    readonly searchForm: {
        employeeName: Locator;
        claimType: Locator;
        status: Locator;
        searchButton: Locator;
        resetButton: Locator;
    };
    readonly claimsTable: {
        headers: Locator;
        rows: Locator;
        firstRow: Locator;
    };

    constructor(page: Page) {
        super(page);
        this.pageTitle = page.getByRole('heading', { name: 'Claim' });
        this.addButton = page.getByRole('button', { name: 'Add' });
        this.searchForm = {
            employeeName: page.getByPlaceholder('Type for hints...').first(), // Placeholder, may need adjustment
            claimType: page.getByRole('combobox').filter({ hasText: /Claim Type/ }), // Placeholder
            status: page.getByRole('combobox').filter({ hasText: /Status/ }),
            searchButton: page.getByRole('button', { name: 'Search' }),
            resetButton: page.getByRole('button', { name: 'Reset' })
        };
        this.claimsTable = {
            headers: page.locator('.oxd-table-header'),
            rows: page.locator('.oxd-table-card'),
            firstRow: page.locator('.oxd-table-card').first()
        };
    }

    async searchClaims(criteria: {
        employeeName?: string;
        claimType?: string;
        status?: string;
    }): Promise<void> {
        if (criteria.employeeName) {
            await this.searchForm.employeeName.fill(criteria.employeeName);
        }
        if (criteria.claimType) {
            await this.searchForm.claimType.selectOption(criteria.claimType);
        }
        if (criteria.status) {
            await this.searchForm.status.selectOption(criteria.status);
        }
        await this.searchForm.searchButton.click();
    }

    async resetSearch(): Promise<void> {
        await this.searchForm.resetButton.click();
    }
} 