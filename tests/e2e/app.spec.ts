import { test, expect } from '@playwright/test';

test.describe('Vehicle Explorer', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('should display main title', async ({ page }) => {
        await expect(page.locator('h1')).toHaveText(/LF 10/);
        await expect(page.locator('.subtitle')).toContainText('MAN TGM');
    });

    test('should open G1 modal on click', async ({ page }) => {
        // Assuming default view is Left -> G1, G3, G5 visible
        // Click on the overlay for G1
        await page.locator('.viz-layer .g1').click();

        // Verify modal content
        const modal = page.locator('.modal-content');
        await expect(modal).toBeVisible();
        await expect(modal.locator('h2')).toHaveText('Gerätefach 1');

        // Check items
        await expect(modal.locator('li').first()).toBeVisible();

        // Check description
        await expect(modal.locator('.desc')).toContainText('Löschtechnik');

        // Close modal
        await page.locator('.close-btn').click();
        await expect(modal).not.toBeVisible();
    });

    test('should switch views', async ({ page }) => {
        // Switch to Right side
        await page.getByRole('button', { name: 'Beifahrerseite' }).click();

        // Expect G2, G4, G6 overlays to be visible/present
        await expect(page.locator('.viz-layer .g2')).toBeVisible();

        // Click G2
        await page.locator('.viz-layer .g2').click();

        // Verify modal for G2
        const modal = page.locator('.modal-content');
        await expect(modal).toBeVisible();
        await expect(modal.locator('h2')).toHaveText('Gerätefach 2');
        await expect(modal.locator('.desc')).toContainText('Technische Hilfeleistung');
    });

    test('should open Cab modal', async ({ page }) => {
        // Click on "Fahrer" door overlay - ID is 'drivers_cab'
        await page.locator('.viz-layer .drivers_cab').click();

        // Verify modal
        const modal = page.locator('.modal-content');
        await expect(modal).toBeVisible();
        await expect(modal.locator('h2')).toHaveText('Fahrerraum');
    });

    test('should open Pump GR modal in rear view', async ({ page }) => {
        // Switch to Rear view
        await page.getByRole('button', { name: 'Heck' }).click();

        // Expect GR overlay to be visible - ID is 'GR' -> 'gr'
        const grOverlay = page.locator('.viz-layer .gr');
        await expect(grOverlay).toBeVisible();

        // Click GR
        await grOverlay.click();

        // Verify modal
        const modal = page.locator('.modal-content');
        await expect(modal).toBeVisible();
        await expect(modal.locator('h2')).toContainText('Geräteraum Rückseite');
    });
});
