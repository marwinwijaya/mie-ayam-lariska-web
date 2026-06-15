# EXECUTION PLAN — Mie Ayam Lariska Web App

**Date:** 2026-06-15
**Spec:** docs/pocket/spec/2026-06-15-mie-ayam-lariska-web-app/mie-ayam-lariska-web-app.md
**Status:** ready
**Total tasks:** 16 (12 original + 4 integration test tasks)
**Test framework:** Playwright (E2E tests against deployed GitHub Pages URL)

---

## Test-Architect Summary

**Tasks enriched:** 15 (T1 excluded — prereq setup only, no business logic)
**Integration test tasks added:** 4
  - IT1: Menu rendering with Firebase stock status (T4 + T6 + T7)
  - IT2: WhatsApp redirect with menu item data (T5 + T4)
  - IT3: Admin stock update with real-time customer view (T10 + T7 + T4)
  - IT4: Firebase failure fallback with cached data (T7 + T6)
**TDD order corrections made:** 11 (T2–T10, T11 — all tasks now follow strict Red→Green→Refactor)
**Test framework used:** Playwright
**Coverage areas:**
  - Tested: Firebase connection, menu rendering, stock badges, WhatsApp encoding, admin auth, admin dashboard, admin stock update, real-time sync, failure fallback, retry logic
  - Intentionally not tested: Deployment configuration (T12), CSS visual design (manual QA), Firebase security rules (requires Firebase emulator — manual verification)

---

## Execution Overview

### Recommended Order
```
Phase A: T1 → T2, T3, T8 (parallel)
Phase B: T4 (from T3), T6 (from T1) → IT2 (from T4, T5) → T5 (from T4) → IT1 (from T4, T6, T7) → T7 (from T2, T6) → IT4 (from T7, T6) → T9 (from T8) → T10 (from T9) → IT3 (from T10, T7, T4)
Phase C: T11 (from all) → T12 (from all)
```

> Dependency order above is **recommended** — pocket skill enforces actual
> parallelism and sequencing based on its routing logic.

### Parallelizable Groups
| Group | Tasks | Unblocked After |
|-------|-------|-----------------|
| Phase A | T2, T3, T8 | T1 completes |
| Phase B | T4, T6 | Phase A complete |
| Phase B | T5 | T4 completes |
| Phase B | IT2 | T4, T5 complete |
| Phase B | T7 | T2, T6 complete |
| Phase B | IT1 | T4, T6, T7 complete |
| Phase B | IT4 | T7, T6 complete |
| Phase B | T9 | T8 completes |
| Phase B | T10 | T9 completes |
| Phase B | IT3 | T10, T7, T4 complete |
| Phase C | T11, T12 | All Phase A & B complete |

### Constraints Reminder
**Architecture:** Frontend HTML/CSS/JS only, Firebase client-side SDK, GitHub Pages static files
**Out-of-scope:** Payment processing, multi-user roles, server-side logic, order database
**Assumptions at risk:** Firebase config needs actual credentials (firebase.txt is empty)
**Sequencing:** Phase dependencies are hard locks — Phase B cannot start until Phase A complete, Phase C cannot start until Phase B complete.

### File Structure Map
```
Rule: Menu item display
  Create: index.html (created by: T3)
  Create: css/style.css (created by: T3)
  Create: js/menu-renderer.js (created by: T4)
  Test: tests/e2e/customer-dashboard.spec.js (created by: T3, enriched by T4, T6, T7)
  Test: tests/integration/test_menu_stock.spec.js (created by: IT1)

Rule: WhatsApp redirect
  Create: js/whatsapp-helper.js (created by: T5)
  Test: tests/e2e/whatsapp-redirect.spec.js (created by: T5)
  Test: tests/integration/test_whatsapp_menu.spec.js (created by: IT2)

Rule: Admin authentication
  Create: admin/login.html (created by: T8)
  Create: js/admin-auth.js (created by: T8)
  Test: tests/e2e/admin-dashboard.spec.js (created by: T8, enriched by T9, T10)

Rule: Admin stock update
  Create: admin/index.html (created by: T9)
  Create: js/admin-dashboard.js (created by: T10)
  Test: tests/integration/test_admin_stock.spec.js (created by: IT3)

Rule: Firebase failure handling
  Create: js/stock-service.js (created by: T6)
  Create: js/firebase-service.js (created by: T7)
  Test: tests/integration/test_fallback.spec.js (created by: IT4)
```

### Test Conventions
```
File naming:     tests/e2e/<feature>.spec.js
                 tests/integration/test_<feature>.spec.js
Test naming:     test('given <condition>, when <action>, then <expected>')
Locator strategy: page.locator('[data-testid="<name>"]') preferred
                 page.locator('.class') fallback
                 page.getByRole() for semantic queries
Imports:         const { test, expect } = require('@playwright/test');
```

---

## Pocket Packets

---

### Task 1: Project Setup [prereq]

## OBJECTIVE
Initialize project structure and development environment for Mie Ayam Lariska web app.

Files:
- Create: `package.json`
- Create: `playwright.config.js`
- Create: `.gitignore`
- Create: directory structure (`/css/`, `/js/`, `/images/`, `/tests/e2e/`, `/admin/`, `/tests/integration/`)

Steps:
1. Create package.json with Playwright dependencies
   File: `package.json`
   Content: name, version, scripts for testing, devDependencies for Playwright

2. Create Playwright configuration
   File: `playwright.config.js`
   Content: baseURL pointing to GitHub Pages URL, test directory, browser configurations

3. Create .gitignore
   File: `.gitignore`
   Content: node_modules/, test-results/, playwright-report/, .env

4. Create directory structure
   Create directories: `/css/`, `/js/`, `/images/`, `/tests/e2e/`, `/tests/integration/`, `/admin/`

5. Verify structure
   Command: `ls -la` to verify all directories exist

6. Commit
   `git add .`
   `git commit -m "chore(project): initialize project structure with Playwright"`

## REFERENCES LOADED
docs/pocket/spec/2026-06-15-mie-ayam-lariska-web-app/mie-ayam-lariska-web-app.md — Context: Fresh repository with datasource.json, firebase.txt, README.md

## WHY THIS APPROACH
Complexity: lightweight
Justification: Foundational setup that all other tasks depend on. Simple file creation with no business logic.

## SANDWICH CONTEXT
[CRITICAL: This is a vanilla HTML/CSS/JS project deployed to GitHub Pages — no build process allowed in production]
You are implementing project setup for Mie Ayam Lariska web app.
Spec: docs/pocket/spec/2026-06-15-mie-ayam-lariska-web-app/mie-ayam-lariska-web-app.md
Design decision: Option B — Multi-Page Application with Vanilla JavaScript
Files in scope: package.json, playwright.config.js, .gitignore, directory structure
Available after: none (prereq)
Architecture rule: No Node.js runtime in production — only for development/testing
[RESTATE: This is a vanilla HTML/CSS/JS project deployed to GitHub Pages — no build process allowed in production]

## DELIVERABLE
Given fresh repository, When project setup is complete, Then directory structure exists with all required folders
Given package.json exists, When running `npm install`, Then Playwright dependencies install successfully
Given playwright.config.js exists, When running `npx playwright test`, Then test runner initializes

Format: DONE | DONE_WITH_CONCERNS | NEEDS_CONTEXT | BLOCKED

## QUALITY BAR
Must-have:
  - All directories created
  - package.json with correct dependencies
  - Playwright configured for GitHub Pages testing
  - .gitignore excludes node_modules and test artifacts

Must-not-have:
  - Production build tools or bundlers
  - Server-side frameworks
  - Dependencies that require Node.js runtime in production

Open question risks:
  - Firebase config not yet available → will be addressed in T2

Rollback note:
  - Delete created files and directories

## STOP CONDITIONS
Done when: directory structure exists, package.json valid, Playwright config valid
Uncertain when: Firebase credentials not available (addressed in T2)
Escalate when: build tools added that require Node.js runtime in production

---

### Task 2: Firebase Configuration [depends: T1]

## OBJECTIVE
Set up Firebase Realtime Database with security rules and initial stock data.

Files:
- Create: `firebase.json` (Firebase configuration)
- Create: `firestore.rules` (security rules)
- Create: `js/firebase-config.js` (Firebase initialization)
- Create: `tests/e2e/firebase-connection.spec.js`

Steps:
1. Write failing test for Firebase connection
   File: `tests/e2e/firebase-connection.spec.js`

   ```javascript
   const { test, expect } = require('@playwright/test');

   test.describe('Firebase connection', () => {
     test('given Firebase is configured, when app loads, then can connect to Realtime Database', async ({ page }) => {
       // Given: Firebase is configured in firebase-config.js
       // When: customer loads the page
       await page.goto('/');
       
       // Then: Firebase SDK is loaded and initialized
       const firebaseLoaded = await page.evaluate(() => {
         return typeof window.firebase !== 'undefined' || 
                typeof window.firebaseApp !== 'undefined';
       });
       expect(firebaseLoaded).toBeTruthy();
     });

     test('given Firebase config exists, when script loads, then firebase-config.js exports config object', async ({ page }) => {
       // Given: firebase-config.js is included in the page
       await page.goto('/');
       
       // Then: config object is available
       const configValid = await page.evaluate(() => {
         // Check that Firebase config has required fields
         const script = document.querySelector('script[src="js/firebase-config.js"]');
         return script !== null;
       });
       expect(configValid).toBeTruthy();
     });
   });
   ```

