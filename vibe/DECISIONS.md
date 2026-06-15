# DECISIONS — Mie Ayam Lariska Web

> Append-only. Every drift, scope change, tech choice — logged with full context.
> Onboarded via vibe-init on 2026-06-15. All decisions prior to this date are untracked.

---

## Decision types
- **drift** — deviated from ARCHITECTURE.md
- **blocker-resolution** — impossible; workaround found
- **tech-choice** — chose between valid approaches
- **scope-change** — added/removed via change: command
- **discovery** — unexpected finding affecting future tasks

---

## Format

### D-[ID] — [Short title]
- **Date**: · **Task**: [TASK-ID] · **Type**: [type]
- **What was planned**: · **What was done**: · **Why**:
- **Alternatives considered**: · **Impact on other tasks**:
- **Approved by**: human | agent-autonomous

---

### D-001 — Project onboarded via vibe-init
- **Date**: 2026-06-15 · **Task**: vibe-init · **Type**: discovery
- **What was planned**: N/A — legacy project, no prior vibe context
- **What was done**: Generated vibe/ scaffold from codebase analysis.
  Stack: Vanilla JS + Firebase Realtime Database + Firebase Hosting.
  Pattern: Static HTML with IIFE JavaScript modules.
  Files read: 63 files across 10 directories.
- **Why**: Retrofitting vibe-* skills framework onto existing codebase.
- **Alternatives considered**: Manual documentation (rejected — too slow and error-prone)
- **Impact on other tasks**: All vibe-* skills now operational.
  SPEC.md is provisional — verify before first vibe-review run.
- **Approved by**: human (triggered vibe-init)

---

### D-002 — Pocket workflow documentation created
- **Date**: 2026-06-15 · **Task**: pocket-grinding · **Type**: discovery
- **What was planned**: Create spec and execution plan for Mie Ayam Lariska Web
- **What was done**: Generated pocket workflow docs in docs/pocket/
  - Spec: docs/pocket/spec/2026-06-15-mie-ayam-lariska-web-app/mie-ayam-lariska-web-app.md
  - Plans: docs/pocket/plans/2026-06-15-mie-ayam-lariska-web-app/
  - Phased execution plan with 5 phases
- **Why**: Structured development workflow for feature implementation
- **Alternatives considered**: Direct implementation without planning
- **Impact on other tasks**: Development can proceed phase by phase
- **Approved by**: human (triggered pocket-grinding)

---

### D-003 — Firebase Realtime Database chosen for data storage
- **Date**: 2026-06-15 · **Task**: vibe-init · **Type**: tech-choice
- **What was planned**: N/A — observed in codebase
- **What was done**: Firebase Realtime Database for stock data storage
  - Client-side SDK only (no server-side functions)
  - Public read/write rules for stock data
  - Real-time synchronization across clients
- **Why**: Architecture constraint — static files only, no server-side functions
- **Alternatives considered**: 
  - Firebase Firestore (not used)
  - Custom backend API (violates static-only constraint)
  - LocalStorage only (no real-time sync)
- **Impact on other tasks**: All stock operations use FirebaseService
- **Approved by**: human (architecture decision)

---

### D-004 — Hardcoded admin authentication
- **Date**: 2026-06-15 · **Task**: vibe-init · **Type**: tech-choice
- **What was planned**: N/A — observed in codebase
- **What was done**: Admin authentication with hardcoded credentials
  - Username: lariska
  - Password: lariska123
  - Session stored in localStorage
- **Why**: Simple implementation for single-admin use case
- **Alternatives considered**:
  - Firebase Authentication (adds complexity)
  - Custom backend auth (violates static-only constraint)
  - Environment variables (not possible in static site)
- **Impact on other tasks**: Security review needed for production
- **Approved by**: human (current implementation)

---

### D-005 — WhatsApp-based ordering system
- **Date**: 2026-06-15 · **Task**: vibe-init · **Type**: tech-choice
- **What was planned**: N/A — observed in codebase
- **What was done**: Ordering via WhatsApp wa.me links
  - Pre-filled messages for packages
  - Direct links to WhatsApp
  - No cart or checkout system
- **Why**: Simple ordering without payment integration
- **Alternatives considered**:
  - Custom cart system (adds complexity)
  - Payment gateway integration (requires backend)
  - Form-based ordering (less convenient)
- **Impact on other tasks**: No order tracking or history
- **Approved by**: human (business decision)

---

### D-006 — Mobile-first responsive design
- **Date**: 2026-06-15 · **Task**: vibe-init · **Type**: tech-choice
- **What was planned**: N/A — observed in codebase
- **What was done**: CSS custom properties with mobile-first approach
  - BEM naming convention
  - CSS Grid and Flexbox layouts
  - Responsive breakpoints
- **Why**: Modern web development best practice
- **Alternatives considered**:
  - Desktop-first (not mobile-optimized)
  - CSS framework (adds dependency)
  - Component library (overkill for static site)
- **Impact on other tasks**: All UI components must be responsive
- **Approved by**: human (design decision)

---

### D-007 — Playwright for E2E testing
- **Date**: 2026-06-15 · **Task**: vibe-init · **Type**: tech-choice
- **What was planned**: N/A — observed in codebase
- **What was done**: Playwright E2E tests for admin login flow
  - Chromium and mobile-chrome projects
  - Local server with `npx serve`
  - HTML reporter
- **Why**: Modern E2E testing with good browser support
- **Alternatives considered**:
  - Cypress (different API)
  - Selenium (older technology)
  - Jest (unit tests only)
- **Impact on other tasks**: All features should have E2E tests
- **Approved by**: human (testing decision)

---

*Generated by vibe-init on 2026-06-15*
*Source: Codebase analysis — 63 files*
