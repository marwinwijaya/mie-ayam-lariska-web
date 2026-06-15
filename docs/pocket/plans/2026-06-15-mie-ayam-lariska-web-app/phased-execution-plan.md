# Phased Execution Plan — Mie Ayam Lariska Web App

**Total:** 12 tasks across 3 phases | Pocket-development enforces phase sequencing

---

## Phase A: Foundation (4 tasks)
**Goal:** Set up project structure, Firebase, and basic HTML/CSS for both dashboards

### T1: Project Setup [prereq]
**Objective:** Initialize project structure and development environment
**Files:**
- Create: `package.json`
- Create: `playwright.config.js`
- Create: `.gitignore`
- Create: directory structure (`/css/`, `/js/`, `/images/`, `/tests/e2e/`, `/admin/`)
**Complexity:** Lightweight

### T2: Firebase Configuration [depends: T1]
**Objective:** Set up Firebase Realtime Database with security rules and initial data
**Files:**
- Create: `firebase.json` (Firebase configuration)
- Create: `firestore.rules` (security rules)
- Create: `js/firebase-config.js` (Firebase initialization)
**Complexity:** Standard

### T3: Customer Dashboard HTML/CSS [depends: T1]
**Objective:** Create customer-facing dashboard with all sections
**Files:**
- Create: `index.html`
- Create: `css/style.css`
**Complexity:** Standard

### T8: Admin Login Page [depends: T1]
**Objective:** Create admin login page with hardcoded authentication
**Files:**
- Create: `admin/login.html`
- Create: `css/admin.css`
- Create: `js/admin-auth.js`
**Complexity:** Lightweight

**Phase A Parallelizable:** T2, T3, T8 can run concurrently after T1

---

## Phase B: Features (5 tasks)
**Goal:** Implement menu rendering, WhatsApp integration, stock service, and admin dashboard

### T4: Menu Rendering Logic [depends: T3]
**Objective:** Render menu items from datasource.json with proper formatting
**Files:**
- Create: `js/menu-renderer.js`
- Modify: `index.html` (add script tags)
**Complexity:** Standard

### T5: WhatsApp Integration [depends: T4]
**Objective:** Add WhatsApp redirect functionality to menu cards
**Files:**
- Create: `js/whatsapp-helper.js`
- Modify: `js/menu-renderer.js` (add click handlers)
**Complexity:** Lightweight

### T6: Stock Service with Caching [depends: T1]
**Objective:** Implement stock data caching with localStorage fallback
**Files:**
- Create: `js/stock-service.js`
**Complexity:** Standard

### T9: Admin Dashboard [depends: T8]
**Objective:** Create admin dashboard for stock management
**Files:**
- Create: `admin/index.html`
- Modify: `css/admin.css` (add dashboard styles)
**Complexity:** Standard

### T10: Admin Stock Update Logic [depends: T9]
**Objective:** Implement stock update functionality with retry logic
**Files:**
- Create: `js/admin-dashboard.js`
- Modify: `admin/index.html` (add script tags)
**Complexity:** Standard

**Phase B Parallelizable:** T4 and T6 can run concurrently; T5 depends on T4; T9 and T10 are sequential

---

## Phase C: Integration (3 tasks)
**Goal:** Connect Firebase, write E2E tests, and prepare for deployment

### T7: Firebase Stock Integration [depends: T2, T6]
**Objective:** Connect stock service to Firebase Realtime Database
**Files:**
- Create: `js/firebase-service.js`
- Modify: `js/stock-service.js` (add Firebase sync)
**Complexity:** Standard

### T11: E2E Tests [depends: all Phase A & B tasks]
**Objective:** Write Playwright tests for all user flows
**Files:**
- Create: `tests/e2e/customer-dashboard.spec.js`
- Create: `tests/e2e/admin-dashboard.spec.js`
- Create: `tests/e2e/whatsapp-redirect.spec.js`
**Complexity:** Standard

### T12: Deployment Configuration [depends: all Phase A & B tasks]
**Objective:** Configure for GitHub Pages deployment
**Files:**
- Modify: `README.md` (add setup instructions)
- Create: `DEPLOY.md` (deployment guide)
**Complexity:** Lightweight

**Phase C Parallelizable:** T11 and T12 can run concurrently

---

## Execution Flow

```
Phase A: T1 → T2, T3, T8 (parallel)
Phase B: T4 (from T3), T6 (from T1) → T5 (from T4) → T9 (from T8) → T10 (from T9)
Phase C: T7 (from T2, T6) → T11, T12 (parallel)
```

## Phase Dependencies
- Phase B cannot start until Phase A is complete
- Phase C cannot start until Phase B is complete
- Within each phase, tasks can run in parallel where dependencies allow

## Quality Gates
- Phase A complete when: All 4 tasks done, project structure ready
- Phase B complete when: All 5 tasks done, core features working
- Phase C complete when: All 3 tasks done, tests passing, deployment ready