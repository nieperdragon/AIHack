import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class BuzzPage extends BasePage {
    readonly pageTitle: Locator;
    readonly postForm: {
        textArea: Locator;
        sharePhotos: Locator;
        shareVideo: Locator;
        postButton: Locator;
    };

    readonly feedControls: {
        mostRecent: Locator;
        mostLiked: Locator;
        mostCommented: Locator;
    };

    readonly posts: {
        container: Locator;
        post: Locator;
        authorName: Locator;
        timestamp: Locator;
        content: Locator;
        likeButton: Locator;
        commentButton: Locator;
        shareButton: Locator;
        commentBox: Locator;
        comments: {
            container: Locator;
            author: Locator;
            text: Locator;
            timestamp: Locator;
            likeButton: Locator;
        };
    };

    readonly sharePhotoModal: {
        dropZone: Locator;
        description: Locator;
        shareButton: Locator;
        cancelButton: Locator;
    };

    readonly shareVideoModal: {
        url: Locator;
        description: Locator;
        shareButton: Locator;
        cancelButton: Locator;
    };

    constructor(page: Page) {
        super(page);
        
        this.pageTitle = page.getByRole('heading', { name: 'Buzz' });

        this.postForm = {
            textArea: page.getByPlaceholder("What's on your mind?"),
            sharePhotos: page.getByRole('button', { name: 'Share Photos' }),
            shareVideo: page.getByRole('button', { name: 'Share Video' }),
            postButton: page.getByRole('button', { name: 'Post' })
        };

        this.feedControls = {
            mostRecent: page.getByRole('button', { name: 'Most Recent Posts' }),
            mostLiked: page.getByRole('button', { name: 'Most Liked Posts' }),
            mostCommented: page.getByRole('button', { name: 'Most Commented Posts' })
        };

        this.posts = {
            container: page.locator('.oxd-buzz-post-container'),
            post: page.locator('.oxd-buzz-post'),
            authorName: page.locator('.oxd-buzz-post-author'),
            timestamp: page.locator('.oxd-buzz-post-timestamp'),
            content: page.locator('.oxd-buzz-post-content'),
            likeButton: page.getByRole('button', { name: 'Like' }),
            commentButton: page.getByRole('button', { name: 'Comment' }),
            shareButton: page.getByRole('button', { name: 'Share' }),
            commentBox: page.getByPlaceholder('Write your comment...'),
            comments: {
                container: page.locator('.oxd-buzz-comment'),
                author: page.locator('.oxd-buzz-comment-author'),
                text: page.locator('.oxd-buzz-comment-content'),
                timestamp: page.locator('.oxd-buzz-comment-timestamp'),
                likeButton: page.getByRole('button', { name: 'Like Comment' })
            }
        };

        this.sharePhotoModal = {
            dropZone: page.locator('input[type="file"]'),
            description: page.getByPlaceholder('Write something about the photos...'),
            shareButton: page.getByRole('button', { name: 'Share' }),
            cancelButton: page.getByRole('button', { name: 'Cancel' })
        };

        this.shareVideoModal = {
            url: page.getByPlaceholder('Enter Video URL'),
            description: page.getByPlaceholder('Write something about the video...'),
            shareButton: page.getByRole('button', { name: 'Share' }),
            cancelButton: page.getByRole('button', { name: 'Cancel' })
        };
    }

    async createTextPost(text: string): Promise<void> {
        await this.postForm.textArea.fill(text);
        await this.postForm.postButton.click();
    }

    async sharePhotos(photosPaths: string[], description?: string): Promise<void> {
        await this.postForm.sharePhotos.click();
        await this.sharePhotoModal.dropZone.setInputFiles(photosPaths);
        if (description) {
            await this.sharePhotoModal.description.fill(description);
        }
        await this.sharePhotoModal.shareButton.click();
    }

    async shareVideo(url: string, description?: string): Promise<void> {
        await this.postForm.shareVideo.click();
        await this.shareVideoModal.url.fill(url);
        if (description) {
            await this.shareVideoModal.description.fill(description);
        }
        await this.shareVideoModal.shareButton.click();
    }

    async likePost(postIndex: number): Promise<void> {
        await this.posts.post.nth(postIndex).locator('button', { hasText: 'Like' }).click();
    }

    async commentOnPost(postIndex: number, comment: string): Promise<void> {
        await this.posts.post.nth(postIndex).locator('button', { hasText: 'Comment' }).click();
        await this.posts.commentBox.nth(postIndex).fill(comment);
        await this.page.keyboard.press('Enter');
    }

    async sortFeedBy(sort: 'recent' | 'liked' | 'commented'): Promise<void> {
        switch (sort) {
            case 'recent':
                await this.feedControls.mostRecent.click();
                break;
            case 'liked':
                await this.feedControls.mostLiked.click();
                break;
            case 'commented':
                await this.feedControls.mostCommented.click();
                break;
        }
    }

    async getPostContent(postIndex: number): Promise<{
        author: string;
        content: string;
        timestamp: string;
    }> {
        const post = this.posts.post.nth(postIndex);
        return {
            author: await post.locator('.oxd-buzz-post-author').textContent() || '',
            content: await post.locator('.oxd-buzz-post-content').textContent() || '',
            timestamp: await post.locator('.oxd-buzz-post-timestamp').textContent() || ''
        };
    }
}
