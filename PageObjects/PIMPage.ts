import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class PIMPage extends BasePage {
    readonly pageTitle: Locator;
    readonly addEmployee: {
        button: Locator;
        form: {
            firstName: Locator;
            middleName: Locator;
            lastName: Locator;
            employeeId: Locator;
            image: Locator;
            saveButton: Locator;
            cancelButton: Locator;
            createLoginDetails: {
                switch: Locator;
                username: Locator;
                password: Locator;
                confirmPassword: Locator;
                enabled: Locator;
            };
        };
    };

    readonly employeeList: {
        searchForm: {
            employeeName: Locator;
            employeeId: Locator;
            employeeStatus: Locator;
            include: Locator;
            supervisorName: Locator;
            jobTitle: Locator;
            subUnit: Locator;
            searchButton: Locator;
            resetButton: Locator;
        };
        table: {
            headers: Locator;
            rows: Locator;
            checkbox: Locator;
            deleteSelected: Locator;
        };
    };    readonly personalDetails: {
        nationalityDropdown: Locator;
        maritalStatusDropdown: Locator;
        dateOfBirthInput: Locator;
        maleRadio: Locator;
        femaleRadio: Locator;
        saveButton: Locator;
    };

    constructor(page: Page) {
        super(page);
        
        this.pageTitle = page.getByRole('heading', { name: 'PIM' });        
        this.addEmployee = {
            button: page.getByRole('button', { name: 'Add' }),
            form: {
                firstName: page.getByRole('textbox', { name: 'First Name' }),
                middleName: page.getByRole('textbox', { name: 'Middle Name' }),
                lastName: page.getByRole('textbox', { name: 'Last Name' }),
                employeeId: page.locator('input.oxd-input').nth(1),  // Employee ID is typically the second input field
                image: page.locator('input[type="file"]'),
                saveButton: page.getByRole('button', { name: 'Save' }),
                cancelButton: page.getByRole('button', { name: 'Cancel' }),
                createLoginDetails: {
                    switch: page.getByText('Create Login Details'),
                    username: page.getByRole('textbox', { name: 'Username' }),
                    password: page.getByRole('textbox', { name: 'Password' }),
                    confirmPassword: page.getByRole('textbox', { name: 'Confirm Password' }),
                    enabled: page.getByText('Enabled')
                }
            }
        };        this.personalDetails = {
            nationalityDropdown: page.locator('.oxd-input-group').filter({ hasText: 'Nationality' }).locator('.oxd-select-wrapper'),
            maritalStatusDropdown: page.locator('.oxd-input-group').filter({ hasText: 'Marital Status' }).locator('.oxd-select-wrapper'),
            dateOfBirthInput: page.locator('input.oxd-input[placeholder="yyyy-mm-dd"]'),
            maleRadio: page.getByRole('radio').nth(0),
            femaleRadio: page.getByRole('radio').nth(1),
            saveButton: page.getByRole('button', { name: 'Save' }).first()
        };

        this.employeeList = {
            searchForm: {
                employeeName: page.getByPlaceholder('Type for hints...').first(),
                employeeId: page.locator('label').filter({ hasText: 'Employee Id' }).locator('xpath=following::input[1]'),
                employeeStatus: page.getByRole('combobox').filter({ hasText: /Employment Status/ }),
                include: page.getByRole('combobox').filter({ hasText: /Include/ }),
                supervisorName: page.getByRole('combobox').filter({ hasText: /Supervisor Name/ }),
                jobTitle: page.getByRole('combobox').filter({ hasText: /Job Title/ }),
                subUnit: page.getByRole('combobox').filter({ hasText: /Sub Unit/ }),
                searchButton: page.getByRole('button', { name: 'Search' }),
                resetButton: page.getByRole('button', { name: 'Reset' })
            },
            table: {
                headers: page.locator('.oxd-table-header'),
                rows: page.locator('.oxd-table-card'),
                checkbox: page.getByRole('checkbox'),
                deleteSelected: page.getByRole('button', { name: 'Delete Selected' })
            }
        };

        this.personalDetails = {
            nationalityDropdown: page.getByRole('combobox').filter({ hasText: 'Nationality' }),
            maritalStatusDropdown: page.getByRole('combobox').filter({ hasText: 'Marital Status' }),
            dateOfBirthInput: page.getByRole('textbox').filter({ hasText: 'Date of Birth' }),
            maleRadio: page.getByLabel('Male'),
            femaleRadio: page.getByLabel('Female'),
            saveButton: page.getByRole('button', { name: 'Save' }).nth(0)
        };
    }    async addNewEmployee(employee: {
        firstName: string;
        middleName?: string;
        lastName: string;
        employeeId?: string;
        imageFile?: string;
        createLogin?: {
            username: string;
            password: string;
            enabled?: boolean;
        };
    }): Promise<string> {
        // Click Add button and wait for form
        await this.addEmployee.button.click();
        await this.page.waitForLoadState('networkidle');
        await this.addEmployee.form.firstName.waitFor();
        
        // Fill in employee details
        await this.addEmployee.form.firstName.fill(employee.firstName);
        if (employee.middleName) {
            await this.addEmployee.form.middleName.fill(employee.middleName);
        }
        await this.addEmployee.form.lastName.fill(employee.lastName);

        // Click save and wait for navigation
        await this.addEmployee.form.saveButton.click();
        await this.page.waitForLoadState('networkidle');
        
        // Wait for navigation to personal details page
        await this.page.waitForURL(/\/pim\/viewPersonalDetails\/empNumber\/\d+/, { timeout: 10000 });
        
        // Wait for the form to load completely
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForTimeout(1000); // Extra wait for stability
          // Get the employee ID from the personal details form
        const employeeId = await this.getEmployeeIdFromPersonalDetails();
        
        console.log('=== Employee Creation Details ===');
        console.log('Employee ID from personal details:', employeeId);
        console.log('Current URL:', this.page.url());
        console.log('================================');
        
        return employeeId;
    }

    async searchEmployees(criteria: {
        name?: string;
        id?: string;
        status?: string;
        include?: string;
        supervisor?: string;
        jobTitle?: string;
        subUnit?: string;
    }): Promise<void> {
        if (criteria.name) {
            await this.employeeList.searchForm.employeeName.fill(criteria.name);
        }
        if (criteria.id) {
            await this.employeeList.searchForm.employeeId.fill(criteria.id);
        }
        if (criteria.status) {
            await this.employeeList.searchForm.employeeStatus.selectOption(criteria.status);
        }
        if (criteria.include) {
            await this.employeeList.searchForm.include.selectOption(criteria.include);
        }
        if (criteria.supervisor) {
            await this.employeeList.searchForm.supervisorName.selectOption(criteria.supervisor);
        }
        if (criteria.jobTitle) {
            await this.employeeList.searchForm.jobTitle.selectOption(criteria.jobTitle);
        }
        if (criteria.subUnit) {
            await this.employeeList.searchForm.subUnit.selectOption(criteria.subUnit);
        }

        await this.employeeList.searchForm.searchButton.click();
    }

    async resetSearch(): Promise<void> {
        await this.employeeList.searchForm.resetButton.click();
    }

    async deleteSelectedEmployees(): Promise<void> {
        await this.employeeList.table.deleteSelected.click();
        // Handle confirmation dialog if needed
    }    async searchEmployee({ employeeName, employeeId }: { employeeName?: string; employeeId?: string }): Promise<void> {
        // Wait for page load and click reset
        await this.page.waitForLoadState('networkidle');
        
        console.log('=== Search Employee Start ===');
        console.log('Resetting search filters...');
        
        await this.employeeList.searchForm.resetButton.click();
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForTimeout(1000); // Extra wait for the form to reset

        if (employeeId) {
            console.log('Searching by Employee ID:', employeeId);
            await this.employeeList.searchForm.employeeId.waitFor({ state: 'visible' });
            await this.employeeList.searchForm.employeeId.fill(employeeId);
            console.log('Employee ID field filled');
        }

        console.log('Clicking search button');
        await this.employeeList.searchForm.searchButton.click();
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForTimeout(2000); // Wait for search results to load

        console.log('Search completed');
    }

    async getSearchResults(): Promise<Locator> {
        await this.page.waitForLoadState('networkidle');
        
        // Check for "No Records Found" message
        const noRecordsLocator = this.page.getByText('No Records Found');
        const hasNoRecords = await noRecordsLocator.isVisible();
        
        if (hasNoRecords) {
            console.log('Search returned no records');
            return this.employeeList.table.rows;
        }

        // Wait for the table to be visible
        await this.employeeList.table.rows.first().waitFor({ state: 'visible', timeout: 10000 });
        
        // Log the number of results
        const count = await this.employeeList.table.rows.count();
        console.log(`Found ${count} search results`);
        
        return this.employeeList.table.rows;
    }    async getEmployeeIdFromPersonalDetails(): Promise<string> {
        // Wait for the personal details page to load completely
        await this.page.waitForLoadState('networkidle');
        
        // Wait for the employee ID field to be visible
        // It's the input following the "Employee Id" text
        const idField = this.page.locator('label')
            .filter({ hasText: 'Employee Id' })
            .locator('xpath=following::input[1]');
            
        await idField.waitFor({ state: 'visible', timeout: 10000 });
        
        const employeeId = await idField.inputValue();
        console.log('Employee ID from personal details:', employeeId);
        
        if (!employeeId) {
            throw new Error('Employee ID field is empty');
        }
        
        return employeeId;
    }    async setPersonalDetails({
        nationality,
        maritalStatus,
        dateOfBirth,
        gender
    }: {
        nationality: string;
        maritalStatus: string;
        dateOfBirth: string;
        gender: 'Male' | 'Female';
    }): Promise<void> {
        console.log('=== Setting Personal Details ===');
        
        // Wait for the form to be interactive
        await this.page.waitForLoadState('networkidle');
        
        // Set nationality
        console.log('Setting nationality:', nationality);
        const nationSelect = this.personalDetails.nationalityDropdown.locator('.oxd-select-text');
        await nationSelect.waitFor({ state: 'visible' });
        await nationSelect.click();
        await this.page.waitForTimeout(500);
        const nationOption = this.page.locator('.oxd-select-dropdown').locator('.oxd-select-option').filter({ hasText: nationality });
        await nationOption.click();
        await this.page.waitForTimeout(500);

        // Set marital status
        console.log('Setting marital status:', maritalStatus);
        const maritalSelect = this.personalDetails.maritalStatusDropdown.locator('.oxd-select-text');
        await maritalSelect.waitFor({ state: 'visible' });
        await maritalSelect.click();
        await this.page.waitForTimeout(500);
        const maritalOption = this.page.locator('.oxd-select-dropdown').locator('.oxd-select-option').filter({ hasText: maritalStatus });
        await maritalOption.click();
        await this.page.waitForTimeout(500);

        // Set date of birth
        console.log('Setting date of birth:', dateOfBirth);
        const [year, month, day] = dateOfBirth.split('-');
        const formattedDate = `${year}-${month}-${day}`;
        await this.personalDetails.dateOfBirthInput.fill(formattedDate);
        await this.page.keyboard.press('Tab');
        await this.page.waitForTimeout(500);

        // Set gender
        console.log('Setting gender:', gender);
        if (gender === 'Male') {
            await this.personalDetails.maleRadio.check();
        } else {
            await this.personalDetails.femaleRadio.check();
        }

        // Save changes
        console.log('Saving personal details');
        await this.personalDetails.saveButton.click();
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForTimeout(1000);

        console.log('Personal details saved');
    }
}
