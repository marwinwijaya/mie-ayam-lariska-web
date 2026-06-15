# EXECUTION PLAN — Admin Dashboard Enhancement

**Date:** 2026-06-15
**Spec:** docs/pocket/spec/2026-06-15-admin-dashboard-enhancement/admin-dashboard-enhancement.md
**Status:** approved
**Total tasks:** 8

---

## Execution Overview

### Recommended Order
```
T1 → T2, T3, T4, T6 (parallel) → T5 → T7 → T8
```

> Dependency order above is **recommended** — pocket skill enforces actual
> parallelism and sequencing based on its routing logic.

### Parallelizable Groups
| Group | Tasks | Unblocked After |
|-------|-------|-----------------|
| Group A | T2, T3, T4, T6 | T1 completes |
| Group B | T5 | T2, T3, T4 complete |
| Group C | T7 | T5, T6 complete |

### Constraints Reminder
**Architecture:** Static files only, Firebase client-side SDK, Vanilla JS, IIFE pattern
**Out-of-scope:** Menu image upload, bulk edit, history/audit log, HTML descriptions
**Assumptions at risk:** Concurrent admin sessions could cause data conflicts (last-write-wins)
**Sequencing:** Dependency order shown is recommended only — pocket enforces actual blocking rules.

### File Structure Map

```
Rule: Firebase Connection Management
  Create: js/firebase-connection-service.js        (created by: T3)
  Modify: admin/index.html
  Test:   tests/e2e/admin-connection.spec.js

Rule: Menu CRUD — Create/Update/Delete
  Create: js/menu-service.js                       (created by: T2)
  Create: js/description-templates.js              (created by: T4)
  Modify: admin/index.html
  Modify: css/admin.css
  Test:   tests/e2e/admin-menu-crud.spec.js

Rule: Menu Ordering
  Create: js/drag-drop-service.js                  (created by: T6)
  Modify: admin/index.html
  Modify: css/admin.css
  Test:   tests/e2e/admin-menu-ordering.spec.js

Rule: Data Migration
  Modify: js/firebase-config.js                    (modified by: T1)
  Create: scripts/migrate-data.js                  (created by: T1)
  Test:   tests/e2e/migration.spec.js

Rule: Customer Dashboard Update
  Modify: js/main.js                               (modified by: T8)
  Modify: index.html                               (modified by: T8)
  Test:   tests/e2e/customer-dashboard-menu.spec.js
```

---

## Pocket Packets

---

### Task 1: Data Migration [prereq]

## OBJECTIVE
Migrate data from stock/ to menu/ path in Firebase. Add order field to all items. Update firebase-config.js to use new structure.

Files:
- Modify: `js/firebase-config.js`
- Create: `scripts/migrate-data.js`
- Test: `tests/e2e/migration.spec.js`

Steps:
1. Write failing test for: Data migration from stock/ to menu/
   File: `tests/e2e/migration.spec.js`
   Test verifies: Given stock/ has data, When migration runs, Then menu/ has all items with order field

2. Run test — verify FAIL:
   `npx playwright test tests/e2e/migration.spec.js`
   Expected failure: menu/ path does not exist

3. Implement minimal code to satisfy the test:
   File: `scripts/migrate-data.js`
   Implement: Migration script that reads stock/, creates menu/ with order field

4. Run test — verify PASS:
   `npx playwright test tests/e2e/migration.spec.js`
   Expected: PASS

5. Update firebase-config.js to use menu/ path:
   File: `js/firebase-config.js`
   Implement: Change stockRef to menuRef, update INITIAL_STOCK_DATA to INITIAL_MENU_DATA

6. Commit:
   `git add js/firebase-config.js scripts/migrate-data.js tests/e2e/migration.spec.js`
   `git commit -m "feat(data): migrate from stock/ to menu/ path with order field"`

## REFERENCES LOADED
- docs/pocket/spec/2026-06-15-admin-dashboard-enhancement/admin-dashboard-enhancement.md — Data Model section
- js/firebase-config.js — Current stock/ structure and FirebaseService API

## WHY THIS APPROACH
Complexity: standard
Justification: Data migration must happen first before any CRUD can work

## SANDWICH CONTEXT
[CRITICAL: All menu data must live in menu/{item_id} path]
You are implementing Data Migration for Admin Dashboard Enhancement.
Spec: docs/pocket/spec/2026-06-15-admin-dashboard-enhancement/admin-dashboard-enhancement.md
Design decision: Single-page CRUD with inline editing
Files in scope: js/firebase-config.js, scripts/migrate-data.js, tests/e2e/migration.spec.js
Test framework: Playwright (E2E)
Available after: none (prereq)
Architecture rule: IIFE modules, window.ModuleName pattern
[RESTATE: All menu data must live in menu/{item_id} path]

