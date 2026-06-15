# Task List — Mie Ayam Lariska Web App

**Total:** 12 tasks | Dependency order is recommended — pocket-development enforces execution

## Task List

**T1: Project Setup** [prereq]
- Initialize project structure
- Create package.json with Playwright dependencies
- Create playwright.config.js
- Create .gitignore
- Create basic directory structure

**T2: Firebase Configuration** [depends: T1]
- Set up Firebase project (requires actual credentials)
- Create Firebase Realtime Database structure
- Configure security rules for read/write access
- Create initial stock data for all menu items

**T3: Customer Dashboard HTML/CSS** [depends: T1]
- Create index.html with all sections (hero, menu, packages, events, location, FAQ, footer)
- Create css/style.css with mobile-first design and brand colors
- Implement responsive layout
- Add SEO meta tags and Open Graph

**T4: Menu Rendering Logic** [depends: T3]
- Create js/menu-renderer.js
- Read menu data from datasource.json
- Render menu cards with images, names, descriptions, prices
- Group items by category (Mie Ayam, Minuman, Topping Tambahan)
- Handle missing data with placeholders

**T5: WhatsApp Integration** [depends: T4]
- Create js/whatsapp-helper.js
- Implement WhatsApp URL generation with proper encoding
- Convert local phone number to international format
- Add click handlers to menu card buttons
- Test WhatsApp redirect for menu items, packages, and events

**T6: Stock Service with Caching** [depends: T1]
- Create js/stock-service.js
- Implement localStorage caching for stock data
- Create fallback logic for Firebase failures
- Implement error indicator for cached data
- Handle missing stock entries (default to "available")

**T7: Firebase Stock Integration** [depends: T2, T6]
- Create js/firebase-service.js
- Initialize Firebase with config
- Implement real-time stock listeners
- Sync stock data between Firebase and localStorage
- Handle partial data fetches

**T8: Admin Login Page** [depends: T1]
- Create admin/login.html
- Create js/admin-auth.js
- Implement hardcoded authentication (lariska/lariska123)
- Use localStorage for session persistence
- Add logout functionality

**T9: Admin Dashboard** [depends: T8]
- Create admin/index.html
- Create css/admin.css
- Display stock summary (total, available, limited, sold out)
- Create stock table with all menu items
- Add category filter
- Add stock status update buttons

**T10: Admin Stock Update Logic** [depends: T9, T7]
- Create js/admin-dashboard.js
- Implement stock status update to Firebase
- Add retry logic (5 attempts) for failed updates
- Show "Menyimpan..." indicator during save
- Show error message after 5 failed attempts

**T11: E2E Tests** [depends: T3, T4, T5, T6, T7, T8, T9, T10]
- Create tests/e2e/customer-dashboard.spec.js
- Create tests/e2e/admin-dashboard.spec.js
- Create tests/e2e/whatsapp-redirect.spec.js
- Test customer flows (view menu, check stock, order via WhatsApp)
- Test admin flows (login, update stock, logout)
- Test error scenarios (Firebase failure, invalid login)

**T12: Deployment Configuration** [depends: T3, T4, T5, T6, T7, T8, T9, T10]
- Configure for GitHub Pages deployment
- Update README.md with setup instructions
- Create deployment documentation
- Test deployment to GitHub Pages

## Parallelizable Groups

**After T1:** T2, T3, T6, T8 can run concurrently (no dependencies between them)
**After T3:** T4 can start
**After T4:** T5 can start
**After T2 + T6:** T7 can start
**After T8:** T9 can start
**After T9 + T7:** T10 can start
**After all implementation:** T11, T12 can run concurrently

## Dependency Graph
```
T1 → T2, T3, T6, T8 (parallel)
T3 → T4 → T5
T2 + T6 → T7
T8 → T9 → T10
T7 + T9 → T10
T3, T4, T5, T6, T7, T8, T9, T10 → T11, T12 (parallel)
```