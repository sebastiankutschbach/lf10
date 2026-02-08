import { test, expect } from '@playwright/test';

test.describe('Quiz Functionality', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('should start the quiz when the button is clicked', async ({ page }) => {
        const startBtn = page.locator('button:has-text("Quiz: Kennst du die Beladung?")');
        await expect(startBtn).toBeVisible();
        await startBtn.click();

        // Check if quiz overlay is visible
        const quizContainer = page.locator('.quiz-container');
        await expect(quizContainer).toBeVisible();
        await expect(page.locator('h2:has-text("Wo befindet sich:")')).toBeVisible();
    });

    test('should allow answering questions and tracking progress', async ({ page }) => {
        await page.locator('button:has-text("Quiz: Kennst du die Beladung?")').click();

        // Check initial progress
        await expect(page.locator('.progress')).toContainText('Frage 1 von 10');

        // Click any option
        const options = page.locator('.option-btn');
        await expect(options).toHaveCount(4);
        await options.first().click();

        // Wait for next question (should happen after timeout)
        await expect(page.locator('.progress')).toContainText('Frage 2 von 10', { timeout: 3000 });
    });

    test('should close the quiz when the close button is clicked', async ({ page }) => {
        await page.locator('button:has-text("Quiz: Kennst du die Beladung?")').click();
        await page.locator('.close-btn').click();

        await expect(page.locator('.quiz-container')).not.toBeVisible();
    });
});
