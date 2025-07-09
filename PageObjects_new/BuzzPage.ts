import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class BuzzPage extends BasePage {
    readonly pageTitle: Locator;
    readonly postInput: Locator;
    readonly postButton: Locator;
    readonly sharePhotosButton: Locator;
    readonly shareVideoButton: Locator;
    readonly mostRecentPostsButton: Locator;
    readonly mostLikedPostsButton: Locator;
    readonly mostCommentedPostsButton: Locator;
    readonly newsfeed: Locator;
    readonly upcomingAnniversaries: Locator;
    readonly twitterLink: Locator;

    constructor(page: Page) {
        super(page);
        this.pageTitle = page.getByRole('heading', { name: 'Buzz' });
        this.postInput = page.getByPlaceholder("What's on your mind?");
        this.postButton = page.getByRole('button', { name: 'Post' });
        this.sharePhotosButton = page.getByRole('button', { name: 'Share Photos' });
        this.shareVideoButton = page.getByRole('button', { name: 'Share Video' });
        this.mostRecentPostsButton = page.getByRole('button', { name: /Most Recent Posts/i });
        this.mostLikedPostsButton = page.getByRole('button', { name: /Most Liked Posts/i });
        this.mostCommentedPostsButton = page.getByRole('button', { name: /Most Commented Posts/i });
        this.newsfeed = page.getByText('Buzz Newsfeed');
        this.upcomingAnniversaries = page.getByText('Upcoming Anniversaries');
        this.twitterLink = page.locator('a[href*="x.com"], a[href*="twitter.com"]');
    }

    async createPost(content: string): Promise<void> {
        await this.postInput.fill(content);
        await this.postButton.click();
    }

    async sharePhoto(): Promise<void> {
        await this.sharePhotosButton.click();
    }

    async shareVideo(): Promise<void> {
        await this.shareVideoButton.click();
    }

    async filterByMostRecent(): Promise<void> {
        await this.mostRecentPostsButton.click();
    }

    async filterByMostLiked(): Promise<void> {
        await this.mostLikedPostsButton.click();
    }

    async filterByMostCommented(): Promise<void> {
        await this.mostCommentedPostsButton.click();
    }

    async clickTwitterLinkAndVerifyUrl(expectedUrl: string): Promise<void> {
        const [newPage] = await Promise.all([
            this.page.context().waitForEvent('page'),
            this.twitterLink.first().click({ button: 'middle' }) // open in new tab
        ]);
        await newPage.waitForLoadState();
        const url = newPage.url();
        if (!url.includes(expectedUrl)) {
            throw new Error(`Expected Twitter URL to include ${expectedUrl}, but got ${url}`);
        }
        await newPage.close();
    }
} 