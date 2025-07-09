import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class TimePage extends BasePage {
    readonly pageTitle: Locator;
    readonly timesheets: {
        myTimesheets: {
            dateInput: Locator;
            viewButton: Locator;
        };
        employeeTimesheets: {
            employeeName: Locator;
            viewButton: Locator;
        };
    };

    readonly attendance: {
        myRecords: {
            dateInput: Locator;
            viewButton: Locator;
        };
        punchInOut: {
            dateTime: Locator;
            note: Locator;
            inButton: Locator;
            outButton: Locator;
        };
        employeeRecords: {
            employeeName: Locator;
            dateInput: Locator;
            viewButton: Locator;
        };
    };

    readonly reports: {
        projectReports: Locator;
        employeeReports: Locator;
        attendanceSummary: Locator;
    };

    readonly projectInfo: {
        customers: Locator;
        projects: Locator;
    };

    constructor(page: Page) {
        super(page);
        
        this.pageTitle = page.getByRole('heading', { name: 'Time' });

        this.timesheets = {
            myTimesheets: {
                dateInput: page.locator('input[placeholder="yyyy-mm-dd"]').first(),
                viewButton: page.getByRole('button', { name: 'View' }).first()
            },
            employeeTimesheets: {
                employeeName: page.getByPlaceholder('Type for hints...').first(),
                viewButton: page.getByRole('button', { name: 'View' }).last()
            }
        };

        this.attendance = {
            myRecords: {
                dateInput: page.locator('input[placeholder="yyyy-mm-dd"]').first(),
                viewButton: page.getByRole('button', { name: 'View' }).first()
            },
            punchInOut: {
                dateTime: page.locator('input[placeholder="yyyy-mm-dd"]'),
                note: page.getByRole('textbox').filter({ hasText: /Note/ }),
                inButton: page.getByRole('button', { name: 'In' }),
                outButton: page.getByRole('button', { name: 'Out' })
            },
            employeeRecords: {
                employeeName: page.getByPlaceholder('Type for hints...').first(),
                dateInput: page.locator('input[placeholder="yyyy-mm-dd"]'),
                viewButton: page.getByRole('button', { name: 'View' })
            }
        };

        this.reports = {
            projectReports: page.getByRole('link', { name: 'Project Reports' }),
            employeeReports: page.getByRole('link', { name: 'Employee Reports' }),
            attendanceSummary: page.getByRole('link', { name: 'Attendance Summary' })
        };

        this.projectInfo = {
            customers: page.getByRole('link', { name: 'Customers' }),
            projects: page.getByRole('link', { name: 'Projects' })
        };
    }

    async viewMyTimesheet(date: string): Promise<void> {
        await this.timesheets.myTimesheets.dateInput.fill(date);
        await this.timesheets.myTimesheets.viewButton.click();
    }

    async viewEmployeeTimesheet(employeeName: string): Promise<void> {
        await this.timesheets.employeeTimesheets.employeeName.fill(employeeName);
        await this.timesheets.employeeTimesheets.viewButton.click();
    }

    async punchIn(note?: string): Promise<void> {
        if (note) {
            await this.attendance.punchInOut.note.fill(note);
        }
        await this.attendance.punchInOut.inButton.click();
    }

    async punchOut(note?: string): Promise<void> {
        if (note) {
            await this.attendance.punchInOut.note.fill(note);
        }
        await this.attendance.punchInOut.outButton.click();
    }

    async viewAttendanceRecords(date: string): Promise<void> {
        await this.attendance.myRecords.dateInput.fill(date);
        await this.attendance.myRecords.viewButton.click();
    }

    async navigateToReport(type: keyof TimePage['reports']): Promise<void> {
        await this.reports[type].click();
    }

    async navigateToProjectInfo(section: keyof TimePage['projectInfo']): Promise<void> {
        await this.projectInfo[section].click();
    }
}
