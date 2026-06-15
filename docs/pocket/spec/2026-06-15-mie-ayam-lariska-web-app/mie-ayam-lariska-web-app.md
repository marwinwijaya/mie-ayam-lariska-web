# Mie Ayam Lariska Web App

**Date:** 2026-06-15
**Status:** draft
**Author:** pocket-pitching + pocket-grinding session
**Spec path:** docs/pocket/spec/2026-06-15-mie-ayam-lariska-web-app/mie-ayam-lariska-web-app.md

---

## Summary

Build a mobile-first web app for Mie Ayam Lariska with customer and admin dashboards. Customers can view menu with images, prices, and real-time stock status, then order via WhatsApp. Admins can update stock status from a protected dashboard. The app uses `datasource.json` for static data, Firebase Realtime Database for stock management, and deploys to GitHub Pages.

---

## Context

### Current State
Fresh repository with `datasource.json` (menu, prices, contact info), empty `firebase.txt`, and README.md. No existing code.

### Problem / Motivation
The business needs a simple web presence where customers can quickly see what's available and order via WhatsApp, while the admin can update stock without technical knowledge. Current approach (likely manual WhatsApp updates) is inefficient and doesn't scale.

### Related Areas
- `datasource.json`: All static data (menu, prices, brand info)
- Firebase Realtime Database: Dynamic stock data
- GitHub Pages: Static hosting
- WhatsApp API: Order redirect

---

## Scope

### In-Scope
- Customer dashboard with hero, menu (Mie Ayam, Minuman, Topping), packages, event orders, location, FAQ, footer
- Menu cards with images (placeholder), names, descriptions, prices, stock badges, and order buttons
- Real-time stock status from Firebase Realtime Database
- WhatsApp redirect with pre-filled messages per menu/package/event
- Google Maps and Instagram links
- Admin dashboard with simple hardcoded authentication
- Admin stock update functionality (available, limited, sold out)
- Mobile-first responsive design with brand colors
- Basic SEO meta tags and Open Graph
- Deployment to GitHub Pages

### Out-of-Scope
- Payment processing, checkout, cart, order tracking (WhatsApp only)
- Multi-user roles or complex authentication (single admin)
- Server-side logic or backend APIs (static files only)
- Data storage for customer orders (no order database)
- Analytics beyond Firebase Analytics (optional)
- Image upload or management (placeholder images)
- Multi-language support
- Progressive Web App features
- Offline functionality beyond basic caching

---

## Architecture Constraints

- Layers this work may touch: Frontend HTML/CSS/JS, Firebase client-side SDK, GitHub Pages static files
- Layers this work must NOT touch: Server-side code, databases other than Firebase, build systems requiring Node.js runtime
- Patterns that must be followed: Static-dynamic data separation (datasource.json for static, Firebase for stock), hardcoded admin authentication, mobile-first responsive design
- Architecture validation result: PASS

---

## Stories + Scenarios

### Story 1: Customer views menu with stock status
> As a customer, I want to view the menu with images, prices, and stock status so that I can see what's available.

**Rule 1: Menu item display**
- Example A: Mie Ayam Komplit shows image, name, description "Isi ceker, pangsit, dan bakso", price "15k", stock badge "Tersedia", order button enabled.
- Example B: Menu item with missing price shows "Rp -" placeholder.

**Rule 2: Stock badge display**
- Example C: Stock badge shows "Tersedia" (green), "Terbatas" (yellow), or "Habis" (red).
- Example D: Firebase returns stock status "avaiable" (typo), badge shows "Habis".

**Rule 3: Order button state**
- Example E: Order button disabled when stock status is "Habis".
- Example F: Order button enabled when stock status is "available" or "limited".

**Rule 4: Category grouping**
- Example G: Menu items grouped by category: Mie Ayam, Minuman, Topping Tambahan.

**Rule 5: Missing data handling**
- Example H: Menu item with missing name shows blank.
- Example I: Menu item with missing price shows "Rp -".

**Rule 6: Invalid stock status handling**
- Example J: Firebase returns null/undefined/missing stock_status, treat as "sold_out".