## DELIVERABLE
Verification — task is DONE when all pass:

Given stock/ has 24 items, When migration runs, Then menu/ has 24 items with order field (1-24)
Given menu/ already exists, When migration runs again, Then no data duplication
Given firebase-config.js loads, Then menuRef is used instead of stockRef

All tests PASS. Commit exists with message matching feat(data): migrate from stock/ to menu/ path.

Format: DONE

## QUALITY BAR
Must-have:
  - All 24 items migrated to menu/
  - Order field auto-initialized (1-24)
  - Status field preserved
  - No data loss during migration

Must-not-have:
  - Duplicate items in menu/
  - Missing order field
  - Breaking existing customer dashboard (temporary backward compat)

Open question risks:
  - Concurrent admin sessions during migration → document as assumption

## STOP CONDITIONS
Done when: migration test passes, firebase-config.js updated
Escalate when: Firebase write fails repeatedly

---

### Task 2: MenuService Module [depends: T1]

## OBJECTIVE
Create MenuService module with CRUD operations, duplicate detection, and input validation.

Files:
- Create: `js/menu-service.js`
- Test: `tests/e2e/menu-service.spec.js`

Steps:
1. Write failing test for: MenuService CRUD operations
   File: `tests/e2e/menu-service.spec.js`
   Test verifies: Given valid menu data, When createMenu called, Then item saved to Firebase

2. Run test — verify FAIL:
   `npx playwright test tests/e2e/menu-service.spec.js`
   Expected failure: MenuService not defined

3. Implement MenuService:
   File: `js/menu-service.js`
   Implement: createMenu, updateMenu, deleteMenu, getMenu, getAllMenus, duplicate detection

4. Run test — verify PASS:
   `npx playwright test tests/e2e/menu-service.spec.js`
   Expected: PASS

5. Commit:
   `git add js/menu-service.js tests/e2e/menu-service.spec.js`
   `git commit -m "feat(menu): add MenuService with CRUD operations"`

## REFERENCES LOADED
- docs/pocket/spec/2026-06-15-admin-dashboard-enhancement/admin-dashboard-enhancement.md — Story 2, 3, 4
- js/firebase-config.js — FirebaseService pattern to follow

## WHY THIS APPROACH
Complexity: standard
Justification: Centralized menu operations, reusable across admin and customer

## SANDWICH CONTEXT
[CRITICAL: MenuService must use menu/ path from Task 1]
You are implementing MenuService for Admin Dashboard Enhancement.
Spec: docs/pocket/spec/2026-06-15-admin-dashboard-enhancement/admin-dashboard-enhancement.md
Design decision: Single-page CRUD with inline editing
Files in scope: js/menu-service.js, tests/e2e/menu-service.spec.js
Test framework: Playwright (E2E)
Available after: T1
Architecture rule: IIFE modules, window.ModuleName pattern
[RESTATE: MenuService must use menu/ path from Task 1]

## DELIVERABLE
Verification — task is DONE when all pass:

Given valid data, When createMenu, Then item saved with name, category, price, description, status, order
Given duplicate name, When createMenu, Then error "Menu sudah ada"
Given empty name, When createMenu, Then error "Nama menu wajib diisi"
Given valid data, When updateMenu, Then item updated in Firebase
Given item exists, When deleteMenu, Then item removed from Firebase

All tests PASS. Commit exists.

Format: DONE

## QUALITY BAR
Must-have:
  - Duplicate name detection
  - Input validation (name required, price numeric)
  - Use update() not set() for partial writes
  - Expose window.MenuService

Must-not-have:
  - Direct Firebase calls from UI (must go through MenuService)
  - Hardcoded menu items

## STOP CONDITIONS
Done when: all CRUD tests pass
Escalate when: validation rules unclear

---

### Task 3: FirebaseConnectionService [depends: T1]

## OBJECTIVE
Create FirebaseConnectionService with connection monitoring and manual reconnect.

Files:
- Create: `js/firebase-connection-service.js`
- Modify: `admin/index.html`
- Test: `tests/e2e/admin-connection.spec.js`

Steps:
1. Write failing test for: Connection status display
   File: `tests/e2e/admin-connection.spec.js`
   Test verifies: Given connected, When page loads, Then status shows "Terhubung"

