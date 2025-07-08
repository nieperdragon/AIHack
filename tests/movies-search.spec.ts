import { test, expect } from '@playwright/test';

test('search for Garfield movie', async ({ page }) => {
  // Navigate to the movies app
  await page.goto('https://debs-obrien.github.io/playwright-movies-app');

  // Click the search button
  await page.getByRole('search').click();

  // Type 'Garfield' in the search input and press Enter
  await page.getByRole('textbox', { name: 'Search Input' }).fill('Garfield');
  await page.getByRole('textbox', { name: 'Search Input' }).press('Enter');

  // Verify that 'The Garfield Movie' appears in the search results
  await expect(page.getByRole('heading', { name: 'The Garfield Movie', level: 2 })).toBeVisible();
});
