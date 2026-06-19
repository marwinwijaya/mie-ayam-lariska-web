# Web App Phase 2 Improvements — Code Quality, Performance & Security

> Date: 2026-06-19
> Status: Draft
> Scope: Post-comprehensive-improvement refinements

---

## Context

Setelah menyelesaikan 12 task comprehensive improvement (security rules, ES modules, unit tests, SEO, accessibility), code review mengidentifikasi beberapa area yang masih bisa di-improve. Spec ini mencakup refinements untuk code quality, performance, dan security hardening.

**Current State:**
- ✅ Firebase security rules tightened
- ✅ ES module migration complete
- ✅ 192/200 unit tests passing
- ✅ SEO meta tags & structured data added
- ✅ Accessibility foundations (skip link, ARIA, reduced motion)

**Remaining Gaps:**
- ❌ Hardcoded admin credentials in source
- ❌ Missing input sanitization utility
- ❌ 32 console.log statements in production
- ❌ Duplicated functions across modules
- ❌ Missing image optimization (dimensions, srcset, WebP)
- ❌ Incomplete PWA manifest (no PNG icons)
- ❌ No robots.txt / sitemap.xml (actually these exist from T11)
- ❌ Mixed module patterns (some IIFE remnants)

---

## Scope Definition

### IN-SCOPE:
1. **Console.log Cleanup** — Remove or conditionalize debug logging
2. **Centralize Duplicated Code** — Extract shared utilities
3. **Image Optimization** — Add dimensions, srcset support, WebP hints
4. **Input Sanitization** — Centralized sanitizeHtml utility
5. **PWA Manifest** — Add PNG icons for installability
6. **Admin Auth Hardening** — Move credentials to environment or obfuscate

### OUT-OF-SCOPE (intentionally excluded):
- Firebase Authentication migration (too large, separate project)
- Service worker implementation (complex, needs dedicated planning)
- CSS purging (needs build step, violates static-site constraint)
- Full performance monitoring setup (needs external service)

### ARCHITECTURE CONSTRAINTS:
- Static files only (no server-side code)
- No build process (direct HTML/CSS/JS)
- Firebase client-side SDK
- Mobile-first responsive design
- BEM CSS naming convention

---

## Stories & Scenarios

### Story 1: Console.log Cleanup

**As a** developer, **I want** production code free of debug logging, **so that** the browser console is clean and no sensitive data leaks.

**Rules:**
- All console.log statements removed or wrapped in debug flag
- console.warn and console.error kept for critical issues
- Debug mode toggleable via localStorage

**Scenarios:**

```
Scenario: Production code has no debug logs
  Given the application is loaded in production
  When I open browser console
  Then no "[Main]", "[Admin]", "[packages]" debug messages appear
  And only error/warning messages for actual issues are shown

Scenario: Debug mode can be enabled
  Given I set localStorage.debug = 'true'
  When I reload the page
  Then debug messages appear in console
```

---

### Story 2: Centralize Duplicated Code

**As a** developer, **I want** shared utilities in one place, **so that** changes only need to happen once.

**Rules:**
- getStatusText() in one place (js/utils.js or on FirebaseService)
- BADGE_CONFIG in one place
- Slug generation in one place
- All modules import from shared location

**Scenarios:**

```
Scenario: getStatusText used from single source
  Given getStatusText is called from main.js
  And getStatusText is called from admin-dashboard.js
  When I change the function definition
  Then both callers use the updated version

Scenario: BADGE_CONFIG consistency
  Given BADGE_CONFIG is defined once
  When main.js renders visitor badges
  And admin-dashboard.js renders admin badges
  Then both use identical badge definitions
```

---

### Story 3: Image Optimization

**As a** visitor, **I want** images to load fast without layout shift, **so that** I can see the menu quickly.

**Rules:**
- All <img> tags have explicit width/height
- Hero image has loading="eager"
- Menu images have loading="lazy"
- Images have srcset for responsive loading

**Scenarios:**

```
Scenario: No layout shift from images
  Given the page is loading
  When images load progressively
  Then content does not jump or shift
  And CLS (Cumulative Layout Shift) < 0.1

Scenario: Responsive image loading
  Given I'm on a mobile device (375px width)
  When the page loads
  Then smaller image variants are loaded
  And bandwidth usage is optimized
```

---

### Story 4: Input Sanitization

**As a** developer, **I want** all Firebase data sanitized before rendering, **so that** XSS attacks are prevented.

**Rules:**
- Centralized sanitizeHtml() utility function
- Applied to all dynamic content from Firebase
- Handles: script tags, event handlers, javascript: URLs
- Does NOT strip legitimate HTML (bold, italic for descriptions)

**Scenarios:**

```
Scenario: XSS in menu item name
  Given a menu item has name "<script>alert('xss')</script>Mie Ayam"
  When the menu renders
  Then the script tag is escaped
  And only "Mie Ayam" is visible

Scenario: XSS in package description
  Given a package has description "<img onerror=alert(1)>Enak"
  When packages render
  Then the onerror handler is stripped
  And only "Enak" is visible
```