2. Run test — verify FAIL:
   `npx playwright test tests/e2e/admin-connection.spec.js`
   Expected failure: Connection service not implemented

3. Implement FirebaseConnectionService:
   File: `js/firebase-connection-service.js`
   Implement: monitorConnection, reconnect, getStatus

4. Update admin/index.html:
   - Add "Hubungkan" button
   - Add status indicator
   - Wire up connection service

5. Run test — verify PASS:
   `npx playwright test tests/e2e/admin-connection.spec.js`
   Expected: PASS

6. Commit:
   `git add js/firebase-connection-service.js admin/index.html tests/e2e/admin-connection.spec.js`
   `git commit -m "feat(admin): add Firebase connection monitoring and reconnect"`

## REFERENCES LOADED
- docs/pocket/spec/2026-06-15-admin-dashboard-enhancement/admin-dashboard-enhancement.md — Story 1
- admin/index.html — Current connection status implementation

## WHY THIS APPROACH
Complexity: lightweight
Justification: Reusable connection service, clean separation

## SANDWICH CONTEXT
[CRITICAL: Reconnect must not create duplicate listeners]
You are implementing FirebaseConnectionService for Admin Dashboard Enhancement.
Spec: docs/pocket/spec/2026-06-15-admin-dashboard-enhancement/admin-dashboard-enhancement.md
Design decision: Single-page CRUD with inline editing
Files in scope: js/firebase-connection-service.js, admin/index.html, tests/e2e/admin-connection.spec.js
Test framework: Playwright (E2E)
Available after: T1
Architecture rule: IIFE modules, window.ModuleName pattern
[RESTATE: Reconnect must not create duplicate listeners]

## DELIVERABLE
Verification — task is DONE when all pass:

Given connected, When page loads, Then status "Terhubung" (green)
Given disconnected, When page loads, Then status "Terputus" (red) + "Hubungkan" button
Given disconnected, When clicks "Hubungkan", Then reconnects and status updates

All tests PASS. Commit exists.

Format: DONE

## QUALITY BAR
Must-have:
  - Debounce on reconnect button
  - Clean up old listeners before re-register
  - Visual feedback during reconnect

Must-not-have:
  - Multiple .info/connected listeners
  - Blocking UI during reconnect

## STOP CONDITIONS
Done when: connection tests pass
Escalate when: Firebase SDK reconnect behavior unclear

---

### Task 4: DescriptionTemplates Module [prereq]

## OBJECTIVE
Create DescriptionTemplates module for auto-generating marketing descriptions.

Files:
- Create: `js/description-templates.js`
- Test: `tests/e2e/description-templates.spec.js`

Steps:
1. Write failing test for: Auto-generate description
   File: `tests/e2e/description-templates.spec.js`
   Test verifies: Given name "Mie Ayam Komplit" and category "Mie Ayam", When generate, Then description generated

2. Run test — verify FAIL:
   `npx playwright test tests/e2e/description-templates.spec.js`
   Expected failure: DescriptionTemplates not defined

3. Implement DescriptionTemplates:
   File: `js/description-templates.js`
   Implement: generateDescription, templates for each category

4. Run test — verify PASS:
   `npx playwright test tests/e2e/description-templates.spec.js`
   Expected: PASS

5. Commit:
   `git add js/description-templates.js tests/e2e/description-templates.spec.js`
   `git commit -m "feat(menu): add auto-generate description templates"`

## REFERENCES LOADED
- docs/pocket/spec/2026-06-15-admin-dashboard-enhancement/admin-dashboard-enhancement.md — Story 2, auto-generate description

## WHY THIS APPROACH
Complexity: lightweight
Justification: Marketing copy consistency, time-saving for admin

## SANDWICH CONTEXT
[CRITICAL: Descriptions must be plain text, max 200 chars]
You are implementing DescriptionTemplates for Admin Dashboard Enhancement.
Spec: docs/pocket/spec/2026-06-15-admin-dashboard-enhancement/admin-dashboard-enhancement.md
Design decision: Single-page CRUD with inline editing
Files in scope: js/description-templates.js, tests/e2e/description-templates.spec.js
Test framework: Playwright (E2E)
Available after: none (prereq)
Architecture rule: IIFE modules, window.ModuleName pattern
[RESTATE: Descriptions must be plain text, max 200 chars]

## DELIVERABLE
Verification — task is DONE when all pass:

