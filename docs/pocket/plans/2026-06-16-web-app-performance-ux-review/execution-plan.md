# Execution Plan: Web App Performance & UX Quick Wins

Date: 2026-06-16
Spec: `docs/pocket/spec/2026-06-16-web-app-performance-ux-review/spec.md`

### Task 1: Move scripts to bottom & remove error indicator [prereq]

## OBJECTIVE
Pindahkan semua `<script>` tags dari `<head>` ke sebelum `</body>` di index.html, dan hapus element `#stock-error-indicator` dari HTML.

Files:
- Modify: `index.html`

Steps:
1. Implement: Pindahkan semua `<script>` tags dari `<head>` ke sebelum `</body>`
   - Keep `<link rel="stylesheet">` in `<head>` (CSS must block render)
   - Preserve script load order: Firebase SDK → firebase-config → stock-service → main (with defer)

2. Hapus `<div id="stock-error-indicator">` element dari HTML

3. Verify manual:
   - `grep -c '<script' index.html` — semua script ditemukan
   - `grep '<head>' -A 50 index.html` — tidak ada script di head
   - `grep 'stock-error-indicator' index.html` — element tidak ditemukan

4. Commit:
   `git add index.html`
   `git commit -m "perf(index): move scripts to bottom, remove error indicator"`

## REFERENCES LOADED
`docs/pocket/spec/2026-06-16-web-app-performance-ux-review/spec.md` — Rule: JS loading order, Cleanup
`index.html` — current script placement in head

## WHY THIS APPROACH
Justification: Moving scripts to bottom is the highest-impact single change for first paint. Removing error indicator cleans up unused code.
Complexity: lightweight

## SANDWICH CONTEXT
[CRITICAL: Scripts MUST remain in correct load order — Firebase SDK before firebase-config before stock-service before main]
You are implementing script relocation for Mie Ayam Lariska Web.
Spec: `docs/pocket/spec/2026-06-16-web-app-performance-ux-review/spec.md`
Design decision: Option B — Complete Quick Wins
Files in scope: `index.html` only
Available after: none (prerequisite task)
Architecture rule: No build step, vanilla JS only
[RESTATE: Scripts MUST remain in correct load order — Firebase SDK before firebase-config before stock-service before main]

## DELIVERABLE
Verification — task is DONE when all pass:

Given HTML file is opened, When inspecting `<head>`, Then no `<script>` tags present
Given HTML file is opened, When inspecting before `</body>`, Then all `<script>` tags present in correct order
Given HTML file is opened, When searching for `stock-error-indicator`, Then element not found

Commit exists with message `perf(index): move scripts to bottom, remove error indicator`.

Format: DONE | DONE_WITH_CONCERNS | NEEDS_CONTEXT | BLOCKED

## QUALITY BAR
Must-have:
  - All scripts moved to bottom before `</body>`
  - Script load order preserved (Firebase SDK → firebase-config → stock-service → main with defer)
  - Error indicator HTML element removed
  - CSS `<link>` tags remain in `<head>`

Must-not-have:
  - Changes to JS file contents (only HTML structure)
  - Removal of CSS link tags from head
  - Breaking script load order

Open question risks:
  - none

Rollback note:
  - `git revert` to restore previous script placement

## STOP CONDITIONS
Done when: scripts at bottom, error indicator removed
Escalate when: script order broken, Firebase fails to initialize


### Task 2: Add shimmer skeleton CSS + HTML [depends: T1]

## OBJECTIVE
Tambahkan CSS shimmer skeleton animation dan HTML skeleton placeholders untuk section Menu dan Packages di index.html.

Files:
- Modify: `css/style.css`
- Modify: `index.html`

Steps:
1. Implement CSS shimmer skeleton:
   File: `css/style.css`
   - Add `.skeleton` base class with gray background and shimmer animation
   - Add `.skeleton__card`, `.skeleton__image`, `.skeleton__text` variants
   - Add `@keyframes shimmer` animation
   - Use brand colors: `--color-border` for skeleton base, `--color-surface-alt` for shimmer highlight

