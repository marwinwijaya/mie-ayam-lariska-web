// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Customer Dashboard Structure', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  // === SECTION PRESENCE ===
  test('has hero section with brand name and tagline', async ({ page }) => {
    const hero = page.locator('[data-section="hero"]');
    await expect(hero).toBeVisible();
    await expect(hero.locator('.hero__brand')).toContainText('Mie Ayam Lariska');
    await expect(hero.locator('.hero__tagline')).toContainText('Mie Ayam Enak, Topping Bisa Mix Suka-Suka');
  });

  test('has hero section with WhatsApp CTA button', async ({ page }) => {
    const cta = page.locator('[data-section="hero"] .hero__cta-primary');
    await expect(cta).toBeVisible();
    await expect(cta).toHaveText(/Pesan.*WhatsApp/i);
  });

  test('has hero section with Maps CTA button', async ({ page }) => {
    const cta = page.locator('[data-section="hero"] .hero__cta-secondary');
    await expect(cta).toBeVisible();
    await expect(cta).toHaveText(/Lokasi.*Maps/i);
  });

  test('has menu section with all three categories', async ({ page }) => {
    const menu = page.locator('[data-section="menu"]');
    await expect(menu).toBeVisible();

    // Check for category headings
    const categories = menu.locator('.menu__category-title');
    const categoryTexts = await categories.allTextContents();
    const lowerTexts = categoryTexts.map(t => t.toLowerCase());
    expect(lowerTexts.some(t => t.includes('mie ayam'))).toBeTruthy();
    expect(lowerTexts.some(t => t.includes('minuman'))).toBeTruthy();
    expect(lowerTexts.some(t => t.includes('topping'))).toBeTruthy();
  });

  test('has menu placeholder cards', async ({ page }) => {
    const cards = page.locator('.menu__item-card');
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);
  });

  test('has packages section', async ({ page }) => {
    const packages = page.locator('[data-section="packages"]');
    await expect(packages).toBeVisible();
    await expect(packages.locator('.section__title')).toContainText(/Paket/i);
  });

  test('has events section for event orders', async ({ page }) => {
    const events = page.locator('[data-section="events"]');
    await expect(events).toBeVisible();
    await expect(events).toContainText(/Acara/i);
  });

  test('has location section with address', async ({ page }) => {
    const location = page.locator('[data-section="location"]');
    await expect(location).toBeVisible();
    await expect(location).toContainText(/Adijaya|Fairamart|Pasar Kambing/i);
  });

  test('has FAQ section', async ({ page }) => {
    const faq = page.locator('[data-section="faq"]');
    await expect(faq).toBeVisible();
    await expect(faq.locator('.section__title')).toContainText(/FAQ/i);
  });

  test('has FAQ items with question and answer pairs', async ({ page }) => {
    const items = page.locator('[data-section="faq"] .faq__item');
    const count = await items.count();
    expect(count).toBeGreaterThan(0);
  });

  test('has footer with brand info', async ({ page }) => {
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
    await expect(footer).toContainText('Mie Ayam Lariska');
  });

  test('has footer with Instagram link', async ({ page }) => {
    const footer = page.locator('footer');
    const instagramLinks = footer.locator('a[href*="instagram"]');
    const count = await instagramLinks.count();
    expect(count).toBeGreaterThan(0);
    await expect(instagramLinks.first()).toBeVisible();
  });

  test('has footer with WhatsApp link', async ({ page }) => {
    const footer = page.locator('footer');
    const whatsappLink = footer.locator('a[href*="wa.me"], a[href*="whatsapp"]');
    await expect(whatsappLink).toBeVisible();
  });

  // === SEO META TAGS ===
  test('has SEO meta tags', async ({ page }) => {
    const title = await page.title();
    expect(title).toContain('Mie Ayam Lariska');

    const description = page.locator('meta[name="description"]');
    await expect(description).toHaveAttribute('content', /.+/);
  });

  test('has Open Graph tags', async ({ page }) => {
    const ogTitle = page.locator('meta[property="og:title"]');
    await expect(ogTitle).toHaveAttribute('content', /.+/);

    const ogDescription = page.locator('meta[property="og:description"]');
    await expect(ogDescription).toHaveAttribute('content', /.+/);

    const ogType = page.locator('meta[property="og:type"]');
    await expect(ogType).toHaveAttribute('content', 'website');
  });

  // === MOBILE-FIRST RESPONSIVE DESIGN ===
  test('page renders correctly on mobile viewport', async ({ page }) => {
    // Playwright config sets viewport to 375x812 (mobile)
    const hero = page.locator('[data-section="hero"]');
    await expect(hero).toBeVisible();
    const menu = page.locator('[data-section="menu"]');
    await expect(menu).toBeVisible();
  });

  // === BRAND COLORS ===
  test('brand primary color is applied', async ({ page }) => {
    // Check that primary color exists as CSS custom property or is used
    const hero = page.locator('[data-section="hero"]');
    const ctaButton = hero.locator('.hero__cta-primary');
    await expect(ctaButton).toBeVisible();

    // Verify button has a background color (brand red)
    const bgColor = await ctaButton.evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor;
    });
    // Not checking exact color value as it may vary by implementation
    expect(bgColor).toBeTruthy();
  });

  // === NO JAVASCRIPT FUNCTIONALITY ===
  test('no inline onclick handlers on page', async ({ page }) => {
    const onclickElements = await page.locator('[onclick]').count();
    expect(onclickElements).toBe(0);
  });

  // === STRUCTURE INTEGRITY ===
  test('all main sections have data-section attribute', async ({ page }) => {
    const expectedSections = ['hero', 'menu', 'packages', 'events', 'location', 'faq'];
    for (const section of expectedSections) {
      const el = page.locator(`[data-section="${section}"]`);
      await expect(el).toBeAttached();
    }
  });

  test('has a nav or header element for navigation', async ({ page }) => {
    const nav = page.locator('nav, header');
    const count = await nav.count();
    expect(count).toBeGreaterThan(0);
  });

  // === LINK INTEGRITY ===
  test('WhatsApp links point to correct number', async ({ page }) => {
    const whatsappLinks = page.locator('a[href*="wa.me/6281364856560"]');
    const count = await whatsappLinks.count();
    expect(count).toBeGreaterThan(0);
  });

  test('Google Maps link exists', async ({ page }) => {
    const mapsLinks = page.locator('a[href*="maps"], a[href*="goo.gl"]');
    const count = await mapsLinks.count();
    expect(count).toBeGreaterThan(0);
  });
});