Given name "Mie Ayam Komplit" category "Mie Ayam", When generate, Then marketing description returned
Given name "Es Teh Manis" category "Minuman", When generate, Then appropriate description returned
Given any description, Then length <= 200 chars
Given any description, Then plain text only (no HTML)

All tests PASS. Commit exists.

Format: DONE

## QUALITY BAR
Must-have:
  - Templates for all categories (Mie Ayam, Minuman, Topping, custom)
  - Max 200 chars enforcement
  - Plain text only

Must-not-have:
  - HTML in descriptions
  - Descriptions > 200 chars

## STOP CONDITIONS
Done when: description tests pass
Escalate when: template quality unclear

---

### Task 5: Admin Dashboard UI — CRUD [depends: T2, T3, T4]

## OBJECTIVE
Implement admin dashboard UI with create form, inline editing, and delete with confirmation.

Files:
- Modify: `admin/index.html`
- Modify: `css/admin.css`
- Test: `tests/e2e/admin-menu-crud.spec.js`

Steps:
1. Write failing test for: Create menu form
   File: `tests/e2e/admin-menu-crud.spec.js`
   Test verifies: Given admin clicks "Tambah Menu", When fills form and submits, Then menu created

2. Run test — verify FAIL:
   `npx playwright test tests/e2e/admin-menu-crud.spec.js`
   Expected failure: Create form not found

3. Implement create form:
   - Add "Tambah Menu" button
   - Add modal form with name, category, price, description fields
   - Wire up MenuService.createMenu

4. Write failing test for: Inline editing
   Test verifies: Given admin clicks name, When edits and saves, Then menu updated

5. Implement inline editing:
   - Click on name/price/description opens inline input
   - Blur/Enter saves via MenuService.updateMenu

6. Write failing test for: Delete with confirmation
   Test verifies: Given admin clicks delete, When confirms, Then menu deleted

7. Implement delete:
   - Delete button on each item
   - Confirmation dialog (native confirm())
   - MenuService.deleteMenu on confirm

8. Run all tests — verify PASS:
   `npx playwright test tests/e2e/admin-menu-crud.spec.js`
   Expected: PASS

9. Commit:
   `git add admin/index.html css/admin.css tests/e2e/admin-menu-crud.spec.js`
   `git commit -m "feat(admin): add CRUD UI with inline editing and delete confirmation"`

## REFERENCES LOADED
- docs/pocket/spec/2026-06-15-admin-dashboard-enhancement/admin-dashboard-enhancement.md — Story 2, 3, 4
- js/menu-service.js — Task 2 output
- js/firebase-connection-service.js — Task 3 output
- js/description-templates.js — Task 4 output

## WHY THIS APPROACH
Complexity: standard
Justification: Single-page UI, familiar pattern, fast editing

## SANDWICH CONTEXT
[CRITICAL: Must use MenuService for all CRUD operations]
You are implementing Admin Dashboard UI for Admin Dashboard Enhancement.
Spec: docs/pocket/spec/2026-06-15-admin-dashboard-enhancement/admin-dashboard-enhancement.md
Design decision: Single-page CRUD with inline editing
Files in scope: admin/index.html, css/admin.css, tests/e2e/admin-menu-crud.spec.js
Test framework: Playwright (E2E)
Available after: T2, T3, T4
Architecture rule: IIFE modules, UI calls MenuService (not Firebase directly)
[RESTATE: Must use MenuService for all CRUD operations]

## DELIVERABLE
Verification — task is DONE when all pass:

Given admin clicks "Tambah Menu", When fills valid data, Then menu created in Firebase
Given admin clicks name, When edits and saves, Then name updated
Given admin clicks delete, When confirms, Then menu deleted
Given duplicate name, When creates, Then error shown
Given empty name, When creates, Then error shown

All tests PASS. Commit exists.

Format: DONE

## QUALITY BAR
Must-have:
  - Create form with all fields
  - Inline editing for name, price, description
  - Delete with native confirm() dialog
  - Error handling and display
  - Responsive layout

Must-not-have:
  - Direct Firebase calls from UI
  - Hardcoded menu items
  - HTML in description field

## STOP CONDITIONS
Done when: CRUD UI tests pass
Escalate when: inline editing UX unclear

---

### Task 6: DragDropService Module [prereq]

## OBJECTIVE
Create DragDropService with HTML5 drag-and-drop and arrow buttons for mobile.

Files:
- Create: `js/drag-drop-service.js`
- Test: `tests/e2e/drag-drop-service.spec.js`

