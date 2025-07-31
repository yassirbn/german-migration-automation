import { test, expect } from '@playwright/test';

test.describe('Chatbot Authentication and Interaction Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/chatbot');
  });

  test.describe('Page Load and Initial State', () => {
    test('should load chatbot page with correct elements', async ({ page }) => {
      // Check page title and description
      await expect(page.getByText('AI Chatbot Interface')).toBeVisible();
      await expect(page.getByText('Get instant answers about your visa application')).toBeVisible();
      
      // Check initial bot message
      await expect(page.getByText(/Hello! I'm your virtual assistant/)).toBeVisible();
      
      // Check input field is present
      await expect(page.getByPlaceholder(/Enter your application ID or name/)).toBeVisible();
      
      // Check send button is present
      await expect(page.getByRole('button').filter({ hasText: 'Send' })).toBeVisible();
    });

    test('should display quick actions sidebar', async ({ page }) => {
      await expect(page.getByText('Quick Actions')).toBeVisible();
      await expect(page.getByText('Check my application status')).toBeVisible();
      await expect(page.getByText('What documents do I need?')).toBeVisible();
      await expect(page.getByText('How long will processing take?')).toBeVisible();
      await expect(page.getByText('I need urgent processing')).toBeVisible();
    });

    test('should display test accounts for demo', async ({ page }) => {
      await expect(page.getByText('Test Accounts')).toBeVisible();
      await expect(page.getByText('Hans Mueller')).toBeVisible();
      await expect(page.getByText('Maria Santos')).toBeVisible();
      await expect(page.getByText('Ahmed Hassan')).toBeVisible();
    });
  });

  test.describe('Authentication Flow', () => {
    test('should authenticate with valid application ID', async ({ page }) => {
      const chatInput = page.getByPlaceholder(/Enter your application ID or name/);
      const sendButton = page.getByRole('button').filter({ hasText: 'Send' });
      
      // Send application ID
      await chatInput.fill('WP-2024-1234');
      await sendButton.click();
      
      // Wait for response
      await expect(page.getByText(/Welcome back, Hans Mueller/)).toBeVisible({ timeout: 3000 });
      await expect(page.getByText(/work permit application/)).toBeVisible();
      
      // Check authentication indicator
      await expect(page.getByText('Hans Mueller').first()).toBeVisible();
    });

    test('should authenticate with name and date of birth', async ({ page }) => {
      const chatInput = page.getByPlaceholder(/Enter your application ID or name/);
      const sendButton = page.getByRole('button').filter({ hasText: 'Send' });
      
      // Send name and DOB
      await chatInput.fill('Maria Santos, born 22.08.1992');
      await sendButton.click();
      
      // Wait for response
      await expect(page.getByText(/Welcome, Maria Santos/)).toBeVisible({ timeout: 3000 });
      await expect(page.getByText(/student visa application/)).toBeVisible();
    });

    test('should handle invalid credentials gracefully', async ({ page }) => {
      const chatInput = page.getByPlaceholder(/Enter your application ID or name/);
      const sendButton = page.getByRole('button').filter({ hasText: 'Send' });
      
      // Send invalid credentials
      await chatInput.fill('Invalid User');
      await sendButton.click();
      
      // Wait for error response
      await expect(page.getByText(/I couldn't find your application/)).toBeVisible({ timeout: 3000 });
      await expect(page.getByText(/Please provide your application ID/)).toBeVisible();
    });

    test('should authenticate with different test accounts', async ({ page }) => {
      const testCases = [
        { input: 'SV-2024-7891', expectedName: 'Maria Santos', expectedType: 'student visa' },
        { input: 'TV-2024-3456', expectedName: 'Ahmed Hassan', expectedType: 'tourist visa' },
        { input: 'FR-2024-5678', expectedName: 'Elena Rossi', expectedType: 'family reunification' }
      ];

      for (const testCase of testCases) {
        await page.reload();
        
        const chatInput = page.getByPlaceholder(/Enter your application ID or name/);
        const sendButton = page.getByRole('button').filter({ hasText: 'Send' });
        
        await chatInput.fill(testCase.input);
        await sendButton.click();
        
        await expect(page.getByText(new RegExp(testCase.expectedName))).toBeVisible({ timeout: 3000 });
        await expect(page.getByText(new RegExp(testCase.expectedType))).toBeVisible();
      }
    });
  });

  test.describe('Post-Authentication Interactions', () => {
    test.beforeEach(async ({ page }) => {
      // Authenticate first
      const chatInput = page.getByPlaceholder(/Enter your application ID or name/);
      const sendButton = page.getByRole('button').filter({ hasText: 'Send' });
      
      await chatInput.fill('WP-2024-1234');
      await sendButton.click();
      await expect(page.getByText(/Welcome back, Hans Mueller/)).toBeVisible({ timeout: 3000 });
    });

    test('should handle status inquiry', async ({ page }) => {
      const chatInput = page.locator('textarea');
      const sendButton = page.getByRole('button').filter({ hasText: 'Send' });
      
      await chatInput.fill('What is my application status?');
      await sendButton.click();
      
      await expect(page.getByText(/work permit application is currently waiting/)).toBeVisible({ timeout: 3000 });
      await expect(page.getByText(/Employment Contract/)).toBeVisible();
      await expect(page.getByText(/German Language Proficiency/)).toBeVisible();
    });

    test('should handle document inquiry', async ({ page }) => {
      const chatInput = page.locator('textarea');
      const sendButton = page.getByRole('button').filter({ hasText: 'Send' });
      
      await chatInput.fill('What documents do I need?');
      await sendButton.click();
      
      await expect(page.getByText(/document status/)).toBeVisible({ timeout: 3000 });
      await expect(page.getByText(/Still needed/)).toBeVisible();
      await expect(page.getByText(/Already received/)).toBeVisible();
    });

    test('should handle timeline inquiry', async ({ page }) => {
      const chatInput = page.locator('textarea');
      const sendButton = page.getByRole('button').filter({ hasText: 'Send' });
      
      await chatInput.fill('How long will processing take?');
      await sendButton.click();
      
      await expect(page.getByText(/Processing timeline/)).toBeVisible({ timeout: 3000 });
      await expect(page.getByText(/Submitted:/)).toBeVisible();
      await expect(page.getByText(/Expected Decision:/)).toBeVisible();
    });

    test('should handle urgent processing request', async ({ page }) => {
      const chatInput = page.locator('textarea');
      const sendButton = page.getByRole('button').filter({ hasText: 'Send' });
      
      await chatInput.fill('I need urgent processing');
      await sendButton.click();
      
      await expect(page.getByText(/urgent processing/)).toBeVisible({ timeout: 3000 });
      await expect(page.getByText(/emergency-visa@germany.gov/)).toBeVisible();
      await expect(page.getByText(/48-72 hours/)).toBeVisible();
    });

    test('should handle appointment inquiry', async ({ page }) => {
      const chatInput = page.locator('textarea');
      const sendButton = page.getByRole('button').filter({ hasText: 'Send' });
      
      await chatInput.fill('I need an appointment');
      await sendButton.click();
      
      await expect(page.getByText(/appointments at the German Foreign Office/)).toBeVisible({ timeout: 3000 });
      await expect(page.getByText(/www.germany.diplo.de/)).toBeVisible();
    });
  });

  test.describe('Quick Actions Functionality', () => {
    test.beforeEach(async ({ page }) => {
      // Authenticate first
      const chatInput = page.getByPlaceholder(/Enter your application ID or name/);
      const sendButton = page.getByRole('button').filter({ hasText: 'Send' });
      
      await chatInput.fill('WP-2024-1234');
      await sendButton.click();
      await expect(page.getByText(/Welcome back, Hans Mueller/)).toBeVisible({ timeout: 3000 });
    });

    test('should populate input field when quick action is clicked', async ({ page }) => {
      const chatInput = page.locator('textarea');
      
      // Click on quick action
      await page.getByText('Check my application status').click();
      
      // Verify input field is populated
      await expect(chatInput).toHaveValue('Check my application status');
    });

    test('should work with all quick actions', async ({ page }) => {
      const quickActions = [
        'Check my application status',
        'What documents do I need?',
        'How long will processing take?',
        'I need urgent processing'
      ];

      for (const action of quickActions) {
        const chatInput = page.locator('textarea');
        
        await page.getByText(action).click();
        await expect(chatInput).toHaveValue(action);
        
        // Clear for next iteration
        await chatInput.clear();
      }
    });
  });

  test.describe('Conversation Flow and Memory', () => {
    test.beforeEach(async ({ page }) => {
      // Authenticate first
      const chatInput = page.getByPlaceholder(/Enter your application ID or name/);
      const sendButton = page.getByRole('button').filter({ hasText: 'Send' });
      
      await chatInput.fill('WP-2024-1234');
      await sendButton.click();
      await expect(page.getByText(/Welcome back, Hans Mueller/)).toBeVisible({ timeout: 3000 });
    });

    test('should maintain conversation context', async ({ page }) => {
      const chatInput = page.locator('textarea');
      const sendButton = page.getByRole('button').filter({ hasText: 'Send' });
      
      // First question
      await chatInput.fill('What is my status?');
      await sendButton.click();
      await expect(page.getByText(/waiting for additional documents/)).toBeVisible({ timeout: 3000 });
      
      // Follow-up question (context-dependent)
      await chatInput.fill('When is the deadline?');
      await sendButton.click();
      await expect(page.getByText(/2024-04-15/)).toBeVisible({ timeout: 3000 });
    });

    test('should display typing indicator during processing', async ({ page }) => {
      const chatInput = page.locator('textarea');
      const sendButton = page.getByRole('button').filter({ hasText: 'Send' });
      
      await chatInput.fill('What is my status?');
      await sendButton.click();
      
      // Check for typing indicator (animated dots)
      await expect(page.locator('.animate-bounce')).toBeVisible();
    });

    test('should scroll to latest message', async ({ page }) => {
      const chatInput = page.locator('textarea');
      const sendButton = page.getByRole('button').filter({ hasText: 'Send' });
      
      // Send multiple messages to create scroll
      const messages = [
        'What is my status?',
        'What documents do I need?',
        'How long will it take?',
        'I need urgent processing'
      ];

      for (const message of messages) {
        await chatInput.fill(message);
        await sendButton.click();
        await page.waitForTimeout(2000); // Wait for response
      }
      
      // Verify the latest message is visible
      await expect(page.getByText(/urgent processing/)).toBeVisible();
    });
  });

  test.describe('Error Handling and Edge Cases', () => {
    test('should handle empty message submission', async ({ page }) => {
      const sendButton = page.getByRole('button').filter({ hasText: 'Send' });
      
      // Try to send empty message
      await sendButton.click();
      
      // Should not add empty message to chat
      const chatMessages = page.locator('.max-w-xs');
      const messageCount = await chatMessages.count();
      expect(messageCount).toBe(1); // Only initial bot message
    });

    test('should handle special characters in input', async ({ page }) => {
      const chatInput = page.getByPlaceholder(/Enter your application ID or name/);
      const sendButton = page.getByRole('button').filter({ hasText: 'Send' });
      
      await chatInput.fill('Test with special chars: äöü @#$%');
      await sendButton.click();
      
      // Should handle gracefully without errors
      await expect(page.getByText(/I couldn't find your application/)).toBeVisible({ timeout: 3000 });
    });

    test('should handle very long input', async ({ page }) => {
      const chatInput = page.getByPlaceholder(/Enter your application ID or name/);
      const sendButton = page.getByRole('button').filter({ hasText: 'Send' });
      
      const longText = 'A'.repeat(1000); // Very long input
      await chatInput.fill(longText);
      await sendButton.click();
      
      // Should handle without breaking
      await expect(page.getByText(/I couldn't find your application/)).toBeVisible({ timeout: 3000 });
    });
  });

  test.describe('Mobile Responsiveness', () => {
    test('should work on mobile viewport', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE
      
      // Check elements are still visible
      await expect(page.getByText('AI Chatbot Interface')).toBeVisible();
      await expect(page.getByPlaceholder(/Enter your application ID/)).toBeVisible();
      
      // Test interaction on mobile
      const chatInput = page.getByPlaceholder(/Enter your application ID or name/);
      const sendButton = page.getByRole('button').filter({ hasText: 'Send' });
      
      await chatInput.fill('WP-2024-1234');
      await sendButton.click();
      
      await expect(page.getByText(/Welcome back, Hans Mueller/)).toBeVisible({ timeout: 3000 });
    });

    test('should handle keyboard on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      
      const chatInput = page.getByPlaceholder(/Enter your application ID or name/);
      
      // Focus input and type
      await chatInput.focus();
      await chatInput.fill('WP-2024-1234');
      
      // Press Enter to send
      await chatInput.press('Enter');
      
      await expect(page.getByText(/Welcome back, Hans Mueller/)).toBeVisible({ timeout: 3000 });
    });
  });

  test.describe('Accessibility', () => {
    test('should be keyboard navigable', async ({ page }) => {
      // Tab to input field
      await page.keyboard.press('Tab');
      const chatInput = page.locator(':focus');
      await expect(chatInput).toHaveAttribute('placeholder');
      
      // Type and submit with Enter
      await chatInput.fill('WP-2024-1234');
      await chatInput.press('Enter');
      
      await expect(page.getByText(/Welcome back, Hans Mueller/)).toBeVisible({ timeout: 3000 });
    });

    test('should have proper ARIA labels', async ({ page }) => {
      const chatInput = page.getByPlaceholder(/Enter your application ID or name/);
      const sendButton = page.getByRole('button').filter({ hasText: 'Send' });
      
      // Check elements have proper accessibility attributes
      await expect(chatInput).toBeVisible();
      await expect(sendButton).toBeVisible();
    });
  });
});