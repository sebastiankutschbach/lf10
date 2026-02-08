import { test, expect } from '@playwright/test';

test.describe('Legal Pages', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('should open and display Impressum', async ({ page }) => {
        const imprintBtn = page.getByRole('button', { name: 'Impressum' });
        await expect(imprintBtn).toBeVisible();
        await imprintBtn.click();

        const modal = page.locator('.legal-modal');
        await expect(modal).toBeVisible();
        await expect(modal.locator('h1')).toHaveText('Impressum');

        const content = modal.locator('.content');
        await expect(content).toContainText('Angaben gemäß § 5 TMG');
        await expect(content).toContainText('Sebastian Kutschbach');
        await expect(content).toContainText('Wiesenstr, 54');

        // Close modal
        await modal.locator('.close-btn').click();
        await expect(modal).not.toBeVisible();
    });

    test('should open and display Datenschutz', async ({ page }) => {
        const privacyBtn = page.getByRole('button', { name: 'Datenschutz' });
        await expect(privacyBtn).toBeVisible();
        await privacyBtn.click();

        const modal = page.locator('.legal-modal');
        await expect(modal).toBeVisible();
        await expect(modal.locator('h1')).toHaveText('Datenschutzerklärung');

        const content = modal.locator('.content');
        await expect(content).toContainText('Datenschutz auf einen Blick');
        await expect(content).toContainText('GitHub Pages');

        // Close modal via overlay click
        // Click slightly offset from center to hit the overlay
        await page.locator('.legal-overlay').click({ position: { x: 10, y: 10 } });
        await expect(modal).not.toBeVisible();
    });
});
