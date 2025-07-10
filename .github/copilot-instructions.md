# Copilot Instructions

This is a Playwright test automation project that uses the Page Object Model (POM) design pattern.

## Architecture

The project is structured as follows:
- `tests/`: Contains all the Playwright test files (`.spec.ts`).
- `PageObjects/`: Contains the Page Object Model files. Each file represents a page or a major component of the web application and encapsulates the locators and actions for that page.
- `utilities/`: Contains helper functions and utilities, such as the `axeHelper.ts` for running accessibility tests.
- `playwright.config.ts`: The main configuration file for Playwright.

## Agent Personas & Workflows

This repository contains instructions for two primary AI agent workflows. Before starting, please identify which workflow is required.

### 1. Creating Page Object Models (POMs)

When asked to create page objects for a website, you must follow the detailed instructions in `.github/create-pom-rules.md`.

**Key Steps:**
1.  **PLAN/ACT Mode**: Operate in a two-mode cycle. First, create and present a detailed plan. Do not make any changes until the user approves by typing "ACT".
2.  **Analyze the Website**: Systematically explore the target website to identify key pages and components.
3.  **Generate Page Objects**: Create TypeScript classes in the `PageObjects/` directory.
4.  **Define Locators**: All locators must be defined as `readonly` properties at the top of the class. Methods should reference these properties, not define their own locators.
5.  **Integrate Accessibility**: Add an accessibility test method to each page object that uses the `testAccessibility` function from `utilities/axeHelper.ts`.

**Example Page Object Structure:**
```typescript
import { Page, Locator } from '@playwright/test';
import { testAccessibility } from '../utilities/axeHelper';

export class ExamplePage {
    readonly page: Page;
    readonly someElement: Locator;

    constructor(page: Page) {
        this.page = page;
        this.someElement = page.getByRole('button', { name: 'Click Me' });
    }

    async doSomething(): Promise<void> {
        await this.someElement.click();
    }

    async checkAccessibility(): Promise<void> {
        await testAccessibility(this.page);
    }
}
```

### 2. Generating Test Cases from Scenarios

When given a scenario to automate, you must follow the instructions in `.github/generate-test-cases.md`.

**Key Steps:**
1.  **PLAN/ACT Mode**: Similar to creating POMs, you must present a plan and wait for user approval.
2.  **Leverage Existing POMs**: Analyze the scenario and identify which existing page objects in the `PageObjects/` directory can be used.
3.  **Update Page Objects if Necessary**: If new interactions are needed, add them to the appropriate page object. Do not put automation logic directly in the test file.
4.  **Generate Test File**: Create a new test file in the `tests/` directory that uses the page objects to execute the scenario.

### Running Tests

To run a specific test, use the following command. You can add flags like `--headed` for UI mode or `--project=chromium` to specify a browser.

```bash
npx playwright test tests/your-test-file.spec.ts
```
