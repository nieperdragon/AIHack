import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class LeavePage extends BasePage {
    readonly pageTitle: Locator;
    readonly applyLeave: {
        button: Locator;
        form: {
            leaveType: Locator;
            fromDate: Locator;
            toDate: Locator;
            comment: Locator;
            duration: {
                fullDay: Locator;
                halfDay: Locator;
                specifyTime: Locator;
                fromTime: Locator;
                toTime: Locator;
            };
            balanceLabel: Locator;
            submitButton: Locator;
        };
    };

    readonly leaveList: {
        searchForm: {
            fromDate: Locator;
            toDate: Locator;
            leaveStatus: {
                rejected: Locator;
                cancelled: Locator;
                pendingApproval: Locator;
                scheduled: Locator;
                taken: Locator;
            };
            leaveType: Locator;
            employee: Locator;
            subUnit: Locator;
            searchButton: Locator;
            resetButton: Locator;
        };
        table: {
            headers: Locator;
            rows: Locator;
        };
    };

    readonly entitlements: {
        addButton: Locator;
        employeeName: Locator;
        leaveType: Locator;
        leavePeriod: Locator;
        entitlement: Locator;
        submitButton: Locator;
    };

    constructor(page: Page) {
        super(page);
        
        this.pageTitle = page.getByRole('heading', { name: 'Leave' });

        this.applyLeave = {
            button: page.getByRole('button', { name: 'Apply' }),
            form: {
                leaveType: page.getByRole('combobox').filter({ hasText: /Leave Type/ }),
                fromDate: page.locator('input[placeholder="yyyy-mm-dd"]').first(),
                toDate: page.locator('input[placeholder="yyyy-mm-dd"]').last(),
                comment: page.getByRole('textbox').filter({ hasText: /Comment/ }),
                duration: {
                    fullDay: page.getByText('Full Day'),
                    halfDay: page.getByText('Half Day'),
                    specifyTime: page.getByText('Specify Time'),
                    fromTime: page.locator('input[type="time"]').first(),
                    toTime: page.locator('input[type="time"]').last()
                },
                balanceLabel: page.getByText(/Balance:/),
                submitButton: page.getByRole('button', { name: 'Apply' })
            }
        };

        this.leaveList = {
            searchForm: {
                fromDate: page.locator('input[placeholder="yyyy-mm-dd"]').first(),
                toDate: page.locator('input[placeholder="yyyy-mm-dd"]').last(),
                leaveStatus: {
                    rejected: page.getByText('Rejected'),
                    cancelled: page.getByText('Cancelled'),
                    pendingApproval: page.getByText('Pending Approval'),
                    scheduled: page.getByText('Scheduled'),
                    taken: page.getByText('Taken')
                },
                leaveType: page.getByRole('combobox').filter({ hasText: /Leave Type/ }),
                employee: page.getByPlaceholder('Type for hints...').first(),
                subUnit: page.getByRole('combobox').filter({ hasText: /Sub Unit/ }),
                searchButton: page.getByRole('button', { name: 'Search' }),
                resetButton: page.getByRole('button', { name: 'Reset' })
            },
            table: {
                headers: page.locator('.oxd-table-header'),
                rows: page.locator('.oxd-table-card')
            }
        };

        this.entitlements = {
            addButton: page.getByRole('button', { name: 'Add' }),
            employeeName: page.getByPlaceholder('Type for hints...').first(),
            leaveType: page.getByRole('combobox').filter({ hasText: /Leave Type/ }),
            leavePeriod: page.getByRole('combobox').filter({ hasText: /Leave Period/ }),
            entitlement: page.getByRole('spinbutton'),
            submitButton: page.getByRole('button', { name: 'Save' })
        };
    }

    async applyForLeave(details: {
        leaveType: string;
        fromDate: string;
        toDate: string;
        duration?: 'Full Day' | 'Half Day' | 'Specify Time';
        fromTime?: string;
        toTime?: string;
        comment?: string;
    }): Promise<void> {
        await this.applyLeave.button.click();
        await this.applyLeave.form.leaveType.selectOption(details.leaveType);
        await this.applyLeave.form.fromDate.fill(details.fromDate);
        await this.applyLeave.form.toDate.fill(details.toDate);

        if (details.duration) {
            switch (details.duration) {
                case 'Half Day':
                    await this.applyLeave.form.duration.halfDay.click();
                    break;
                case 'Specify Time':
                    await this.applyLeave.form.duration.specifyTime.click();
                    if (details.fromTime) await this.applyLeave.form.duration.fromTime.fill(details.fromTime);
                    if (details.toTime) await this.applyLeave.form.duration.toTime.fill(details.toTime);
                    break;
            }
        }

        if (details.comment) {
            await this.applyLeave.form.comment.fill(details.comment);
        }

        await this.applyLeave.form.submitButton.click();
    }

    async searchLeave(criteria: {
        fromDate?: string;
        toDate?: string;
        leaveType?: string;
        status?: ('Rejected' | 'Cancelled' | 'Pending Approval' | 'Scheduled' | 'Taken')[];
        employee?: string;
        subUnit?: string;
    }): Promise<void> {
        if (criteria.fromDate) {
            await this.leaveList.searchForm.fromDate.fill(criteria.fromDate);
        }
        if (criteria.toDate) {
            await this.leaveList.searchForm.toDate.fill(criteria.toDate);
        }
        if (criteria.leaveType) {
            await this.leaveList.searchForm.leaveType.selectOption(criteria.leaveType);
        }
        if (criteria.status) {
            for (const status of criteria.status) {
                await this.leaveList.searchForm.leaveStatus[status.toLowerCase().replace(' ', '') as keyof typeof this.leaveList.searchForm.leaveStatus].click();
            }
        }
        if (criteria.employee) {
            await this.leaveList.searchForm.employee.fill(criteria.employee);
        }
        if (criteria.subUnit) {
            await this.leaveList.searchForm.subUnit.selectOption(criteria.subUnit);
        }

        await this.leaveList.searchForm.searchButton.click();
    }

    async addLeaveEntitlement(details: {
        employee: string;
        leaveType: string;
        period: string;
        entitlement: number;
    }): Promise<void> {
        await this.entitlements.addButton.click();
        await this.entitlements.employeeName.fill(details.employee);
        await this.entitlements.leaveType.selectOption(details.leaveType);
        await this.entitlements.leavePeriod.selectOption(details.period);
        await this.entitlements.entitlement.fill(details.entitlement.toString());
        await this.entitlements.submitButton.click();
    }
}