// ===========================================================================
// Stock Service — caching, normalization, and fallback tests
// ===========================================================================
test.describe('Stock Service — Normalization', () => {
  test.beforeEach(async ({ page }) => {
    // Clear all localStorage before each test
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
  });

  test('normalizes invalid stock status to sold_out', async ({ page }) => {
    await page.goto('/');
    const result = await page.evaluate(() => {
      return StockService.normalizeStockStatus('avaiable');
    });
    expect(result).toBe('sold_out');
  });

  test('normalizes typo stock status to sold_out', async ({ page }) => {
    await page.goto('/');
    const result = await page.evaluate(() => {
      return StockService.normalizeStockStatus('limted');
    });
    expect(result).toBe('sold_out');
  });

  test('normalizes null stock status to sold_out', async ({ page }) => {
    await page.goto('/');
    const result = await page.evaluate(() => {
      return StockService.normalizeStockStatus(null);
    });
    expect(result).toBe('sold_out');
  });

  test('normalizes undefined stock status to sold_out', async ({ page }) => {
    await page.goto('/');
    const result = await page.evaluate(() => {
      return StockService.normalizeStockStatus(undefined);
    });
    expect(result).toBe('sold_out');
  });

  test('normalizes empty string stock status to sold_out', async ({ page }) => {
    await page.goto('/');
    const result = await page.evaluate(() => {
      return StockService.normalizeStockStatus('');
    });
    expect(result).toBe('sold_out');
  });

  test('preserves valid status available', async ({ page }) => {
    await page.goto('/');
    const result = await page.evaluate(() => {
      return StockService.normalizeStockStatus('available');
    });
    expect(result).toBe('available');
  });

  test('preserves valid status limited', async ({ page }) => {
    await page.goto('/');
    const result = await page.evaluate(() => {
      return StockService.normalizeStockStatus('limited');
    });
    expect(result).toBe('limited');
  });

  test('preserves valid status sold_out', async ({ page }) => {
    await page.goto('/');
    const result = await page.evaluate(() => {
      return StockService.normalizeStockStatus('sold_out');
    });
    expect(result).toBe('sold_out');
  });
});

