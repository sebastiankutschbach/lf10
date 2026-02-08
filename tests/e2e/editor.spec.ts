import { test, expect } from '@playwright/test';

test.describe('Loadout Editor', () => {
    test.beforeEach(async ({ page }) => {
        // The app is served with base path /lf10/
        await page.goto('/lf10/');
    });

    test('should show edit button in dev mode', async ({ page }) => {
        const editButton = page.getByRole('button', { name: 'Edit Loadout' });
        await expect(editButton).toBeVisible();
    });

    test('should open editor and display compartments', async ({ page }) => {
        await page.getByRole('button', { name: 'Edit Loadout' }).click();

        const editor = page.locator('.editor-container');
        await expect(editor).toBeVisible();
        await expect(page.locator('.sidebar-header')).toHaveText('Kompartimente');

        // Check if G1 is in the list
        await expect(page.locator('.comp-item').filter({ hasText: 'G1' })).toBeVisible();
    });

    test('should save changes successfully', async ({ page }) => {
        await page.getByRole('button', { name: 'Edit Loadout' }).click();

        // Select G1
        await page.locator('.comp-item').filter({ hasText: 'G1' }).click();

        const nameInput = page.locator('input#comp-name');
        const originalName = await nameInput.inputValue();
        const testName = originalName + ' (Edited)';

        // Update name
        await nameInput.fill(testName);

        // Click save
        await page.locator('.btn-save').click();

        // Wait for success status
        await expect(page.locator('.btn-save.success')).toBeVisible();

        // Final verification by reloading (handles HMR reload as well)
        await page.reload();
        await page.getByRole('button', { name: 'Edit Loadout' }).click();
        await page.locator('.comp-item').filter({ hasText: 'G1' }).click();
        await expect(page.locator('input#comp-name')).toHaveValue(testName);

        // REVERT CHANGE to keep data clean
        await page.locator('input#comp-name').fill(originalName);
        await page.locator('.btn-save').click();
        await expect(page.locator('.btn-save.success')).toBeVisible();
    });
});
