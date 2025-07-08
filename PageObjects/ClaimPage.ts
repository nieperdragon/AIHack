import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class ClaimPage extends BasePage {
    readonly pageTitle: Locator;
    readonly submitClaim: {
        addButton: Locator;
        form: {
            event: Locator;
            currency: Locator;
            remarks: Locator;
            createButton: Locator;
            cancelButton: Locator;
        };
        expenses: {
            addButton: Locator;
            form: {
                expenseType: Locator;
                date: Locator;
                amount: Locator;
                notes: Locator;
                submitButton: Locator;
                cancelButton: Locator;
            };
            table: {
                headers: Locator;
                rows: Locator;
                amount: Locator;
                deleteButtons: Locator;
            };
        };
        submitButton: Locator;
    };

    readonly myClaims: {
        searchForm: {
            referenceId: Locator;
            status: Locator;
            fromDate: Locator;
            toDate: Locator;
            searchButton: Locator;
            resetButton: Locator;
        };
        table: {
            headers: Locator;
            rows: Locator;
            referenceId: Locator;
            claimType: Locator;
            submittedDate: Locator;
            status: Locator;
            actions: Locator;
        };
    };

    readonly employeeClaims: {
        searchForm: {
            referenceId: Locator;
            employeeName: Locator;
            status: Locator;
            fromDate: Locator;
            toDate: Locator;
            searchButton: Locator;
            resetButton: Locator;
        };
        table: {
            headers: Locator;
            rows: Locator;
            referenceId: Locator;
            employeeName: Locator;
            claimType: Locator;
            submittedDate: Locator;
            status: Locator;
            actions: Locator;
        };
    };

    readonly configuration: {
        events: {
            addButton: Locator;
            form: {
                name: Locator;
                description: Locator;
                status: Locator;
                saveButton: Locator;
                cancelButton: Locator;
            };
            table: {
                headers: Locator;
                rows: Locator;
                actions: Locator;
            };
        };
        expenseTypes: {
            addButton: Locator;
            form: {
                name: Locator;
                description: Locator;
                status: Locator;
                saveButton: Locator;
                cancelButton: Locator;
            };
            table: {
                headers: Locator;
                rows: Locator;
                actions: Locator;
            };
        };
    };

    constructor(page: Page) {
        super(page);
        
        this.pageTitle = page.getByRole('heading', { name: 'Claims' });

        this.submitClaim = {
            addButton: page.getByRole('button', { name: 'Submit Claim' }),
            form: {
                event: page.getByRole('combobox').filter({ hasText: /Event/ }),
                currency: page.getByRole('combobox').filter({ hasText: /Currency/ }),
                remarks: page.getByRole('textbox').filter({ hasText: /Remarks/ }),
                createButton: page.getByRole('button', { name: 'Create' }),
                cancelButton: page.getByRole('button', { name: 'Cancel' })
            },
            expenses: {
                addButton: page.getByRole('button', { name: 'Add Expense' }),
                form: {
                    expenseType: page.getByRole('combobox').filter({ hasText: /Expense Type/ }),
                    date: page.locator('input[placeholder="yyyy-mm-dd"]'),
                    amount: page.getByRole('spinbutton', { name: 'Amount' }),
                    notes: page.getByRole('textbox').filter({ hasText: /Notes/ }),
                    submitButton: page.getByRole('button', { name: 'Submit' }),
                    cancelButton: page.getByRole('button', { name: 'Cancel' })
                },
                table: {
                    headers: page.locator('.oxd-table-header'),
                    rows: page.locator('.oxd-table-card'),
                    amount: page.locator('.oxd-table-cell').filter({ hasText: /\d+(\.\d{2})?/ }),
                    deleteButtons: page.getByRole('button', { name: 'Delete' })
                }
            },
            submitButton: page.getByRole('button', { name: 'Submit' })
        };

        this.myClaims = {
            searchForm: {
                referenceId: page.getByPlaceholder('Reference Id'),
                status: page.getByRole('combobox').filter({ hasText: /Status/ }),
                fromDate: page.locator('input[placeholder="yyyy-mm-dd"]').first(),
                toDate: page.locator('input[placeholder="yyyy-mm-dd"]').last(),
                searchButton: page.getByRole('button', { name: 'Search' }),
                resetButton: page.getByRole('button', { name: 'Reset' })
            },
            table: {
                headers: page.locator('.oxd-table-header'),
                rows: page.locator('.oxd-table-card'),
                referenceId: page.locator('.oxd-table-cell').filter({ hasText: /CLM-\d+/ }),
                claimType: page.locator('.oxd-table-cell').filter({ hasText: /Travel|Medical|Training/ }),
                submittedDate: page.locator('.oxd-table-cell').filter({ hasText: /\d{4}-\d{2}-\d{2}/ }),
                status: page.locator('.oxd-table-cell').filter({ hasText: /Submitted|Approved|Rejected|Pending/ }),
                actions: page.locator('.oxd-table-cell-actions')
            }
        };

        this.employeeClaims = {
            searchForm: {
                referenceId: page.getByPlaceholder('Reference Id'),
                employeeName: page.getByPlaceholder('Type for hints...').first(),
                status: page.getByRole('combobox').filter({ hasText: /Status/ }),
                fromDate: page.locator('input[placeholder="yyyy-mm-dd"]').first(),
                toDate: page.locator('input[placeholder="yyyy-mm-dd"]').last(),
                searchButton: page.getByRole('button', { name: 'Search' }),
                resetButton: page.getByRole('button', { name: 'Reset' })
            },
            table: {
                headers: page.locator('.oxd-table-header'),
                rows: page.locator('.oxd-table-card'),
                referenceId: page.locator('.oxd-table-cell').filter({ hasText: /CLM-\d+/ }),
                employeeName: page.locator('.oxd-table-cell').filter({ hasText: /[A-Za-z]+ [A-Za-z]+/ }),
                claimType: page.locator('.oxd-table-cell').filter({ hasText: /Travel|Medical|Training/ }),
                submittedDate: page.locator('.oxd-table-cell').filter({ hasText: /\d{4}-\d{2}-\d{2}/ }),
                status: page.locator('.oxd-table-cell').filter({ hasText: /Submitted|Approved|Rejected|Pending/ }),
                actions: page.locator('.oxd-table-cell-actions')
            }
        };

        this.configuration = {
            events: {
                addButton: page.getByRole('button', { name: 'Add Event' }),
                form: {
                    name: page.getByRole('textbox').filter({ hasText: /Event Name/ }),
                    description: page.getByRole('textbox').filter({ hasText: /Description/ }),
                    status: page.getByRole('switch', { name: 'Status' }),
                    saveButton: page.getByRole('button', { name: 'Save' }),
                    cancelButton: page.getByRole('button', { name: 'Cancel' })
                },
                table: {
                    headers: page.locator('.oxd-table-header'),
                    rows: page.locator('.oxd-table-card'),
                    actions: page.locator('.oxd-table-cell-actions')
                }
            },
            expenseTypes: {
                addButton: page.getByRole('button', { name: 'Add Expense Type' }),
                form: {
                    name: page.getByRole('textbox').filter({ hasText: /Expense Type/ }),
                    description: page.getByRole('textbox').filter({ hasText: /Description/ }),
                    status: page.getByRole('switch', { name: 'Status' }),
                    saveButton: page.getByRole('button', { name: 'Save' }),
                    cancelButton: page.getByRole('button', { name: 'Cancel' })
                },
                table: {
                    headers: page.locator('.oxd-table-header'),
                    rows: page.locator('.oxd-table-card'),
                    actions: page.locator('.oxd-table-cell-actions')
                }
            }
        };
    }

    async submitNewClaim(details: {
        event: string;
        currency: string;
        remarks?: string;
        expenses: Array<{
            type: string;
            date: string;
            amount: number;
            notes?: string;
        }>;
    }): Promise<void> {
        await this.submitClaim.addButton.click();
        await this.submitClaim.form.event.selectOption(details.event);
        await this.submitClaim.form.currency.selectOption(details.currency);
        if (details.remarks) {
            await this.submitClaim.form.remarks.fill(details.remarks);
        }
        await this.submitClaim.form.createButton.click();

        for (const expense of details.expenses) {
            await this.submitClaim.expenses.addButton.click();
            await this.submitClaim.expenses.form.expenseType.selectOption(expense.type);
            await this.submitClaim.expenses.form.date.fill(expense.date);
            await this.submitClaim.expenses.form.amount.fill(expense.amount.toString());
            if (expense.notes) {
                await this.submitClaim.expenses.form.notes.fill(expense.notes);
            }
            await this.submitClaim.expenses.form.submitButton.click();
        }

        await this.submitClaim.submitButton.click();
    }

    async searchMyClaims(criteria: {
        referenceId?: string;
        status?: string;
        fromDate?: string;
        toDate?: string;
    }): Promise<void> {
        if (criteria.referenceId) {
            await this.myClaims.searchForm.referenceId.fill(criteria.referenceId);
        }
        if (criteria.status) {
            await this.myClaims.searchForm.status.selectOption(criteria.status);
        }
        if (criteria.fromDate) {
            await this.myClaims.searchForm.fromDate.fill(criteria.fromDate);
        }
        if (criteria.toDate) {
            await this.myClaims.searchForm.toDate.fill(criteria.toDate);
        }
        await this.myClaims.searchForm.searchButton.click();
    }

    async searchEmployeeClaims(criteria: {
        referenceId?: string;
        employeeName?: string;
        status?: string;
        fromDate?: string;
        toDate?: string;
    }): Promise<void> {
        if (criteria.referenceId) {
            await this.employeeClaims.searchForm.referenceId.fill(criteria.referenceId);
        }
        if (criteria.employeeName) {
            await this.employeeClaims.searchForm.employeeName.fill(criteria.employeeName);
        }
        if (criteria.status) {
            await this.employeeClaims.searchForm.status.selectOption(criteria.status);
        }
        if (criteria.fromDate) {
            await this.employeeClaims.searchForm.fromDate.fill(criteria.fromDate);
        }
        if (criteria.toDate) {
            await this.employeeClaims.searchForm.toDate.fill(criteria.toDate);
        }
        await this.employeeClaims.searchForm.searchButton.click();
    }

    async addEvent(details: {
        name: string;
        description?: string;
        status?: boolean;
    }): Promise<void> {
        await this.configuration.events.addButton.click();
        await this.configuration.events.form.name.fill(details.name);
        if (details.description) {
            await this.configuration.events.form.description.fill(details.description);
        }
        if (details.status === false) {
            await this.configuration.events.form.status.click();
        }
        await this.configuration.events.form.saveButton.click();
    }

    async addExpenseType(details: {
        name: string;
        description?: string;
        status?: boolean;
    }): Promise<void> {
        await this.configuration.expenseTypes.addButton.click();
        await this.configuration.expenseTypes.form.name.fill(details.name);
        if (details.description) {
            await this.configuration.expenseTypes.form.description.fill(details.description);
        }
        if (details.status === false) {
            await this.configuration.expenseTypes.form.status.click();
        }
        await this.configuration.expenseTypes.form.saveButton.click();
    }
}
