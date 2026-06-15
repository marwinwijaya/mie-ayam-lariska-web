# File Structure Mapping

## Customer Dashboard Files
- **Create:** `index.html` - Main customer dashboard with hero, menu sections, packages, event orders, location, FAQ, footer
- **Create:** `css/style.css` - Customer dashboard styles (mobile-first, brand colors)
- **Create:** `js/menu-renderer.js` - Render menu items from datasource.json with stock status
- **Create:** `js/firebase-service.js` - Firebase initialization and stock data operations
- **Create:** `js/whatsapp-helper.js` - Generate WhatsApp URLs with proper encoding
- **Create:** `js/stock-service.js` - Stock caching with localStorage, fallback logic
- **Create:** `js/main.js` - Main entry point for customer dashboard

## Admin Dashboard Files
- **Create:** `admin/index.html` - Admin dashboard with stock management
- **Create:** `admin/login.html` - Admin login page
- **Create:** `css/admin.css` - Admin dashboard styles
- **Create:** `js/admin-auth.js` - Hardcoded authentication with localStorage
- **Create:** `js/admin-dashboard.js` - Admin dashboard logic (stock updates)

## Shared Files
- **Create:** `datasource.json` - Already exists, will be used as-is
- **Create:** `firebase.txt` - Needs actual Firebase config (currently empty)
- **Create:** `images/` - Directory for placeholder images
- **Create:** `images/placeholder-mie-ayam.svg` - Placeholder for Mie Ayam category
- **Create:** `images/placeholder-minuman.svg` - Placeholder for Minuman category
- **Create:** `images/placeholder-topping.svg` - Placeholder for Topping category

## Test Files
- **Create:** `tests/e2e/customer-dashboard.spec.js` - E2E tests for customer flows
- **Create:** `tests/e2e/admin-dashboard.spec.js` - E2E tests for admin flows
- **Create:** `tests/e2e/whatsapp-redirect.spec.js` - E2E tests for WhatsApp redirect
- **Create:** `playwright.config.js` - Playwright configuration
- **Create:** `package.json` - Node.js package for Playwright dependencies

## Configuration Files
- **Create:** `.gitignore` - Ignore node_modules, test results
- **Create:** `README.md` - Update with project setup instructions

## File Responsibility Rules
1. Each JavaScript module has single responsibility
2. CSS files separated by dashboard (customer vs admin)
3. Test files organized by feature (customer, admin, WhatsApp)
4. No utility catch-all files
5. Firebase logic isolated in firebase-service.js
6. Authentication logic isolated in admin-auth.js