```gherkin
Scenario: Customer views available menu item
  Given customer is on dashboard
  And menu item "Mie Ayam Komplit" has stock_status "available"
  When customer scrolls to Mie Ayam section
  Then menu card shows image placeholder
  And shows name "Mie Ayam Komplit"
  And shows description "Isi ceker, pangsit, dan bakso"
  And shows price "15k"
  And shows green badge "Tersedia"
  And order button is enabled with text "Pesan Menu Ini"

Scenario: Customer views limited menu item
  Given customer is on dashboard
  And menu item "Mie Ayam Mini" has stock_status "limited"
  When customer views menu card
  Then shows yellow badge "Terbatas"
  And order button is enabled

Scenario: Customer views sold out menu item
  Given customer is on dashboard
  And menu item "Teh Anget" has stock_status "sold_out"
  When customer views menu card
  Then shows red badge "Habis"
  And order button is disabled with text "Menu Habis"

Scenario: Customer views menu categories
  Given customer is on dashboard
  When customer scrolls through page
  Then sees sections for "Mie Ayam", "Minuman", "Topping Tambahan"
  And each section shows relevant menu items

Scenario: Customer views menu item with missing price
  Given customer is on dashboard
  And menu item "Special Mie" has no price in datasource.json
  When customer views menu card
  Then shows placeholder price "Rp -"
  And other fields display normally

Scenario: Customer views menu item with missing name
  Given customer is on dashboard
  And menu item has no name in datasource.json
  When customer views menu card
  Then shows blank name
  And other fields display normally

Scenario: Customer views menu item with invalid stock status
  Given customer is on dashboard
  And menu item "Es Teh" has stock_status "avaiable" (typo) from Firebase
  When customer views menu card
  Then shows red badge "Habis"
  And order button is disabled with text "Menu Habis"

Scenario: Customer views menu item with null stock status
  Given customer is on dashboard
  And menu item "Es Teh" has stock_status null from Firebase
  When customer views menu card
  Then shows red badge "Habis"
  And order button is disabled with text "Menu Habis"
```

### Story 2: Customer orders via WhatsApp
> As a customer, I want to click "Pesan Menu Ini" and be redirected to WhatsApp with a pre-filled message so that I can quickly order.

**Rule 1: WhatsApp redirect**
- Example A: Click "Pesan Menu Ini" for Mie Ayam Komplit opens wa.me/6281364856560?text=Halo%20Mie%20Ayam%20Lariska%2C%20saya%20mau%20pesan%20Mie%20Ayam%20Komplit.

**Rule 2: Message format**
- Example B: For Paket Kenyang, message is "Halo Mie Ayam Lariska, saya mau pesan Paket Kenyang."

**Rule 3: Phone number format**
- Example C: datasource.json number "081364856560" becomes "6281364856560" in WhatsApp URL.

**Rule 4: Sold out handling**
- Example D: Click disabled button for sold out item does nothing.

**Rule 5: Special character encoding**
- Example E: Menu name "Mie Ayam & Topping" becomes "Mie%20Ayam%20%26%20Topping" in URL.

**Rule 6: Package and event ordering**
- Example F: Package "Paket Kenyang" has order button that opens WhatsApp with appropriate message.

```gherkin
Scenario: Customer orders available menu item
  Given customer is on dashboard
  And menu item "Mie Ayam Komplit" is available
  When customer clicks "Pesan Menu Ini" button
  Then browser opens WhatsApp URL with encoded message
  And message contains "Halo Mie Ayam Lariska, saya mau pesan Mie Ayam Komplit."

Scenario: Customer tries to order sold out item
  Given customer is on dashboard
  And menu item "Teh Anget" is sold out
  When customer clicks disabled "Menu Habis" button
  Then no navigation occurs
  And button remains disabled

Scenario: Customer orders menu item with special characters
  Given customer is on dashboard
  And menu item "Mie Ayam & Topping" is available
  When customer clicks "Pesan Menu Ini" button
  Then browser opens WhatsApp URL with properly encoded message
  And message contains "Mie%20Ayam%20%26%20Topping"

Scenario: Customer orders package
  Given customer is on dashboard
  And package "Paket Kenyang" is displayed
  When customer clicks order button for package
  Then browser opens WhatsApp URL with message "Halo Mie Ayam Lariska, saya mau pesan Paket Kenyang."

Scenario: Customer orders for event
  Given customer is on dashboard
  And "Pesanan Acara" section is displayed
  When customer clicks "Hubungi WhatsApp" button
  Then browser opens WhatsApp URL with message "Halo Mie Ayam Lariska, saya mau pesan untuk acara."
```

### Story 3: Admin updates stock status
> As an admin, I want to update stock status of menu items so that customers see real-time availability.

**Rule 1: Authentication required**
- Example A: Admin must be logged in to access stock update functionality.

**Rule 2: Stock status options**
- Example B: Admin can set stock status to: "available", "limited", "sold_out".

**Rule 3: Firebase persistence**
- Example C: After update, Firebase path "stock/mie_ayam_komplit/status" is "sold_out".

**Rule 4: Real-time updates**
- Example D: Customer page updates badge from "Tersedia" to "Habis" within 5 seconds.

**Rule 5: Retry on failure**
- Example E: Network error during save triggers automatic retry every 2 seconds, stops after 5 attempts.

**Rule 6: Security rules**
- Example F: Anyone can read stock data, only admin can write.

