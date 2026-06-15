# Phase 4 Draft Updated: Stories, Rules, Examples, GWT Scenarios

## Story 1: Customer views menu with stock status
As a customer, I want to view the menu with images, prices, and stock status so that I can see what's available.

### Rules:
1. Each menu item must display: image placeholder, name, description (if any), price, stock badge, and order button.
2. Stock badge must show: "Tersedia" (green), "Terbatas" (yellow), or "Habis" (red).
3. Order button must be disabled when stock status is "Habis".
4. Menu items are grouped by category: Mie Ayam, Minuman, Topping Tambahan (categories are structurally enforced by datasource.json).
5. If a menu item in `datasource.json` is missing a price, show placeholder "Rp -". If missing a name, show blank.
6. If Firebase returns a stock status that is not 'available', 'limited', or 'sold_out', or is null/undefined/missing, treat it as 'sold_out'.

### Examples:
- Rule 1 → Example A: Mie Ayam Komplit shows image, name, description "Isi ceker, pangsit, dan bakso", price "15k", stock badge "Tersedia", order button enabled.
- Rule 2 → Example B: Mie Ayam Mini shows stock badge "Terbatas" when stock is limited.
- Rule 3 → Example C: Teh Anget shows order button disabled with text "Menu Habis" when stock_status is "sold_out".
- Rule 4 → Example D: Minuman category shows Teh Anget, Es Teh Manis, etc.
- Rule 5 → Example E: Menu item with missing price shows "Rp -" as placeholder price. Menu item with missing name shows blank.
- Rule 6 → Example F: Firebase returns stock status "avaiable" (typo), badge shows "Habis". Firebase returns null, badge shows "Habis".

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
  Then sees sections for "Mie Ayam", "Minuman", "Topping Tambahan", "Lainnya"
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

## Story 2: Customer orders via WhatsApp
As a customer, I want to click "Pesan Menu Ini" and be redirected to WhatsApp with a pre-filled message so that I can quickly order.

### Rules:
1. Clicking enabled order button opens WhatsApp URL with pre-filled message.
2. WhatsApp message format: "Halo Mie Ayam Lariska, saya mau pesan [menu name]."
3. WhatsApp number in international format: 6281364856560.
4. If menu item is sold out, button is disabled and no redirect happens.
5. Menu names with special characters must be properly URL-encoded.
6. Convert local phone number format (081364856560) to international format (6281364856560) by replacing leading 0 with 62.
7. Packages and event orders also have order buttons with appropriate messages.

### Examples:
- Rule 1 → Example A: Click "Pesan Menu Ini" for Mie Ayam Komplit opens wa.me/6281364856560?text=Halo%20Mie%20Ayam%20Lariska%2C%20saya%20mau%20pesan%20Mie%20Ayam%20Komplit.
- Rule 2 → Example B: For Paket Kenyang, message is "Halo Mie Ayam Lariska, saya mau pesan Paket Kenyang."
- Rule 4 → Example C: Click disabled button for sold out item does nothing.
- Rule 5 → Example D: Menu name "Mie Ayam & Topping" becomes "Mie%20Ayam%20%26%20Topping" in URL.
- Rule 6 → Example E: datasource.json number "081364856560" becomes "6281364856560" in WhatsApp URL.
- Rule 7 → Example F: Package "Paket Kenyang" has order button that opens WhatsApp with message "Halo Mie Ayam Lariska, saya mau pesan Paket Kenyang."

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

Scenario: Customer orders menu item with special characters
  Given customer is on dashboard
  And menu item "Mie Ayam & Topping" is available
  When customer clicks "Pesan Menu Ini" button
  Then browser opens WhatsApp URL with properly encoded message
  And message contains "Mie%20Ayam%20%26%20Topping"

## Story 3: Admin updates stock status
As an admin, I want to update stock status of menu items so that customers see real-time availability.

### Rules:
1. Admin must be authenticated to access stock update functionality.
2. Admin can set stock status to: "available", "limited", "sold_out".
3. Stock updates are saved to Firebase Realtime Database.
4. Customer dashboard reflects stock updates in real-time (or near real-time).
5. If stock update fails to save to Firebase, automatically retry up to 5 times, then show error.
6. Security rules allow anyone to read stock data but only admin to write.

### Examples:
- Rule 2 → Example A: Admin changes "Mie Ayam Komplit" from "available" to "sold_out".
- Rule 3 → Example B: After update, Firebase path "stock/mie_ayam_komplit/status" is "sold_out".
- Rule 4 → Example C: Customer page updates badge from "Tersedia" to "Habis" within 5 seconds.
- Rule 5 → Example D: Network error during save triggers automatic retry every 2 seconds, stops after 5 attempts.

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

## Story 4: Admin authentication
As an admin, I want to login with username and password to access the dashboard.

### Rules:
1. Admin credentials: username "lariska", password "lariska123".
2. Authentication is hardcoded in JavaScript (no Firebase Auth).
3. Login form collects username (not email).
4. Unauthenticated users cannot access admin dashboard.
5. Session persists in localStorage until logout.
6. Logout clears localStorage and redirects to login page.

### Examples:
- Rule 1 → Example A: Login with "lariska" and "lariska123" succeeds.
- Rule 2 → Example B: Authentication check is performed in client-side JavaScript.
- Rule 3 → Example C: Login form shows username field, not email field.
- Rule 4 → Example D: Accessing /admin without login redirects to /admin/login.
- Rule 6 → Example E: Click logout clears localStorage and redirects to /admin/login.

### GWT Scenarios:

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

## Story 5: Firebase connection failure handling
As a customer, I want to see cached stock data if Firebase fails to load so that I can still view menu.

### Rules:
1. If Firebase fails to load or connect, show cached stock data from last successful fetch.
2. If no cached data exists, default all items to "available".
3. Show subtle error indicator (mandatory, e.g., "Menampilkan data terakhir").
4. If Firebase returns partial data (some items load, others fail), use cached data for failed items.
5. Items in datasource.json with no Firebase stock entry default to "available".
6. Orphaned Firebase stock entries (not matching any datasource.json item) are silently ignored.

### Examples:
- Rule 1 → Example A: Firebase timeout, show cached stock statuses.
- Rule 2 → Example B: First visit and Firebase fails, show all items as "available".
- Rule 4 → Example C: Firebase returns data for 8 out of 10 items, use cache for remaining 2.
- Rule 5 → Example D: New menu item added to datasource.json but no Firebase entry yet, shows "Tersedia".
- Rule 6 → Example E: Firebase has stock entry for deleted menu item, ignore it.

### GWT Scenarios:

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