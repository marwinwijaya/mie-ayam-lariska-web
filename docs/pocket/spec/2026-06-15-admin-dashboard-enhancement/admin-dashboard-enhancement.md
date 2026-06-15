# Spec: Admin Dashboard Enhancement

> Generated: 2026-06-15
> Status: Ready for pocket-planning

---

## Problem Statement

Admin dashboard hanya bisa manage stok. Admin perlu fitur lengkap untuk manage menu termasuk CRUD, deskripsi marketing, dan urutan tampilan yang tersync dengan Firebase.

---

## Scope

### IN-SCOPE
- Connect/Reconnect button to Firebase
- CRUD menu items (Create, Read, Update, Delete)
- Menu description (auto-generate + edit, plain text, max 200 chars)
- Menu ordering with drag-and-drop (desktop) + arrow buttons (mobile)
- Custom categories support
- Hard delete with confirmation
- Duplicate menu name detection
- Order auto-initialization for existing items

### OUT-OF-SCOPE
- Menu image upload (requires Firebase Storage)
- Bulk edit functionality
- History/audit log
- HTML descriptions (security risk)
- Preview before save

---

## Architecture Constraints

- **Layers may touch:** admin UI, Firebase service, CSS
- **Layers must NOT touch:** customer-facing HTML (separate update later)
- **Patterns to follow:** IIFE modules, window.ModuleName pattern
- **No new dependencies:** use native HTML5 drag API

---

## Data Model

### Firebase Structure
```
menu/
├── mie_ayam_mini: {
│     name: "Mie Ayam Mini",
│     category: "Mie Ayam",
│     price: 5000,
│     description: "Porsi kecil, pas untuk cemilan",
│     status: "available",
│     order: 1
│   }
├── mie_ayam_biasa: {
│     name: "Mie Ayam Biasa",
│     category: "Mie Ayam",
│     price: 10000,
│     description: "Mie ayam dengan topping ayam suwir",
│     status: "available",
│     order: 2
│   }
└── ...
```

### Migration Strategy
1. Delete `stock/` path from Firebase
2. Delete `datasource.json`
3. Create `menu/` path with all data
4. Auto-initialize `order` field based on current display order
5. Update customer dashboard to read from `menu/`

---

## GWT Scenarios

### Story 1: Firebase Connection Management

```
Scenario: Show connected status
  Given admin is on dashboard page
  And Firebase connection is active
  Then status shows "Terhubung" with green indicator

Scenario: Show disconnected status
  Given admin is on dashboard page
  And Firebase connection is lost
  Then status shows "Terputus" with red indicator
  And "Hubungkan" button is visible

Scenario: Manual reconnect
  Given admin is disconnected from Firebase
  When admin clicks "Hubungkan" button
  Then system attempts to reconnect
  And status updates to "Terhubung" on success
```

### Story 2: Menu CRUD — Create

```
Scenario: Create new menu with existing category
  Given admin clicks "Tambah Menu" button
  And fills name "Mie Ayam Special"
  And selects category "Mie Ayam"
  And fills price "15000"
  When admin clicks "Simpan"
  Then menu is saved to Firebase
  And menu appears at end of "Mie Ayam" category

Scenario: Create new menu with custom category
  Given admin clicks "Tambah Menu" button
  And fills name "Paket Hemat"
  And enters new category "Paket"
  And fills price "13000"
  When admin clicks "Simpan"
  Then new category "Paket" is created
  And menu is saved to Firebase
  And menu appears in new "Paket" category

Scenario: Auto-generate description
  Given admin fills name "Mie Ayam Komplit"
  And selects category "Mie Ayam"
  When name field loses focus
  Then description auto-fills with marketing copy
  And admin can edit the description

Scenario: Validation error — missing name
  Given admin clicks "Tambah Menu" button
  And leaves name empty
  When admin clicks "Simpan"
  Then error message "Nama menu wajib diisi" is shown

Scenario: Duplicate menu name detection
  Given admin creates menu "Mie Ayam Biasa"
  And "Mie Ayam Biasa" already exists
  When admin clicks "Simpan"
  Then error "Menu dengan nama ini sudah ada" is shown
```

### Story 3: Menu CRUD — Update

