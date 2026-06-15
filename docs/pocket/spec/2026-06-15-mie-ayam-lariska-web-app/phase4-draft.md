# Phase 4 Draft: Stories, Rules, Examples, GWT Scenarios

## Story 1: Customer views menu with stock status
As a customer, I want to view the menu with images, prices, and stock status so that I can see what's available.

### Rules:
1. Each menu item must display: image placeholder, name, description (if any), price, stock badge, and order button.
2. Stock badge must show: "Tersedia" (green), "Terbatas" (yellow), or "Habis" (red).
3. Order button must be disabled when stock status is "Habis".
4. Menu items are grouped by category: Mie Ayam, Minuman, Topping Tambahan.

### Examples:
- Rule 1 → Example A: Mie Ayam Komplit shows image, name, description "Isi ceker, pangsit, dan bakso", price "15k", stock badge "Tersedia", order button enabled.
- Rule 2 → Example B: Mie Ayam Mini shows stock badge "Terbatas" when stock is limited.
- Rule 3 → Example C: Teh Anget shows order button disabled with text "Menu Habis" when stock_status is "sold_out".
- Rule 4 → Example D: Minuman category shows Teh Anget, Es Teh Manis, etc.

### GWT Scenarios:

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

## Story 2: Customer orders via WhatsApp
As a customer, I want to click "Pesan Menu Ini" and be redirected to WhatsApp with a pre-filled message so that I can quickly order.

### Rules:
1. Clicking enabled order button opens WhatsApp URL with pre-filled message.
2. WhatsApp message format: "Halo Mie Ayam Lariska, saya mau pesan [menu name]."
3. WhatsApp number: 6281364856560.
4. If menu item is sold out, button is disabled and no redirect happens.

### Examples:
- Rule 1 → Example A: Click "Pesan Menu Ini" for Mie Ayam Komplit opens wa.me/6281364856560?text=Halo%20Mie%20Ayam%20Lariska%2C%20saya%20mau%20pesan%20Mie%20Ayam%20Komplit.
- Rule 2 → Example B: For Paket Kenyang, message is "Halo Mie Ayam Lariska, saya mau pesan Paket Kenyang."
- Rule 4 → Example C: Click disabled button for sold out item does nothing.

### GWT Scenarios:

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

## Story 3: Admin updates stock status
As an admin, I want to update stock status of menu items so that customers see real-time availability.

### Rules:
1. Admin must be authenticated to access stock update functionality.
2. Admin can set stock status to: "available", "limited", "sold_out".
3. Stock updates are saved to Firebase Realtime Database.
4. Customer dashboard reflects stock updates in real-time (or near real-time).

### Examples:
- Rule 2 → Example A: Admin changes "Mie Ayam Komplit" from "available" to "sold_out".
- Rule 3 → Example B: After update, Firebase path "stock/mie_ayam_komplit/status" is "sold_out".
- Rule 4 → Example C: Customer page updates badge from "Tersedia" to "Habis" within 5 seconds.

### GWT Scenarios:

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

## Story 4: Admin authentication
As an admin, I want to login with username and password to access the dashboard.

### Rules:
1. Admin credentials: username "lariska", password "lariska123".
2. Authentication uses Firebase Email/Password with email "lariska@mieayamlariska.com" (or similar).
3. Unauthenticated users cannot access admin dashboard.
4. Session persists until logout.

### Examples:
- Rule 1 → Example A: Login with "lariska" and "lariska123" succeeds.
- Rule 3 → Example B: Accessing /admin without login redirects to /admin/login.

### GWT Scenarios:

Scenario: Admin logs in successfully
  Given admin is on login page
  When admin enters username "lariska" and password "lariska123"
  And clicks login
  Then authentication succeeds
  And admin is redirected to dashboard

Scenario: Admin login fails
  Given admin is on login page
  When admin enters wrong password
  And clicks login
  Then authentication fails
  And error message is shown

Scenario: Unauthenticated access to admin dashboard
  Given user is not logged in
  When user navigates to /admin
  Then user is redirected to /admin/login

## Story 5: Firebase connection failure handling
As a customer, I want to see cached stock data if Firebase fails to load so that I can still view menu.

### Rules:
1. If Firebase fails to load or connect, show cached stock data from last successful fetch.
2. If no cached data exists, default all items to "available".
3. Show subtle error indicator (optional).

### Examples:
- Rule 1 → Example A: Firebase timeout, show cached stock statuses.
- Rule 2 → Example B: First visit and Firebase fails, show all items as "available".

### GWT Scenarios:

Scenario: Firebase connection fails with cache
  Given customer has previously loaded stock data
  And Firebase fails to connect
  When customer loads page
  Then cached stock data is displayed
  And menu items show correct stock badges

Scenario: Firebase connection fails without cache
  Given customer first visits site
  And Firebase fails to connect
  When customer loads page
  Then all menu items default to "available"
  And order buttons are enabled