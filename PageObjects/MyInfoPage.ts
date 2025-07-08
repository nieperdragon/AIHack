import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class MyInfoPage extends BasePage {
    readonly pageTitle: Locator;
    readonly personalDetails: {
        firstName: Locator;
        middleName: Locator;
        lastName: Locator;
        nickname: Locator;
        employeeId: Locator;
        otherId: Locator;
        driverLicense: Locator;
        licenseExpiry: Locator;
        ssnNumber: Locator;
        sinNumber: Locator;
        nationality: Locator;
        maritalStatus: Locator;
        dateOfBirth: Locator;
        gender: {
            male: Locator;
            female: Locator;
        };
        militaryService: Locator;
        bloodType: Locator;
        saveButton: Locator;
    };

    readonly contactDetails: {
        street1: Locator;
        street2: Locator;
        city: Locator;
        state: Locator;
        zipCode: Locator;
        country: Locator;
        home: Locator;
        mobile: Locator;
        work: Locator;
        workEmail: Locator;
        otherEmail: Locator;
        saveButton: Locator;
    };

    readonly emergencyContacts: {
        addButton: Locator;
        name: Locator;
        relationship: Locator;
        home: Locator;
        mobile: Locator;
        work: Locator;
        saveButton: Locator;
        table: {
            headers: Locator;
            rows: Locator;
            deleteButtons: Locator;
        };
    };

    readonly dependents: {
        addButton: Locator;
        name: Locator;
        relationship: Locator;
        dateOfBirth: Locator;
        saveButton: Locator;
        table: {
            headers: Locator;
            rows: Locator;
            deleteButtons: Locator;
        };
    };

    readonly immigration: {
        addButton: Locator;
        documentType: {
            passport: Locator;
            visa: Locator;
        };
        number: Locator;
        issuedDate: Locator;
        expiryDate: Locator;
        eligibleStatus: Locator;
        issuedBy: Locator;
        eligibleReview: Locator;
        comments: Locator;
        saveButton: Locator;
        table: {
            headers: Locator;
            rows: Locator;
            deleteButtons: Locator;
        };
    };

    readonly job: {
        jobTitle: Locator;
        jobSpecification: Locator;
        employmentStatus: Locator;
        jobCategory: Locator;
        joinedDate: Locator;
        subUnit: Locator;
        location: Locator;
        startDate: Locator;
        endDate: Locator;
        contractDetails: Locator;
    };

    readonly salary: {
        addButton: Locator;
        salaryComponent: Locator;
        payGrade: Locator;
        payFrequency: Locator;
        currency: Locator;
        amount: Locator;
        comments: Locator;
        directDeposit: {
            accountNumber: Locator;
            accountType: Locator;
            routingNumber: Locator;
            amount: Locator;
        };
        saveButton: Locator;
    };

    readonly taxExemptions: {
        federal: {
            status: Locator;
            exemptions: Locator;
        };
        state: {
            state: Locator;
            status: Locator;
            exemptions: Locator;
            unemploymentState: Locator;
            workState: Locator;
        };
        saveButton: Locator;
    };

    constructor(page: Page) {
        super(page);
        
        this.pageTitle = page.getByRole('heading', { name: 'Personal Details' });

        this.personalDetails = {
            firstName: page.getByPlaceholder('First Name'),
            middleName: page.getByPlaceholder('Middle Name'),
            lastName: page.getByPlaceholder('Last Name'),
            nickname: page.getByPlaceholder('Nickname'),
            employeeId: page.locator('[name="employeeId"]'),
            otherId: page.locator('[name="otherId"]'),
            driverLicense: page.locator('[name="licenseNumber"]'),
            licenseExpiry: page.locator('[name="licenseExpiryDate"]'),
            ssnNumber: page.locator('[name="ssnNumber"]'),
            sinNumber: page.locator('[name="sinNumber"]'),
            nationality: page.getByRole('combobox').filter({ hasText: /Nationality/ }),
            maritalStatus: page.getByRole('combobox').filter({ hasText: /Marital Status/ }),
            dateOfBirth: page.locator('[name="birthday"]'),
            gender: {
                male: page.getByText('Male'),
                female: page.getByText('Female')
            },
            militaryService: page.locator('[name="militaryService"]'),
            bloodType: page.getByRole('combobox').filter({ hasText: /Blood Type/ }),
            saveButton: page.getByRole('button', { name: 'Save' }).first()
        };

        this.contactDetails = {
            street1: page.locator('[name="street1"]'),
            street2: page.locator('[name="street2"]'),
            city: page.locator('[name="city"]'),
            state: page.locator('[name="state"]'),
            zipCode: page.locator('[name="zip"]'),
            country: page.getByRole('combobox').filter({ hasText: /Country/ }),
            home: page.locator('[name="homePhone"]'),
            mobile: page.locator('[name="mobile"]'),
            work: page.locator('[name="workPhone"]'),
            workEmail: page.locator('[name="workEmail"]'),
            otherEmail: page.locator('[name="otherEmail"]'),
            saveButton: page.getByRole('button', { name: 'Save' }).first()
        };

        this.emergencyContacts = {
            addButton: page.getByRole('button', { name: 'Add' }),
            name: page.locator('[name="name"]'),
            relationship: page.locator('[name="relationship"]'),
            home: page.locator('[name="homePhone"]'),
            mobile: page.locator('[name="mobile"]'),
            work: page.locator('[name="workPhone"]'),
            saveButton: page.getByRole('button', { name: 'Save' }),
            table: {
                headers: page.locator('.oxd-table-header'),
                rows: page.locator('.oxd-table-card'),
                deleteButtons: page.getByRole('button', { name: 'Delete' })
            }
        };

        // Initialize other sections similarly...
    }

    async updatePersonalDetails(details: {
        firstName?: string;
        middleName?: string;
        lastName?: string;
        nickname?: string;
        nationality?: string;
        maritalStatus?: string;
        dateOfBirth?: string;
        gender?: 'Male' | 'Female';
    }): Promise<void> {
        if (details.firstName) await this.personalDetails.firstName.fill(details.firstName);
        if (details.middleName) await this.personalDetails.middleName.fill(details.middleName);
        if (details.lastName) await this.personalDetails.lastName.fill(details.lastName);
        if (details.nickname) await this.personalDetails.nickname.fill(details.nickname);
        if (details.nationality) await this.personalDetails.nationality.selectOption(details.nationality);
        if (details.maritalStatus) await this.personalDetails.maritalStatus.selectOption(details.maritalStatus);
        if (details.dateOfBirth) await this.personalDetails.dateOfBirth.fill(details.dateOfBirth);
        if (details.gender) {
            if (details.gender === 'Male') await this.personalDetails.gender.male.click();
            else await this.personalDetails.gender.female.click();
        }
        await this.personalDetails.saveButton.click();
    }

    async updateContactDetails(details: {
        street1?: string;
        street2?: string;
        city?: string;
        state?: string;
        zipCode?: string;
        country?: string;
        home?: string;
        mobile?: string;
        work?: string;
        workEmail?: string;
        otherEmail?: string;
    }): Promise<void> {
        if (details.street1) await this.contactDetails.street1.fill(details.street1);
        if (details.street2) await this.contactDetails.street2.fill(details.street2);
        if (details.city) await this.contactDetails.city.fill(details.city);
        if (details.state) await this.contactDetails.state.fill(details.state);
        if (details.zipCode) await this.contactDetails.zipCode.fill(details.zipCode);
        if (details.country) await this.contactDetails.country.selectOption(details.country);
        if (details.home) await this.contactDetails.home.fill(details.home);
        if (details.mobile) await this.contactDetails.mobile.fill(details.mobile);
        if (details.work) await this.contactDetails.work.fill(details.work);
        if (details.workEmail) await this.contactDetails.workEmail.fill(details.workEmail);
        if (details.otherEmail) await this.contactDetails.otherEmail.fill(details.otherEmail);
        await this.contactDetails.saveButton.click();
    }

    async addEmergencyContact(contact: {
        name: string;
        relationship: string;
        home?: string;
        mobile?: string;
        work?: string;
    }): Promise<void> {
        await this.emergencyContacts.addButton.click();
        await this.emergencyContacts.name.fill(contact.name);
        await this.emergencyContacts.relationship.fill(contact.relationship);
        if (contact.home) await this.emergencyContacts.home.fill(contact.home);
        if (contact.mobile) await this.emergencyContacts.mobile.fill(contact.mobile);
        if (contact.work) await this.emergencyContacts.work.fill(contact.work);
        await this.emergencyContacts.saveButton.click();
    }
}