2. Implement HTML skeleton placeholders:
   File: `index.html`
   - Add skeleton HTML inside `#packages-container` (before script)
   - Add skeleton HTML inside `.menu__grid` containers (11 for Mie Ayam, 8 for Topping, 5 for Minuman)
   - Skeleton cards show: gray image placeholder, gray text lines, gray price badge

3. Verify manual:
   - Open page with Firebase blocked — skeleton visible
   - Count skeleton cards per category

4. Commit:
   `git add css/style.css index.html`
   `git commit -m "feat(ui): add shimmer skeleton loading for menu and packages"`

## REFERENCES LOADED
`docs/pocket/spec/2026-06-16-web-app-performance-ux-review/spec.md` — Rule: Shimmer skeleton
`css/style.css` — existing CSS variables and animation patterns
`index.html` — menu grid structure

## WHY THIS APPROACH
Justification: Gray shimmer is industry standard. CSS-only animation, no JS dependency. Uses existing brand CSS variables.
Complexity: standard

## SANDWICH CONTEXT
[CRITICAL: Skeleton card count MUST match hard-coded HTML card count per category]
You are implementing shimmer skeleton for Mie Ayam Lariska Web.
Spec: `docs/pocket/spec/2026-06-16-web-app-performance-ux-review/spec.md`
Design decision: Option B — Complete Quick Wins
Files in scope: `css/style.css`, `index.html`
Available after: T1
Architecture rule: BEM naming for CSS classes, no build step
[RESTATE: Skeleton card count MUST match hard-coded HTML card count per category — 11 Mie Ayam, 8 Topping, 5 Minuman]

## DELIVERABLE
Verification — task is DONE when all pass:

Given page loads, When Firebase not yet connected, Then `.skeleton` elements visible in menu section
Given menu category "Mie Ayam", When skeleton renders, Then 11 skeleton cards shown
Given menu category "Topping Tambahan", When skeleton renders, Then 8 skeleton cards shown
Given menu category "Minuman", When skeleton renders, Then 5 skeleton cards shown
Given packages section, When skeleton renders, Then skeleton cards shown for packages

Commit exists with message `feat(ui): add shimmer skeleton loading for menu and packages`.

Format: DONE | DONE_WITH_CONCERNS | NEEDS_CONTEXT | BLOCKED

## QUALITY BAR
Must-have:
  - Shimmer animation uses CSS only (no JS)
  - Skeleton card count matches hard-coded HTML per category
  - Uses existing CSS custom properties (--color-border, --color-surface-alt)
  - BEM naming convention followed

Must-not-have:
  - JavaScript-based skeleton logic
  - Hard-coded color values (use CSS variables)
  - Skeleton in sections outside scope (FAQ, Why, Location)

Open question risks:
  - Skeleton count mismatch if admin adds new menu items — accepted trade-off

Rollback note:
  - Remove skeleton HTML and CSS classes

## STOP CONDITIONS
Done when: skeleton visible before Firebase connects, correct card counts
Escalate when: skeleton count doesn't match actual cards


### Task 3: Add skeleton-to-content transition + optimistic Tersedia [depends: T2]

## OBJECTIVE
Tambahkan logic di main.js untuk: (1) sembunyikan skeleton dan tampilkan kartu asli saat Firebase connect, (2) tampilkan badge "Tersedia" sebagai default untuk semua item, (3) update badge saat stok aktual dari Firebase diterima. Hapus error indicator functions dari stock-service.js dan hapus test error indicator yang sudah ada.

Files:
- Modify: `js/main.js`
- Modify: `js/stock-service.js`
- Modify: `tests/e2e/customer-dashboard.spec.js`

Steps:
1. Implement skeleton-to-content transition:
   File: `js/main.js`
   - Add `initSkeletonTransition()` function: hide skeleton elements when Firebase data arrives
   - Add `setAllBadgesToAvailable()` function for initial state
   - Modify `initStockUpdates()`: call `setAllBadgesToAvailable()` first, then listen for Firebase updates

