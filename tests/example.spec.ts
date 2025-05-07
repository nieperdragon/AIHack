import { test, expect } from '@playwright/test';

test('homepage shows popular movies', async ({ page }) => {
  await page.goto('https://debs-obrien.github.io/playwright-movies-app');

  await expect(page.getByRole('main')).toMatchAriaSnapshot(`
    - main:
      - heading "Popular" [level=1]
      - heading "movies" [level=2]
      - list "movies"
  `);
});