```gherkin
Scenario: Admin updates stock to sold out
  Given admin is logged in
  And menu item "Mie Ayam Komplit" is available
  When admin changes stock status to "Habis"
  And clicks save
  Then Firebase stock data updates
  And customer dashboard shows "Habis" badge
  And customer order button becomes disabled

Scenario: Admin updates stock to available
  Given admin is logged in
  And menu item "Teh Anget" is sold out
  When admin changes stock status to "Tersedia"
  And clicks save
  Then Firebase stock data updates
  And customer dashboard shows "Tersedia" badge
  And customer order button becomes enabled

Scenario: Admin stock update fails and retries
  Given admin is logged in
  And network connection is unstable
  When admin changes stock status and clicks save
  Then system automatically retries save every 2 seconds
  And shows "Menyimpan..." indicator during retry
  And stops after 5 attempts if still failing
  And shows error message "Gagal menyimpan data"

Scenario: Customer reads stock data with security rules
  Given customer is not authenticated
  When customer loads dashboard
  Then can read stock data from Firebase
  And sees current stock statuses

Scenario: Unauthorized user attempts to write stock data
  Given user is not authenticated as admin
  When user attempts to write to Firebase stock path
  Then Firebase security rules deny the write
  And error is logged
```

### Story 4: Admin authentication
> As an admin, I want to login with username and password to access the dashboard.

**Rule 1: Credentials**
- Example A: Login with "lariska" and "lariska123" succeeds.

**Rule 2: Hardcoded authentication**
- Example B: Authentication check is performed in client-side JavaScript.

**Rule 3: Login form**
- Example C: Login form shows username field, not email field.

**Route protection**
- Example D: Accessing /admin without login redirects to /admin/login.

**Rule 5: Session persistence**
- Example E: Session persists in localStorage until logout.

**Rule 6: Logout**
- Example F: Click logout clears localStorage and redirects to /admin/login.

```gherkin
Scenario: Admin logs in successfully
  Given admin is on login page
  When admin enters username "lariska" and password "lariska123"
  And clicks login
  Then client-side JavaScript validates credentials
  And sets localStorage flag "admin_logged_in" = true
  And admin is redirected to dashboard

Scenario: Admin login fails
  Given admin is on login page
  When admin enters wrong password
  And clicks login
  Then client-side JavaScript rejects credentials
  And error message "Username atau password salah" is shown

Scenario: Unauthenticated access to admin dashboard
  Given user is not logged in (no localStorage flag)
  When user navigates to /admin
  Then JavaScript checks localStorage
  And user is redirected to /admin/login

Scenario: Admin logs out
  Given admin is logged in to dashboard
  When admin clicks logout
  Then JavaScript clears localStorage flag
  And admin is redirected to /admin/login
```

### Story 5: Firebase connection failure handling
> As a customer, I want to see cached stock data if Firebase fails to load so that I can still view menu.

**Rule 1: Cached data fallback**
- Example A: Firebase timeout, show cached stock statuses.

**Rule 2: Default to available**
- Example B: First visit and Firebase fails, show all items as "available".

**Rule 3: Error indicator**
- Example C: Show mandatory error indicator "Menampilkan data terakhir".

**Rule 4: Partial data handling**
- Example D: Firebase returns data for 8 out of 10 items, use cache for remaining 2.

**Rule 5: Missing Firebase entries**
- Example E: New menu item added to datasource.json but no Firebase entry yet, shows "Tersedia".

**Rule 6: Orphaned Firebase entries**
- Example F: Firebase has stock entry for deleted menu item, ignore it.

```gherkin
Scenario: Firebase connection fails with cache
  Given customer has previously loaded stock data
  And Firebase fails to connect
  When customer loads page
  Then cached stock data is displayed
  And menu items show correct stock badges
  And shows error indicator "Menampilkan data terakhir"

Scenario: Firebase connection fails without cache
  Given customer first visits site
  And Firebase fails to connect
  When customer loads page
  Then all menu items default to "available"
  And order buttons are enabled
  And shows error indicator "Menampilkan data terakhir"

Scenario: Firebase returns partial data
  Given customer has previously loaded stock data for all items
  And Firebase returns data for only 8 out of 10 items
  When customer loads page
  Then 8 items show Firebase data
  And 2 items show cached data
  And all menu items display correctly
  And shows error indicator "Menampilkan data terakhir"

Scenario: Menu item with no Firebase stock entry
  Given customer is on dashboard
  And new menu item "Special Mie" exists in datasource.json
  And no Firebase stock entry for "Special Mie"
  When customer views menu card
  Then shows default stock status "Tersedia"
  And order button is enabled

Scenario: Orphaned Firebase stock entry
  Given customer is on dashboard
  And Firebase has stock entry for deleted menu item "Old Item"
  And "Old Item" does not exist in datasource.json
  When customer loads page
  Then orphaned entry is ignored
  And no menu card for "Old Item" appears
```

