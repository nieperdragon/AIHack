import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class RecruitmentPage extends BasePage {
    readonly pageTitle: Locator;
    readonly candidates: {
        searchForm: {
            jobTitle: Locator;
            vacancy: Locator;
            hiringManager: Locator;
            status: Locator;
            candidateName: Locator;
            keywords: Locator;
            dateFrom: Locator;
            dateTo: Locator;
            methodOfApplication: Locator;
            searchButton: Locator;
            resetButton: Locator;
            addButton: Locator;
        };
        table: {
            headers: Locator;
            rows: Locator;
            checkbox: Locator;
            deleteSelected: Locator;
        };
    };

    readonly vacancies: {
        searchForm: {
            jobTitle: Locator;
            vacancy: Locator;
            hiringManager: Locator;
            status: Locator;
            searchButton: Locator;
            resetButton: Locator;
            addButton: Locator;
        };
        table: {
            headers: Locator;
            rows: Locator;
            checkbox: Locator;
            deleteSelected: Locator;
        };
    };

    constructor(page: Page) {
        super(page);
        
        this.pageTitle = page.getByRole('heading', { name: 'Recruitment' });

        this.candidates = {
            searchForm: {
                jobTitle: page.getByRole('combobox').filter({ hasText: /Job Title/ }),
                vacancy: page.getByRole('combobox').filter({ hasText: /Vacancy/ }),
                hiringManager: page.getByRole('combobox').filter({ hasText: /Hiring Manager/ }),
                status: page.getByRole('combobox').filter({ hasText: /Status/ }),
                candidateName: page.getByPlaceholder('Type for hints...').first(),
                keywords: page.getByRole('textbox').filter({ hasText: /Keywords/ }),
                dateFrom: page.locator('input[placeholder="yyyy-mm-dd"]').first(),
                dateTo: page.locator('input[placeholder="yyyy-mm-dd"]').last(),
                methodOfApplication: page.getByRole('combobox').filter({ hasText: /Method of Application/ }),
                searchButton: page.getByRole('button', { name: 'Search' }),
                resetButton: page.getByRole('button', { name: 'Reset' }),
                addButton: page.getByRole('button', { name: 'Add' })
            },
            table: {
                headers: page.locator('.oxd-table-header'),
                rows: page.locator('.oxd-table-card'),
                checkbox: page.getByRole('checkbox'),
                deleteSelected: page.getByRole('button', { name: 'Delete Selected' })
            }
        };

        this.vacancies = {
            searchForm: {
                jobTitle: page.getByRole('combobox').filter({ hasText: /Job Title/ }),
                vacancy: page.getByRole('combobox').filter({ hasText: /Vacancy/ }),
                hiringManager: page.getByRole('combobox').filter({ hasText: /Hiring Manager/ }),
                status: page.getByRole('combobox').filter({ hasText: /Status/ }),
                searchButton: page.getByRole('button', { name: 'Search' }),
                resetButton: page.getByRole('button', { name: 'Reset' }),
                addButton: page.getByRole('button', { name: 'Add' })
            },
            table: {
                headers: page.locator('.oxd-table-header'),
                rows: page.locator('.oxd-table-card'),
                checkbox: page.getByRole('checkbox'),
                deleteSelected: page.getByRole('button', { name: 'Delete Selected' })
            }
        };
    }

    async searchCandidates(criteria: {
        jobTitle?: string;
        vacancy?: string;
        hiringManager?: string;
        status?: string;
        candidateName?: string;
        keywords?: string;
        dateFrom?: string;
        dateTo?: string;
        methodOfApplication?: string;
    }): Promise<void> {
        const form = this.candidates.searchForm;
        
        if (criteria.jobTitle) await form.jobTitle.selectOption(criteria.jobTitle);
        if (criteria.vacancy) await form.vacancy.selectOption(criteria.vacancy);
        if (criteria.hiringManager) await form.hiringManager.selectOption(criteria.hiringManager);
        if (criteria.status) await form.status.selectOption(criteria.status);
        if (criteria.candidateName) await form.candidateName.fill(criteria.candidateName);
        if (criteria.keywords) await form.keywords.fill(criteria.keywords);
        if (criteria.dateFrom) await form.dateFrom.fill(criteria.dateFrom);
        if (criteria.dateTo) await form.dateTo.fill(criteria.dateTo);
        if (criteria.methodOfApplication) await form.methodOfApplication.selectOption(criteria.methodOfApplication);

        await form.searchButton.click();
    }

    async resetCandidateSearch(): Promise<void> {
        await this.candidates.searchForm.resetButton.click();
    }

    async searchVacancies(criteria: {
        jobTitle?: string;
        vacancy?: string;
        hiringManager?: string;
        status?: string;
    }): Promise<void> {
        const form = this.vacancies.searchForm;
        
        if (criteria.jobTitle) await form.jobTitle.selectOption(criteria.jobTitle);
        if (criteria.vacancy) await form.vacancy.selectOption(criteria.vacancy);
        if (criteria.hiringManager) await form.hiringManager.selectOption(criteria.hiringManager);
        if (criteria.status) await form.status.selectOption(criteria.status);

        await form.searchButton.click();
    }

    async resetVacancySearch(): Promise<void> {
        await this.vacancies.searchForm.resetButton.click();
    }
}
