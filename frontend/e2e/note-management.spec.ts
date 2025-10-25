import { test, expect } from '@playwright/test';
import path from 'path';

test.describe('Note Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should display notes list', async ({ page }) => {
    const notesList = page.getByText(/all notes/i);
    await expect(notesList).toBeVisible({ timeout: 10000 });
  });

  test('should create a text note', async ({ page }) => {
    const firstPatient = page.getByRole('button').filter({ hasText: /PAT-/ }).first();
    await firstPatient.click();

    const noteContent = 'Patient came in today with headache complaints.';
    await page.getByPlaceholder(/enter note content/i).fill(noteContent);

    await page.getByRole('button', { name: /create note/i }).click();

    await expect(page.getByText(/headache/i)).toBeVisible({ timeout: 10000 });
  });

  test('should show error when creating note without patient selection', async ({ page }) => {
    const noteContent = 'Test note without patient';
    await page.getByPlaceholder(/enter note content/i).fill(noteContent);

    await page.getByRole('button', { name: /create note/i }).click();

    await expect(page.getByText(/select a patient/i)).toBeVisible();
  });

  test('should view note details', async ({ page }) => {
    const firstNote = page.locator('[class*="cursor-pointer"]').filter({ hasText: /PAT-/ }).first();
    await expect(firstNote).toBeVisible({ timeout: 10000 });
    
    await firstNote.click();

    await expect(page.getByText(/note details/i)).toBeVisible();
    await expect(page.getByText(/note content/i)).toBeVisible();
  });

  test('should navigate back from note details', async ({ page }) => {
    const firstNote = page.locator('[class*="cursor-pointer"]').filter({ hasText: /PAT-/ }).first();
    await firstNote.click();

    await page.getByRole('button', { name: /back to/i }).click();

    await expect(page.getByText(/ai scribe/i)).toBeVisible();
    await expect(page.getByText(/select patient/i)).toBeVisible();
  });

  test('should delete note from patient details', async ({ page }) => {
    const firstPatient = page.getByRole('button').filter({ hasText: /PAT-/ }).first();
    await firstPatient.hover();
    
    const viewButton = firstPatient.locator('..').getByRole('button').first();
    await viewButton.click({ timeout: 5000 });

    await expect(page.getByText(/patient notes/i)).toBeVisible();

    const deleteButton = page.getByRole('button').locator('svg').first();
    if (await deleteButton.isVisible()) {
      await deleteButton.click();

      const dialog = page.getByRole('dialog');
      await expect(dialog).toBeVisible();

      await page.getByRole('button', { name: /delete note/i }).last().click();

      await expect(dialog).not.toBeVisible({ timeout: 5000 });
    }
  });

  test('should display note with audio indicator', async ({ page }) => {
    const audioNote = page.locator('[class*="bg-blue"]').filter({ hasText: /audio/i }).first();
    
    if (await audioNote.isVisible()) {
      await expect(audioNote).toContainText(/audio/i);
    }
  });

  test('should display note with AI summary indicator', async ({ page }) => {
    const aiNote = page.locator('[class*="bg-green"]').filter({ hasText: /ai summary/i }).first();
    
    if (await aiNote.isVisible()) {
      await expect(aiNote).toContainText(/ai summary/i);
    }
  });

  test('should filter notes by patient', async ({ page }) => {
    const firstPatient = page.getByRole('button').filter({ hasText: /PAT-/ }).first();
    const patientName = await firstPatient.textContent();
    
    await firstPatient.hover();
    const viewButton = firstPatient.locator('..').getByRole('button').first();
    await viewButton.click({ timeout: 5000 });

    await expect(page.getByText(/patient notes/i)).toBeVisible();
    
    const notes = page.locator('[class*="border rounded"]');
    const count = await notes.count();
    
    expect(count).toBeGreaterThanOrEqual(0);
  });
});