---

### Story 5: PWA Manifest Completion

**As a** mobile user, **I want** to install the app on my home screen, **so that** I can access it quickly.

**Rules:**
- Manifest has 192x192 and 512x512 PNG icons
- At least one icon has purpose: "maskable"
- Manifest has correct name, short_name, theme_color
- App is installable (passes Lighthouse PWA audit)

**Scenarios:**

```
Scenario: App is installable on Android
  Given I visit the site on Chrome Android
  When I tap "Add to Home Screen"
  Then the app installs with correct icon
  And opens in standalone mode

Scenario: Maskable icon displays correctly
  Given the app is installed
  When Android applies adaptive icon mask
  Then the icon displays without cropping issues
```

---

### Story 6: Admin Auth Hardening

**As a** site owner, **I want** admin credentials harder to discover, **so that** casual users cannot access the dashboard.

**Rules:**
- Credentials not in plaintext in source
- Simple obfuscation (base64 + salt) — NOT full security
- Login still works as before
- Session expiry still works

**Scenarios:**

```
Scenario: Credentials not visible in source
  Given I view the admin-auth.js source
  When I search for "lariska123"
  Then the password is not found in plaintext

Scenario: Login still works
  Given I'm on the admin login page
  When I enter correct credentials
  Then I'm authenticated and redirected to dashboard
```

---

## Acceptance Criteria

```
ACCEPTANCE CRITERIA — Phase 2 Improvements
Date: 2026-06-19 | Scope confirmed: pending

Rule: Console.log Cleanup
  ✓ Given production build, When loaded, Then no debug logs appear
  ✓ Given localStorage.debug='true', When reloaded, Then debug logs appear
  ✗ Given production build, When loaded, Then console shows debug messages

Rule: Centralized Utilities
  ✓ Given getStatusText changed, When called from any module, Then new version used
  ✓ Given BADGE_CONFIG changed, When rendered anywhere, Then new config used
  ✗ Given utility changed, When called, Then old version still used (duplication)

Rule: Image Optimization
  ✓ Given any <img>, When inspected, Then has width/height attributes
  ✓ Given mobile viewport, When loading, Then responsive image loaded
  ✗ Given page load, When images load, Then layout shifts (CLS > 0.1)

Rule: Input Sanitization
  ✓ Given XSS payload in Firebase data, When rendered, Then script escaped
  ✓ Given legitimate HTML in description, When rendered, Then preserved
  ✗ Given script tag in data, When rendered, Then script executes

Rule: PWA Manifest
  ✓ Given manifest.json, When inspected, Then has 192x192 and 512x512 icons
  ✓ Given Android device, When "Add to Home Screen", Then installs correctly
  ✗ Given manifest, When checked, Then missing required icon sizes

Rule: Admin Auth Hardening
  ✓ Given admin-auth.js source, When searched, Then no plaintext password
  ✓ Given correct credentials, When login, Then authentication succeeds
  ✗ Given source code, When viewed, Then credentials visible in plaintext
```

---

## Design Decisions

### Option A: Minimal Quick Wins (Recommended)
- Console.log cleanup with debug flag
- Simple utility extraction (js/utils.js)
- Image dimension attributes only
- Base64 credential obfuscation
- PNG icon generation

**Pros:** Low effort, high impact, maintains static-site constraint
**Cons:** Not full optimization (no srcset, no service worker)

### Option B: Moderate Improvements
- Everything in Option A
- Full srcset implementation
- WebP image conversion
- Comprehensive sanitizeHtml with DOMPurify

**Pros:** Better performance, stronger security
**Cons:** More effort, needs image conversion tools

### Option C: Full Modern Web
- Everything in Option B
- Service worker implementation
- CSS purging build step
- Firebase Authentication migration

**Pros:** Production-grade, fully modern
**Cons:** Violates static-site constraint, high complexity

**Recommendation:** Option A — best effort-to-impact ratio, maintains architecture constraints.

---

## Open Questions

1. **Image optimization scope** — Should we add srcset (requires multiple image sizes) or just dimensions?
   - *Assumption:* Just dimensions for now (minimal effort)

2. **Credential obfuscation** — Is base64 obfuscation sufficient or do we need Firebase Auth?
   - *Assumption:* Base64 obfuscation is sufficient for now (casual deterrent)

3. **Debug mode** — Should debug logs be toggleable or completely removed?
   - *Assumption:* Toggleable via localStorage for development

---

## Out-of-Scope Reminders (for Planning)

- Firebase Authentication migration → separate project
- Service worker → needs dedicated planning session
- CSS purging → requires build step, breaks static-site model
- Performance monitoring → needs external service (Vercel Analytics, etc.)

---

*Spec created: 2026-06-19*
*Ready for pocket-planning handoff*