2. Implement optimistic Tersedia default:
   File: `js/main.js`
   - All menu items show "Tersedia" badge on initial load (cache ignored)
   - Badges update in-place when Firebase data arrives (no layout shift)

3. Remove error indicator:
   File: `js/stock-service.js`
   - Remove `showErrorIndicator()` function
   - Remove `hideErrorIndicator()` function
   - Remove `isUsingCachedData()` and `setUsingCachedData()` if they only serve error indicator

4. Delete broken existing tests:
   File: `tests/e2e/customer-dashboard.spec.js`
   - Delete entire `test.describe('Stock Service — Error Indicator', ...)` block (3 tests)
   - These tests call `showErrorIndicator()`/`hideErrorIndicator()` which are being removed

5. Verify manual:
   - Open page — all items show "Tersedia"
   - Firebase connects — badges update without layout shift
   - No error banner visible

6. Commit:
   `git add js/main.js js/stock-service.js tests/e2e/customer-dashboard.spec.js`
   `git commit -m "feat(stock): optimistic Tersedia default, skeleton-to-content transition, remove error indicator"`

## REFERENCES LOADED
`docs/pocket/spec/2026-06-16-web-app-performance-ux-review/spec.md` — Rule: Optimistic Tersedia, skeleton transition
`js/main.js` — current stock update logic, MENU_STOCK_MAP
`js/stock-service.js` — error indicator functions to remove
`tests/e2e/customer-dashboard.spec.js` — existing error indicator tests to delete

## WHY THIS APPROACH
Justification: Optimistic display gives positive first impression. Skeleton hides until real data arrives. Removing error indicator cleans up unused code.
Complexity: standard

## SANDWICH CONTEXT
[CRITICAL: Badge update must NOT cause layout shift — badges must update in-place]
You are implementing stock display logic for Mie Ayam Lariska Web.
Spec: `docs/pocket/spec/2026-06-16-web-app-performance-ux-review/spec.md`
Design decision: Option B — Complete Quick Wins
Files in scope: `js/main.js`, `js/stock-service.js`, `tests/e2e/customer-dashboard.spec.js`
Available after: T2
Architecture rule: IIFE 'use strict', no new dependencies
[RESTATE: Badge update must NOT cause layout shift — badges must update in-place]

## DELIVERABLE
Verification — task is DONE when all pass:

Given user opens page, When menu renders, Then all items show "Tersedia" badge
Given Firebase connects after 3 seconds, When stock data received, Then badges update to reflect actual stock
Given Firebase reconnects after failure, When data arrives, Then badges update in place without layout shift
Given Firebase connection fails, When user browses menu, Then no error banner appears
Given stock-error-indicator functions exist in stock-service.js, When inspected, Then functions removed
Given existing error indicator tests, When inspected, Then tests deleted

Commit exists with message `feat(stock): optimistic Tersedia default, skeleton-to-content transition, remove error indicator`.

Format: DONE | DONE_WITH_CONCERNS | NEEDS_CONTEXT | BLOCKED

## QUALITY BAR
Must-have:
  - All items show "Tersedia" on initial load
  - Skeleton hides when real content arrives
  - Stock badges update in-place (no layout shift)
  - Error indicator functions removed from stock-service.js
  - Error indicator tests deleted from customer-dashboard.spec.js
  - No error banner shown on connection failure

Must-not-have:
  - localStorage cache read on initial load (always optimistic)
  - Error indicator display
  - Layout shift during badge updates

Open question risks:
  - none

Rollback note:
  - Restore error indicator functions, revert badge logic, restore deleted tests

## STOP CONDITIONS
Done when: optimistic Tersedia works, skeleton transitions, no error indicator
Escalate when: layout shift detected during badge update


### Task 4: Add image fallback system [depends: T1]

## OBJECTIVE
Tambahkan image fallback system: jika gambar menu atau hero tidak ditemukan, tampilkan placeholder cream dengan icon noodle bowl.

Files:
- Modify: `css/style.css`
- Modify: `js/main.js`

