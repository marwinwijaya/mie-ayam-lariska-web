# Phase 5: Design Proposals

Based on the GWT scenarios and constraints, here are three design options:

## Option A: Single-Page Application (SPA) with Vanilla JavaScript
**Summary:** All functionality in one `index.html` file with embedded CSS and JavaScript. Firebase SDK loaded via CDN. Admin login route handled by JavaScript showing/hiding sections.

**Scenarios satisfied:** All GWT scenarios from Stories 1-5.

**Scenarios at risk:** None.

**Tradeoffs:**
+ Simplest possible structure, no build process
+ Easy to deploy to GitHub Pages (single file)
+ Minimal dependencies
- Code becomes large and hard to maintain as features grow
- Mixing HTML, CSS, and JavaScript in one file
- No separation of concerns

**Risk:** Maintenance complexity as codebase grows.

## Option B: Multi-Page Application with Vanilla JavaScript
**Summary:** Separate HTML files for customer dashboard (`index.html`) and admin dashboard (`admin.html`). Shared JavaScript modules (`firebase-service.js`, `whatsapp-helper.js`, `stock-service.js`). CSS in separate file.

**Scenarios satisfied:** All GWT scenarios from Stories 1-5.

**Scenarios at risk:** None.

**Tradeoffs:**
+ Better separation of concerns
+ Easier to maintain and debug
+ Clear routing (/ for customer, /admin for admin)
+ Shared code via script tags
- Multiple files to manage
- Still no build process (manual script inclusion)

**Risk:** Slightly more complex deployment but still simple.

## Option C: Component-Based Vanilla JavaScript with Web Components
**Summary:** Use Custom Elements v1 for menu cards, stock badges, etc. Each component encapsulates HTML, CSS, and JavaScript. Still no frameworks.

**Scenarios satisfied:** All GWT scenarios from Stories 1-5.

**Scenarios at risk:** None.

**Tradeoffs:**
+ Best code reusability
+ Encapsulated styling and behavior
+ Modern web standards
- More complex to implement
- Browser compatibility considerations (though Web Components are well-supported)
- Overkill for this scope

**Risk:** Unnecessary complexity for a simple UMKM web app.

## Recommendation: Option B — Multi-Page Application with Vanilla JavaScript

**Reasoning:** This option balances simplicity with maintainability. It aligns with the constraints:
1. **GitHub Pages deployment:** Multiple static files work perfectly
2. **Non-technical maintenance:** Clear file structure makes updates easier
3. **Firebase integration:** Separate service modules keep Firebase logic organized
4. **Scope control:** No over-engineering, but still structured
5. **Mobile-first:** CSS can be optimized per page

The multi-page approach also naturally handles the admin/customer separation while sharing common code. This is the right level of architecture for a v1 UMKM web app.