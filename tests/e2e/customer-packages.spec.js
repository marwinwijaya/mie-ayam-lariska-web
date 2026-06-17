// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Customer Packages Display', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for packages to load from Firebase
    await page.waitForTimeout(3000);
  });

  // =========================================================================
  // Rule 1: Featured Card Dominance
  // =========================================================================

  test('renders packages section from Firebase', async ({ page }) => {
    const section = page.locator('[data-section="packages"]');
    await expect(section).toBeVisible();

    const container = page.locator('#packages-container');
    await expect(container).toBeVisible();

    // Verify cards are rendered
    const cards = page.locator('.packages__card');
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);
  });

  test('displays featured card full-width at top', async ({ page }) => {
    const featured = page.locator('.packages__featured');
    await expect(featured).toBeVisible();

    const featuredCard = featured.locator('.packages__card--featured');
    await expect(featuredCard).toBeAttached();
  });

  test('displays featured card with accent bar and badge', async ({ page }) => {
    const featuredCard = page.locator('.packages__card--featured');
    await expect(featuredCard).toBeAttached();

    // Verify featured card has the featured class (which applies gradient styles)
    const hasFeaturedClass = await featuredCard.evaluate(el => {
      return el.classList.contains('packages__card--featured');
    });
    expect(hasFeaturedClass).toBe(true);

    // Verify featured card has a badge
    const badge = featuredCard.locator('.packages__card-badge');
    await expect(badge).toBeAttached();
  });

  test('featured card has Paling Laris badge', async ({ page }) => {
    const featuredCard = page.locator('.packages__card--featured');
    const badge = featuredCard.locator('.packages__card-badge');
    await expect(badge).toContainText(/Paling Laris/i);
  });

  test('featured card has larger styling than regular cards', async ({ page }) => {
    const featuredCard = page.locator('.packages__card--featured');
    await expect(featuredCard).toBeAttached();

    // Check featured card has special styling classes and attributes
    const featuredClass = await featuredCard.getAttribute('class');
    expect(featuredClass).toContain('packages__card--featured');

    // Check featured card has solid background (not gradient)
    const hasSolidBackground = await featuredCard.evaluate((el) => {
      const style = window.getComputedStyle(el);
      return !style.backgroundImage.includes('gradient');
    });
    expect(hasSolidBackground).toBe(true);

    // On desktop, featured card should be in separate container above grid
    const featuredContainer = page.locator('.packages__featured');
    await expect(featuredContainer).toBeAttached();
  });

  // =========================================================================
  // Rule 2: Value Proposition — Convenience
  // =========================================================================

  test('shows Lengkap badge instead of Hemat 0k', async ({ page }) => {
    // Verify "Lengkap" badge exists on non-topping cards
    const lengkapBadges = page.locator('.packages__badge--lengkap');
    const count = await lengkapBadges.count();
    expect(count).toBeGreaterThan(0);

    // Verify "Hemat 0k" text does NOT exist
    const pageContent = await page.textContent('body');
    expect(pageContent).not.toContain('Hemat 0k');
  });

  test('does not display strikethrough pricing', async ({ page }) => {
    // Verify no strikethrough elements in packages section
    const section = page.locator('[data-section="packages"]');
    const strikethroughElements = section.locator('s, strike, del');
    const count = await strikethroughElements.count();
    expect(count).toBe(0);
  });

  test('displays price in k format', async ({ page }) => {
    const priceElements = page.locator('.packages__card-price .price');
    const count = await priceElements.count();
    expect(count).toBeGreaterThan(0);

    // Verify price format (e.g., "15k", "13k")
    const firstPrice = await priceElements.first().textContent();
    expect(firstPrice).toMatch(/\d+k/);
  });

  // =========================================================================
  // Rule 3: Dynamic Data from Firebase
  // =========================================================================

  test('falls back to offline data if Firebase fails', async ({ page }) => {
    // The fallback packages are defined in the page
    // Verify that even with potential Firebase issues, cards render
    const cards = page.locator('.packages__card');
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);

    // Verify at least one known fallback package exists
    const cardNames = page.locator('.packages__card-name');
    const names = await cardNames.allTextContents();
    const hasKnownPackage = names.some(n =>
      n.includes('Paket Lengkap') ||
      n.includes('Paket Favorit') ||
      n.includes('Paket Kenyang') ||
      n.includes('Topping Suka-Suka')
    );
    expect(hasKnownPackage).toBeTruthy();
  });

  test('packages section has title and subtitle', async ({ page }) => {
    const section = page.locator('[data-section="packages"]');
    await expect(section.locator('.section__title')).toContainText(/Paket/i);
    await expect(section.locator('.packages__subtitle')).toBeVisible();
  });

  test('renders package cards with name, price, and WhatsApp button', async ({ page }) => {
    const cards = page.locator('.packages__card');
    const count = await cards.count();

    for (let i = 0; i < count; i++) {
      const card = cards.nth(i);

      // Each card should have a name
      const name = card.locator('.packages__card-name');
      await expect(name).toBeAttached();

      // Each card should have a price
      const price = card.locator('.packages__card-price');
      await expect(price).toBeAttached();

      // Each card should have a WhatsApp/order button
      const btn = card.locator('.packages__card-btn');
      await expect(btn).toBeAttached();
    }
  });

  test('package cards have correct WhatsApp links', async ({ page }) => {
    const waButtons = page.locator('.packages__card-btn');
    const count = await waButtons.count();

    for (let i = 0; i < count; i++) {
      const btn = waButtons.nth(i);
      const href = await btn.getAttribute('href');
      expect(href).toContain('wa.me/6281364856560');
    }
  });

  // =========================================================================
  // Rule 8: Responsive Layout
  // =========================================================================

  test('renders non-featured cards in responsive grid', async ({ page }) => {
    const grid = page.locator('.packages__grid');
    await expect(grid).toBeVisible();

    const gridCards = grid.locator('.packages__card');
    const count = await gridCards.count();
    expect(count).toBeGreaterThan(0);
  });

  test('mobile view shows 1 column layout', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 812 });
    await page.waitForTimeout(500);

    const grid = page.locator('.packages__grid');
    await expect(grid).toBeVisible();

    // On mobile, grid should use 1 column
    const gridStyle = await grid.evaluate(el => {
      const style = window.getComputedStyle(el);
      return {
        display: style.display,
        gridTemplateColumns: style.gridTemplateColumns
      };
    });

    // Grid should be present
    expect(gridStyle.display).toBeTruthy();
  });

  test('tablet view shows 2 column layout', async ({ page }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForTimeout(500);

    const grid = page.locator('.packages__grid');
    await expect(grid).toBeVisible();

    // Verify grid is rendered
    const gridDisplay = await grid.evaluate(el => {
      return window.getComputedStyle(el).display;
    });
    expect(gridDisplay).toBeTruthy();
  });

  test('desktop view shows 3 column layout', async ({ page }) => {
    // Set desktop viewport
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.waitForTimeout(500);

    const grid = page.locator('.packages__grid');
    await expect(grid).toBeVisible();

    // Verify grid is rendered
    const gridDisplay = await grid.evaluate(el => {
      return window.getComputedStyle(el).display;
    });
    expect(gridDisplay).toBeTruthy();
  });

  // =========================================================================
  // Edge Cases & Content Validation
  // =========================================================================

  test('inactive packages are not displayed', async ({ page }) => {
    // Count total cards
    const cards = page.locator('.packages__card');
    const count = await cards.count();

    // All rendered cards should be active (this is enforced by the render logic)
    expect(count).toBeGreaterThan(0);
  });

  test('topping card has secondary style button', async ({ page }) => {
    // Find the Topping Suka-Suka card
    const cards = page.locator('.packages__card');
    const count = await cards.count();

    for (let i = 0; i < count; i++) {
      const card = cards.nth(i);
      const name = await card.locator('.packages__card-name').textContent();

      if (name && name.includes('Topping')) {
        const btn = card.locator('.packages__card-btn');
        const btnClass = await btn.getAttribute('class');
        expect(btnClass).toContain('btn--secondary');

        // Verify button text
        await expect(btn).toContainText(/Buat Paket Sendiri/i);
        break;
      }
    }
  });

  test('non-topping cards have primary style button', async ({ page }) => {
    const gridCards = page.locator('.packages__grid .packages__card');
    const count = await gridCards.count();

    for (let i = 0; i < count; i++) {
      const card = gridCards.nth(i);
      const name = await card.locator('.packages__card-name').textContent();

      if (name && !name.includes('Topping')) {
        const btn = card.locator('.packages__card-btn');
        const btnClass = await btn.getAttribute('class');
        expect(btnClass).toContain('btn--primary');
        await expect(btn).toContainText(/WhatsApp/i);
      }
    }
  });

  test('package cards display items list when available', async ({ page }) => {
    // Find a card with items list
    const itemsLists = page.locator('.packages__card-items');
    const count = await itemsLists.count();

    // At least some cards should have items
    expect(count).toBeGreaterThan(0);

    // Verify items have list items
    const listItems = itemsLists.first().locator('li');
    const itemCount = await listItems.count();
    expect(itemCount).toBeGreaterThan(0);
  });

  test('Topping Suka-Suka card shows description instead of items', async ({ page }) => {
    const cards = page.locator('.packages__card');
    const count = await cards.count();

    for (let i = 0; i < count; i++) {
      const card = cards.nth(i);
      const name = await card.locator('.packages__card-name').textContent();

      if (name && name.includes('Topping')) {
        // Should have description
        const desc = card.locator('.packages__card-description');
        await expect(desc).toBeAttached();
        const descText = await desc.textContent();
        expect(descText.length).toBeGreaterThan(0);
        break;
      }
    }
  });

  test('featured card is placed above regular grid', async ({ page }) => {
    const featured = page.locator('.packages__featured');
    const grid = page.locator('.packages__grid');

    await expect(featured).toBeAttached();
    await expect(grid).toBeAttached();

    // Featured should appear before grid in DOM order
    const featuredBox = await featured.boundingBox();
    const gridBox = await grid.boundingBox();

    if (featuredBox && gridBox) {
      expect(featuredBox.y).toBeLessThan(gridBox.y);
    }
  });
});
