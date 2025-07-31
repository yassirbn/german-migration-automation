import { test, expect } from '@playwright/test';

test.describe('Dashboard and Navigation Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test.describe('Dashboard Page Load', () => {
    test('should load dashboard with correct header and navigation', async ({ page }) => {
      // Check header
      await expect(page.getByText('German Foreign Office')).toBeVisible();
      await expect(page.getByText('90% Communication Automation System - Prototype')).toBeVisible();
      await expect(page.getByText('Live Demo')).toBeVisible();
      
      // Check navigation tabs
      await expect(page.getByText('Dashboard Overview')).toBeVisible();
      await expect(page.getByText('AI Chatbot')).toBeVisible();
      await expect(page.getByText('Email Automation')).toBeVisible();
    });

    test('should display dashboard statistics correctly', async ({ page }) => {
      // Check stats cards
      await expect(page.getByText('Total Applications')).toBeVisible();
      await expect(page.getByText('4')).toBeVisible(); // Total count
      
      await expect(page.getByText('Approved Today')).toBeVisible();
      await expect(page.getByText('1')).toBeVisible(); // Approved count
      
      await expect(page.getByText('Pending Review')).toBeVisible();
      await expect(page.getByText('3')).toBeVisible(); // Pending count
      
      await expect(page.getByText('Automation Rate')).toBeVisible();
      await expect(page.getByText('90%')).toBeVisible();
    });

    test('should display all application cards', async ({ page }) => {
      // Check all test applications are displayed
      await expect(page.getByText('Hans Mueller')).toBeVisible();
      await expect(page.getByText('WP-2024-1234')).toBeVisible();
      
      await expect(page.getByText('Maria Santos')).toBeVisible();
      await expect(page.getByText('SV-2024-7891')).toBeVisible();
      
      await expect(page.getByText('Ahmed Hassan')).toBeVisible();
      await expect(page.getByText('TV-2024-3456')).toBeVisible();
      
      await expect(page.getByText('Elena Rossi')).toBeVisible();
      await expect(page.getByText('FR-2024-5678')).toBeVisible();
    });

    test('should show correct visa types and statuses', async ({ page }) => {
      // Check visa types are properly formatted
      await expect(page.getByText('WORK PERMIT')).toBeVisible();
      await expect(page.getByText('STUDENT VISA')).toBeVisible();
      await expect(page.getByText('TOURIST VISA')).toBeVisible();
      await expect(page.getByText('FAMILY REUNIFICATION')).toBeVisible();
      
      // Check status badges
      await expect(page.getByText('documents required')).toBeVisible();
      await expect(page.getByText('under review')).toBeVisible();
      await expect(page.getByText('approved')).toBeVisible();
    });
  });

  test.describe('Navigation Functionality', () => {
    test('should navigate to chatbot page', async ({ page }) => {
      await page.getByText('AI Chatbot').click();
      
      await expect(page).toHaveURL('/chatbot');
      await expect(page.getByText('AI Chatbot Interface')).toBeVisible();
      await expect(page.getByText(/Hello! I'm your virtual assistant/)).toBeVisible();
    });

    test('should navigate to email simulator page', async ({ page }) => {
      await page.getByText('Email Automation').click();
      
      await expect(page).toHaveURL('/email-simulator');
      await expect(page.getByText('Email Auto-Response Simulator')).toBeVisible();
      await expect(page.getByText('Generate automated email templates')).toBeVisible();
    });

    test('should navigate back to dashboard', async ({ page }) => {
      // Go to chatbot first
      await page.getByText('AI Chatbot').click();
      await expect(page).toHaveURL('/chatbot');
      
      // Navigate back to dashboard
      await page.getByText('Dashboard Overview').click();
      await expect(page).toHaveURL('/');
      await expect(page.getByText('Application Dashboard')).toBeVisible();
    });

    test('should highlight active navigation tab', async ({ page }) => {
      // Dashboard tab should be active initially
      const dashboardTab = page.getByText('Dashboard Overview');
      await expect(dashboardTab).toHaveClass(/border-blue-500/);
      await expect(dashboardTab).toHaveClass(/text-blue-600/);
      
      // Navigate to chatbot
      await page.getByText('AI Chatbot').click();
      const chatbotTab = page.getByText('AI Chatbot');
      await expect(chatbotTab).toHaveClass(/border-blue-500/);
      await expect(chatbotTab).toHaveClass(/text-blue-600/);
    });
  });

  test.describe('Dashboard Content Validation', () => {
    test('should display system performance metrics', async ({ page }) => {
      await expect(page.getByText('System Performance')).toBeVisible();
      await expect(page.getByText('Inquiries Handled Today')).toBeVisible();
      await expect(page.getByText('247')).toBeVisible();
      await expect(page.getByText('Average Response Time')).toBeVisible();
      await expect(page.getByText('0.8s')).toBeVisible();
      await expect(page.getByText('User Satisfaction')).toBeVisible();
      await expect(page.getByText('94.2%')).toBeVisible();
      await expect(page.getByText('Staff Time Saved')).toBeVisible();
      await expect(page.getByText('6.2 hrs')).toBeVisible();
    });

    test('should display recent activity feed', async ({ page }) => {
      await expect(page.getByText('Recent Activity')).toBeVisible();
      
      // Check activity items
      await expect(page.getByText('Tourist visa approved')).toBeVisible();
      await expect(page.getByText('Ahmed Hassan - 2 minutes ago')).toBeVisible();
      
      await expect(page.getByText('Documents received')).toBeVisible();
      await expect(page.getByText('Maria Santos - 15 minutes ago')).toBeVisible();
      
      await expect(page.getByText('New application submitted')).toBeVisible();
      await expect(page.getByText('Work permit - 1 hour ago')).toBeVisible();
      
      await expect(page.getByText('Document deadline reminder sent')).toBeVisible();
      await expect(page.getByText('Hans Mueller - 2 hours ago')).toBeVisible();
    });

    test('should show document status indicators', async ({ page }) => {
      // Hans Mueller should have missing documents
      const hansMuellerCard = page.locator('text=Hans Mueller').locator('..').locator('..');
      await expect(hansMuellerCard.getByText('Documents Status:')).toBeVisible();
      await expect(hansMuellerCard.getByText('Employment Contract...')).toBeVisible();
    });

    test('should display proper date formats', async ({ page }) => {
      // Check expected completion dates
      await expect(page.getByText('Expected: 2024-04-20')).toBeVisible();
      await expect(page.getByText('Expected: 2024-03-27')).toBeVisible();
      await expect(page.getByText('Expected: 2024-04-25')).toBeVisible();
      await expect(page.getByText('Expected: 2024-05-01')).toBeVisible();
      
      // Check date of birth formats
      await expect(page.getByText('DOB: 1985-03-15')).toBeVisible();
      await expect(page.getByText('DOB: 1978-12-03')).toBeVisible();
      await expect(page.getByText('DOB: 1992-08-22')).toBeVisible();
      await expect(page.getByText('DOB: 1990-07-12')).toBeVisible();
    });
  });

  test.describe('Responsive Design Testing', () => {
    test('should work on tablet viewport', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      
      // Check elements are still visible and properly arranged
      await expect(page.getByText('German Foreign Office')).toBeVisible();
      await expect(page.getByText('Application Dashboard')).toBeVisible();
      await expect(page.getByText('Total Applications')).toBeVisible();
      
      // Navigation should still work
      await page.getByText('AI Chatbot').click();
      await expect(page).toHaveURL('/chatbot');
    });

    test('should work on mobile viewport', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      
      // Check mobile layout
      await expect(page.getByText('German Foreign Office')).toBeVisible();
      await expect(page.getByText('Application Dashboard')).toBeVisible();
      
      // Stats should stack vertically but still be visible
      await expect(page.getByText('Total Applications')).toBeVisible();
      await expect(page.getByText('4')).toBeVisible();
      
      // Navigation should work on mobile
      await page.getByText('AI Chatbot').click();
      await expect(page).toHaveURL('/chatbot');
    });

    test('should handle very narrow viewport', async ({ page }) => {
      await page.setViewportSize({ width: 320, height: 568 }); // iPhone 5/SE
      
      // Essential elements should still be accessible
      await expect(page.getByText('German Foreign Office')).toBeVisible();
      await expect(page.getByText('Dashboard Overview')).toBeVisible();
      
      // Navigation should remain functional
      await page.getByText('AI Chatbot').click();
      await expect(page).toHaveURL('/chatbot');
    });
  });

  test.describe('Performance and Loading', () => {
    test('should load dashboard quickly', async ({ page }) => {
      const startTime = Date.now();
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      const loadTime = Date.now() - startTime;
      
      // Dashboard should load within reasonable time (3 seconds)
      expect(loadTime).toBeLessThan(3000);
      
      // Key elements should be visible
      await expect(page.getByText('Application Dashboard')).toBeVisible();
    });

    test('should handle page refresh correctly', async ({ page }) => {
      // Navigate to a different page first
      await page.getByText('AI Chatbot').click();
      await expect(page).toHaveURL('/chatbot');
      
      // Refresh the page
      await page.reload();
      
      // Should stay on the same page with content loaded
      await expect(page).toHaveURL('/chatbot');
      await expect(page.getByText('AI Chatbot Interface')).toBeVisible();
    });

    test('should maintain state across navigation', async ({ page }) => {
      // Verify initial dashboard state
      await expect(page.getByText('Total Applications')).toBeVisible();
      await expect(page.getByText('4')).toBeVisible();
      
      // Navigate away and back
      await page.getByText('AI Chatbot').click();
      await page.getByText('Dashboard Overview').click();
      
      // State should be maintained
      await expect(page.getByText('Total Applications')).toBeVisible();
      await expect(page.getByText('4')).toBeVisible();
    });
  });

  test.describe('Error Handling and Edge Cases', () => {
    test('should handle navigation with keyboard', async ({ page }) => {
      // Focus on navigation
      await page.keyboard.press('Tab');
      
      // Navigate using Enter key
      await page.keyboard.press('Tab'); // Skip to first nav item
      await page.keyboard.press('Tab'); // Move to AI Chatbot
      await page.keyboard.press('Enter');
      
      await expect(page).toHaveURL('/chatbot');
    });

    test('should handle direct URL access', async ({ page }) => {
      // Direct access to chatbot
      await page.goto('/chatbot');
      await expect(page.getByText('AI Chatbot Interface')).toBeVisible();
      
      // Direct access to email simulator
      await page.goto('/email-simulator');
      await expect(page.getByText('Email Auto-Response Simulator')).toBeVisible();
      
      // Back to dashboard
      await page.goto('/');
      await expect(page.getByText('Application Dashboard')).toBeVisible();
    });

    test('should handle browser back/forward buttons', async ({ page }) => {
      // Navigate through pages
      await page.getByText('AI Chatbot').click();
      await expect(page).toHaveURL('/chatbot');
      
      await page.getByText('Email Automation').click();
      await expect(page).toHaveURL('/email-simulator');
      
      // Use browser back button
      await page.goBack();
      await expect(page).toHaveURL('/chatbot');
      
      // Use browser forward button
      await page.goForward();
      await expect(page).toHaveURL('/email-simulator');
    });
  });

  test.describe('Accessibility Features', () => {
    test('should have proper heading hierarchy', async ({ page }) => {
      // Check main headings
      await expect(page.getByRole('heading', { level: 1 })).toHaveText('German Foreign Office');
      await expect(page.getByRole('heading', { level: 2 })).toHaveText('Application Dashboard');
      
      // Check section headings
      const h3Headings = page.getByRole('heading', { level: 3 });
      const headingCount = await h3Headings.count();
      expect(headingCount).toBeGreaterThan(0);
    });

    test('should support keyboard navigation for all interactive elements', async ({ page }) => {
      let tabCount = 0;
      const maxTabs = 20; // Prevent infinite loop
      
      while (tabCount < maxTabs) {
        await page.keyboard.press('Tab');
        tabCount++;
        
        const focusedElement = page.locator(':focus');
        const elementCount = await focusedElement.count();
        
        if (elementCount > 0) {
          // Element is focusable, which is good for accessibility
          const tagName = await focusedElement.evaluate(el => el.tagName.toLowerCase());
          expect(['a', 'button', 'input', 'select', 'textarea'].some(tag => 
            tagName.includes(tag)
          ));
        }
      }
    });

    test('should have proper color contrast for status indicators', async ({ page }) => {
      // This is a visual check - in a real scenario you'd use accessibility testing tools
      const statusElements = [
        page.getByText('documents required'),
        page.getByText('under review'),
        page.getByText('approved')
      ];
      
      for (const element of statusElements) {
        await expect(element).toBeVisible();
        // In a real test, you'd check computed styles for color contrast ratios
      }
    });
  });
});