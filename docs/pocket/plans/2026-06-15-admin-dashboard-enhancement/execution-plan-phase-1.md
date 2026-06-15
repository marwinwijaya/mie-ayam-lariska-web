# Admin Dashboard Enhancement — Data Migration (Phase 1 of 2)

**Date:** 2026-06-15
**Original plan:** docs/pocket/plans/2026-06-15-admin-dashboard-enhancement/execution-plan.md
**Prerequisite:** None (first phase)
**Contains tasks:** {T1, T4, T6}
**Unlocks next:** Phase 2

---

## Task List

Total: 3 tasks | Prerequisite phases must be complete before starting

T1: Data Migration [prereq]
T4: DescriptionTemplates Module [prereq]
T6: DragDropService Module [prereq]

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

## Phase Completion Gate

DONE when ALL of the following:
- Every task in this phase: status DONE
- All tests pass
- All commits created with correct format
- No task has status BLOCKED or NEEDS_CONTEXT

Hand off to Phase 2 ONLY after this gate passes.