Steps:
1. Write failing test for: Drag-and-drop reordering
   File: `tests/e2e/drag-drop-service.spec.js`
   Test verifies: Given items [A,B,C], When drag C to first, Then order [C,A,B]

2. Run test — verify FAIL:
   `npx playwright test tests/e2e/drag-drop-service.spec.js`
   Expected failure: DragDropService not defined

3. Implement DragDropService:
   File: `js/drag-drop-service.js`
   Implement: initDragDrop, initArrowButtons, persistOrder

4. Run test — verify PASS:
   `npx playwright test tests/e2e/drag-drop-service.spec.js`
   Expected: PASS

5. Commit:
   `git add js/drag-drop-service.js tests/e2e/drag-drop-service.spec.js`
   `git commit -m "feat(admin): add drag-and-drop and arrow button reordering"`

## REFERENCES LOADED
- docs/pocket/spec/2026-06-15-admin-dashboard-enhancement/admin-dashboard-enhancement.md — Story 5

## WHY THIS APPROACH
Complexity: standard
Justification: Native HTML5 API, no dependencies, hybrid for mobile

## SANDWICH CONTEXT
[CRITICAL: Order must persist to Firebase order field]
You are implementing DragDropService for Admin Dashboard Enhancement.
Spec: docs/pocket/spec/2026-06-15-admin-dashboard-enhancement/admin-dashboard-enhancement.md
Design decision: Single-page CRUD with inline editing
Files in scope: js/drag-drop-service.js, tests/e2e/drag-drop-service.spec.js
Test framework: Playwright (E2E)
Available after: none (prereq)
Architecture rule: IIFE modules, window.ModuleName pattern
[RESTATE: Order must persist to Firebase order field]

## DELIVERABLE
Verification — task is DONE when all pass:

Given desktop, When drags item, Then order updates visually and in Firebase
Given mobile, When clicks arrow, Then item moves and order updates
Given item at top, When clicks up, Then nothing happens (no error)
Given item at bottom, When clicks down, Then nothing happens

All tests PASS. Commit exists.

Format: DONE

## QUALITY BAR
Must-have:
  - HTML5 drag-and-drop for desktop
  - Arrow buttons for mobile (media query detection)
  - Persist order to Firebase via MenuService
  - Visual feedback during drag

Must-not-have:
  - External drag-and-drop libraries
  - Order gaps after reordering

## STOP CONDITIONS
Done when: reordering tests pass
Escalate when: mobile detection strategy unclear

---

### Task 7: Admin Dashboard UI — Ordering [depends: T6, T5]

## OBJECTIVE
Integrate drag-drop and arrow buttons into admin dashboard. Add category reordering.

Files:
- Modify: `admin/index.html`
- Modify: `css/admin.css`
- Test: `tests/e2e/admin-menu-ordering.spec.js`

Steps:
1. Write failing test for: Menu reordering in admin
   File: `tests/e2e/admin-menu-ordering.spec.js`
   Test verifies: Given admin drags item, When drops, Then order persists

2. Run test — verify FAIL:
   `npx playwright test tests/e2e/admin-menu-ordering.spec.js`
   Expected failure: Drag-drop not integrated

3. Integrate DragDropService into admin:
   - Initialize drag-drop on menu grids
   - Add arrow buttons to each item
   - Add category drag handles

4. Run test — verify PASS:
   `npx playwright test tests/e2e/admin-menu-ordering.spec.js`
   Expected: PASS

5. Commit:
   `git add admin/index.html css/admin.css tests/e2e/admin-menu-ordering.spec.js`
   `git commit -m "feat(admin): integrate menu and category reordering"`

## REFERENCES LOADED
- docs/pocket/spec/2026-06-15-admin-dashboard-enhancement/admin-dashboard-enhancement.md — Story 5
- js/drag-drop-service.js — Task 6 output

## WHY THIS APPROACH
Complexity: standard
Justification: Reuse DragDropService, consistent UX

## SANDWICH CONTEXT
[CRITICAL: Must support both menu and category reordering]
You are implementing Admin Dashboard Ordering for Admin Dashboard Enhancement.
Spec: docs/pocket/spec/2026-06-15-admin-dashboard-enhancement/admin-dashboard-enhancement.md
Design decision: Single-page CRUD with inline editing
Files in scope: admin/index.html, css/admin.css, tests/e2e/admin-menu-ordering.spec.js
Test framework: Playwright (E2E)
Available after: T5, T6
Architecture rule: Use DragDropService, not direct DOM manipulation
[RESTATE: Must support both menu and category reordering]

