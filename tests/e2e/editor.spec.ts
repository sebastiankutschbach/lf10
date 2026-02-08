import { test, expect } from '@playwright/test';

test.describe('Loadout Editor', () => {
    test.describe.configure({ mode: 'serial' });

    test.beforeEach(async ({ page }) => {
        // The app is served with base path /lf10/
        await page.goto('/lf10/');
        await page.waitForLoadState('networkidle');
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
        const testName = "G1 Test Name";

        // Update name
        await nameInput.fill(testName);

        // Click save and wait for response
        await Promise.all([
            page.waitForResponse(resp => resp.url().includes('api/save-loadout')),
            page.locator('.btn-save').click()
        ]);

        // Wait for potential HMR and reload
        await page.waitForTimeout(1000);
        await page.reload();
        await page.waitForLoadState('networkidle');

        await page.getByRole('button', { name: 'Edit Loadout' }).click();
        await page.locator('.comp-item').filter({ hasText: 'G1' }).click();
        await expect(page.locator('input#comp-name')).toHaveValue(testName);

        // REVERT CHANGE to keep data clean
        await page.locator('input#comp-name').fill(originalName);
        await Promise.all([
            page.waitForResponse(resp => resp.url().includes('api/save-loadout')),
            page.locator('.btn-save').click()
        ]);

        // Final Verify
        await page.waitForTimeout(1000);
        await page.reload();
        await page.waitForLoadState('networkidle');
        await page.getByRole('button', { name: 'Edit Loadout' }).click();
        await page.locator('.comp-item').filter({ hasText: 'G1' }).click();
        await expect(page.locator('input#comp-name')).toHaveValue(originalName);
    });
});