Steps:
1. Implement CSS fallback styles:
   File: `css/style.css`
   - Add `.image-fallback` class with cream background (`var(--color-background)`)
   - Add `.image-fallback__icon` for noodle bowl emoji
   - Add `.image-fallback__name` for menu name text
   - Style to match existing `.menu__item-image` dimensions

2. Implement JS fallback handler:
   File: `js/main.js`
   - Modify `initMenuImages()`: add `onerror` handler to show fallback
   - Modify hero image: add `onerror` handler for hero fallback
   - Fallback shows cream background + 🍜 icon + menu name

3. Verify manual:
   - Rename an image file temporarily — fallback appears
   - Restore image — normal display resumes

4. Commit:
   `git add css/style.css js/main.js`
   `git commit -m "feat(ui): add image fallback with brand-colored placeholder"`

## REFERENCES LOADED
`docs/pocket/spec/2026-06-16-web-app-performance-ux-review/spec.md` — Rule: Image fallback
`css/style.css` — existing image styles, brand colors
`js/main.js` — initMenuImages() function, hero image element

## WHY THIS APPROACH
Justification: Cream placeholder with noodle bowl icon is on-brand and informative. CSS-only fallback styling, JS handles the swap.
Complexity: standard

## SANDWICH CONTEXT
[CRITICAL: Fallback must use brand colors (--color-background), not generic gray]
You are implementing image fallback for Mie Ayam Lariska Web.
Spec: `docs/pocket/spec/2026-06-16-web-app-performance-ux-review/spec.md`
Design decision: Option B — Complete Quick Wins
Files in scope: `css/style.css`, `js/main.js`
Available after: T1
Architecture rule: BEM naming, IIFE pattern
[RESTATE: Fallback must use brand colors (--color-background), not generic gray]

## DELIVERABLE
Verification — task is DONE when all pass:

Given menu image doesn't exist, When menu loads, Then card shows cream placeholder with 🍜 icon and menu name
Given hero image doesn't exist, When page loads, Then hero shows cream placeholder with 🍜 icon
Given image loads then returns 404, When error occurs, Then card shows cream placeholder

Commit exists with message `feat(ui): add image fallback with brand-colored placeholder`.

Format: DONE | DONE_WITH_CONCERNS | NEEDS_CONTEXT | BLOCKED

## QUALITY BAR
Must-have:
  - Fallback uses `var(--color-background)` for background
  - Noodle bowl emoji (🍜) displayed
  - Menu name visible in fallback
  - Works for both menu cards and hero image
  - onerror handler catches 404 and network errors

Must-not-have:
  - Generic gray placeholder
  - Broken image icon (browser default)
  - JavaScript that blocks rendering

Open question risks:
  - none

Rollback note:
  - Remove fallback handlers, restore original image loading

## STOP CONDITIONS
Done when: fallback shows on missing images, brand colors used
Escalate when: fallback doesn't trigger on 404


### Task 5: Fix admin grid responsive breakpoint [prereq]

## OBJECTIVE
Perbaiki responsive grid di admin dashboard: ubah dari 2 kolom langsung ke 4 kolom menjadi 3 kolom di 768px+ breakpoint.

Files:
- Modify: `css/admin.css`

Steps:
1. Implement CSS fix:
   File: `css/admin.css`
   - Change `@media (min-width: 768px)` grid from `repeat(2, 1fr)` to `repeat(3, 1fr)`
   - Keep `@media (min-width: 1024px)` at `repeat(4, 1fr)`

2. Verify manual:
   - Open admin at 768px — 3 columns
   - Open admin at 480px — 2 columns
   - Open admin at 1024px — 4 columns

3. Commit:
   `git add css/admin.css`
   `git commit -m "fix(admin): 3-column grid at tablet breakpoint"`

## REFERENCES LOADED
`docs/pocket/spec/2026-06-16-web-app-performance-ux-review/spec.md` — Rule: Admin responsive grid
`css/admin.css` — current responsive breakpoints

## WHY THIS APPROACH
Justification: 3 columns at 768px is consistent with visitor page menu grid. Simple CSS change.
Complexity: lightweight

