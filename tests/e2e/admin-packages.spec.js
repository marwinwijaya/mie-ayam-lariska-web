// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * Helper: Login as admin and navigate to admin dashboard.
 */
async function loginAsAdmin(page) {
  await page.goto('/admin/login.html');
  await page.fill('#username', 'lariska');
  await page.fill('#password', 'lariska123');
  await page.click('#login-button');
  await page.waitForTimeout(1500);
}

test.describe('Admin Packages Management', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to admin login first to establish context
    await page.goto('/admin/login.html');
    // Clear session
    await page.evaluate(() => localStorage.removeItem('admin_logged_in'));
    // Login
    await loginAsAdmin(page);
    // Navigate to admin dashboard if not already there
    if (!page.url().includes('/admin/index.html')) {
      await page.goto('/admin/index.html');
    }
    await page.waitForTimeout(2000);
  });

  // =========================================================================
  // Rule 4: Admin CRUD — Read
  // =========================================================================

  test('displays packages tab in admin navigation', async ({ page }) => {
    const tab = page.locator('#tab-packages');
    await expect(tab).toBeAttached();
    await expect(tab).toContainText(/Paket/i);
  });

  test('shows packages table with all columns', async ({ page }) => {
    // Click packages tab
    await page.click('#tab-packages');
    await page.waitForTimeout(1000);

    // Verify table headers
    const table = page.locator('.packages-table');
    await expect(table).toBeVisible();

    const headers = table.locator('thead th');
    const headerTexts = await headers.allTextContents();
    const lowerHeaders = headerTexts.map(h => h.toLowerCase());

    expect(lowerHeaders.some(h => h.includes('icon'))).toBeTruthy();
    expect(lowerHeaders.some(h => h.includes('nama'))).toBeTruthy();
    expect(lowerHeaders.some(h => h.includes('harga'))).toBeTruthy();
    expect(lowerHeaders.some(h => h.includes('item'))).toBeTruthy();
    expect(lowerHeaders.some(h => h.includes('tag'))).toBeTruthy();
  });

  test('shows packages table with data rows', async ({ page }) => {
    await page.click('#tab-packages');
    await page.waitForTimeout(2000);

    const tbody = page.locator('#packages-table-body');
    await expect(tbody).toBeVisible();

    // Should have at least one row (from seeded data)
    const rows = tbody.locator('tr');
    const count = await rows.count();
    expect(count).toBeGreaterThan(0);
  });

  // =========================================================================
  // Rule 5: Admin CRUD — Create
  // =========================================================================

  test('opens add package modal with all fields', async ({ page }) => {
    await page.click('#tab-packages');
    await page.waitForTimeout(1000);

    // Click add package button
    await page.click('#add-package-button');
    await page.waitForTimeout(500);

    // Verify modal is visible
    const modal = page.locator('#package-modal');
    await expect(modal).toBeVisible();
    await expect(page.locator('#package-modal-title')).toContainText('Tambah Paket');

    // Verify all form fields exist
    await expect(page.locator('#package-name')).toBeVisible();
    await expect(page.locator('#package-description')).toBeVisible();
    await expect(page.locator('#package-icon')).toBeVisible();
    await expect(page.locator('#package-price')).toBeVisible();
    await expect(page.locator('#package-tag')).toBeVisible();
    await expect(page.locator('#package-featured')).toBeAttached();
    await expect(page.locator('#package-status')).toBeVisible();
    await expect(page.locator('#package-order')).toBeVisible();
    await expect(page.locator('#package-whatsapp')).toBeVisible();

    // Verify items checkboxes container exists
    await expect(page.locator('#package-items-checkboxes')).toBeVisible();

    // Verify submit button
    await expect(page.locator('#package-modal-submit')).toBeVisible();
    await expect(page.locator('#package-modal-submit')).toContainText('Simpan');
  });

  test('creates new package and saves to Firebase', async ({ page }) => {
    await page.click('#tab-packages');
    await page.waitForTimeout(1000);

    // Open add modal
    await page.click('#add-package-button');
    await page.waitForTimeout(500);

    // Fill in form
    await page.fill('#package-name', 'Paket Test E2E');
    await page.fill('#package-description', 'Paket testing dari Playwright');
    await page.fill('#package-icon', '🧪');
    await page.fill('#package-price', '12000');
    await page.selectOption('#package-tag', 'Basic');
    await page.fill('#package-order', '99');
    await page.fill('#package-whatsapp', 'Halo, saya mau pesan Paket Test E2E');

    // Submit form
    await page.click('#package-modal-submit');
    await page.waitForTimeout(2000);

    // Verify modal closed
    const modal = page.locator('#package-modal');
    await expect(modal).toBeHidden();

    // Verify new package appears in table
    const tbody = page.locator('#packages-table-body');
    const nameCells = tbody.locator('.packages-table__name');
    const names = await nameCells.allTextContents();
    expect(names.some(n => n.includes('Paket Test E2E'))).toBeTruthy();
  });

  test('shows validation errors for empty required fields', async ({ page }) => {
    await page.click('#tab-packages');
    await page.waitForTimeout(1000);

    // Open add modal
    await page.click('#add-package-button');
    await page.waitForTimeout(500);

    // Submit without filling
    await page.click('#package-modal-submit');
    await page.waitForTimeout(500);

    // Verify error messages appear
    const nameError = page.locator('#package-name-error');
    await expect(nameError).toContainText(/wajib/i);
  });

  // =========================================================================
  // Rule 6: Admin CRUD — Update
  // =========================================================================

  test('edits existing package with pre-filled data', async ({ page }) => {
    await page.click('#tab-packages');
    await page.waitForTimeout(2000);

    // Find first edit button in table
    const editBtn = page.locator('#packages-table-body .btn--text').filter({ hasText: 'Edit' }).first();
    await expect(editBtn).toBeAttached();
    await editBtn.click();
    await page.waitForTimeout(500);

    // Verify modal is open with pre-filled data
    const modal = page.locator('#package-modal');
    await expect(modal).toBeVisible();
    await expect(page.locator('#package-modal-title')).toContainText('Edit Paket');

    // Verify fields are pre-filled (not empty)
    const nameValue = await page.locator('#package-name').inputValue();
    expect(nameValue.length).toBeGreaterThan(0);

    const descValue = await page.locator('#package-description').inputValue();
    expect(descValue.length).toBeGreaterThan(0);

    const iconValue = await page.locator('#package-icon').inputValue();
    expect(iconValue.length).toBeGreaterThan(0);

    const priceValue = await page.locator('#package-price').inputValue();
    expect(priceValue.length).toBeGreaterThan(0);
  });

  test('updates package data when editing', async ({ page }) => {
    await page.click('#tab-packages');
    await page.waitForTimeout(2000);

    // Find first edit button
    const editBtn = page.locator('#packages-table-body .btn--text').filter({ hasText: 'Edit' }).first();
    await editBtn.click();
    await page.waitForTimeout(500);

    // Modify name
    await page.fill('#package-name', 'Paket Updated E2E');

    // Submit
    await page.click('#package-modal-submit');
    await page.waitForTimeout(2000);

    // Verify modal closed
    const modal = page.locator('#package-modal');
    await expect(modal).toBeHidden();

    // Verify updated name in table
    const tbody = page.locator('#packages-table-body');
    const nameCells = tbody.locator('.packages-table__name');
    const names = await nameCells.allTextContents();
    expect(names.some(n => n.includes('Paket Updated E2E'))).toBeTruthy();
  });

  test('auto-unsets featured when setting new featured', async ({ page }) => {
    await page.click('#tab-packages');
    await page.waitForTimeout(2000);

    // Count current featured badges
    const featuredBadgesBefore = page.locator('#packages-table-body .packages-badge--featured');
    const countBefore = await featuredBadgesBefore.count();

    // Find a non-featured package and edit it
    const rows = page.locator('#packages-table-body tr');
    const rowCount = await rows.count();

    // Find a row without featured badge
    let targetEditBtn = null;
    for (let i = 0; i < rowCount; i++) {
      const row = rows.nth(i);
      const featuredBadge = row.locator('.packages-badge--featured');
      const hasFeatured = await featuredBadge.count();
      if (hasFeatured === 0) {
        targetEditBtn = row.locator('.btn--text').filter({ hasText: 'Edit' });
        break;
      }
    }

    if (targetEditBtn) {
      await targetEditBtn.click();
      await page.waitForTimeout(500);

      // Set as featured
      await page.check('#package-featured');

      // Submit
      await page.click('#package-modal-submit');
      await page.waitForTimeout(2000);

      // Verify only one featured badge exists
      const featuredBadgesAfter = page.locator('#packages-table-body .packages-badge--featured');
      const countAfter = await featuredBadgesAfter.count();
      expect(countAfter).toBe(1);
    }
  });

  // =========================================================================
  // Rule 7: Admin CRUD — Delete
  // =========================================================================

  test('deletes package with confirmation', async ({ page }) => {
    await page.click('#tab-packages');
    await page.waitForTimeout(2000);

    // Get initial row count
    const rowsBefore = page.locator('#packages-table-body tr');
    const countBefore = await rowsBefore.count();

    // Find last delete button
    const deleteBtn = page.locator('#packages-table-body .btn--text.btn--danger').filter({ hasText: 'Hapus' }).last();
    await expect(deleteBtn).toBeAttached();
    await deleteBtn.click();
    await page.waitForTimeout(500);

    // Verify delete confirmation modal
    const deleteModal = page.locator('#package-delete-modal');
    await expect(deleteModal).toBeVisible();

    // Verify package name is shown in confirmation
    const deleteName = page.locator('#package-delete-name');
    const nameText = await deleteName.textContent();
    expect(nameText.length).toBeGreaterThan(0);

    // Confirm delete
    await page.click('#package-delete-confirm');
    await page.waitForTimeout(2000);

    // Verify modal closed
    await expect(deleteModal).toBeHidden();

    // Verify row count decreased
    const countAfter = await rowsBefore.count();
    expect(countAfter).toBeLessThan(countBefore);
  });

  test('cancels delete when clicking cancel', async ({ page }) => {
    await page.click('#tab-packages');
    await page.waitForTimeout(2000);

    // Get initial row count
    const rowsBefore = page.locator('#packages-table-body tr');
    const countBefore = await rowsBefore.count();

    // Find delete button
    const deleteBtn = page.locator('#packages-table-body .btn--text.btn--danger').filter({ hasText: 'Hapus' }).first();
    await deleteBtn.click();
    await page.waitForTimeout(500);

    // Click cancel
    await page.click('#package-delete-cancel');
    await page.waitForTimeout(500);

    // Verify modal closed
    const deleteModal = page.locator('#package-delete-modal');
    await expect(deleteModal).toBeHidden();

    // Verify row count unchanged
    const countAfter = await rowsBefore.count();
    expect(countAfter).toBe(countBefore);
  });

  // =========================================================================
  // Edge Cases
  // =========================================================================

  test('closes modal when clicking cancel', async ({ page }) => {
    await page.click('#tab-packages');
    await page.waitForTimeout(1000);

    // Open add modal
    await page.click('#add-package-button');
    await page.waitForTimeout(500);

    const modal = page.locator('#package-modal');
    await expect(modal).toBeVisible();

    // Click cancel
    await page.click('#package-modal-cancel');
    await page.waitForTimeout(500);

    // Verify modal closed
    await expect(modal).toBeHidden();
  });

  test('closes modal when clicking close button', async ({ page }) => {
    await page.click('#tab-packages');
    await page.waitForTimeout(1000);

    // Open add modal
    await page.click('#add-package-button');
    await page.waitForTimeout(500);

    const modal = page.locator('#package-modal');
    await expect(modal).toBeVisible();

    // Click close (X) button
    await page.click('#package-modal-close');
    await page.waitForTimeout(500);

    // Verify modal closed
    await expect(modal).toBeHidden();
  });

  test('displays package tag badges in table', async ({ page }) => {
    await page.click('#tab-packages');
    await page.waitForTimeout(2000);

    // Verify tag badges exist
    const tagBadges = page.locator('#packages-table-body .packages-badge');
    const count = await tagBadges.count();
    expect(count).toBeGreaterThan(0);
  });

  test('displays package status badges in table', async ({ page }) => {
    await page.click('#tab-packages');
    await page.waitForTimeout(2000);

    // Verify active/inactive badges
    const activeBadges = page.locator('#packages-table-body .packages-badge--active');
    const inactiveBadges = page.locator('#packages-table-body .packages-badge--inactive');
    const totalStatusBadges = await activeBadges.count() + await inactiveBadges.count();
    expect(totalStatusBadges).toBeGreaterThan(0);
  });
});