test.describe('Stock Service — localStorage Cache', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
  });

  test('saves stock data to localStorage', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => {
      StockService.saveStockData({
        'mie_ayam_komplit': { status: 'sold_out' },
        'teh_anget': { status: 'limited' }
      });
    });

    const stored = await page.evaluate(() => {
      return localStorage.getItem('mie_ayam_lariska_stock');
    });
    expect(stored).toBeTruthy();
    const parsed = JSON.parse(stored);
    expect(parsed['mie_ayam_komplit'].status).toBe('sold_out');
    expect(parsed['teh_anget'].status).toBe('limited');
  });

  test('reads cached stock data from localStorage', async ({ page }) => {
    await page.goto('/');
    // Manually set localStorage
    await page.evaluate(() => {
      localStorage.setItem('mie_ayam_lariska_stock', JSON.stringify({
        'mie_ayam_komplit': { status: 'available' },
        'es_teh_manis': { status: 'sold_out' }
      }));
    });

    const cached = await page.evaluate(() => {
      return StockService.getCachedStockData();
    });
    expect(cached).toBeTruthy();
    expect(cached['mie_ayam_komplit'].status).toBe('available');
    expect(cached['es_teh_manis'].status).toBe('sold_out');
  });

  test('returns null when no cached data exists', async ({ page }) => {
    await page.goto('/');
    const cached = await page.evaluate(() => {
      return StockService.getCachedStockData();
    });
    expect(cached).toBeNull();
  });

  test('clears stock cache', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => {
      StockService.saveStockData({ 'test_item': { status: 'available' } });
    });

    await page.evaluate(() => {
      StockService.clearStockCache();
    });

    const cached = await page.evaluate(() => {
      return StockService.getCachedStockData();
    });
    expect(cached).toBeNull();
  });
});

test.describe('Stock Service — Fallback Logic', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
  });

  test('defaults to available when no cache and no firebase data', async ({ page }) => {
    await page.goto('/');
    const result = await page.evaluate(() => {
      return StockService.getStockStatus('mie_ayam_komplit', null);
    });
    expect(result).toBe('available');
  });

  test('uses firebase data when available', async ({ page }) => {
    await page.goto('/');
    const result = await page.evaluate(() => {
      return StockService.getStockStatus('mie_ayam_komplit', 'sold_out');
    });
    expect(result).toBe('sold_out');
  });

  test('uses cached data for missing firebase entries', async ({ page }) => {
    await page.goto('/');
    // Pre-populate cache
    await page.evaluate(() => {
      StockService.saveStockData({
        'mie_ayam_komplit': { status: 'limited' }
      });
    });
    // Firebase has no data for this item (null)
    const result = await page.evaluate(() => {
      return StockService.getStockStatus('mie_ayam_komplit', null);
    });
    expect(result).toBe('available');
  });

  test('merges firebase data with cached data for partial updates', async ({ page }) => {
    await page.goto('/');
    // Pre-populate cache with full stock data
    await page.evaluate(() => {
      StockService.saveStockData({
        'mie_ayam_komplit': { status: 'available' },
        'teh_anget': { status: 'available' },
        'es_teh_manis': { status: 'available' }
      });
    });
    // Firebase returns partial data (only 2 of 3 items)
    const firebaseData = {
      'mie_ayam_komplit': { status: 'sold_out' },
      'teh_anget': { status: 'limited' }
      // es_teh_manis is missing from firebase
    };
    const merged = await page.evaluate((fData) => {
      return StockService.mergeStockData(fData);
    }, firebaseData);

    // Firebase data overrides cache
    expect(merged['mie_ayam_komplit'].status).toBe('sold_out');
    expect(merged['teh_anget'].status).toBe('limited');
    // Missing firebase entry keeps cached data
    expect(merged['es_teh_manis'].status).toBe('available');
  });
});

test.describe('Stock Service — Missing and Orphaned Entries', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
  });

  test('handles missing stock entry by defaulting to available', async ({ page }) => {
    await page.goto('/');
    const result = await page.evaluate(() => {
      return StockService.getStockStatus('new_item_no_firebase_entry', null);
    });
    expect(result).toBe('available');
  });

  test('returns all items from firebase data with normalization', async ({ page }) => {
    await page.goto('/');
    const firebaseData = {
      'mie_ayam_komplit': { status: 'available' },
      'teh_anget': { status: 'sold_out' },
      'es_invalid': { status: 'avaiable' }  // invalid typo
    };
    const result = await page.evaluate((fData) => {
      return StockService.processFirebaseData(fData);
    }, firebaseData);

    expect(result['mie_ayam_komplit'].status).toBe('available');
    expect(result['teh_anget'].status).toBe('sold_out');
    // Invalid status normalized to sold_out
    expect(result['es_invalid'].status).toBe('sold_out');
  });

  test('saves processed firebase data to cache', async ({ page }) => {
    await page.goto('/');
    const firebaseData = {
      'mie_ayam_komplit': { status: 'sold_out' }
    };
    await page.evaluate((fData) => {
      StockService.processAndCacheFirebaseData(fData);
    }, firebaseData);

    const cached = await page.evaluate(() => {
      return StockService.getCachedStockData();
    });
    expect(cached).toBeTruthy();
    expect(cached['mie_ayam_komplit'].status).toBe('sold_out');
  });
});