## SANDWICH CONTEXT
[CRITICAL: Must not affect mobile (480px) or desktop (1024px+) breakpoints]
You are implementing admin grid fix for Mie Ayam Lariska Web.
Spec: `docs/pocket/spec/2026-06-16-web-app-performance-ux-review/spec.md`
Design decision: Option B — Complete Quick Wins
Files in scope: `css/admin.css`
Available after: none (prerequisite)
Architecture rule: BEM naming, CSS custom properties
[RESTATE: Must not affect mobile (480px) or desktop (1024px+) breakpoints]

## DELIVERABLE
Verification — task is DONE when all pass:

Given admin dashboard at 768px viewport, When menu grid renders, Then 3 columns displayed
Given admin dashboard at 480px viewport, When menu grid renders, Then 2 columns displayed
Given admin dashboard at 1024px viewport, When menu grid renders, Then 4 columns displayed

Commit exists with message `fix(admin): 3-column grid at tablet breakpoint`.

Format: DONE | DONE_WITH_CONCERNS | NEEDS_CONTEXT | BLOCKED

## QUALITY BAR
Must-have:
  - 3 columns at 768px breakpoint
  - 2 columns at 480px breakpoint unchanged
  - 4 columns at 1024px breakpoint unchanged

Must-not-have:
  - Changes to mobile or desktop breakpoints
  - Changes to visitor page grid

Open question risks:
  - none

Rollback note:
  - Revert CSS change

## STOP CONDITIONS
Done when: 3 columns at 768px, other breakpoints unchanged
Escalate when: mobile or desktop breakpoints affected


### Task 6: E2E test updates [depends: T3, T4, T5]

## OBJECTIVE
Tambahkan E2E tests baru untuk semua acceptance criteria: skeleton visibility, optimistic Tersedia, image fallback, admin grid. Gunakan Firebase mocking via `page.route()`.

Files:
- Modify: `tests/e2e/customer-dashboard.spec.js`
- Modify: `tests/e2e/admin-dashboard.spec.js`

Steps:
1. Tambah test suites baru di `customer-dashboard.spec.js`:

   **Performance — Script Loading:**
   - `no script tags in head element` — verify `document.head.querySelectorAll('script').length === 0`
   - `all script tags at bottom of body` — verify scripts within last 3 body children
   - `no stock-error-indicator element exists` — verify `#stock-error-indicator` count === 0

   **Performance — Skeleton Loading:**
   - `skeleton elements visible before Firebase connects` — block Firebase via `page.route('**/*firebaseio.com/**', route => route.abort())`, verify `.skeleton` count > 0
   - `Mie Ayam category shows 11 skeleton cards` — verify first `.menu__category` skeleton count === 11
   - `Topping category shows 8 skeleton cards` — verify second category skeleton count === 8
   - `Minuman category shows 5 skeleton cards` — verify third category skeleton count === 5
   - `packages section shows skeleton cards` — verify packages skeleton count > 0

   **Performance — Optimistic Tersedia:**
   - `all menu items show Tersedia badge on initial load` — block Firebase, verify all `.menu__item-stock` show "Tersedia"
   - `no error banner shown when Firebase connection fails` — block Firebase, verify no `#stock-error-indicator` visible
   - `badges update in place when Firebase data arrives` — block then unblock Firebase, verify badge count unchanged

   **Performance — Image Fallback:**
   - `missing menu image shows cream placeholder` — block images via `page.route('**/images/**', ...)`, verify `.image-fallback` visible with 🍜
   - `missing hero image shows cream placeholder` — verify hero `.image-fallback` visible
   - `image fallback shows menu name` — verify fallback contains text
   - `fallback uses brand background color` — verify backgroundColor is not generic gray

2. Tambah test suite baru di `admin-dashboard.spec.js`:

   **Admin Grid — Responsive Breakpoints:**
   - `shows 3 columns at 768px viewport` — set viewport 768px, verify `gridTemplateColumns` has 3 values
   - `shows 2 columns at 480px viewport` — set viewport 480px, verify 2 values
   - `shows 4 columns at 1024px viewport` — set viewport 1024px, verify 4 values

