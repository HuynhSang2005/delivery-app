import { expect, test } from '@playwright/test';

test.describe('admin-web runtime flow', () => {
  test('shows health heading and status badge', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { name: 'Delivery Foundation Console' })).toBeVisible();
    await expect(page.getByText(/healthy|degraded/i)).toBeVisible();
  });

  test('renders Next not-found page for unknown routes', async ({ page }) => {
    const response = await page.goto('/definitely-missing-page');

    expect(response?.status()).toBe(404);
    await expect(page.getByText(/404|not found/i)).toBeVisible();
  });
});