## DELIVERABLE
Verification — task is DONE when all pass:

Given admin drags menu item, When drops, Then order updates in Firebase
Given admin clicks arrow, When clicks, Then item moves
Given admin drags category header, When drops, Then category order updates

All tests PASS. Commit exists.

Format: DONE

## QUALITY BAR
Must-have:
  - Menu item reordering (drag + arrows)
  - Category reordering
  - Visual feedback
  - Responsive (drag on desktop, arrows on mobile)

Must-not-have:
  - Cross-category item drag (not in scope)
  - Order gaps

## STOP CONDITIONS
Done when: ordering tests pass
Escalate when: category reorder implementation unclear

---

### Task 8: Customer Dashboard Update [depends: T1, T2]

## OBJECTIVE
Update customer dashboard to read from menu/ path with dynamic categories and order-aware display.

Files:
- Modify: `js/main.js`
- Modify: `index.html`
- Test: `tests/e2e/customer-dashboard-menu.spec.js`

Steps:
1. Write failing test for: Customer reads from menu/
   File: `tests/e2e/customer-dashboard-menu.spec.js`
   Test verifies: Given menu/ has data, When customer loads page, Then menu displayed

2. Run test — verify FAIL:
   `npx playwright test tests/e2e/customer-dashboard-menu.spec.js`
   Expected failure: Still reading from old path

3. Update main.js:
   - Use MenuService.getAllMenus()
   - Render categories dynamically
   - Sort by order field

4. Update index.html:
   - Remove hardcoded menu items
   - Add dynamic rendering container

5. Run test — verify PASS:
   `npx playwright test tests/e2e/customer-dashboard-menu.spec.js`
   Expected: PASS

6. Commit:
   `git add js/main.js index.html tests/e2e/customer-dashboard-menu.spec.js`
   `git commit -m "feat(customer): read menu from Firebase with dynamic categories"`

## REFERENCES LOADED
- docs/pocket/spec/2026-06-15-admin-dashboard-enhancement/admin-dashboard-enhancement.md — Story 5
- js/menu-service.js — Task 2 output
- js/main.js — Current customer dashboard implementation

## WHY THIS APPROACH
Complexity: standard
Justification: Single source of truth (Firebase), dynamic rendering

## SANDWICH CONTEXT
[CRITICAL: Customer must read from menu/ path, not stock/]
You are implementing Customer Dashboard Update for Admin Dashboard Enhancement.
Spec: docs/pocket/spec/2026-06-15-admin-dashboard-enhancement/admin-dashboard-enhancement.md
Design decision: Single-page CRUD with inline editing
Files in scope: js/main.js, index.html, tests/e2e/customer-dashboard-menu.spec.js
Test framework: Playwright (E2E)
Available after: T1, T2
Architecture rule: Use MenuService, dynamic rendering
[RESTATE: Customer must read from menu/ path, not stock/]

## DELIVERABLE
Verification — task is DONE when all pass:

Given menu/ has items, When customer loads, Then menu displayed with categories
Given items have order field, When displayed, Then sorted by order
Given new category created in admin, When customer refreshes, Then new category appears

All tests PASS. Commit exists.

Format: DONE

## QUALITY BAR
Must-have:
  - Read from menu/ path
  - Dynamic category rendering
  - Order-aware sorting
  - Stock status badges

Must-not-have:
  - Hardcoded menu items in HTML
  - Reading from stock/ path
  - Static category list

## STOP CONDITIONS
Done when: customer dashboard tests pass
Escalate when: dynamic rendering performance unclear

---

## Plan Summary

| Task | Name | Depends | Complexity | Key Verification |
|------|------|---------|------------|-----------------|
| T1 | Data Migration | prereq | standard | Menu/ path created with order field |
| T2 | MenuService Module | T1 | standard | CRUD operations with duplicate detection |
| T3 | FirebaseConnectionService | T1 | lightweight | Connection status + reconnect button |
| T4 | DescriptionTemplates Module | prereq | lightweight | Auto-generate descriptions <= 200 chars |
| T5 | Admin Dashboard UI — CRUD | T2, T3, T4 | standard | Create, inline edit, delete with confirm |
| T6 | DragDropService Module | prereq | standard | Drag-drop + arrow buttons |
| T7 | Admin Dashboard UI — Ordering | T6, T5 | standard | Menu + category reordering |
| T8 | Customer Dashboard Update | T1, T2 | standard | Dynamic rendering from menu/ |

---

*Generated by pocket-planning on 2026-06-15*
