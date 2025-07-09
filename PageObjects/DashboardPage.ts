import { Page, Locator } from '@playwright/test';

export class DashboardPage {
    readonly page: Page;
    
    // Navigation elements
    readonly navigation: {
        admin: Locator;
        pim: Locator;
        leave: Locator;
        time: Locator;
        recruitment: Locator;
        myInfo: Locator;
        performance: Locator;
        dashboard: Locator;
        directory: Locator;
        maintenance: Locator;
        claim: Locator;
        buzz: Locator;
    };

    // Top bar elements
    readonly topBar: {
        searchBox: Locator;
        userProfileButton: Locator;
        userDropdown: Locator;
        logoutOption: Locator;
    };

    // Dashboard content
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
        this.page = page;

        // Navigation
        this.navigation = {
            admin: page.getByRole('link', { name: 'Admin' }),
            pim: page.getByRole('link', { name: 'PIM' }),
            leave: page.getByRole('link', { name: 'Leave' }),
            time: page.getByRole('link', { name: 'Time' }),
            recruitment: page.getByRole('link', { name: 'Recruitment' }),
            myInfo: page.getByRole('link', { name: 'My Info' }),
            performance: page.getByRole('link', { name: 'Performance' }),
            dashboard: page.getByRole('link', { name: 'Dashboard' }),
            directory: page.getByRole('link', { name: 'Directory' }),
            maintenance: page.getByRole('link', { name: 'Maintenance' }),
            claim: page.getByRole('link', { name: 'Claim' }),
            buzz: page.getByRole('link', { name: 'Buzz' })
        };

        // Top bar
        this.topBar = {
            searchBox: page.getByPlaceholder('Search'),
            userProfileButton: page.locator('.oxd-userdropdown-img').first(),
            userDropdown: page.locator('[class*="userdropdown"]'),
            logoutOption: page.getByRole('menuitem', { name: 'Logout' })
        };

        // Time at work
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

        // My actions
        this.myActions = {
            pendingSelfReview: page.getByText(/\(\d+\) Pending Self Review/),
            candidateToInterview: page.getByText(/\(\d+\) Candidate to Interview/)
        };

        // Quick launch
        this.quickLaunch = {
            assignLeave: page.getByRole('button', { name: 'Assign Leave' }),
            leaveList: page.getByRole('button', { name: 'Leave List' }),
            timesheets: page.getByRole('button', { name: 'Timesheets' }),
            applyLeave: page.getByRole('button', { name: 'Apply Leave' }),
            myLeave: page.getByRole('button', { name: 'My Leave' }),
            myTimesheet: page.getByRole('button', { name: 'My Timesheet' })
        };

        // Buzz latest posts
        this.buzzLatestPosts = {
            posts: page.locator('[class*="buzz-post-body"]'),
            createPost: page.locator('[class*="buzz-post-input"]')
        };

        // Employee on leave
        this.employeeOnLeave = {
            title: page.getByText('Employees on Leave Today'),
            content: page.getByText('No Employees are on Leave Today')
        };

        // Employee distribution
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

    async navigateTo(section: keyof DashboardPage['navigation']): Promise<void> {
        await this.navigation[section].click();
    }

    async openUserMenu(): Promise<void> {
        await this.topBar.userProfileButton.click();
    }

    async logout(): Promise<void> {
        await this.openUserMenu();
        await this.topBar.logoutOption.click();
    }

    async searchFor(text: string): Promise<void> {
        await this.topBar.searchBox.fill(text);
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

    async waitForDashboard(): Promise<void> {
        await this.page.waitForURL('**/dashboard/index');
        await this.timeAtWork.punchStatus.waitFor({ state: 'visible' });
    }
} 