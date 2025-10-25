import { test, expect } from '@playwright/test';

test.describe('Patient Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should display patient list', async ({ page }) => {
    const patientSelector = page.locator('[data-testid="patient-selector"]').first();
    await expect(patientSelector).toBeVisible({ timeout: 10000 });
    
    const patientButtons = page.getByRole('button').filter({ hasText: /PAT-/ });
    const count = await patientButtons.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should open add patient dialog', async ({ page }) => {
    const addButton = page.getByRole('button', { name: /add patient/i });
    await expect(addButton).toBeVisible();
    await addButton.click();

    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await expect(page.getByText(/add new patient/i)).toBeVisible();
  });

  test('should create a new patient', async ({ page }) => {
    await page.getByRole('button', { name: /add patient/i }).click();

    await page.getByLabel(/first name/i).fill('John');
    await page.getByLabel(/last name/i).fill('Doe');
    await page.getByLabel(/date of birth/i).fill('1990-01-01');
    await page.getByLabel(/email/i).fill('john.doe@example.com');
    await page.getByLabel(/phone/i).fill('555-1234');
    await page.getByLabel(/address/i).fill('123 Main St');

    await page.getByRole('button', { name: /create patient/i }).click();

    await expect(page.getByRole('dialog')).not.toBeVisible({ timeout: 5000 });
    
    await expect(page.getByText(/john doe/i)).toBeVisible({ timeout: 5000 });
  });

  test('should show validation error for missing required fields', async ({ page }) => {
    await page.getByRole('button', { name: /add patient/i }).click();

    await page.getByLabel(/first name/i).fill('John');
    
    await page.getByRole('button', { name: /create patient/i }).click();

    await expect(page.getByText(/required/i)).toBeVisible();
  });

  test('should view patient details', async ({ page }) => {
    const firstPatient = page.getByRole('button').filter({ hasText: /PAT-/ }).first();
    await firstPatient.hover();
    
    const viewButton = firstPatient.locator('..').getByRole('button', { name: /view/i }).first();
    await viewButton.click({ timeout: 5000 });

    await expect(page.getByText(/patient details/i)).toBeVisible();
    await expect(page.getByText(/patient information/i)).toBeVisible();
  });

  test('should delete patient with confirmation', async ({ page }) => {
    const firstPatient = page.getByRole('button').filter({ hasText: /PAT-/ }).first();
    const patientText = await firstPatient.textContent();
    
    await firstPatient.hover();
    const viewButton = firstPatient.locator('..').getByRole('button').first();
    await viewButton.click({ timeout: 5000 });

    await page.getByRole('button', { name: /delete patient/i }).click();

    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await expect(page.getByText(/are you sure/i)).toBeVisible();

    await page.getByRole('button', { name: /delete patient/i }).last().click();

    await expect(page.getByText(/patient details/i)).not.toBeVisible({ timeout: 5000 });
  });

  test('should cancel patient deletion', async ({ page }) => {
    const firstPatient = page.getByRole('button').filter({ hasText: /PAT-/ }).first();
    await firstPatient.hover();
    
    const viewButton = firstPatient.locator('..').getByRole('button').first();
    await viewButton.click({ timeout: 5000 });

    await page.getByRole('button', { name: /delete patient/i }).click();

    await page.getByRole('button', { name: /cancel/i }).click();

    await expect(page.getByRole('dialog')).not.toBeVisible();
    await expect(page.getByText(/patient details/i)).toBeVisible();
  });
});

