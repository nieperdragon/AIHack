import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class DashboardPage extends BasePage {
    readonly timeAtWork: {
        punchStatus: Locator;
        lastPunchInfo: Locator;
        todayTime: {
            hours: Locator;
            minutes: Locator;
        };
        weekInfo: {
            dateRange: Locator;
            totalTime: Locator;
        };
    };

    readonly myActions: {
        pendingSelfReview: Locator;
        candidateToInterview: Locator;
    };

    readonly quickLaunch: {
        assignLeave: Locator;
        leaveList: Locator;
        timesheets: Locator;
        applyLeave: Locator;
        myLeave: Locator;
        myTimesheet: Locator;
    };

    readonly buzzLatestPosts: {
        posts: Locator;
        createPost: Locator;
    };

    readonly employeeOnLeave: {
        title: Locator;
        content: Locator;
    };

    readonly employeeDistribution: {
        bySubUnit: {
            title: Locator;
            chart: Locator;
        };
        byLocation: {
            title: Locator;
            chart: Locator;
        };
    };

    constructor(page: Page) {
        super(page);

        this.timeAtWork = {
            punchStatus: page.getByText('Punched Out').first(),
            lastPunchInfo: page.getByText(/Punched Out: .*/),
            todayTime: {
                hours: page.locator('text=0h').first(),
                minutes: page.locator('text=0m').first()
            },
            weekInfo: {
                dateRange: page.getByText(/Jun \d+ - Jun \d+/),
                totalTime: page.getByText('0h 0m').first()
            }
        };

        this.myActions = {
            pendingSelfReview: page.getByText(/\(\d+\) Pending Self Review/),
            candidateToInterview: page.getByText(/\(\d+\) Candidate to Interview/)
        };

        this.quickLaunch = {
            assignLeave: page.getByRole('button', { name: 'Assign Leave' }),
            leaveList: page.getByRole('button', { name: 'Leave List' }),
            timesheets: page.getByRole('button', { name: 'Timesheets' }),
            applyLeave: page.getByRole('button', { name: 'Apply Leave' }),
            myLeave: page.getByRole('button', { name: 'My Leave' }),
            myTimesheet: page.getByRole('button', { name: 'My Timesheet' })
        };

        this.buzzLatestPosts = {
            posts: page.locator('[class*="buzz-post-body"]'),
            createPost: page.locator('[class*="buzz-post-input"]')
        };

        this.employeeOnLeave = {
            title: page.getByText('Employees on Leave Today'),
            content: page.getByText('No Employees are on Leave Today')
        };

        this.employeeDistribution = {
            bySubUnit: {
                title: page.getByText('Employee Distribution by Sub Unit'),
                chart: page.locator('[class*="emp-dist-chart"]').first()
            },
            byLocation: {
                title: page.getByText('Employee Distribution by Location'),
                chart: page.locator('[class*="emp-dist-chart"]').last()
            }
        };
    }

    async clickQuickLaunchItem(item: keyof DashboardPage['quickLaunch']): Promise<void> {
        await this.quickLaunch[item].click();
    }

    async getTimeAtWorkSummary(): Promise<{
        status: string;
        todayHours: string;
        weekTotal: string;
    }> {
        return {
            status: await this.timeAtWork.punchStatus.textContent() || '',
            todayHours: `${await this.timeAtWork.todayTime.hours.textContent()}${await this.timeAtWork.todayTime.minutes.textContent()}`,
            weekTotal: await this.timeAtWork.weekInfo.totalTime.textContent() || ''
        };
    }

    async getPendingActions(): Promise<{
        reviews: number;
        interviews: number;
    }> {
        const reviewsText = await this.myActions.pendingSelfReview.textContent() || '';
        const interviewsText = await this.myActions.candidateToInterview.textContent() || '';
        
        return {
            reviews: parseInt(reviewsText.match(/\((\d+)\)/)?.[1] || '0'),
            interviews: parseInt(interviewsText.match(/\((\d+)\)/)?.[1] || '0')
        };
    }
}