```
Scenario: Edit menu name inline
  Given admin clicks on menu name "Mie Ayam Biasa"
  Then input field appears with current name
  When admin types "Mie Ayam Original" and presses Enter
  Then name is updated in Firebase
  And display shows new name

Scenario: Edit menu price inline
  Given admin clicks on menu price "10000"
  Then input field appears with current price
  When admin types "12000" and clicks outside
  Then price is updated in Firebase
  And display shows new price

Scenario: Change menu category
  Given admin edits "Mie Ayam Biasa"
  And changes category from "Mie Ayam" to "Paket"
  When admin saves changes
  Then menu moves to "Paket" category in Firebase
  And menu appears under "Paket" in admin grid

Scenario: Rename updates Firebase key
  Given admin renames "Mie Ayam Mini" to "Mie Ayam Kecil"
  When admin saves changes
  Then new entry menu/mie_ayam_kecil is created
  And old entry menu/mie_ayam_mini is deleted
  And stock status preserved
```

### Story 4: Menu CRUD — Delete

```
Scenario: Delete menu with confirmation
  Given admin clicks delete button on "Mie Ayam Mini"
  Then confirmation dialog appears "Hapus Mie Ayam Mini?"
  When admin clicks "Hapus"
  Then menu is deleted from Firebase
  And menu disappears from admin grid

Scenario: Cancel delete
  Given admin clicks delete button on "Mie Ayam Mini"
  Then confirmation dialog appears
  When admin clicks "Batal"
  Then menu is NOT deleted
  And dialog closes
```

### Story 5: Menu Ordering

```
Scenario: Reorder menu within category (desktop)
  Given admin is on desktop browser
  And "Mie Ayam" category has 3 items
  When admin drags "Mie Ayam Komplit" to first position
  Then order updates in Firebase
  And "Mie Ayam Komplit" appears first in category

Scenario: Reorder menu within category (mobile)
  Given admin is on mobile browser
  And "Mie Ayam" category has 3 items
  When admin taps up arrow on "Mie Ayam Komplit"
  Then "Mie Ayam Komplit" moves up one position
  And order updates in Firebase

Scenario: Reorder categories
  Given admin drags "Topping" category above "Minuman"
  Then category order updates in Firebase
  And "Topping" appears before "Minuman" on customer page

Scenario: Order initialization on first load
  Given Firebase menu/ has items without order field
  When admin opens dashboard for first time
  Then system auto-assigns order values (1, 2, 3...)
  Based on current display order
```

---

## Acceptance Criteria

### Firebase Connection
✓ Given admin is on dashboard, When connected, Then status shows "Terhubung" (green)
✓ Given admin is on dashboard, When disconnected, Then status shows "Terputus" (red) + "Hubungkan" button
✓ Given admin clicks "Hubungkan", When reconnect succeeds, Then status updates to "Terhubung"

### Menu Create
✓ Given admin fills valid data, When clicks "Simpan", Then menu saved to Firebase
✓ Given admin enters custom category, When saves, Then new category created
✓ Given admin fills name, When loses focus, Then description auto-generates
✓ Given name is empty, When clicks "Simpan", Then error shown
✓ Given name already exists, When clicks "Simpan", Then duplicate error shown

### Menu Update
✓ Given admin clicks name/price, When edits, Then inline input appears
✓ Given admin changes value, When saves (blur/Enter), Then Firebase updates
✓ Given admin changes category, When saves, Then menu moves to new category

### Menu Delete
✓ Given admin clicks delete, When confirms, Then menu deleted from Firebase
✓ Given admin clicks delete, When cancels, Then menu NOT deleted

### Menu Ordering
✓ Given admin drags item (desktop), When drops, Then order updates in Firebase
✓ Given admin clicks arrow (mobile), When clicks, Then order updates in Firebase
✓ Given admin drags category, When drops, Then category order updates
✓ Given items have no order, When first load, Then auto-assigns order values

---

## Technical Approach

### New Files
- `js/menu-service.js` — CRUD operations for menu items
- `js/description-templates.js` — Auto-generate marketing descriptions

### Modified Files
- `admin/index.html` — Add CRUD interface, connection button, drag-drop
- `css/admin.css` — Styles for new features
- `js/firebase-config.js` — Update to use menu/ path, add CRUD methods
- `js/main.js` — Update customer dashboard to read from menu/
- `index.html` — Update to use dynamic menu from Firebase

### Firebase Rules Update
```json
{
  "rules": {
    "menu": {
      ".read": true,
      ".write": "auth != null || true"
    }
  }
}
```

---

## Open Questions / Assumptions

- **Assumption:** Admin auth is sufficient for write protection (no Firebase Auth needed)
- **Assumption:** 24 items is small enough for single-page UI without pagination
- **Risk:** Concurrent admin sessions could cause data conflicts (last-write-wins)

---

*Generated by pocket-grinding on 2026-06-15*
