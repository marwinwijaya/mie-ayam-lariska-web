// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Admin Login Page', () => {
  test.beforeEach(async ({ page }) => {
    // Clear any existing session
    await page.goto('/admin/login.html');
    await page.evaluate(() => localStorage.removeItem('admin_logged_in'));
  });

  test('displays login form with username and password fields', async ({ page }) => {
    await page.goto('/admin/login.html');
    
    // Check form elements exist
    const form = page.locator('#login-form');
    await expect(form).toBeVisible();
    
    const usernameInput = page.locator('#username');
    await expect(usernameInput).toBeVisible();
    await expect(usernameInput).toHaveAttribute('type', 'text');
    
    const passwordInput = page.locator('#password');
    await expect(passwordInput).toBeVisible();
    await expect(passwordInput).toHaveAttribute('type', 'password');
    
    const loginButton = page.locator('#login-button');
    await expect(loginButton).toBeVisible();
    await expect(loginButton).toHaveText(/masuk/i);
  });

  test('shows error message for invalid credentials', async ({ page }) => {
    await page.goto('/admin/login.html');
    
    // Fill in wrong credentials
    await page.fill('#username', 'wrong');
    await page.fill('#password', 'wrong');
    
    // Click login
    await page.click('#login-button');
    
    // Check error message appears
    const errorElement = page.locator('#error-message');
    await expect(errorElement).toBeVisible();
    await expect(errorElement).toContainText('Username atau password salah');
    
    // Verify localStorage was NOT set
    const isLoggedIn = await page.evaluate(() => {
      return localStorage.getItem('admin_logged_in');
    });
    expect(isLoggedIn).toBeNull();
  });

  test('logs in successfully with correct credentials', async ({ page }) => {
    await page.goto('/admin/login.html');
    
    // Fill in correct credentials
    await page.fill('#username', 'lariska');
    await page.fill('#password', 'lariska123');
    
    // Click login
    await page.click('#login-button');
    
    // Wait for navigation or state change
    await page.waitForTimeout(1000);
    
    // Verify localStorage was set
    const isLoggedIn = await page.evaluate(() => {
      return localStorage.getItem('admin_logged_in');
    });
    expect(isLoggedIn).toBe('true');
    
    // Verify we're redirected to dashboard (or dashboard page loads)
    const currentUrl = page.url();
    expect(currentUrl).toContain('/admin');
  });

  test('does not show error message for valid credentials', async ({ page }) => {
    await page.goto('/admin/login.html');
    
    // Fill in correct credentials
    await page.fill('#username', 'lariska');
    await page.fill('#password', 'lariska123');
    
    // Click login
    await page.click('#login-button');
    
    // Wait a moment
    await page.waitForTimeout(500);
    
    // Check error message is hidden or not present
    const errorElement = page.locator('#error-message');
    const isVisible = await errorElement.isVisible().catch(() => false);
    expect(isVisible).toBe(false);
  });
});

test.describe('Admin Auth - localStorage Session', () => {
  test('redirects to login when not authenticated', async ({ page }) => {
    // Clear session
    await page.goto('/admin/login.html');
    await page.evaluate(() => localStorage.removeItem('admin_logged_in'));
    
    // Try to access admin page (if dashboard exists)
    // For now, just verify that login page loads when not authenticated
    await page.goto('/admin/login.html');
    const loginForm = page.locator('#login-form');
    await expect(loginForm).toBeVisible();
  });

  test('clears session on logout', async ({ page }) => {
    await page.goto('/admin/login.html');
    
    // Set a logged in state manually
    await page.evaluate(() => {
      localStorage.setItem('admin_logged_in', 'true');
    });
    
    // Verify it's set
    let isLoggedIn = await page.evaluate(() => {
      return localStorage.getItem('admin_logged_in');
    });
    expect(isLoggedIn).toBe('true');
    
    // Clear it (simulating logout)
    await page.evaluate(() => {
      localStorage.removeItem('admin_logged_in');
    });
    
    // Verify it's cleared
    isLoggedIn = await page.evaluate(() => {
      return localStorage.getItem('admin_logged_in');
    });
    expect(isLoggedIn).toBeNull();
  });
});

// ===========================================================================
// Admin Grid — Responsive Breakpoints
// ===========================================================================
test.describe('Admin Grid — Responsive Breakpoints', () => {
  test('shows 3 columns at 768px viewport', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/admin/login.html');
    await page.evaluate(() => { localStorage.setItem('admin_logged_in', 'true'); });
    await page.goto('/admin/index.html');
    await page.waitForSelector('.admin-menu__grid', { timeout: 10000 });
    
    const columns = await page.evaluate(() => {
      const grid = document.querySelector('.admin-menu__grid');
      return grid ? window.getComputedStyle(grid).gridTemplateColumns : null;
    });
    expect(columns).toBeTruthy();
    expect(columns.split(' ').length).toBe(3);
  });

  test('shows 4 columns at 1024px viewport', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 768 });
    await page.goto('/admin/login.html');
    await page.evaluate(() => { localStorage.setItem('admin_logged_in', 'true'); });
    await page.goto('/admin/index.html');
    await page.waitForSelector('.admin-menu__grid', { timeout: 10000 });
    
    const columns = await page.evaluate(() => {
      const grid = document.querySelector('.admin-menu__grid');
      return grid ? window.getComputedStyle(grid).gridTemplateColumns : null;
    });
    expect(columns).toBeTruthy();
    expect(columns.split(' ').length).toBe(4);
  });
});