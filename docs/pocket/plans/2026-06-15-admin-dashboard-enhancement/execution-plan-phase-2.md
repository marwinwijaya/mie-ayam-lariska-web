# Admin Dashboard Enhancement — MenuService Module (Phase 2 of 2)

**Date:** 2026-06-15
**Original plan:** docs/pocket/plans/2026-06-15-admin-dashboard-enhancement/execution-plan.md
**Prerequisite:** Phase 1 must be COMPLETE — all tests green, all commits created
**Contains tasks:** {T2, T3, T5, T8, T7}
**Unlocks next:** All phases complete — proceed to final validation

---

## Task List

Total: 5 tasks | Prerequisite phases must be complete before starting

T2: MenuService Module [depends: T1]
T3: FirebaseConnectionService [depends: T1]
T5: Admin Dashboard UI — CRUD [depends: T2, T3, T4]
T8: Customer Dashboard Update [depends: T1, T2]
T7: Admin Dashboard UI — Ordering [depends: T6, T5]

---

## Pocket Packets

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

## Phase Completion Gate

DONE when ALL of the following:
- Every task in this phase: status DONE
- All tests pass
- All commits created with correct format
- No task has status BLOCKED or NEEDS_CONTEXT

Hand off to (none — all phases complete) ONLY after this gate passes.