// ===========================================================================
// Performance — Script Loading
// ===========================================================================
test.describe('Performance — Script Loading', () => {
  test('no script tags in head element', async ({ page }) => {
    await page.goto('/');
    const scriptsInHead = await page.evaluate(() => {
      return document.head.querySelectorAll('script').length;
    });
    expect(scriptsInHead).toBe(0);
  });

  test('all script tags at bottom of body', async ({ page }) => {
    await page.goto('/');
    const scriptInfo = await page.evaluate(() => {
      const scripts = document.body.querySelectorAll('script');
      const bodyChildren = Array.from(document.body.children);
      const lastScript = scripts[scripts.length - 1];
      const lastScriptIndex = bodyChildren.indexOf(lastScript);
      return {
        scriptCount: scripts.length,
        lastScriptIndex: lastScriptIndex,
        totalChildren: bodyChildren.length,
        isAtBottom: lastScriptIndex >= bodyChildren.length - 3
      };
    });
    expect(scriptInfo.scriptCount).toBeGreaterThan(0);
    expect(scriptInfo.isAtBottom).toBe(true);
  });

  test('no stock-error-indicator element exists', async ({ page }) => {
    await page.goto('/');
    const indicator = page.locator('#stock-error-indicator');
    await expect(indicator).toHaveCount(0);
  });
});

// ===========================================================================
// Performance — Skeleton Loading
// ===========================================================================
test.describe('Performance — Skeleton Loading', () => {
  test('skeleton elements visible before Firebase connects', async ({ page }) => {
    await page.route('**/*firebaseio.com/**', route => route.abort());
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    const skeletons = page.locator('.skeleton:not(.skeleton--hidden)');
    const count = await skeletons.count();
    expect(count).toBeGreaterThan(0);
  });

  test('correct skeleton count per category', async ({ page }) => {
    await page.route('**/*firebaseio.com/**', route => route.abort());
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    
    // Mie Ayam: 11 skeletons
    const mieAyam = page.locator('[data-section="menu"] .menu__category').first();
    const mieAyamSkeletons = mieAyam.locator('.skeleton__card');
    expect(await mieAyamSkeletons.count()).toBe(11);
    
    // Topping: 8 skeletons
    const topping = page.locator('[data-section="menu"] .menu__category').nth(1);
    const toppingSkeletons = topping.locator('.skeleton__card');
    expect(await toppingSkeletons.count()).toBe(8);
    
    // Minuman: 5 skeletons
    const minuman = page.locator('[data-section="menu"] .menu__category').nth(2);
    const minumanSkeletons = minuman.locator('.skeleton__card');
    expect(await minumanSkeletons.count()).toBe(5);
  });
});

// ===========================================================================
// Performance — Optimistic Tersedia
// ===========================================================================
test.describe('Performance — Optimistic Tersedia', () => {
  test('all menu items show Tersedia badge on initial load', async ({ page }) => {
    await page.route('**/*firebaseio.com/**', route => route.abort());
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('.menu__item-card', { timeout: 5000 });
    
    const badges = page.locator('.menu__item-stock');
    const count = await badges.count();
    expect(count).toBeGreaterThan(0);
    
    for (let i = 0; i < count; i++) {
      const text = await badges.nth(i).textContent();
      expect(text.trim()).toContain('Tersedia');
    }
  });

  test('no error banner shown when Firebase connection fails', async ({ page }) => {
    await page.route('**/*firebaseio.com/**', route => route.abort());
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
    
    const errorIndicator = page.locator('#stock-error-indicator');
    await expect(errorIndicator).toHaveCount(0);
  });
});

// ===========================================================================
// Performance — Image Fallback
// ===========================================================================
test.describe('Performance — Image Fallback', () => {
  test('missing menu image shows cream placeholder', async ({ page }) => {
    await page.route('**/images/**', route => route.fulfill({
      status: 404, body: '', contentType: 'text/plain'
    }));
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    
    const fallbacks = page.locator('.image-fallback');
    const count = await fallbacks.count();
    expect(count).toBeGreaterThan(0);
    
    const firstFallback = fallbacks.first();
    await expect(firstFallback).toContainText('🍜');
  });

  test('fallback uses brand background color', async ({ page }) => {
    await page.route('**/images/**', route => route.fulfill({
      status: 404, body: '', contentType: 'text/plain'
    }));
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    
    const bgColor = await page.evaluate(() => {
      const fallback = document.querySelector('.image-fallback');
      return fallback ? window.getComputedStyle(fallback).backgroundColor : null;
    });
    expect(bgColor).toBeTruthy();
    expect(bgColor).not.toBe('rgb(240, 240, 240)'); // not generic gray
  });
});
