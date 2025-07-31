import { test, expect } from '@playwright/test';

test.describe('Email Simulator Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/email-simulator');
  });

  test.describe('Page Load and Initial State', () => {
    test('should load email simulator page correctly', async ({ page }) => {
      await expect(page.getByText('Email Auto-Response Simulator')).toBeVisible();
      await expect(page.getByText('Generate automated email templates')).toBeVisible();
      await expect(page.getByText('Email Configuration')).toBeVisible();
    });

    test('should display configuration options', async ({ page }) => {
      await expect(page.getByText('Select Application')).toBeVisible();
      await expect(page.getByText('Email Type')).toBeVisible();
      await expect(page.getByText('Generate Email Template')).toBeVisible();
    });

    test('should have generate button disabled initially', async ({ page }) => {
      const generateButton = page.getByRole('button', { name: /Generate Email Template/ });
      await expect(generateButton).toBeDisabled();
    });

    test('should display empty email preview area', async ({ page }) => {
      await expect(page.getByText('No Email Generated')).toBeVisible();
      await expect(page.getByText('Select an application and email type')).toBeVisible();
    });
  });

  test.describe('Application Selection', () => {
    test('should populate application dropdown with test data', async ({ page }) => {
      const applicationSelect = page.locator('select').first();
      
      await applicationSelect.click();
      await expect(page.getByText('Hans Mueller - work permit (WP-2024-1234)')).toBeVisible();
      await expect(page.getByText('Maria Santos - student visa (SV-2024-7891)')).toBeVisible();
      await expect(page.getByText('Ahmed Hassan - tourist visa (TV-2024-3456)')).toBeVisible();
      await expect(page.getByText('Elena Rossi - family reunification (FR-2024-5678)')).toBeVisible();
    });

    test('should enable generate button when application is selected', async ({ page }) => {
      const applicationSelect = page.locator('select').first();
      const generateButton = page.getByRole('button', { name: /Generate Email Template/ });
      
      await applicationSelect.selectOption('WP-2024-1234');
      await expect(generateButton).toBeEnabled();
    });

    test('should display application summary when selected', async ({ page }) => {
      const applicationSelect = page.locator('select').first();
      
      await applicationSelect.selectOption('WP-2024-1234');
      
      await expect(page.getByText('Application Summary')).toBeVisible();
      await expect(page.getByText('Hans Mueller')).toBeVisible();
      await expect(page.getByText('work permit')).toBeVisible();
      await expect(page.getByText('documents required')).toBeVisible();
    });
  });

  test.describe('Email Type Selection', () => {
    test('should display all email type options', async ({ page }) => {
      const emailTypeSelect = page.locator('select').nth(1);
      
      await emailTypeSelect.click();
      await expect(page.getByText('Status Update')).toBeVisible();
      await expect(page.getByText('Document Request')).toBeVisible();
      await expect(page.getByText('Approval Notification')).toBeVisible();
      await expect(page.getByText('Appointment Confirmation')).toBeVisible();
    });

    test('should change email type selection', async ({ page }) => {
      const emailTypeSelect = page.locator('select').nth(1);
      
      await emailTypeSelect.selectOption('approval_notification');
      await expect(emailTypeSelect).toHaveValue('approval_notification');
    });
  });

  test.describe('Email Generation', () => {
    test.beforeEach(async ({ page }) => {
      // Select an application first
      const applicationSelect = page.locator('select').first();
      await applicationSelect.selectOption('WP-2024-1234');
    });

    test('should generate status update email for Hans Mueller', async ({ page }) => {
      const generateButton = page.getByRole('button', { name: /Generate Email Template/ });
      
      await generateButton.click();
      
      // Wait for email generation
      await expect(page.getByText('Generated Email Template')).toBeVisible({ timeout: 2000 });
      
      // Check email content
      await expect(page.getByText(/WORK PERMIT Application - Additional Documents Required/)).toBeVisible();
      await expect(page.getByText(/Dear Hans Mueller/)).toBeVisible();
      await expect(page.getByText(/Employment Contract/)).toBeVisible();
      await expect(page.getByText(/German Language Proficiency/)).toBeVisible();
    });

    test('should generate document request email', async ({ page }) => {
      const emailTypeSelect = page.locator('select').nth(1);
      const generateButton = page.getByRole('button', { name: /Generate Email Template/ });
      
      await emailTypeSelect.selectOption('document_request');
      await generateButton.click();
      
      await expect(page.getByText(/URGENT - Missing Documents/)).toBeVisible({ timeout: 2000 });
      await expect(page.getByText(/MISSING DOCUMENTS/)).toBeVisible();
      await expect(page.getByText(/SUBMISSION METHODS/)).toBeVisible();
    });

    test('should generate approval email for approved application', async ({ page }) => {
      // Switch to approved application
      const applicationSelect = page.locator('select').first();
      const emailTypeSelect = page.locator('select').nth(1);
      const generateButton = page.getByRole('button', { name: /Generate Email Template/ });
      
      await applicationSelect.selectOption('TV-2024-3456'); // Ahmed Hassan - approved
      await emailTypeSelect.selectOption('approval_notification');
      await generateButton.click();
      
      await expect(page.getByText(/APPROVED - Your TOURIST VISA Application/)).toBeVisible({ timeout: 2000 });
      await expect(page.getByText(/Congratulations!/)).toBeVisible();
      await expect(page.getByText(/Ahmed Hassan/)).toBeVisible();
    });

    test('should generate appointment confirmation email', async ({ page }) => {
      const emailTypeSelect = page.locator('select').nth(1);
      const generateButton = page.getByRole('button', { name: /Generate Email Template/ });
      
      await emailTypeSelect.selectOption('appointment_confirmation');
      await generateButton.click();
      
      await expect(page.getByText(/Appointment Confirmation/)).toBeVisible({ timeout: 2000 });
      await expect(page.getByText(/APPOINTMENT DETAILS/)).toBeVisible();
      await expect(page.getByText(/German Foreign Office, Room 204/)).toBeVisible();
    });

    test('should generate rejection notice', async ({ page }) => {
      const emailTypeSelect = page.locator('select').nth(1);
      const generateButton = page.getByRole('button', { name: /Generate Email Template/ });
      
      await emailTypeSelect.selectOption('rejection_notice');
      await generateButton.click();
      
      await expect(page.getByText(/Application Decision/)).toBeVisible({ timeout: 2000 });
      await expect(page.getByText(/regret to inform you/)).toBeVisible();
      await expect(page.getByText(/Right to Appeal/)).toBeVisible();
    });

    test('should generate reminder notice', async ({ page }) => {
      const emailTypeSelect = page.locator('select').nth(1);
      const generateButton = page.getByRole('button', { name: /Generate Email Template/ });
      
      await emailTypeSelect.selectOption('reminder_notice');
      await generateButton.click();
      
      await expect(page.getByText(/REMINDER - Document Deadline Approaching/)).toBeVisible({ timeout: 2000 });
      await expect(page.getByText(/URGENT - Missing Documents/)).toBeVisible();
      await expect(page.getByText(/Days Remaining: 3 days/)).toBeVisible();
    });
  });

  test.describe('Email Preview and Edit Functionality', () => {
    test.beforeEach(async ({ page }) => {
      // Generate an email first
      const applicationSelect = page.locator('select').first();
      const generateButton = page.getByRole('button', { name: /Generate Email Template/ });
      
      await applicationSelect.selectOption('WP-2024-1234');
      await generateButton.click();
      await expect(page.getByText('Generated Email Template')).toBeVisible({ timeout: 2000 });
    });

    test('should show preview and copy buttons after generation', async ({ page }) => {
      await expect(page.getByRole('button', { name: /Preview/ })).toBeVisible();
      await expect(page.getByRole('button', { name: /Copy/ })).toBeVisible();
    });

    test('should toggle between edit and preview modes', async ({ page }) => {
      const previewButton = page.getByRole('button', { name: /Preview/ });
      
      // Switch to preview mode
      await previewButton.click();
      await expect(page.getByText('Email Preview')).toBeVisible();
      await expect(page.getByText('From: noreply@germany.gov')).toBeVisible();
      await expect(page.getByText('To: hans.mueller@email.de')).toBeVisible();
      
      // Switch back to edit mode
      const editButton = page.getByRole('button', { name: /Edit/ });
      await editButton.click();
      await expect(page.getByText('Generated Email Template')).toBeVisible();
    });

    test('should display email headers in preview mode', async ({ page }) => {
      const previewButton = page.getByRole('button', { name: /Preview/ });
      
      await previewButton.click();
      
      await expect(page.getByText('From: noreply@germany.gov')).toBeVisible();
      await expect(page.getByText('To: hans.mueller@email.de')).toBeVisible();
      await expect(page.getByText(/Subject:.*Additional Documents Required/)).toBeVisible();
    });

    test('should allow editing of generated email', async ({ page }) => {
      const emailTextarea = page.locator('textarea').last();
      
      // Modify email content
      await emailTextarea.clear();
      await emailTextarea.fill('Custom email content for testing');
      
      // Verify content is updated
      await expect(emailTextarea).toHaveValue('Custom email content for testing');
    });

    test('should copy email content to clipboard', async ({ page }) => {
      // Grant clipboard permissions
      await page.context().grantPermissions(['clipboard-write']);
      
      const copyButton = page.getByRole('button', { name: /Copy/ });
      await copyButton.click();
      
      // Verify copy action (note: actual clipboard testing is limited in Playwright)
      // This mainly tests that the button click doesn't cause errors
      await expect(copyButton).toBeVisible();
    });
  });

  test.describe('Different Application Scenarios', () => {
    const testScenarios = [
      {
        applicationId: 'WP-2024-1234',
        applicantName: 'Hans Mueller',
        expectedSubject: 'WORK PERMIT Application',
        expectedContent: 'Employment Contract'
      },
      {
        applicationId: 'SV-2024-7891',
        applicantName: 'Maria Santos',
        expectedSubject: 'STUDENT VISA Application',
        expectedContent: 'Extended Review in Progress'
      },
      {
        applicationId: 'TV-2024-3456',
        applicantName: 'Ahmed Hassan',
        expectedSubject: 'TOURIST VISA Application',
        expectedContent: 'processing normally'
      },
      {
        applicationId: 'FR-2024-5678',
        applicantName: 'Elena Rossi',
        expectedSubject: 'FAMILY REUNIFICATION Application',
        expectedContent: 'Extended Review in Progress'
      }
    ];

    testScenarios.forEach((scenario) => {
      test(`should generate appropriate email for ${scenario.applicantName}`, async ({ page }) => {
        const applicationSelect = page.locator('select').first();
        const generateButton = page.getByRole('button', { name: /Generate Email Template/ });
        
        await applicationSelect.selectOption(scenario.applicationId);
        await generateButton.click();
        
        await expect(page.getByText(new RegExp(scenario.expectedSubject))).toBeVisible({ timeout: 2000 });
        await expect(page.getByText(new RegExp(scenario.applicantName))).toBeVisible();
        await expect(page.getByText(new RegExp(scenario.expectedContent))).toBeVisible();
      });
    });
  });

  test.describe('Error Handling', () => {
    test('should handle no application selected gracefully', async ({ page }) => {
      const generateButton = page.getByRole('button', { name: /Generate Email Template/ });
      
      // Button should be disabled when no application is selected
      await expect(generateButton).toBeDisabled();
    });

    test('should maintain state when switching between applications', async ({ page }) => {
      const applicationSelect = page.locator('select').first();
      const generateButton = page.getByRole('button', { name: /Generate Email Template/ });
      
      // Select first application and generate email
      await applicationSelect.selectOption('WP-2024-1234');
      await generateButton.click();
      await expect(page.getByText(/Hans Mueller/)).toBeVisible({ timeout: 2000 });
      
      // Switch to different application
      await applicationSelect.selectOption('SV-2024-7891');
      await generateButton.click();
      await expect(page.getByText(/Maria Santos/)).toBeVisible({ timeout: 2000 });
    });
  });

})