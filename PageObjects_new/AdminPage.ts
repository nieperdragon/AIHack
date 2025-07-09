import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class AdminPage extends BasePage {
    readonly pageTitle: Locator;
    readonly userManagement: {
        users: {
            searchForm: {
                username: Locator;
                userRole: Locator;
                employeeName: Locator;
                status: Locator;
                searchButton: Locator;
                resetButton: Locator;
                addButton: Locator;
            };
            table: {
                headers: Locator;
                rows: Locator;
                deleteSelected: Locator;
            };
        };
    };

    readonly job: {
        jobTitles: Locator;
        payGrades: Locator;
        employmentStatus: Locator;
        jobCategories: Locator;
        workShifts: Locator;
    };

    readonly organization: {
        generalInfo: Locator;
        locations: Locator;
        structure: Locator;
    };

    readonly qualifications: {
        skills: Locator;
        education: Locator;
        licenses: Locator;
        languages: Locator;
        memberships: Locator;
    };

    readonly nationalities: Locator;
    readonly corporateBranding: Locator;
    readonly configuration: Locator;

    constructor(page: Page) {
        super(page);
        
        this.pageTitle = page.getByRole('heading', { name: 'Admin' });

        this.userManagement = {
            users: {
                searchForm: {
                    username: page.getByPlaceholder('Username'),
                    userRole: page.getByRole('combobox').filter({ hasText: /User Role/ }),
                    employeeName: page.getByPlaceholder('Type for hints...').first(),
                    status: page.getByRole('combobox').filter({ hasText: /Status/ }),
                    searchButton: page.getByRole('button', { name: 'Search' }),
                    resetButton: page.getByRole('button', { name: 'Reset' }),
                    addButton: page.getByRole('button', { name: 'Add' })
                },
                table: {
                    headers: page.locator('.oxd-table-header'),
                    rows: page.locator('.oxd-table-card'),
                    deleteSelected: page.getByRole('button', { name: 'Delete Selected' })
                }
            }
        };

        this.job = {
            jobTitles: page.getByRole('link', { name: 'Job Titles' }),
            payGrades: page.getByRole('link', { name: 'Pay Grades' }),
            employmentStatus: page.getByRole('link', { name: 'Employment Status' }),
            jobCategories: page.getByRole('link', { name: 'Job Categories' }),
            workShifts: page.getByRole('link', { name: 'Work Shifts' })
        };

        this.organization = {
            generalInfo: page.getByRole('link', { name: 'General Information' }),
            locations: page.getByRole('link', { name: 'Locations' }),
            structure: page.getByRole('link', { name: 'Structure' })
        };

        this.qualifications = {
            skills: page.getByRole('link', { name: 'Skills' }),
            education: page.getByRole('link', { name: 'Education' }),
            licenses: page.getByRole('link', { name: 'Licenses' }),
            languages: page.getByRole('link', { name: 'Languages' }),
            memberships: page.getByRole('link', { name: 'Memberships' })
        };

        this.nationalities = page.getByRole('link', { name: 'Nationalities' });
        this.corporateBranding = page.getByRole('link', { name: 'Corporate Branding' });
        this.configuration = page.getByRole('link', { name: 'Configuration' });
    }

    async searchUsers(criteria: {
        username?: string;
        userRole?: string;
        employeeName?: string;
        status?: string;
    }): Promise<void> {
        if (criteria.username) {
            await this.userManagement.users.searchForm.username.fill(criteria.username);
        }
        if (criteria.userRole) {
            await this.userManagement.users.searchForm.userRole.selectOption(criteria.userRole);
        }
        if (criteria.employeeName) {
            await this.userManagement.users.searchForm.employeeName.fill(criteria.employeeName);
        }
        if (criteria.status) {
            await this.userManagement.users.searchForm.status.selectOption(criteria.status);
        }
        await this.userManagement.users.searchForm.searchButton.click();
    }

    async resetUserSearch(): Promise<void> {
        await this.userManagement.users.searchForm.resetButton.click();
    }

    async navigateToJobSection(section: keyof AdminPage['job']): Promise<void> {
        await this.job[section].click();
    }

    async navigateToOrganization(section: keyof AdminPage['organization']): Promise<void> {
        await this.organization[section].click();
    }

    async navigateToQualifications(section: keyof AdminPage['qualifications']): Promise<void> {
        await this.qualifications[section].click();
    }
}