---

## Acceptance Criteria

```
Rule: Menu item display
  ✓ Given customer is on dashboard, When menu item has all fields, Then shows image, name, description, price, stock badge, order button
  ✓ Given menu item has missing price, When customer views card, Then shows "Rp -" placeholder
  ✓ Given menu item has missing name, When customer views card, Then shows blank name

Rule: Stock badge display
  ✓ Given stock_status is "available", When customer views card, Then shows green "Tersedia" badge
  ✓ Given stock_status is "limited", When customer views card, Then shows yellow "Terbatas" badge
  ✓ Given stock_status is "sold_out", When customer views card, Then shows red "Habis" badge
  ✓ Given stock_status is invalid/null/undefined, When customer views card, Then shows red "Habis" badge

Rule: Order button state
  ✓ Given stock_status is "available", When customer views card, Then order button enabled with "Pesan Menu Ini"
  ✓ Given stock_status is "sold_out", When customer views card, Then order button disabled with "Menu Habis"

Rule: WhatsApp redirect
  ✓ Given menu item is available, When customer clicks order button, Then opens WhatsApp URL with encoded message
  ✓ Given menu item is sold out, When customer clicks disabled button, Then no navigation occurs
  ✓ Given menu name has special characters, When customer clicks order button, Then message is properly URL-encoded

Rule: Package and event ordering
  ✓ Given package is displayed, When customer clicks order button, Then opens WhatsApp with package message
  ✓ Given event section is displayed, When customer clicks WhatsApp button, Then opens WhatsApp with event message

Rule: Admin authentication
  ✓ Given correct credentials, When admin logs in, Then sets localStorage flag and redirects to dashboard
  ✓ Given incorrect credentials, When admin logs in, Then shows error message
  ✓ Given not logged in, When accessing /admin, Then redirects to /admin/login
  ✓ Given logged in, When admin clicks logout, Then clears localStorage and redirects to login

Rule: Admin stock update
  ✓ Given admin logged in, When changes stock status and saves, Then Firebase updates and customer dashboard reflects change
  ✓ Given network failure, When admin saves, Then retries up to 5 times then shows error
  ✓ Given unauthorized user, When attempts to write stock, Then Firebase security rules deny

Rule: Firebase failure handling
  ✓ Given Firebase fails with cache, When customer loads page, Then shows cached data with error indicator
  ✓ Given Firebase fails without cache, When customer loads page, Then defaults to "available" with error indicator
  ✓ Given partial Firebase data, When customer loads page, Then uses cache for missing items
  ✓ Given item has no Firebase entry, When customer views card, Then defaults to "Tersedia"
  ✓ Given orphaned Firebase entry, When customer loads page, Then ignores entry
```

---

## Design Decision

**Chosen option:** Option B — Multi-Page Application with Vanilla JavaScript

**Summary:** Separate HTML files for customer dashboard (`index.html`) and admin dashboard (`admin.html`). Shared JavaScript modules (`firebase-service.js`, `whatsapp-helper.js`, `stock-service.js`). CSS in separate file.

**Rejected options:**
- Option A (Single-Page Application): Rejected because mixing all code in one file becomes hard to maintain.
- Option C (Component-Based Web Components): Rejected because unnecessary complexity for this scope.

**Key tradeoffs accepted:**
- Multiple files to manage vs. better separation of concerns
- Manual script inclusion vs. no build process requirement
- Clear routing structure vs. slight deployment complexity

---

## Open Questions / Assumptions

| Question | Resolution | Risk if Wrong |
|----------|------------|---------------|
| Firebase config from firebase.txt? | Assumed: Will need actual Firebase config (project ID, API key, etc.) | App won't connect to Firebase |
| Image placeholder strategy? | Assumed: Use simple colored boxes with text or placeholder.com | Menu looks unprofessional |
| Mobile responsiveness approach? | Assumed: CSS media queries, mobile-first design | UI breaks on phones |
| SEO implementation? | Assumed: Basic meta tags in HTML head | Low search visibility |

---

## Implementation Notes

- Firebase Realtime Database structure: `/stock/{item_id}/status` for each menu item
- Initial stock creation: When app first runs, create stock entries for all menu items with default "available"
- WhatsApp URL encoding: Use `encodeURIComponent()` for message text
- Local phone number conversion: Replace leading "0" with "62" for international format
- Cache mechanism: Use `localStorage` for stock data caching
- Admin authentication: Hardcoded JavaScript check with `localStorage` flag
- Error indicator: Simple banner "Menampilkan data terakhir" when using cached data

---

## Rollback Plan

- Revert to previous GitHub Pages deployment
- No database migrations to rollback (Firebase data can be cleared)
- No server-side components to rollback