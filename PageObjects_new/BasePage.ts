import { Page, Locator } from '@playwright/test';

export class BasePage {
    readonly page: Page;
    readonly logo: Locator;
    readonly footerVersion: Locator;
    readonly footerCopyright: Locator;
    readonly brandLink: Locator;
    readonly topbarMenu: {
        search: Locator;
        userProfile: {
            image: Locator;
            name: Locator;
            button: Locator;
        };
    };
    readonly sidebar: {
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

    constructor(page: Page) {
        this.page = page;
        this.logo = page.getByAltText('client brand banner');
        this.footerVersion = page.getByText('OrangeHRM OS 5.7');
        this.footerCopyright = page.getByText(/© 2005 - \d{4}/);
        this.brandLink = page.getByRole('link', { name: 'client brand banner' });
        
        // Topbar elements
        this.topbarMenu = {
            search: page.getByPlaceholder('Search'),
            userProfile: {
                image: page.getByAltText('profile picture').first(),
                name: page.locator('[class*="userdropdown"]'),
                button: page.getByRole('button').filter({ hasText: '' }).last()
            }
        };

        // Sidebar navigation
        this.sidebar = {
            admin: page.getByRole('link', { name: 'Admin' }),
            pim: page.getByRole('link', { name: 'PIM' }),
            leave: page.getByRole('link', { name: 'Leave' }),
            time: page.getByRole('link', { name: 'Time' }),
            recruitment: page.getByRole('link', { name: 'Recruitment' }),
            myInfo: page.getByRole('link', { name: 'My Info' }),
            performance: page.getByRole('link', { name: 'Performance' }),
            dashboard: page.getByRole('link', { name: 'Dashboard' }),
            directory: page.getByRole('link', { name: 'Directory' }),
            maintenance: page.getByRole('link', { name: 'Maintenance' }),            claim: page.getByRole('link', { name: 'Claim' }),
            buzz: page.getByRole('link', { name: 'Buzz' })
        };
    }

    async getVersion(): Promise<string> {
        return await this.footerVersion.textContent() || '';
    }

    async clickBrandLink(): Promise<void> {
        await this.brandLink.click();
    }

    async navigateTo(section: keyof BasePage['sidebar']): Promise<void> {
        await this.sidebar[section].click();
    }

    async searchFor(text: string): Promise<void> {
        await this.topbarMenu.search.fill(text);
    }

    async openUserMenu(): Promise<void> {
        await this.page.getByRole('banner').getByRole('img', { name: 'profile picture' }).click();
    }

    async logout(): Promise<void> {
        await this.openUserMenu();
        await this.page.getByRole('menuitem', { name: 'Logout' }).click();
    }
}