3. Run all tests:
   `npm test`
   Expected: all PASS

4. Commit:
   `git add tests/e2e/customer-dashboard.spec.js tests/e2e/admin-dashboard.spec.js`
   `git commit -m "test(e2e): add tests for skeleton, Tersedia, fallback, admin grid"`

## REFERENCES LOADED
`docs/pocket/spec/2026-06-16-web-app-performance-ux-review/spec.md` — All 12 acceptance criteria
`tests/e2e/customer-dashboard.spec.js` — existing test patterns
`tests/e2e/admin-dashboard.spec.js` — existing admin test patterns
`playwright.config.js` — test configuration (chromium 375x812, Pixel 5)

## WHY THIS APPROACH
Justification: E2E tests verify end-to-end behavior. Firebase mocking via `page.route()` is reliable Playwright pattern.
Complexity: standard

## SANDWICH CONTEXT
[CRITICAL: Tests must use existing Playwright patterns — no new frameworks]
You are implementing E2E tests for Mie Ayam Lariska Web.
Spec: `docs/pocket/spec/2026-06-16-web-app-performance-ux-review/spec.md`
Design decision: Option B — Complete Quick Wins
Files in scope: `tests/e2e/customer-dashboard.spec.js`, `tests/e2e/admin-dashboard.spec.js`
Available after: T3, T4, T5
Architecture rule: Playwright test patterns, mobile-first viewport
[RESTATE: Tests must use existing Playwright patterns — no new frameworks]

## DELIVERABLE
Verification — task is DONE when all pass:

Given test suite runs, When all tests execute, Then all 12 acceptance criteria covered
Given customer tests run, When skeleton tests execute, Then Firebase blocked via page.route(), skeleton verified
Given customer tests run, When Tersedia tests execute, Then all badges show "Tersedia"
Given customer tests run, When fallback tests execute, Then images blocked, fallback verified
Given admin tests run, When grid tests execute, Then viewport-specific column counts verified

All tests PASS. Commit exists with message `test(e2e): add tests for skeleton, Tersedia, fallback, admin grid`.

Format: DONE | DONE_WITH_CONCERNS | NEEDS_CONTEXT | BLOCKED

## QUALITY BAR
Must-have:
  - Tests cover all 12 acceptance criteria from spec
  - Tests follow existing Playwright patterns
  - Firebase mocking uses `page.route('**/*firebaseio.com/**', ...)`
  - Image mocking uses `page.route('**/images/**', ...)`
  - Admin tests use `page.setViewportSize()` for responsive testing

Must-not-have:
  - New test frameworks or libraries
  - Tests that depend on Firebase real data
  - Flaky tests

Open question risks:
  - Firebase mocking may need refinement if SDK uses different domain patterns

Rollback note:
  - Remove new test cases

## STOP CONDITIONS
Done when: all 12 acceptance criteria have E2E test coverage, all tests pass
Escalate when: Firebase mocking pattern doesn't work


## Execution Flow

```
T1 (prereq) → T2 → T3
              → T4
T5 (prereq) ──────────→ T6
```

Parallelizable groups:
- After T1: T2, T4, T5 can run concurrently
- T6 waits for T3, T4, T5


## ACCEPTANCE CRITERIA COVERAGE

| # | Story | Rule | Task(s) |
|---|-------|------|--------|
| 1 | Fast First Paint | JS at bottom | T1 |
| 2 | Fast First Paint | Shimmer skeleton | T2 |
| 3 | Fast First Paint | Skeleton-to-content transition | T3 |
| 4 | Optimistic Stock | Tersedia default | T3 |
| 5 | Optimistic Stock | Badge update | T3 |
| 6 | Optimistic Stock | No error indicator | T1, T3 |
| 7 | Image Fallback | Menu card fallback | T4 |
| 8 | Image Fallback | Hero fallback | T4 |
| 9 | Image Fallback | 404 fallback | T4 |
| 10 | Admin Grid | 3 columns at 768px | T5 |
| 11 | Cleanup | Remove error indicator | T1, T3 |
| 12 | Tests | E2E coverage | T6 |