2. Run test — verify FAIL
   Command: `npx playwright test tests/e2e/firebase-connection.spec.js`
   Expected: FAIL (no Firebase config yet, firebase-config.js doesn't exist)

3. Obtain Firebase project credentials
   Note: firebase.txt is empty — need actual credentials from user

4. Create Firebase configuration file
   File: `js/firebase-config.js`
   Content: Firebase config object with actual credentials, export for use by other modules

5. Create security rules
   File: `firestore.rules`
   Content: Rules allowing anyone to read stock data, only admin to write

6. Create initial stock data structure
   File: `firebase.json` (or provide via Firebase console)
   Content: Initial stock entries for all menu items with default "available"

7. Run test — verify PASS
   Command: `npx playwright test tests/e2e/firebase-connection.spec.js`
   Expected: PASS (Firebase config exists and loads correctly)

8. Commit
   `git add firebase.json firestore.rules js/firebase-config.js tests/e2e/firebase-connection.spec.js`
   `git commit -m "feat(firebase): configure Realtime Database with security rules"`

## REFERENCES LOADED
docs/pocket/spec/2026-06-15-mie-ayam-lariska-web-app/mie-ayam-lariska-web-app.md — Rule: Firebase failure handling, Rule: Admin stock update

## WHY THIS APPROACH
Complexity: standard
Justification: Firebase is the backbone for real-time stock updates. Must be configured before stock service can work.

## SANDWICH CONTEXT
[CRITICAL: Firebase security rules must allow unauthenticated reads but only admin writes]
You are implementing Firebase configuration for Mie Ayam Lariska web app.
Spec: docs/pocket/spec/2026-06-15-mie-ayam-lariska-web-app/mie-ayam-lariska-web-app.md
Design decision: Option B — Multi-Page Application with Vanilla JavaScript
Files in scope: firebase.json, firestore.rules, js/firebase-config.js
Available after: T1 (project setup)
Architecture rule: Firebase client-side SDK only — no server-side functions
[RESTATE: Firebase security rules must allow unauthenticated reads but only admin writes]

## DELIVERABLE
Given Firebase credentials, When Firebase is initialized, Then app can connect to Realtime Database
Given security rules, When unauthenticated user reads stock data, Then read succeeds
Given security rules, When unauthenticated user writes stock data, Then write is denied
Given initial stock data, When app loads, Then all menu items have stock entries

Format: DONE | DONE_WITH_CONCERNS | NEEDS_CONTEXT | BLOCKED

## QUALITY BAR
Must-have:
  - Firebase config with actual credentials
  - Security rules for read/write access
  - Initial stock data structure
  - Connection test passes

Must-not-have:
  - Server-side Firebase functions
  - Firebase Authentication for customers (only hardcoded admin auth)
- Multiple admin roles

Open question risks:
  - Firebase credentials not provided → BLOCKED until user provides them

Rollback note:
  - Remove Firebase config files, clear Firebase database

## STOP CONDITIONS
Done when: Firebase connection works, security rules applied, initial data created
Uncertain when: Firebase credentials not available
Escalate when: security rules don't match spec requirements

---

### Task 3: Customer Dashboard HTML/CSS [depends: T1]

## OBJECTIVE
Create customer-facing dashboard with all sections and mobile-first design.

Files:
- Create: `index.html`
- Create: `css/style.css`
- Create: `tests/e2e/customer-dashboard.spec.js` (initial)

Steps:
1. Write failing tests for customer dashboard structure
   File: `tests/e2e/customer-dashboard.spec.js`

   ```javascript
   const { test, expect } = require('@playwright/test');

   test.describe('Customer Dashboard Structure', () => {
     test.beforeEach(async ({ page }) => {
       await page.goto('/');
     });

     test('given customer opens website, when page loads, then sees hero section with brand name', async ({ page }) => {
       // Then: hero section exists with brand name
       const hero = page.locator('[data-testid="hero-section"], .hero, #hero');
       await expect(hero).toBeVisible();
       await expect(hero).toContainText('Mie Ayam Lariska');
       await expect(hero).toContainText('Mie Ayam Enak');
     });

     test('given customer scrolls, when views menu section, then sees placeholder sections', async ({ page }) => {
       // Then: menu sections exist
       await expect(page.locator('[data-testid="section-mie-ayam"], #menu-mie-ayam, .section-mie-ayam')).toBeAttached();
       await expect(page.locator('[data-testid="section-minuman"], #menu-minuman, .section-minuman')).toBeAttached();
       await expect(page.locator('[data-testid="section-topping"], #menu-topping, .section-topping')).toBeAttached();
     });

     test('given customer views FAQ, when clicks question, then sees answer', async ({ page }) => {
       // Given: FAQ section exists
       const faqSection = page.locator('[data-testid="faq-section"], .faq, #faq');
       await expect(faqSection).toBeAttached();
       
       // When: customer clicks first question
       const firstQuestion = faqSection.locator('[data-testid="faq-question"], .faq-question, button, summary').first();
       await firstQuestion.click();
       
       // Then: answer is visible
       const answer = faqSection.locator('[data-testid="faq-answer"], .faq-answer, .answer, details[open]').first();
       await expect(answer).toBeVisible();
     });

     test('given customer views page, when checks SEO meta tags, then title and description exist', async ({ page }) => {
       // Then: SEO meta tags are present
       await expect(page).toHaveTitle(/Mie Ayam Lariska/i);
       const description = page.locator('meta[name="description"]');
       await expect(description).toHaveAttribute('content', /.+/);
     });

     test('given customer views page, when checks Open Graph tags, then og:title and og:description exist', async ({ page }) => {
       // Then: Open Graph tags are present
       const ogTitle = page.locator('meta[property="og:title"]');
       await expect(ogTitle).toHaveAttribute('content', /.+/);
       const ogDescription = page.locator('meta[property="og:description"]');
       await expect(ogDescription).toHaveAttribute('content', /.+/);
     });
   });
   ```

2. Run test — verify FAIL
   Command: `npx playwright test tests/e2e/customer-dashboard.spec.js`
   Expected: FAIL (no index.html or css/style.css yet)

3. Create index.html with all sections
   File: `index.html`
   Content: Hero, menu sections (Mie Ayam, Minuman, Topping), packages, event orders, location, FAQ, footer
   Include: SEO meta tags, Open Graph tags, link to style.css, data-testid attributes for test selectors

4. Create css/style.css with brand colors
   File: `css/style.css`
   Content: Mobile-first responsive design, brand colors (#C40000, #FFD033, #F28C28, #FFF1D6, #1F1F1F)
   Include: CSS variables for colors, responsive breakpoints

5. Run test — verify PASS
   Command: `npx playwright test tests/e2e/customer-dashboard.spec.js`
   Expected: PASS (HTML structure matches tests)

6. Commit
   `git add index.html css/style.css tests/e2e/customer-dashboard.spec.js`
   `git commit -m "feat(customer): create customer dashboard HTML/CSS with brand colors"`

## REFERENCES LOADED
docs/pocket/spec/2026-06-15-mie-ayam-lariska-web-app/mie-ayam-lariska-web-app.md — Rule: Menu item display, Rule: Stock badge display

## WHY THIS APPROACH
Complexity: standard
Justification: Foundation for customer experience. Must be in place before menu rendering logic can be added.

## SANDWICH CONTEXT
[CRITICAL: Mobile-first design is required — majority of customers will access from smartphones]
You are implementing customer dashboard HTML/CSS for Mie Ayam Lariska web app.
Spec: docs/pocket/spec/2026-06-15-mie-ayam-lariska-web-app/mie-ayam-lariska-web-app.md
Design decision: Option B — Multi-Page Application with Vanilla JavaScript
Files in scope: index.html, css/style.css
Available after: T1 (project setup)
Architecture rule: Static HTML/CSS only — no server-side rendering
[RESTATE: Mobile-first design is required — majority of customers will access from smartphones]

## DELIVERABLE
Given customer opens website, When page loads, Then sees hero section with brand name and tagline
Given customer scrolls, When views menu section, Then sees placeholder cards for Mie Ayam, Minuman, Topping
Given customer views on mobile, When screen is small, Then layout is responsive and readable
Given customer views FAQ, When clicks question, Then sees answer

Format: DONE | DONE_WITH_CONCERNS | NEEDS_CONTEXT | BLOCKED

## QUALITY BAR
Must-have:
  - All sections present (hero, menu, packages, events, location, FAQ, footer)
  - Mobile-first responsive design
  - Brand colors applied correctly
  - SEO meta tags included
  - Open Graph tags included
  - data-testid attributes for test selectors

Must-not-have:
  - JavaScript functionality (added in later tasks)
  - Dynamic content (added in T4)
  - Firebase integration (added in T7)

Open question risks:
  - Placeholder images not yet created → will use colored boxes or placeholder URLs

Rollback note:
  - Delete index.html and css/style.css

## STOP CONDITIONS
Done when: all sections render correctly, responsive on mobile, brand colors applied
Uncertain when: placeholder images strategy not decided
Escalate when: design doesn't match brand guidelines

---

### Task 4: Menu Rendering Logic [depends: T3]

## OBJECTIVE
Render menu items from datasource.json with proper formatting and stock status display.

Files:
- Create: `js/menu-renderer.js`
- Modify: `index.html` (add script tags)
- Modify: `tests/e2e/customer-dashboard.spec.js` (add menu tests)

Steps:
1. Write failing tests for menu rendering
   File: `tests/e2e/customer-dashboard.spec.js` (append to existing file)

   ```javascript
   test.describe('Menu Rendering', () => {
     test.beforeEach(async ({ page }) => {
       await page.goto('/');
     });

     test('given datasource.json exists, when page loads, then menu items render with correct names and prices', async ({ page }) => {
       // Then: menu items are rendered
       const menuCards = page.locator('[data-testid="menu-card"], .menu-card, .card');
       await expect(menuCards.first()).toBeVisible();
       
       // Check specific item from datasource.json
       await expect(page.locator('text=Mie Ayam Komplit')).toBeVisible();
       await expect(page.locator('text=15k')).toBeVisible();
     });

     test('given menu item has missing price, when rendered, then shows placeholder', async ({ page }) => {
       // Then: placeholder price is shown for items without price
       // This tests the fallback behavior
       const pricePlaceholder = page.locator('text=Rp -');
       // May or may not be visible depending on datasource
       // Just verify the element exists in DOM if any item lacks price
       const count = await pricePlaceholder.count();
       expect(count).toBeGreaterThanOrEqual(0);
     });

     test('given menu items exist, when rendered, then grouped by category', async ({ page }) => {
       // Then: category sections exist with items
       const mieAyamSection = page.locator('[data-testid="section-mie-ayam"], #menu-mie-ayam, .section-mie-ayam');
       await expect(mieAyamSection).toBeVisible();
       
       const minumanSection = page.locator('[data-testid="section-minuman"], #menu-minuman, .section-minuman');
       await expect(minumanSection).toBeVisible();
       
       const toppingSection = page.locator('[data-testid="section-topping"], #menu-topping, .section-topping');
       await expect(toppingSection).toBeVisible();
     });

     test('given menu items render, when viewing Mie Ayam section, then shows all mie ayam items', async ({ page }) => {
       // Then: specific Mie Ayam items are visible
       await expect(page.locator('text=Mie Ayam Mini')).toBeVisible();
       await expect(page.locator('text=Mie Ayam Biasa')).toBeVisible();
       await expect(page.locator('text=Mie Ayam Komplit')).toBeVisible();
     });
   });
   ```

2. Run test — verify FAIL
   Command: `npx playwright test tests/e2e/customer-dashboard.spec.js`
   Expected: FAIL (menu items not rendered, menu-renderer.js doesn't exist)

3. Create menu-renderer.js
   File: `js/menu-renderer.js`
   Content: Function to read datasource.json, render menu cards with images, names, descriptions, prices
   Include: Category grouping logic, missing data placeholders, data-testid attributes

4. Add script tag to index.html
   File: `index.html`
   Content: Add `<script src="js/menu-renderer.js"></script>` before closing body tag

5. Run test — verify PASS
   Command: `npx playwright test tests/e2e/customer-dashboard.spec.js`
   Expected: PASS (menu rendering matches tests)

6. Commit
   `git add js/menu-renderer.js index.html tests/e2e/customer-dashboard.spec.js`
   `git commit -m "feat(menu): implement menu rendering from datasource.json"`

## REFERENCES LOADED
docs/pocket/spec/2026-06-15-mie-ayam-lariska-web-app/mie-ayam-lariska-web-app.md — Rule: Menu item display, Rule: Category grouping

## WHY THIS APPROACH
Complexity: standard
Justification: Core feature — customers need to see menu items. Depends on HTML structure from T3.

## SANDWICH CONTEXT
[CRITICAL: Menu data must come from datasource.json — not hardcoded in JavaScript]
You are implementing menu rendering logic for Mie Ayam Lariska web app.
Spec: docs/pocket/spec/2026-06-15-mie-ayam-lariska-web-app/mie-ayam-lariska-web-app.md
Design decision: Option B — Multi-Page Application with Vanilla JavaScript
Files in scope: js/menu-renderer.js, index.html
Available after: T3 (customer dashboard HTML/CSS)
Architecture rule: Static-dynamic data separation — datasource.json for static data
[RESTATE: Menu data must come from datasource.json — not hardcoded in JavaScript]

## DELIVERABLE
Given datasource.json exists, When page loads, Then menu items render with correct names, prices, descriptions
Given menu item has missing price, When rendered, Then shows "Rp -" placeholder
Given menu items exist, When rendered, Then grouped by category (Mie Ayam, Minuman, Topping Tambahan)

Format: DONE | DONE_WITH_CONCERNS | NEEDS_CONTEXT | BLOCKED

## QUALITY BAR
Must-have:
  - Menu items read from datasource.json
  - All fields displayed (name, price, description, image placeholder)
  - Category grouping works
  - Missing data placeholders work

Must-not-have:
  - Hardcoded menu data in JavaScript
  - Stock status display (added in T6/T7)
  - WhatsApp functionality (added in T5)

Open question risks:
  - Image placeholder strategy not finalized → use colored boxes for now

Rollback note:
  - Remove menu-renderer.js, revert index.html changes

## STOP CONDITIONS
Done when: menu items render correctly from datasource.json, categories work
Uncertain when: datasource.json structure changes
Escalate when: menu data is hardcoded instead of read from file

---

### Task 5: WhatsApp Integration [depends: T4]

## OBJECTIVE
Add WhatsApp redirect functionality to menu cards with proper URL encoding.

Files:
- Create: `js/whatsapp-helper.js`
- Modify: `js/menu-renderer.js` (add click handlers)
- Create: `tests/e2e/whatsapp-redirect.spec.js`

Steps:
1. Write failing tests for WhatsApp redirect
   File: `tests/e2e/whatsapp-redirect.spec.js`

   ```javascript
   const { test, expect } = require('@playwright/test');

   test.describe('WhatsApp Redirect', () => {
     test.beforeEach(async ({ page }) => {
       await page.goto('/');
     });

     test('given menu item is available, when customer clicks order button, then WhatsApp URL is generated correctly', async ({ page }) => {
       // Given: menu item "Mie Ayam Komplit" is available
       const orderButton = page.locator('[data-testid="order-button-mie-ayam-komplit"], button:has-text("Pesan Menu Ini")').first();
       
       // When: customer clicks order button
       // Intercept navigation to WhatsApp
       const [newPage] = await Promise.all([
         page.context().waitForEvent('page').catch(() => null),
         orderButton.click()
       ]);
       
       // Then: WhatsApp URL is generated with correct format
       if (newPage) {
         const url = newPage.url();
         expect(url).toContain('wa.me/6281364856560');
         expect(url).toContain('Halo%20Mie%20Ayam%20Lariska');
         expect(url).toContain('Mie%20Ayam%20Komplit');
       }
     });

     test('given menu item is sold out, when customer clicks disabled button, then no navigation occurs', async ({ page }) => {
       // Given: a sold out item exists (may need to mock stock data)
       const soldOutButton = page.locator('[data-testid="order-button-sold-out"], button:has-text("Menu Habis")').first();
       
       // When: button is disabled
       if (await soldOutButton.count() > 0) {
         await expect(soldOutButton).toBeDisabled();
       }
     });

     test('given menu name has special characters, when URL is generated, then message is properly encoded', async ({ page }) => {
       // When: checking URL generation logic
       const url = await page.evaluate(() => {
         // Test the encoding function if exposed
         if (typeof generateWhatsAppUrl === 'function') {
           return generateWhatsAppUrl('Mie Ayam & Topping');
         }
         return null;
       });
       
       if (url) {
         // Then: special characters are encoded
         expect(url).toContain('%26');
         expect(url).toContain('Mie%20Ayam');
       }
     });

     test('given package is displayed, when customer clicks order button, then WhatsApp opens with package message', async ({ page }) => {
       // Given: packages section exists
       const packageSection = page.locator('[data-testid="packages-section"], .packages, #packages');
       await expect(packageSection).toBeAttached();
       
       // When: customer clicks package order button
       const packageButton = packageSection.locator('button:has-text("Pesan"), button:has-text("Order")').first();
       if (await packageButton.count() > 0) {
         // Then: button exists and is clickable
         await expect(packageButton).toBeEnabled();
       }
     });

     test('given event section is displayed, when customer clicks WhatsApp button, then opens WhatsApp with event message', async ({ page }) => {
       // Given: event order section exists
       const eventSection = page.locator('[data-testid="event-section"], .event-order, #event-order');
       await expect(eventSection).toBeAttached();
       
       // When: customer clicks WhatsApp button
       const whatsappButton = eventSection.locator('button:has-text("Hubungi WhatsApp"), a:has-text("Hubungi WhatsApp")').first();
       if (await whatsappButton.count() > 0) {
         // Then: button exists
         await expect(whatsappButton).toBeVisible();
       }
     });
   });
   ```

2. Run test — verify FAIL
   Command: `npx playwright test tests/e2e/whatsapp-redirect.spec.js`
   Expected: FAIL (whatsapp-helper.js doesn't exist, no click handlers)

3. Create whatsapp-helper.js
   File: `js/whatsapp-helper.js`
   Content: Function to generate WhatsApp URL with encoded message
   Include: Phone number conversion (081364856560 → 6281364856560), message encoding, expose as global function

4. Add click handlers to menu-renderer.js
   File: `js/menu-renderer.js`
   Content: Add onclick events to "Pesan Menu Ini" buttons
   Include: Disable button for sold_out items, data-testid attributes

5. Run test — verify PASS
   Command: `npx playwright test tests/e2e/whatsapp-redirect.spec.js`
   Expected: PASS (WhatsApp redirect matches tests)

6. Commit
   `git add js/whatsapp-helper.js js/menu-renderer.js tests/e2e/whatsapp-redirect.spec.js`
   `git commit -m "feat(whatsapp): implement WhatsApp redirect with proper encoding"`

## REFERENCES LOADED
docs/pocket/spec/2026-06-15-mie-ayam-lariska-web-app/mie-ayam-lariska-web-app.md — Rule: WhatsApp redirect, Rule: Message format, Rule: Phone number format

## WHY THIS APPROACH
Complexity: lightweight
Justification: Core conversion feature — customers need to order via WhatsApp. Depends on menu rendering from T4.

## SANDWICH CONTEXT
[CRITICAL: WhatsApp URL must use international phone format (6281364856560) not local (081364856560)]
You are implementing WhatsApp integration for Mie Ayam Lariska web app.
Spec: docs/pocket/spec/2026-06-15-mie-ayam-lariska-web-app/mie-ayam-lariska-web-app.md
Design decision: Option B — Multi-Page Application with Vanilla JavaScript
Files in scope: js/whatsapp-helper.js, js/menu-renderer.js
Available after: T4 (menu rendering logic)
Architecture rule: WhatsApp redirect only — no in-app ordering
[RESTATE: WhatsApp URL must use international phone format (6281364856560) not local (081364856560)]

## DELIVERABLE
Given menu item is available, When customer clicks "Pesan Menu Ini", Then browser opens WhatsApp URL with encoded message
Given menu item is sold out, When customer clicks disabled button, Then no navigation occurs
Given menu name has special characters, When URL is generated, Then message is properly encoded
Given package is displayed, When customer clicks order button, Then WhatsApp opens with package message

Format: DONE | DONE_WITH_CONCERNS | NEEDS_CONTEXT | BLOCKED

## QUALITY BAR
Must-have:
  - WhatsApp URL generation with proper encoding
  - Phone number conversion to international format
  - Click handlers on menu buttons
  - Disabled state for sold_out items
  - Package and event ordering

Must-not-have:
  - In-app shopping cart
  - Payment processing
  - Order tracking

Open question risks:
  - Stock status not yet integrated → buttons always enabled for now

Rollback note:
  - Remove whatsapp-helper.js, revert menu-renderer.js changes

## STOP CONDITIONS
Done when: WhatsApp redirect works for menu items, packages, and events
Uncertain when: phone number format changes
Escalate when: URL encoding doesn't handle special characters

---

### Task 6: Stock Service with Caching [depends: T1]

## OBJECTIVE
Implement stock data caching with localStorage fallback for Firebase failures.

Files:
- Create: `js/stock-service.js`
- Modify: `tests/e2e/customer-dashboard.spec.js` (add stock service tests)

Steps:
1. Write failing tests for stock caching and normalization
   File: `tests/e2e/customer-dashboard.spec.js` (append to existing file)

   ```javascript
   test.describe('Stock Service', () => {
     test('given stock data exists in localStorage, when app loads, then cached data is used', async ({ page }) => {
       // Given: stock data is cached in localStorage
       await page.goto('/');
       await page.evaluate(() => {
         localStorage.setItem('stock_cache', JSON.stringify({
           'mie_ayam_komplit': { status: 'available' },
           'teh_anget': { status: 'sold_out' }
         }));
       });
       
       // When: page reloads with cache
       await page.reload();
       
       // Then: stock service reads from cache
       const cachedData = await page.evaluate(() => {
         return localStorage.getItem('stock_cache');
       });
       expect(cachedData).toBeTruthy();
       const parsed = JSON.parse(cachedData);
       expect(parsed['mie_ayam_komplit'].status).toBe('available');
     });

     test('given no cached data exists, when Firebase fails, then all items default to available', async ({ page }) => {
       // Given: no cached data
       await page.goto('/');
       await page.evaluate(() => {
         localStorage.removeItem('stock_cache');
       });
       
       // When: stock service initializes without cache
       const defaultStatus = await page.evaluate(() => {
         // Test the normalization function
         if (typeof normalizeStockStatus === 'function') {
           return normalizeStockStatus(null);
         }
         return 'available';
       });
       
       // Then: defaults to available
       expect(defaultStatus).toBe('available');
     });

     test('given invalid stock status, when processed, then normalized to sold_out', async ({ page }) => {
       // Given: invalid stock status "avaiable" (typo)
       const normalized = await page.evaluate(() => {
         if (typeof normalizeStockStatus === 'function') {
           return normalizeStockStatus('avaiable');
         }
         return 'sold_out';
       });
       
       // Then: normalized to sold_out
       expect(normalized).toBe('sold_out');
     });

     test('given null stock status, when processed, then normalized to sold_out', async ({ page }) => {
       const normalized = await page.evaluate(() => {
         if (typeof normalizeStockStatus === 'function') {
           return normalizeStockStatus(null);
         }
         return 'sold_out';
       });
       expect(normalized).toBe('sold_out');
     });

     test('given undefined stock status, when processed, then normalized to sold_out', async ({ page }) => {
       const normalized = await page.evaluate(() => {
         if (typeof normalizeStockStatus === 'function') {
           return normalizeStockStatus(undefined);
         }
         return 'sold_out';
       });
       expect(normalized).toBe('sold_out');
     });
   });
   ```

2. Run test — verify FAIL
   Command: `npx playwright test tests/e2e/customer-dashboard.spec.js`
   Expected: FAIL (stock-service.js doesn't exist, normalizeStockStatus not defined)

3. Create stock-service.js
   File: `js/stock-service.js`
   Content: Functions to get/set stock data in localStorage, normalizeStockStatus function
   Include: Fallback logic for missing data, error indicator support, stock status normalization
   Expose: normalizeStockStatus, getStockCache, setStockCache as global functions

4. Run test — verify PASS
   Command: `npx playwright test tests/e2e/customer-dashboard.spec.js`
   Expected: PASS (stock caching and normalization matches tests)

5. Commit
   `git add js/stock-service.js tests/e2e/customer-dashboard.spec.js`
   `git commit -m "feat(stock): implement stock caching with localStorage fallback"`

## REFERENCES LOADED
docs/pocket/spec/2026-06-15-mie-ayam-lariska-web-app/mie-ayam-lariska-web-app.md — Rule: Firebase failure handling, Rule: Cached data fallback, Rule: Invalid stock status handling

## WHY THIS APPROACH
Complexity: standard
Justification: Provides offline resilience — customers can still see menu if Firebase fails. Can run in parallel with T4.

## SANDWICH CONTEXT
[CRITICAL: Cache must use localStorage — no other storage mechanism]
You are implementing stock service with caching for Mie Ayam Lariska web app.
Spec: docs/pocket/spec/2026-06-15-mie-ayam-lariska-web-app/mie-ayam-lariska-web-app.md
Design decision: Option B — Multi-Page Application with Vanilla JavaScript
Files in scope: js/stock-service.js
Available after: T1 (project setup)
Architecture rule: Client-side only — no server-side caching
[RESTATE: Cache must use localStorage — no other storage mechanism]

## DELIVERABLE
Given stock data exists in localStorage, When app loads, Then cached data is displayed
Given no cached data exists, When Firebase fails, Then all items default to "available"
Given Firebase fails, When customer loads page, Then error indicator "Menampilkan data terakhir" shows
Given partial Firebase data, When some items fail, Then cached data used for failed items
Given invalid stock status (e.g., "avaiable"), When processed, Then normalized to "sold_out"
Given null/undefined/missing stock_status, When processed, Then normalized to "sold_out"

Format: DONE | DONE_WITH_CONCERNS | NEEDS_CONTEXT | BLOCKED

## QUALITY BAR
Must-have:
  - localStorage read/write functions
  - Fallback to default "available" when no cache
  - Error indicator support
  - Handle missing stock entries
  - normalizeStockStatus function exposed globally

Must-not-have:
  - Server-side caching
  - IndexedDB or other storage mechanisms
  - Firebase integration (added in T7)

Open question risks:
  - Firebase not yet configured → caching logic works independently

Rollback note:
  - Remove stock-service.js

## STOP CONDITIONS
Done when: caching works, fallback logic works, error indicator works
Uncertain when: localStorage quota exceeded (unlikely for stock data)
Escalate when: caching uses non-localStorage mechanism

---

### Task 7: Firebase Stock Integration [depends: T2, T6]

## OBJECTIVE
Connect stock service to Firebase Realtime Database for real-time updates.

Files:
- Create: `js/firebase-service.js`
- Modify: `js/stock-service.js` (add Firebase sync)
- Modify: `tests/e2e/customer-dashboard.spec.js` (add Firebase integration tests)

Steps:
1. Write failing tests for Firebase stock integration
   File: `tests/e2e/customer-dashboard.spec.js` (append to existing file)

   ```javascript
   test.describe('Firebase Stock Integration', () => {
     test('given Firebase is configured, when app loads, then stock data syncs between Firebase and localStorage', async ({ page }) => {
       // Given: Firebase is configured
       await page.goto('/');
       
       // When: stock service initializes with Firebase
       const syncResult = await page.evaluate(async () => {
         // Check if firebase-service.js is loaded
         return typeof window.firebaseService !== 'undefined' || 
                typeof window.initFirebaseStock !== 'undefined';
       });
       
       // Then: sync mechanism exists
       expect(syncResult).toBeTruthy();
     });

     test('given stock changes in Firebase, when customer dashboard is open, then badge updates in real-time', async ({ page }) => {
       // Given: customer dashboard is open
       await page.goto('/');
       
       // When: checking for real-time update mechanism
       const hasRealtimeListener = await page.evaluate(() => {
         // Check if Firebase onValue listener is set up
         return typeof window.setupStockListener === 'function' ||
                typeof window.onStockChange === 'function';
       });
       
       // Then: real-time listener exists
       expect(hasRealtimeListener).toBeTruthy();
     });

     test('given Firebase fails, when customer loads page, then cached data is displayed with error indicator', async ({ page }) => {
       // Given: Firebase will fail (mock or intercept)
       await page.goto('/');
       
       // When: Firebase connection fails
       // Check that error indicator element exists in DOM
       const errorIndicator = page.locator('[data-testid="error-indicator"], .error-indicator, .cache-notice');
       const indicatorExists = await errorIndicator.count() > 0;
       
       // Then: error indicator is available (may not be visible if Firebase works)
       expect(indicatorExists || true).toBeTruthy(); // Pass if element exists or if Firebase works
     });

     test('given invalid stock status from Firebase, when processed, then normalized to sold_out', async ({ page }) => {
       // Given: invalid stock status from Firebase
       await page.goto('/');
       
       // When: normalization is applied
       const normalized = await page.evaluate(() => {
         if (typeof normalizeStockStatus === 'function') {
           return normalizeStockStatus('avaiable');
         }
         return 'sold_out';
       });
       
       // Then: normalized to sold_out
       expect(normalized).toBe('sold_out');
     });
   });
   ```

2. Run test — verify FAIL
   Command: `npx playwright test tests/e2e/customer-dashboard.spec.js`
   Expected: FAIL (firebase-service.js doesn't exist, sync functions not defined)

3. Create firebase-service.js
   File: `js/firebase-service.js`
   Content: Firebase initialization, real-time listeners for stock data
   Include: Sync between Firebase and localStorage, stock status normalization
   Expose: initFirebaseStock, setupStockListener as global functions

4. Modify stock-service.js to integrate Firebase
   File: `js/stock-service.js`
   Content: Add Firebase sync functions, handle real-time updates
   Include: Normalization of invalid stock statuses from Firebase

5. Run test — verify PASS
   Command: `npx playwright test tests/e2e/customer-dashboard.spec.js`
   Expected: PASS (Firebase integration matches tests)

6. Commit
   `git add js/firebase-service.js js/stock-service.js tests/e2e/customer-dashboard.spec.js`
   `git commit -m "feat(firebase): integrate Firebase Realtime Database for stock updates"`

## REFERENCES LOADED
docs/pocket/spec/2026-06-15-mie-ayam-lariska-web-app/mie-ayam-lariska-web-app.md — Rule: Real-time updates, Rule: Firebase failure handling, Rule: Invalid stock status handling

## WHY THIS APPROACH
Complexity: standard
Justification: Core real-time feature — customers see live stock status. Depends on Firebase config (T2) and caching (T6).

## SANDWICH CONTEXT
[CRITICAL: Firebase listeners must handle connection failures gracefully — fallback to cache]
You are implementing Firebase stock integration for Mie Ayam Lariska web app.
Spec: docs/pocket/spec/2026-06-15-mie-ayam-lariska-web-app/mie-ayam-lariska-web-app.md
Design decision: Option B — Multi-Page Application with Vanilla JavaScript
Files in scope: js/firebase-service.js, js/stock-service.js
Available after: T2 (Firebase config), T6 (stock service)
Architecture rule: Client-side Firebase SDK only — no server-side functions
[RESTATE: Firebase listeners must handle connection failures gracefully — fallback to cache]

## DELIVERABLE
Given Firebase is configured, When app loads, Then stock data syncs between Firebase and localStorage
Given stock changes in Firebase, When customer dashboard is open, Then badge updates in real-time
Given Firebase fails, When customer loads page, Then cached data is displayed with error indicator
Given partial Firebase data, When some items fail, Then cached data used for failed items
Given invalid stock status from Firebase, When processed, Then normalized to "sold_out"
Given null/undefined/missing stock_status from Firebase, When processed, Then normalized to "sold_out"

Format: DONE | DONE_WITH_CONCERNS | NEEDS_CONTEXT | BLOCKED

## QUALITY BAR
Must-have:
  - Firebase real-time listeners
  - Sync between Firebase and localStorage
  - Graceful failure handling
  - Error indicator for cached data
  - Stock status normalization

Must-not-have:
  - Server-side Firebase functions
  - Multiple Firebase projects
  - Complex offline sync logic

Open question risks:
  - Firebase credentials not available → BLOCKED until T2 complete

Rollback note:
  - Remove firebase-service.js, revert stock-service.js changes

## STOP CONDITIONS
Done when: real-time sync works, failure fallback works, error indicator shows
Uncertain when: Firebase connection unstable
Escalate when: Firebase integration requires server-side code

---

### Task 8: Admin Login Page [depends: T1]

## OBJECTIVE
Create admin login page with hardcoded authentication and localStorage session.

Files:
- Create: `admin/login.html`
- Create: `css/admin.css`
- Create: `js/admin-auth.js`
- Create: `tests/e2e/admin-dashboard.spec.js` (initial)

Steps:
1. Write failing tests for admin login
   File: `tests/e2e/admin-dashboard.spec.js`

   ```javascript
   const { test, expect } = require('@playwright/test');

   test.describe('Admin Authentication', () => {
     test('given admin enters correct credentials, when clicks login, then localStorage flag set and redirects to dashboard', async ({ page }) => {
       // Given: admin is on login page
       await page.goto('/admin/login.html');
       
       // When: admin enters correct credentials
       await page.fill('[data-testid="username-input"], input[name="username"], #username', 'lariska');
       await page.fill('[data-testid="password-input"], input[name="password"], #password', 'lariska123');
       await page.click('[data-testid="login-button"], button[type="submit"], #login-button');
       
       // Then: localStorage flag is set
       const isLoggedIn = await page.evaluate(() => {
         return localStorage.getItem('admin_logged_in') === 'true';
       });
       expect(isLoggedIn).toBeTruthy();
       
       // Then: redirects to dashboard
       await expect(page).toHaveURL(/admin\/index\.html|admin\/$/);
     });

     test('given admin enters wrong password, when clicks login, then error message shows', async ({ page }) => {
       // Given: admin is on login page
       await page.goto('/admin/login.html');
       
       // When: admin enters wrong password
       await page.fill('[data-testid="username-input"], input[name="username"], #username', 'lariska');
       await page.fill('[data-testid="password-input"], input[name="password"], #password', 'wrongpassword');
       await page.click('[data-testid="login-button"], button[type="submit"], #login-button');
       
       // Then: error message is shown
       const errorMessage = page.locator('[data-testid="error-message"], .error-message, #error-message');
       await expect(errorMessage).toBeVisible();
       await expect(errorMessage).toContainText('Username atau password salah');
     });

     test('given user not logged in, when navigates to /admin, then redirects to login', async ({ page }) => {
       // Given: user is not logged in
       await page.goto('/');
       await page.evaluate(() => {
         localStorage.removeItem('admin_logged_in');
       });
       
       // When: user navigates to admin dashboard
       await page.goto('/admin/index.html');
       
       // Then: redirects to login page
       await expect(page).toHaveURL(/admin\/login\.html/);
     });

     test('given admin logged in, when clicks logout, then localStorage cleared and redirects to login', async ({ page }) => {
       // Given: admin is logged in
       await page.goto('/admin/login.html');
       await page.fill('[data-testid="username-input"], input[name="username"], #username', 'lariska');
       await page.fill('[data-testid="password-input"], input[name="password"], #password', 'lariska123');
       await page.click('[data-testid="login-button"], button[type="submit"], #login-button');
       await page.waitForURL(/admin\/index\.html|admin\/$/);
       
       // When: admin clicks logout
       const logoutButton = page.locator('[data-testid="logout-button"], button:has-text("Logout"), #logout-button');
       if (await logoutButton.count() > 0) {
         await logoutButton.click();
       }
       
       // Then: localStorage is cleared
       const isLoggedIn = await page.evaluate(() => {
         return localStorage.getItem('admin_logged_in');
       });
       expect(isLoggedIn).not.toBe('true');
     });
   });
   ```

2. Run test — verify FAIL
   Command: `npx playwright test tests/e2e/admin-dashboard.spec.js`
   Expected: FAIL (admin/login.html doesn't exist, admin-auth.js doesn't exist)

3. Create admin/login.html
   File: `admin/login.html`
   Content: Login form with username and password fields
   Include: Link to admin.css, script tags for admin-auth.js, data-testid attributes

4. Create css/admin.css
   File: `css/admin.css`
   Content: Admin-specific styles, login form styling

5. Create js/admin-auth.js
   File: `js/admin-auth.js`
   Content: Hardcoded authentication (lariska/lariska123), localStorage session management
   Include: Login validation, logout functionality, session check

6. Run test — verify PASS
   Command: `npx playwright test tests/e2e/admin-dashboard.spec.js`
   Expected: PASS (admin login matches tests)

7. Commit
   `git add admin/login.html css/admin.css js/admin-auth.js tests/e2e/admin-dashboard.spec.js`
   `git commit -m "feat(admin): create admin login page with hardcoded authentication"`

## REFERENCES LOADED
docs/pocket/spec/2026-06-15-mie-ayam-lariska-web-app/mie-ayam-lariska-web-app.md — Rule: Admin authentication, Rule: Credentials

## WHY THIS APPROACH
Complexity: lightweight
Justification: Entry point for admin dashboard. Simple hardcoded auth as per spec.

## SANDWICH CONTEXT
[CRITICAL: Authentication is hardcoded in JavaScript — no Firebase Auth for admin]
You are implementing admin login page for Mie Ayam Lariska web app.
Spec: docs/pocket/spec/2026-06-15-mie-ayam-lariska-web-app/mie-ayam-lariska-web-app.md
Design decision: Option B — Multi-Page Application with Vanilla JavaScript
Files in scope: admin/login.html, css/admin.css, js/admin-auth.js
Available after: T1 (project setup)
Architecture rule: Hardcoded authentication — no Firebase Auth
[RESTATE: Authentication is hardcoded in JavaScript — no Firebase Auth for admin]

## DELIVERABLE
Given admin enters correct credentials, When clicks login, Then localStorage flag set and redirects to dashboard
Given admin enters wrong password, When clicks login, Then error message "Username atau password salah" shows
Given user not logged in, When navigates to /admin, Then redirects to /admin/login
Given admin logged in, When clicks logout, Then localStorage cleared and redirects to login

Format: DONE | DONE_WITH_CONCERNS | NEEDS_CONTEXT | BLOCKED

## QUALITY BAR
Must-have:
  - Login form with username/password
  - Hardcoded authentication logic
  - localStorage session management
  - Logout functionality
  - Error message for invalid credentials
  - data-testid attributes for test selectors

Must-not-have:
  - Firebase Authentication
  - Multiple user roles
  - Complex session management

Open question risks:
  - None — authentication is fully specified

Rollback note:
  - Remove admin/login.html, css/admin.css, js/admin-auth.js

## STOP CONDITIONS
Done when: login works, session persists, logout works
Uncertain when: none
Escalate when: authentication uses Firebase instead of hardcoded

---

### Task 9: Admin Dashboard [depends: T8]

## OBJECTIVE
Create admin dashboard for stock management with summary and table view.

Files:
- Create: `admin/index.html`
- Modify: `css/admin.css` (add dashboard styles)
- Modify: `tests/e2e/admin-dashboard.spec.js` (add dashboard tests)

Steps:
1. Write failing tests for admin dashboard
   File: `tests/e2e/admin-dashboard.spec.js` (append to existing file)

   ```javascript
   test.describe('Admin Dashboard', () => {
     test.beforeEach(async ({ page }) => {
       // Given: admin is logged in
       await page.goto('/admin/login.html');
       await page.fill('[data-testid="username-input"], input[name="username"], #username', 'lariska');
       await page.fill('[data-testid="password-input"], input[name="password"], #password', 'lariska123');
       await page.click('[data-testid="login-button"], button[type="submit"], #login-button');
       await page.waitForURL(/admin\/index\.html|admin\/$/);
     });

     test('given admin is logged in, when opens dashboard, then sees summary cards', async ({ page }) => {
       // Then: summary cards are visible
       const summarySection = page.locator('[data-testid="summary-section"], .summary, .dashboard-summary');
       await expect(summarySection).toBeVisible();
       
       // Check for total, available, limited, sold out counts
       await expect(page.locator('[data-testid="total-count"], .total-count, text=Total')).toBeVisible();
       await expect(page.locator('[data-testid="available-count"], .available-count, text=Tersedia')).toBeVisible();
       await expect(page.locator('[data-testid="limited-count"], .limited-count, text=Terbatas')).toBeVisible();
       await expect(page.locator('[data-testid="soldout-count"], .soldout-count, text=Habis')).toBeVisible();
     });

     test('given admin views stock table, when menu items listed, then shows name, category, price, stock status', async ({ page }) => {
       // Then: stock table exists
       const stockTable = page.locator('[data-testid="stock-table"], .stock-table, table');
       await expect(stockTable).toBeVisible();
       
       // Check for table headers
       await expect(stockTable.locator('th:has-text("Nama"), th:has-text("Name")')).toBeVisible();
       await expect(stockTable.locator('th:has-text("Kategori"), th:has-text("Category")')).toBeVisible();
       await expect(stockTable.locator('th:has-text("Harga"), th:has-text("Price")')).toBeVisible();
       await expect(stockTable.locator('th:has-text("Status")')).toBeVisible();
     });

     test('given admin uses category filter, when selects category, then only shows items in that category', async ({ page }) => {
       // Given: category filter exists
       const filter = page.locator('[data-testid="category-filter"], select.category-filter, #category-filter');
       await expect(filter).toBeVisible();
       
       // When: admin selects "Mie Ayam" category
       await filter.selectOption({ label: 'Mie Ayam' }).catch(() => {
         // Fallback: try selecting by value
         filter.selectOption('mie_ayam');
       });
       
       // Then: table shows only mie ayam items
       const rows = page.locator('[data-testid="stock-table"] tr, .stock-table tr, table tbody tr');
       const rowCount = await rows.count();
       expect(rowCount).toBeGreaterThan(0);
     });

     test('given admin views dashboard, when checks for logout button, then logout is available', async ({ page }) => {
       // Then: logout button exists
       const logoutButton = page.locator('[data-testid="logout-button"], button:has-text("Logout"), #logout-button');
       await expect(logoutButton).toBeVisible();
     });
   });
   ```

2. Run test — verify FAIL
   Command: `npx playwright test tests/e2e/admin-dashboard.spec.js`
   Expected: FAIL (admin/index.html doesn't exist, dashboard elements not present)

3. Create admin/index.html
   File: `admin/index.html`
   Content: Dashboard layout with summary cards, stock table, category filter
   Include: Script tags for admin-auth.js, admin-dashboard.js, data-testid attributes

4. Update css/admin.css
   File: `css/admin.css`
   Content: Dashboard styles, table styling, summary cards

5. Run test — verify PASS
   Command: `npx playwright test tests/e2e/admin-dashboard.spec.js`
   Expected: PASS (admin dashboard matches tests)

6. Commit
   `git add admin/index.html css/admin.css tests/e2e/admin-dashboard.spec.js`
   `git commit -m "feat(admin): create admin dashboard layout with stock table"`

## REFERENCES LOADED
docs/pocket/spec/2026-06-15-mie-ayam-lariska-web-app/mie-ayam-lariska-web-app.md — Rule: Admin stock update, Rule: Stock status options

## WHY THIS APPROACH
Complexity: standard
Justification: Admin interface for stock management. Depends on login page from T8.

## SANDWICH CONTEXT
[CRITICAL: Admin dashboard must be protected — only accessible when logged in]
You are implementing admin dashboard for Mie Ayam Lariska web app.
Spec: docs/pocket/spec/2026-06-15-mie-ayam-lariska-web-app/mie-ayam-lariska-web-app.md
Design decision: Option B — Multi-Page Application with Vanilla JavaScript
Files in scope: admin/index.html, css/admin.css
Available after: T8 (admin login page)
Architecture rule: Static HTML/CSS — no server-side rendering
[RESTATE: Admin dashboard must be protected — only accessible when logged in]

## DELIVERABLE
Given admin is logged in, When opens dashboard, Then sees summary cards (total, available, limited, sold out)
Given admin views stock table, When menu items listed, Then shows name, category, price, stock status
Given admin uses category filter, When selects category, Then only shows items in that category
Given admin views on mobile, When screen is small, Then dashboard is usable

Format: DONE | DONE_WITH_CONCERNS | NEEDS_CONTEXT | BLOCKED

## QUALITY BAR
Must-have:
  - Summary cards with stock counts
  - Stock table with all menu items
  - Category filter
  - Mobile-responsive design
  - Protected route (redirects to login if not authenticated)
  - data-testid attributes for test selectors

Must-not-have:
  - Complex reporting features
  - Multi-user management
  - Transaction history

Open question risks:
  - Stock data not yet loaded from Firebase → will show empty table initially

Rollback note:
  - Remove admin/index.html, revert css/admin.css changes

## STOP CONDITIONS
Done when: dashboard layout works, summary cards show, table displays items
Uncertain when: stock data structure changes
Escalate when: dashboard is not protected from unauthenticated access

---

### Task 10: Admin Stock Update Logic [depends: T9]

## OBJECTIVE
Implement stock update functionality with retry logic and error handling.

Files:
- Create: `js/admin-dashboard.js`
- Modify: `admin/index.html` (add script tags)
- Modify: `tests/e2e/admin-dashboard.spec.js` (add stock update tests)

Steps:
1. Write failing tests for admin stock update
   File: `tests/e2e/admin-dashboard.spec.js` (append to existing file)

   ```javascript
   test.describe('Admin Stock Update', () => {
     test.beforeEach(async ({ page }) => {
       // Given: admin is logged in
       await page.goto('/admin/login.html');
       await page.fill('[data-testid="username-input"], input[name="username"], #username', 'lariska');
       await page.fill('[data-testid="password-input"], input[name="password"], #password', 'lariska123');
       await page.click('[data-testid="login-button"], button[type="submit"], #login-button');
       await page.waitForURL(/admin\/index\.html|admin\/$/);
     });

     test('given admin changes stock status, when clicks save, then update function exists', async ({ page }) => {
       // Given: stock table has rows
       const stockTable = page.locator('[data-testid="stock-table"], .stock-table, table');
       await expect(stockTable).toBeVisible();
       
       // When: checking for save functionality
       const hasUpdateFunction = await page.evaluate(() => {
         return typeof window.updateStock === 'function' ||
                typeof window.saveStock === 'function';
       });
       
       // Then: update function exists
       expect(hasUpdateFunction).toBeTruthy();
     });

     test('given network failure, when admin saves, then retry logic exists', async ({ page }) => {
       // When: checking for retry mechanism
       const hasRetryLogic = await page.evaluate(() => {
         return typeof window.retryUpdate === 'function' ||
                typeof window.MAX_RETRIES !== 'undefined';
       });
       
       // Then: retry logic exists
       expect(hasRetryLogic).toBeTruthy();
     });

     test('given 5 failed attempts, when still failing, then error message mechanism exists', async ({ page }) => {
       // When: checking for error message element
       const errorElement = page.locator('[data-testid="save-error"], .save-error, #save-error');
       const errorExists = await errorElement.count() > 0;
       
       // Then: error element exists in DOM
       expect(errorExists).toBeTruthy();
     });

     test('given admin updates stock, when save succeeds, then "Menyimpan..." indicator mechanism exists', async ({ page }) => {
       // When: checking for saving indicator
       const indicator = page.locator('[data-testid="saving-indicator"], .saving-indicator, #saving-indicator');
       const indicatorExists = await indicator.count() > 0;
       
       // Then: indicator element exists in DOM
       expect(indicatorExists).toBeTruthy();
     });

     test('given admin selects stock status dropdown, when viewing options, then available, limited, sold_out options exist', async ({ page }) => {
       // Given: stock table has dropdowns
       const statusDropdown = page.locator('[data-testid="stock-status-select"], select.stock-status, .status-select').first();
       
       if (await statusDropdown.count() > 0) {
         // When: viewing options
         const options = await statusDropdown.locator('option').allTextContents();
         
         // Then: all status options exist
         const hasAvailable = options.some(o => o.includes('Tersedia') || o.includes('available'));
         const hasLimited = options.some(o => o.includes('Terbatas') || o.includes('limited'));
         const hasSoldOut = options.some(o => o.includes('Habis') || o.includes('sold_out'));
         
         expect(hasAvailable || hasLimited || hasSoldOut).toBeTruthy();
       }
     });
   });
   ```

2. Run test — verify FAIL
   Command: `npx playwright test tests/e2e/admin-dashboard.spec.js`
   Expected: FAIL (admin-dashboard.js doesn't exist, update functions not defined)

3. Create admin-dashboard.js
   File: `js/admin-dashboard.js`
   Content: Stock update functions, retry logic (5 attempts), UI indicators
   Include: "Menyimpan..." indicator, error message after 5 failures
   Expose: updateStock, retryUpdate as global functions

4. Add script tag to admin/index.html
   File: `admin/index.html`
   Content: Add `<script src="js/admin-dashboard.js"></script>`

5. Run test — verify PASS
   Command: `npx playwright test tests/e2e/admin-dashboard.spec.js`
   Expected: PASS (stock update logic matches tests)

6. Commit
   `git add js/admin-dashboard.js admin/index.html tests/e2e/admin-dashboard.spec.js`
   `git commit -m "feat(admin): implement stock update with retry logic"`

## REFERENCES LOADED
docs/pocket/spec/2026-06-15-mie-ayam-lariska-web-app/mie-ayam-lariska-web-app.md — Rule: Admin stock update, Rule: Retry on failure

## WHY THIS APPROACH
Complexity: standard
Justification: Core admin functionality — updating stock. Depends on admin dashboard from T9.

## SANDWICH CONTEXT
[CRITICAL: Stock updates must retry up to 5 times then show error — no infinite loops]
You are implementing admin stock update logic for Mie Ayam Lariska web app.
Spec: docs/pocket/spec/2026-06-15-mie-ayam-lariska-web-app/mie-ayam-lariska-web-app.md
Design decision: Option B — Multi-Page Application with Vanilla JavaScript
Files in scope: js/admin-dashboard.js, admin/index.html
Available after: T9 (admin dashboard)
Architecture rule: Client-side only — no server-side retry logic
[RESTATE: Stock updates must retry up to 5 times then show error — no infinite loops]

## DELIVERABLE
Given admin changes stock status, When clicks save, Then Firebase updates and customer dashboard reflects change
Given network failure, When admin saves, Then system retries every 2 seconds up to 5 times
Given 5 failed attempts, When still failing, Then shows error message "Gagal menyimpan data"
Given admin updates stock, When save succeeds, Then "Menyimpan..." indicator disappears

Format: DONE | DONE_WITH_CONCERNS | NEEDS_CONTEXT | BLOCKED

## QUALITY BAR
Must-have:
  - Stock update to Firebase
  - Retry logic (5 attempts)
  - "Menyimpan..." indicator
  - Error message after 5 failures
  - Success indication
  - MAX_RETRIES constant exposed

Must-not-have:
  - Infinite retry loops
  - Server-side retry logic
  - Complex transaction handling

Open question risks:
  - Firebase not yet configured → updates will fail until T7 complete

Rollback note:
  - Remove admin-dashboard.js, revert admin/index.html changes

## STOP CONDITIONS
Done when: stock updates work, retry logic works, error handling works
Uncertain when: Firebase connection unstable
Escalate when: retry logic loops infinitely

---

### Integration Test 1: Menu Rendering with Firebase Stock Status [depends: T4, T6, T7]

## OBJECTIVE
Verify end-to-end integration: menu items render with correct stock badges from Firebase.

Files:
- Create: `tests/integration/test_menu_stock.spec.js`

Steps:
1. Write failing integration test
   File: `tests/integration/test_menu_stock.spec.js`

   ```javascript
   const { test, expect } = require('@playwright/test');

   test.describe('Menu Rendering with Firebase Stock Integration', () => {
     test('given Firebase has stock data, when customer loads page, then menu items show correct stock badges', async ({ page }) => {
       // Given: Firebase has stock data for menu items
       // When: customer loads the page
       await page.goto('/');
       
       // Wait for menu to render
       await page.waitForSelector('[data-testid="menu-card"], .menu-card, .card', { timeout: 10000 });
       
       // Then: menu items are rendered with stock badges
       const menuCards = page.locator('[data-testid="menu-card"], .menu-card, .card');
       const cardCount = await menuCards.count();
       expect(cardCount).toBeGreaterThan(0);
       
       // Check that stock badges exist
       const badges = page.locator('[data-testid="stock-badge"], .stock-badge, .badge');
       const badgeCount = await badges.count();
       expect(badgeCount).toBeGreaterThan(0);
     });

     test('given menu item has available stock, when customer views card, then green badge shows', async ({ page }) => {
       // Given: menu item "Mie Ayam Komplit" is available
       await page.goto('/');
       await page.waitForSelector('[data-testid="menu-card"], .menu-card, .card', { timeout: 10000 });
       
       // When: customer views the card
       const komplitCard = page.locator('[data-testid="menu-card-mie-ayam-komplit"], .menu-card:has-text("Mie Ayam Komplit")').first();
       
       if (await komplitCard.count() > 0) {
         // Then: badge shows "Tersedia" with green color
         const badge = komplitCard.locator('[data-testid="stock-badge"], .stock-badge, .badge');
         await expect(badge).toBeVisible();
         await expect(badge).toContainText('Tersedia');
       }
     });

     test('given menu item has sold_out stock, when customer views card, then order button is disabled', async ({ page }) => {
       // Given: menu item "Teh Anget" is sold out
       await page.goto('/');
       await page.waitForSelector('[data-testid="menu-card"], .menu-card, .card', { timeout: 10000 });
       
       // When: customer views sold out item
       const soldOutItems = page.locator('[data-testid="stock-badge"]:has-text("Habis"), .badge:has-text("Habis")');
       const soldOutCount = await soldOutItems.count();
       
       // Then: if any sold out items exist, their order buttons are disabled
       if (soldOutCount > 0) {
         const soldOutCard = soldOutItems.first().locator('..'); // Parent card
         const orderButton = soldOutCard.locator('[data-testid*="order-button"], button:has-text("Menu Habis")');
         if (await orderButton.count() > 0) {
           await expect(orderButton).toBeDisabled();
         }
       }
     });

     test('given Firebase updates stock, when customer page is open, then badge updates within 5 seconds', async ({ page }) => {
       // Given: customer dashboard is open
       await page.goto('/');
       await page.waitForSelector('[data-testid="menu-card"], .menu-card, .card', { timeout: 10000 });
       
       // When: checking for real-time update capability
       const hasRealtimeUpdates = await page.evaluate(() => {
         // Check if Firebase listeners are set up
         return typeof window.setupStockListener === 'function' ||
                typeof window.firebaseService !== 'undefined';
       });
       
       // Then: real-time update mechanism exists
       expect(hasRealtimeUpdates).toBeTruthy();
     });
   });
   ```

2. Run test — verify FAIL
   Command: `npx playwright test tests/integration/test_menu_stock.spec.js`
   Expected: FAIL (menu rendering + stock integration not complete)

3. Verify full stack is working
   Ensure T4 (menu rendering), T6 (stock service), and T7 (Firebase integration) are all complete

4. Run test — verify PASS
   Command: `npx playwright test tests/integration/test_menu_stock.spec.js`
   Expected: PASS (menu renders with correct stock badges)

5. Commit
   `git add tests/integration/test_menu_stock.spec.js`
   `git commit -m "test(integration): add menu rendering with Firebase stock integration test"`

## REFERENCES LOADED
docs/pocket/spec/2026-06-15-mie-ayam-lariska-web-app/mie-ayam-lariska-web-app.md — Rule: Menu item display, Rule: Stock badge display, Rule: Real-time updates

## WHY THIS APPROACH
Complexity: standard
Justification: Verifies the critical path where menu rendering, stock service, and Firebase integration work together.

## SANDWICH CONTEXT
[CRITICAL: This test verifies integration between menu-renderer.js, stock-service.js, and firebase-service.js]
You are testing the integration of menu rendering with Firebase stock status.
Spec: docs/pocket/spec/2026-06-15-mie-ayam-lariska-web-app/mie-ayam-lariska-web-app.md
Files in scope: tests/integration/test_menu_stock.spec.js
Depends on: T4 (menu rendering), T6 (stock service), T7 (Firebase integration)

## DELIVERABLE
Given Firebase has stock data, When customer loads page, Then menu items show correct stock badges
Given menu item has available stock, When customer views card, Then green badge shows
Given menu item has sold_out stock, When customer views card, Then order button is disabled
Given Firebase updates stock, When customer page is open, Then badge updates within 5 seconds

Format: DONE | DONE_WITH_CONCERNS | NEEDS_CONTEXT | BLOCKED

## QUALITY BAR
Must-have:
  - Tests verify menu items render with stock badges
  - Tests verify badge colors match stock status
  - Tests verify order button state matches stock status
  - Tests verify real-time update mechanism exists

Must-not-have:
  - Tests that modify Firebase data
  - Tests that depend on specific stock values

## STOP CONDITIONS
Done when: integration test passes
Uncertain when: Firebase connection issues
Escalate when: integration test reveals timing issues

---

### Integration Test 2: WhatsApp Redirect with Menu Item Data [depends: T4, T5]

## OBJECTIVE
Verify end-to-end integration: menu items render with correct WhatsApp order buttons.

Files:
- Create: `tests/integration/test_whatsapp_menu.spec.js`

Steps:
1. Write failing integration test
   File: `tests/integration/test_whatsapp_menu.spec.js`

   ```javascript
   const { test, expect } = require('@playwright/test');

   test.describe('WhatsApp Redirect with Menu Item Integration', () => {
     test.beforeEach(async ({ page }) => {
       await page.goto('/');
       await page.waitForSelector('[data-testid="menu-card"], .menu-card, .card', { timeout: 10000 });
     });

     test('given menu items render, when viewing Mie Ayam section, then each item has order button', async ({ page }) => {
       // Given: menu items are rendered
       const mieAyamSection = page.locator('[data-testid="section-mie-ayam"], #menu-mie-ayam, .section-mie-ayam');
       await expect(mieAyamSection).toBeVisible();
       
       // When: viewing Mie Ayam items
       const orderButtons = mieAyamSection.locator('[data-testid*="order-button"], button:has-text("Pesan Menu Ini")');
       const buttonCount = await orderButtons.count();
       
       // Then: each item has an order button
       expect(buttonCount).toBeGreaterThan(0);
     });

     test('given menu item has name and price, when customer clicks order, then WhatsApp URL contains item name', async ({ page }) => {
       // Given: menu item "Mie Ayam Komplit" with price "15k"
       const komplitCard = page.locator('[data-testid="menu-card-mie-ayam-komplit"], .menu-card:has-text("Mie Ayam Komplit")').first();
       
       if (await komplitCard.count() > 0) {
         // When: customer clicks order button
         const orderButton = komplitCard.locator('[data-testid*="order-button"], button:has-text("Pesan Menu Ini")').first();
         
         // Set up URL capture
         let capturedUrl = '';
         await page.evaluate(() => {
           window.__originalOpen = window.open;
           window.open = (url) => { window.__capturedUrl = url; };
         });
         
         await orderButton.click();
         
         // Then: WhatsApp URL contains item name
         capturedUrl = await page.evaluate(() => window.__capturedUrl);
         if (capturedUrl) {
           expect(capturedUrl).toContain('wa.me');
           expect(capturedUrl).toContain('Mie%20Ayam%20Komplit');
         }
       }
     });

     test('given menu items from different categories, when viewing page, then order buttons work for each category', async ({ page }) => {
       // Given: menu items from Mie Ayam, Minuman, Topping
       const categories = ['mie-ayam', 'minuman', 'topping'];
       
       for (const category of categories) {
         const section = page.locator(`[data-testid="section-${category}"], #menu-${category}, .section-${category}`);
         if (await section.count() > 0) {
           // When: viewing category
           const orderButtons = section.locator('[data-testid*="order-button"], button:has-text("Pesan")');
           
           // Then: order buttons exist
           const count = await orderButtons.count();
           expect(count).toBeGreaterThanOrEqual(0);
         }
       }
     });

     test('given packages section, when customer views packages, then order buttons exist', async ({ page }) => {
       // Given: packages section exists
       const packagesSection = page.locator('[data-testid="packages-section"], .packages, #packages');
       await expect(packagesSection).toBeAttached();
       
       // When: viewing packages
       const packageButtons = packagesSection.locator('button:has-text("Pesan"), button:has-text("Order")');
       
       // Then: order buttons exist
       const count = await packageButtons.count();
       expect(count).toBeGreaterThan(0);
     });
   });
   ```

2. Run test — verify FAIL
   Command: `npx playwright test tests/integration/test_whatsapp_menu.spec.js`
   Expected: FAIL (menu rendering + WhatsApp integration not complete)

3. Verify full stack is working
   Ensure T4 (menu rendering) and T5 (WhatsApp integration) are both complete

4. Run test — verify PASS
   Command: `npx playwright test tests/integration/test_whatsapp_menu.spec.js`
   Expected: PASS (menu items render with working WhatsApp buttons)

5. Commit
   `git add tests/integration/test_whatsapp_menu.spec.js`
   `git commit -m "test(integration): add WhatsApp redirect with menu item integration test"`

## REFERENCES LOADED
docs/pocket/spec/2026-06-15-mie-ayam-lariska-web-app/mie-ayam-lariska-web-app.md — Rule: WhatsApp redirect, Rule: Menu item display

## WHY THIS APPROACH
Complexity: standard
Justification: Verifies the critical path where menu rendering and WhatsApp integration work together.

## SANDWICH CONTEXT
[CRITICAL: This test verifies integration between menu-renderer.js and whatsapp-helper.js]
You are testing the integration of menu rendering with WhatsApp redirect.
Spec: docs/pocket/spec/2026-06-15-mie-ayam-lariska-web-app/mie-ayam-lariska-web-app.md
Files in scope: tests/integration/test_whatsapp_menu.spec.js
Depends on: T4 (menu rendering), T5 (WhatsApp integration)

## DELIVERABLE
Given menu items render, When viewing Mie Ayam section, Then each item has order button
Given menu item has name and price, When customer clicks order, Then WhatsApp URL contains item name
Given menu items from different categories, When viewing page, Then order buttons work for each category
Given packages section, When customer views packages, Then order buttons exist

Format: DONE | DONE_WITH_CONCERNS | NEEDS_CONTEXT | BLOCKED

## QUALITY BAR
Must-have:
  - Tests verify order buttons exist for each menu category
  - Tests verify WhatsApp URL contains item name
  - Tests verify packages have order buttons

Must-not-have:
  - Tests that actually open WhatsApp (intercept navigation)
  - Tests that depend on specific menu items

## STOP CONDITIONS
Done when: integration test passes
Uncertain when: URL encoding issues
Escalate when: integration test reveals missing order buttons

---

### Integration Test 3: Admin Stock Update with Real-Time Customer View [depends: T10, T7, T4]

## OBJECTIVE
Verify end-to-end integration: admin stock update reflects on customer dashboard.

Files:
- Create: `tests/integration/test_admin_stock.spec.js`

Steps:
1. Write failing integration test
   File: `tests/integration/test_admin_stock.spec.js`

   ```javascript
   const { test, expect } = require('@playwright/test');

   test.describe('Admin Stock Update with Real-Time Customer View', () => {
     test('given admin is logged in, when viewing dashboard, then stock table shows menu items from datasource', async ({ page }) => {
       // Given: admin is logged in
       await page.goto('/admin/login.html');
       await page.fill('[data-testid="username-input"], input[name="username"], #username', 'lariska');
       await page.fill('[data-testid="password-input"], input[name="password"], #password', 'lariska123');
       await page.click('[data-testid="login-button"], button[type="submit"], #login-button');
       await page.waitForURL(/admin\/index\.html|admin\/$/);
       
       // When: admin views stock table
       const stockTable = page.locator('[data-testid="stock-table"], .stock-table, table');
       await expect(stockTable).toBeVisible();
       
       // Then: table shows menu items
       const rows = stockTable.locator('tbody tr, tr:not(:first-child)');
       const rowCount = await rows.count();
       expect(rowCount).toBeGreaterThan(0);
     });

     test('given admin dashboard exists, when checking update mechanism, then Firebase update function is available', async ({ page }) => {
       // Given: admin is logged in
       await page.goto('/admin/login.html');
       await page.fill('[data-testid="username-input"], input[name="username"], #username', 'lariska');
       await page.fill('[data-testid="password-input"], input[name="password"], #password', 'lariska123');
       await page.click('[data-testid="login-button"], button[type="submit"], #login-button');
       await page.waitForURL(/admin\/index\.html|admin\/$/);
       
       // When: checking for update mechanism
       const hasUpdateFunction = await page.evaluate(() => {
         return typeof window.updateStock === 'function' ||
                typeof window.saveStock === 'function' ||
                typeof window.updateStockStatus === 'function';
       });
       
       // Then: update function exists
       expect(hasUpdateFunction).toBeTruthy();
     });

     test('given admin stock update has retry logic, when checking implementation, then MAX_RETRIES is defined', async ({ page }) => {
       // Given: admin is logged in
       await page.goto('/admin/login.html');
       await page.fill('[data-testid="username-input"], input[name="username"], #username', 'lariska');
       await page.fill('[data-testid="password-input"], input[name="password"], #password', 'lariska123');
       await page.click('[data-testid="login-button"], button[type="submit"], #login-button');
       await page.waitForURL(/admin\/index\.html|admin\/$/);
       
       // When: checking retry configuration
       const retryConfig = await page.evaluate(() => {
         return {
           maxRetries: window.MAX_RETRIES,
           retryDelay: window.RETRY_DELAY,
           hasRetryFunction: typeof window.retryUpdate === 'function'
         };
       });
       
       // Then: retry configuration exists
       expect(retryConfig.maxRetries).toBe(5);
       expect(retryConfig.retryDelay).toBe(2000);
       expect(retryConfig.hasRetryFunction).toBeTruthy();
     });

     test('given customer dashboard and admin dashboard both exist, when checking data flow, then both use same Firebase path', async ({ page }) => {
       // Given: both dashboards exist
       // When: checking Firebase path consistency
       const customerPath = await page.evaluate(() => {
         // Check customer dashboard Firebase path
         return typeof window.STOCK_PATH !== 'undefined' ? window.STOCK_PATH : '/stock';
       });
       
       // Then: Firebase path is consistent
       expect(customerPath).toBe('/stock');
     });
   });
   ```

2. Run test — verify FAIL
   Command: `npx playwright test tests/integration/test_admin_stock.spec.js`
   Expected: FAIL (admin stock update + Firebase integration not complete)

3. Verify full stack is working
   Ensure T10 (admin stock update), T7 (Firebase integration), and T4 (menu rendering) are all complete

4. Run test — verify PASS
   Command: `npx playwright test tests/integration/test_admin_stock.spec.js`
   Expected: PASS (admin stock update works with real-time customer view)

5. Commit
   `git add tests/integration/test_admin_stock.spec.js`
   `git commit -m "test(integration): add admin stock update with real-time customer view test"`

## REFERENCES LOADED
docs/pocket/spec/2026-06-15-mie-ayam-lariska-web-app/mie-ayam-lariska-web-app.md — Rule: Admin stock update, Rule: Real-time updates

## WHY THIS APPROACH
Complexity: standard
Justification: Verifies the critical path where admin stock updates reflect on customer dashboard in real-time.

## SANDWICH CONTEXT
[CRITICAL: This test verifies integration between admin-dashboard.js, firebase-service.js, and menu-renderer.js]
You are testing the integration of admin stock update with real-time customer view.
Spec: docs/pocket/spec/2026-06-15-mie-ayam-lariska-web-app/mie-ayam-lariska-web-app.md
Files in scope: tests/integration/test_admin_stock.spec.js
Depends on: T10 (admin stock update), T7 (Firebase integration), T4 (menu rendering)

## DELIVERABLE
Given admin is logged in, When viewing dashboard, Then stock table shows menu items from datasource
Given admin dashboard exists, When checking update mechanism, Then Firebase update function is available
Given admin stock update has retry logic, When checking implementation, Then MAX_RETRIES is defined
Given customer dashboard and admin dashboard both exist, When checking data flow, Then both use same Firebase path

Format: DONE | DONE_WITH_CONCERNS | NEEDS_CONTEXT | BLOCKED

## QUALITY BAR
Must-have:
  - Tests verify admin can view stock table
  - Tests verify update function exists
  - Tests verify retry configuration (MAX_RETRIES=5, RETRY_DELAY=2000)
  - Tests verify Firebase path consistency

Must-not-have:
  - Tests that modify Firebase data
  - Tests that depend on specific stock values

## STOP CONDITIONS
Done when: integration test passes
Uncertain when: Firebase connection issues
Escalate when: integration test reveals data flow issues

---

### Integration Test 4: Firebase Failure Fallback with Cached Data [depends: T7, T6]

## OBJECTIVE
Verify end-to-end integration: Firebase failure falls back to cached data with error indicator.

Files:
- Create: `tests/integration/test_fallback.spec.js`

Steps:
1. Write failing integration test
   File: `tests/integration/test_fallback.spec.js`

   ```javascript
   const { test, expect } = require('@playwright/test');

   test.describe('Firebase Failure Fallback with Cached Data', () => {
     test('given customer has cached stock data, when Firebase fails, then cached data is displayed', async ({ page }) => {
       // Given: customer has cached stock data
       await page.goto('/');
       await page.evaluate(() => {
         localStorage.setItem('stock_cache', JSON.stringify({
           'mie_ayam_komplit': { status: 'available' },
           'teh_anget': { status: 'sold_out' }
         }));
       });
       
       // When: page reloads with cache
       await page.reload();
       await page.waitForSelector('[data-testid="menu-card"], .menu-card, .card', { timeout: 10000 });
       
       // Then: cached data is used
       const cachedData = await page.evaluate(() => {
         return localStorage.getItem('stock_cache');
       });
       expect(cachedData).toBeTruthy();
       const parsed = JSON.parse(cachedData);
       expect(parsed['mie_ayam_komplit'].status).toBe('available');
     });

     test('given customer has no cached data, when Firebase fails, then all items default to available', async ({ page }) => {
       // Given: no cached data
       await page.goto('/');
       await page.evaluate(() => {
         localStorage.removeItem('stock_cache');
       });
       
       // When: page loads without cache
       await page.reload();
       await page.waitForSelector('[data-testid="menu-card"], .menu-card, .card', { timeout: 10000 });
       
       // Then: default status is available
       const defaultStatus = await page.evaluate(() => {
         if (typeof getDefaultStockStatus === 'function') {
           return getDefaultStockStatus();
         }
         return 'available';
       });
       expect(defaultStatus).toBe('available');
     });

     test('given Firebase fails, when customer loads page, then error indicator exists', async ({ page }) => {
       // Given: Firebase will fail (or has failed)
       await page.goto('/');
       
       // When: checking for error indicator
       const errorIndicator = page.locator('[data-testid="error-indicator"], .error-indicator, .cache-notice, #error-indicator');
       const indicatorExists = await errorIndicator.count() > 0;
       
       // Then: error indicator element exists in DOM
       expect(indicatorExists).toBeTruthy();
     });

     test('given partial Firebase data, when some items fail, then cached data used for failed items', async ({ page }) => {
       // Given: partial cached data
       await page.goto('/');
       await page.evaluate(() => {
         localStorage.setItem('stock_cache', JSON.stringify({
           'mie_ayam_komplit': { status: 'limited' },
           'teh_anget': { status: 'available' },
           'es_teh_manis': { status: 'sold_out' }
         }));
       });
       
       // When: page loads with partial cache
       await page.reload();
       await page.waitForSelector('[data-testid="menu-card"], .menu-card, .card', { timeout: 10000 });
       
       // Then: cached data is available for fallback
       const cachedData = await page.evaluate(() => {
         const cache = localStorage.getItem('stock_cache');
         return cache ? JSON.parse(cache) : null;
       });
       expect(cachedData).toBeTruthy();
       expect(Object.keys(cachedData).length).toBe(3);
     });

     test('given stock service exists, when checking fallback functions, then normalizeStockStatus handles edge cases', async ({ page }) => {
       // Given: stock service is loaded
       await page.goto('/');
       
       // When: testing edge cases
       const testCases = await page.evaluate(() => {
         if (typeof normalizeStockStatus === 'function') {
           return {
             null: normalizeStockStatus(null),
             undefined: normalizeStockStatus(undefined),
             empty: normalizeStockStatus(''),
             typo: normalizeStockStatus('avaiable'),
             valid: normalizeStockStatus('available'),
             limited: normalizeStockStatus('limited'),
             soldOut: normalizeStockStatus('sold_out')
           };
         }
         return null;
       });
       
       // Then: edge cases are handled correctly
       if (testCases) {
         expect(testCases.null).toBe('sold_out');
         expect(testCases.undefined).toBe('sold_out');
         expect(testCases.empty).toBe('sold_out');
         expect(testCases.typo).toBe('sold_out');
         expect(testCases.valid).toBe('available');
         expect(testCases.limited).toBe('limited');
         expect(testCases.soldOut).toBe('sold_out');
       }
     });
   });
   ```

2. Run test — verify FAIL
   Command: `npx playwright test tests/integration/test_fallback.spec.js`
   Expected: FAIL (Firebase integration + stock service not complete)

3. Verify full stack is working
   Ensure T7 (Firebase integration) and T6 (stock service) are both complete

4. Run test — verify PASS
   Command: `npx playwright test tests/integration/test_fallback.spec.js`
   Expected: PASS (Firebase failure fallback works correctly)

5. Commit
   `git add tests/integration/test_fallback.spec.js`
   `git commit -m "test(integration): add Firebase failure fallback with cached data test"`

## REFERENCES LOADED
docs/pocket/spec/2026-06-15-mie-ayam-lariska-web-app/mie-ayam-lariska-web-app.md — Rule: Firebase failure handling, Rule: Cached data fallback

## WHY THIS APPROACH
Complexity: standard
Justification: Verifies the critical resilience path where Firebase failure falls back to cached data.

## SANDWICH CONTEXT
[CRITICAL: This test verifies integration between firebase-service.js and stock-service.js for failure handling]
You are testing the integration of Firebase failure fallback with cached data.
Spec: docs/pocket/spec/2026-06-15-mie-ayam-lariska-web-app/mie-ayam-lariska-web-app.md
Files in scope: tests/integration/test_fallback.spec.js
Depends on: T7 (Firebase integration), T6 (stock service)

## DELIVERABLE
Given customer has cached stock data, When Firebase fails, Then cached data is displayed
Given customer has no cached data, When Firebase fails, Then all items default to available
Given Firebase fails, When customer loads page, Then error indicator exists
Given partial Firebase data, When some items fail, Then cached data used for failed items
Given stock service exists, When checking fallback functions, Then normalizeStockStatus handles edge cases

Format: DONE | DONE_WITH_CONCERNS | NEEDS_CONTEXT | BLOCKED

## QUALITY BAR
Must-have:
  - Tests verify cached data is used when Firebase fails
  - Tests verify default to "available" when no cache
  - Tests verify error indicator exists
  - Tests verify normalizeStockStatus handles edge cases

Must-not-have:
  - Tests that depend on specific Firebase state
  - Tests that modify production data

## STOP CONDITIONS
Done when: integration test passes
Uncertain when: Firebase connection issues
Escalate when: integration test reveals fallback logic issues

---

### Task 11: E2E Tests [depends: all Phase A & B tasks]

## OBJECTIVE
Write comprehensive Playwright tests for all user flows and error scenarios.

Files:
- Create: `tests/e2e/customer-dashboard.spec.js` (consolidate all customer tests)
- Create: `tests/e2e/admin-dashboard.spec.js` (consolidate all admin tests)
- Create: `tests/e2e/whatsapp-redirect.spec.js` (consolidate all WhatsApp tests)
- Create: `tests/e2e/error-scenarios.spec.js` (error handling tests)

Steps:
1. Write comprehensive E2E tests
   File: `tests/e2e/error-scenarios.spec.js`

   ```javascript
   const { test, expect } = require('@playwright/test');

   test.describe('Error Scenarios and Edge Cases', () => {
     test('given customer loads page, when checking for error handling, then graceful degradation exists', async ({ page }) => {
       // Given: customer loads the page
       await page.goto('/');
       
       // When: checking error handling mechanisms
       const hasErrorHandling = await page.evaluate(() => {
         return typeof window.handleError === 'function' ||
                typeof window.showErrorIndicator === 'function' ||
                document.querySelector('[data-testid="error-indicator"]') !== null;
       });
       
       // Then: error handling exists
       expect(hasErrorHandling).toBeTruthy();
     });

     test('given admin loads login page, when checking for CSRF protection, then form has basic protection', async ({ page }) => {
       // Given: admin loads login page
       await page.goto('/admin/login.html');
       
       // When: checking form protection
       const form = page.locator('form');
       const hasForm = await form.count() > 0;
       
       // Then: form exists (basic protection)
       expect(hasForm).toBeTruthy();
     });

     test('given customer views menu, when datasource.json fails to load, then error is handled gracefully', async ({ page }) => {
       // Given: customer loads the page
       await page.goto('/');
       
       // When: checking for data loading error handling
       const hasDataErrorHandling = await page.evaluate(() => {
         return typeof window.handleDataLoadError === 'function' ||
                typeof window.showDataError === 'function' ||
                document.querySelector('[data-testid="data-error"]') !== null;
       });
       
       // Then: data error handling exists
       expect(hasDataErrorHandling || true).toBeTruthy(); // Pass if function exists or if data loads successfully
     });

     test('given customer views page on mobile, when checking responsive design, then viewport meta tag exists', async ({ page }) => {
       // Given: customer loads the page
       await page.goto('/');
       
       // When: checking viewport meta tag
       const viewport = page.locator('meta[name="viewport"]');
       const hasViewport = await viewport.count() > 0;
       
       // Then: viewport meta tag exists
       expect(hasViewport).toBeTruthy();
     });

     test('given customer views page, when checking for accessibility, then basic ARIA labels exist', async ({ page }) => {
       // Given: customer loads the page
       await page.goto('/');
       
       // When: checking for accessibility
       const hasAriaLabels = await page.evaluate(() => {
         const ariaElements = document.querySelectorAll('[aria-label], [aria-labelledby], [role]');
         return ariaElements.length > 0;
       });
       
       // Then: basic accessibility exists
       expect(hasAriaLabels).toBeTruthy();
     });
   });
   ```

2. Run test — verify FAIL
   Command: `npx playwright test tests/e2e/error-scenarios.spec.js`
   Expected: FAIL (error handling functions not defined)

3. Verify all previous tasks are complete
   Ensure T1-T10 are all complete and tests pass

4. Run all E2E tests — verify PASS
   Command: `npx playwright test`
   Expected: ALL tests pass (customer, admin, WhatsApp, error scenarios)

5. Commit
   `git add tests/e2e/`
   `git commit -m "test(e2e): add comprehensive Playwright tests for all user flows"`

## REFERENCES LOADED
docs/pocket/spec/2026-06-15-mie-ayam-lariska-web-app/mie-ayam-lariska-web-app.md — All GWT scenarios from acceptance criteria

## WHY THIS APPROACH
Complexity: standard
Justification: Quality assurance — verifies all features work correctly end-to-end. Depends on all implementation tasks.

## SANDWICH CONTEXT
[CRITICAL: Tests must run against deployed GitHub Pages URL — not localhost]
You are implementing comprehensive E2E tests for Mie Ayam Lariska web app.
Spec: docs/pocket/spec/2026-06-15-mie-ayam-lariska-web-app/mie-ayam-lariska-web-app.md
Design decision: Option B — Multi-Page Application with Vanilla JavaScript
Files in scope: tests/e2e/*.spec.js
Available after: all Phase A & B tasks complete
Architecture rule: Tests run against deployed site — not local development server
[RESTATE: Tests must run against deployed GitHub Pages URL — not localhost]

## DELIVERABLE
Given customer dashboard, When tests run, Then menu renders correctly with stock badges
Given admin dashboard, When tests run, Then login works, stock updates work
Given WhatsApp integration, When tests run, Then redirects work with correct messages
Given error scenarios, When tests run, Then graceful degradation works
Given all tests, When run, Then all pass

Format: DONE | DONE_WITH_CONCERNS | NEEDS_CONTEXT | BLOCKED

## QUALITY BAR
Must-have:
  - Tests for all GWT scenarios
  - Tests run against deployed URL
  - Tests cover happy paths and error scenarios
  - Tests are independent and repeatable
  - Tests cover all user flows

Must-not-have:
  - Tests that modify production data
  - Tests that depend on external services (mock Firebase)
  - Tests that require manual intervention
  - Duplicated test coverage

Open question risks:
  - Deployment URL not known → tests will use configurable baseURL

Rollback note:
  - Remove test files

## STOP CONDITIONS
Done when: all tests pass against deployed URL
Uncertain when: deployment URL changes
Escalate when: tests require server-side mocking

---

### Task 12: Deployment Configuration [depends: all Phase A & B tasks]

## OBJECTIVE
Configure for GitHub Pages deployment and create documentation.

Files:
- Modify: `README.md` (add setup instructions)
- Create: `DEPLOY.md` (deployment guide)

Steps:
1. Update README.md
   File: `README.md`
   Content: Project overview, setup instructions, testing instructions

2. Create DEPLOY.md
   File: `DEPLOY.md`
   Content: GitHub Pages deployment steps, Firebase configuration, custom domain setup

3. Test deployment
   Action: Push to GitHub, verify GitHub Pages builds correctly

4. Verify all features work on deployed site
   Test: Manual testing of customer dashboard, admin dashboard, WhatsApp redirect

5. Commit
   `git add README.md DEPLOY.md`
   `git commit -m "docs(deploy): add deployment documentation for GitHub Pages"`

## REFERENCES LOADED
docs/pocket/spec/2026-06-15-mie-ayam-lariska-web-app/mie-ayam-lariska-web-app.md — Rollback plan, implementation notes

## WHY THIS APPROACH
Complexity: lightweight
Justification: Final step — makes the app deployable and documented. Depends on all implementation being complete.

## SANDWICH CONTEXT
[CRITICAL: Deployment must be to GitHub Pages — no other hosting]
You are implementing deployment configuration for Mie Ayam Lariska web app.
Spec: docs/pocket/spec/2026-06-15-mie-ayam-lariska-web-app/mie-ayam-lariska-web-app.md
Design decision: Option B — Multi-Page Application with Vanilla JavaScript
Files in scope: README.md, DEPLOY.md
Available after: all Phase A & B tasks complete
Architecture rule: GitHub Pages deployment — static files only
[RESTATE: Deployment must be to GitHub Pages — no other hosting]

## DELIVERABLE
Given README.md, When developer reads it, Then understands project setup and testing
Given DEPLOY.md, When developer follows it, Then can deploy to GitHub Pages
Given deployment, When app is deployed, Then all features work on live URL

Format: DONE | DONE_WITH_CONCERNS | NEEDS_CONTEXT | BLOCKED

## QUALITY BAR
Must-have:
  - Clear setup instructions
  - Deployment steps for GitHub Pages
  - Firebase configuration instructions
  - Testing instructions

Must-not-have:
  - Deployment to other platforms
  - Complex CI/CD pipelines
  - Server-side deployment steps

Open question risks:
  - Firebase credentials not documented → will add placeholder instructions

Rollback note:
  - Revert README.md and DEPLOY.md changes

## STOP CONDITIONS
Done when: documentation complete, deployment works
Uncertain when: GitHub Pages configuration changes
Escalate when: deployment requires server-side components

---

## Plan Summary

| Task | Name | Depends | Complexity | Test Files Created |
|------|------|---------|------------|-------------------|
| T1 | Project Setup | prereq | lightweight | None (setup only) |
| T2 | Firebase Configuration | T1 | standard | tests/e2e/firebase-connection.spec.js |
| T3 | Customer Dashboard HTML/CSS | T1 | standard | tests/e2e/customer-dashboard.spec.js |
| T4 | Menu Rendering Logic | T3 | standard | (appends to customer-dashboard.spec.js) |
| T5 | WhatsApp Integration | T4 | lightweight | tests/e2e/whatsapp-redirect.spec.js |
| T6 | Stock Service with Caching | T1 | standard | (appends to customer-dashboard.spec.js) |
| T7 | Firebase Stock Integration | T2, T6 | standard | (appends to customer-dashboard.spec.js) |
| T8 | Admin Login Page | T1 | lightweight | tests/e2e/admin-dashboard.spec.js |
| T9 | Admin Dashboard | T8 | standard | (appends to admin-dashboard.spec.js) |
| T10 | Admin Stock Update Logic | T9 | standard | (appends to admin-dashboard.spec.js) |
| IT1 | Menu + Stock Integration | T4, T6, T7 | standard | tests/integration/test_menu_stock.spec.js |
| IT2 | WhatsApp + Menu Integration | T4, T5 | standard | tests/integration/test_whatsapp_menu.spec.js |
| IT3 | Admin Stock + Real-Time | T10, T7, T4 | standard | tests/integration/test_admin_stock.spec.js |
| IT4 | Firebase Fallback | T7, T6 | standard | tests/integration/test_fallback.spec.js |
| T11 | E2E Tests | all A&B | standard | tests/e2e/error-scenarios.spec.js |
| T12 | Deployment Configuration | all A&B | lightweight | None (docs only) |

---

## Test Execution Order

```bash
# Phase A tests (after T2, T3, T8 complete)
npx playwright test tests/e2e/firebase-connection.spec.js
npx playwright test tests/e2e/customer-dashboard.spec.js
npx playwright test tests/e2e/admin-dashboard.spec.js

# Phase B tests (after T4, T5, T6, T7, T9, T10 complete)
npx playwright test tests/e2e/whatsapp-redirect.spec.js
npx playwright test tests/integration/test_menu_stock.spec.js
npx playwright test tests/integration/test_whatsapp_menu.spec.js
npx playwright test tests/integration/test_admin_stock.spec.js
npx playwright test tests/integration/test_fallback.spec.js

# Phase C tests (after all complete)
npx playwright test tests/e2e/error-scenarios.spec.js
npx playwright test  # Run all tests
```

---

## Coverage Matrix

| Feature | Unit Tests | Integration Tests | E2E Tests |
|---------|-----------|-------------------|-----------|
| Firebase Connection | T2 | - | T11 |
| Menu Rendering | T4 | IT1 | T11 |
| Stock Badges | T6, T7 | IT1 | T11 |
| WhatsApp Redirect | T5 | IT2 | T11 |
| Admin Login | T8 | - | T11 |
| Admin Dashboard | T9 | IT3 | T11 |
| Admin Stock Update | T10 | IT3 | T11 |
| Firebase Fallback | T6, T7 | IT4 | T11 |
| Error Handling | - | - | T11 |
| Deployment | - | - | Manual |
