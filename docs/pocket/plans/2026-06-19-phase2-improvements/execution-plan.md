# Execution Plan — Phase 2 Improvements

> Spec: docs/pocket/spec/2026-06-19-phase2-improvements/phase2-code-quality-performance.md
> Created: 2026-06-19
> Tasks: 6 | Quick-win focused

---

## Overview

Quick-win improvements untuk code quality, performance, dan security hardening. Dirancang sebagai 1-2 hari pengerjaan dengan impact tinggi.

---

### Task 1: Console.log Cleanup [prereq]

## OBJECTIVE
Remove atau conditionalize semua console.log debug statements di production code. Implement debug mode toggle via localStorage.

Files:
- Modify: `js/main.js`
- Modify: `js/admin-dashboard.js`
- Modify: `js/packages-renderer.js`
- Modify: `js/firebase-config.js`
- Create: `js/debug.js` (debug utility)

Steps:
1. Create debug utility module:
   File: `js/debug.js`
   ```javascript
   const DEBUG_KEY = 'mie_ayam_lariska_debug';
   
   function isDebugMode() {
     try {
       return localStorage.getItem(DEBUG_KEY) === 'true';
     } catch {
       return false;
     }
   }
   
   function debugLog(...args) {
     if (isDebugMode()) {
       console.log(...args);
     }
   }
   
   function debugWarn(...args) {
     if (isDebugMode()) {
       console.warn(...args);
     }
   }
   
   export { isDebugMode, debugLog, debugWarn };
   window.DebugUtil = { isDebugMode, debugLog, debugWarn };
   ```

2. Replace all console.log with debugLog in:
   - `js/main.js` — ~15 console.log statements
   - `js/admin-dashboard.js` — ~10 console.log statements
   - `js/packages-renderer.js` — ~5 console.log statements

3. Keep console.error for actual errors (Firebase failures, etc.)

4. Add debug toggle to admin panel (optional):
   ```javascript
   // In admin dashboard
   document.getElementById('debug-toggle').addEventListener('click', () => {
     const current = localStorage.getItem(DEBUG_KEY);
     localStorage.setItem(DEBUG_KEY, current === 'true' ? 'false' : 'true');
     location.reload();
   });
   ```

5. Test:
   - Open console in production mode → no debug logs
   - Set `localStorage.mie_ayam_lariska_debug = 'true'` → debug logs appear
   - Refresh page → debug state persists

6. Commit:
   `git add js/debug.js js/main.js js/admin-dashboard.js js/packages-renderer.js`
   `git commit -m "refactor(debug): add debug utility, conditionalize console.log statements"`

## DELIVERABLE
- No console.log output in production mode
- Debug mode toggleable via localStorage
- console.error preserved for actual errors

---

### Task 2: Centralize Duplicated Code [depends: T1]

## OBJECTIVE
Extract duplicated functions into shared utility module. Single source of truth untuk getStatusText, BADGE_CONFIG, dan slug generation.

Files:
- Create: `js/utils.js`
- Modify: `js/main.js`
- Modify: `js/admin-dashboard.js`
- Modify: `js/packages-renderer.js`

Steps:
1. Create utils.js with shared functions:
   File: `js/utils.js`
   ```javascript
   // Status text mapping
   function getStatusText(status) {
     const statusMap = {
       'available': 'Tersedia',
       'limited': 'Terbatas',
       'sold_out': 'Habis'
     };
     return statusMap[status] || 'Tersedia';
   }
   
   // Badge configuration
   const BADGE_CONFIG = {
     'favorit': { icon: '⭐', label: 'Favorit', class: 'favorit' },
     'baru': { icon: '🆕', label: 'Baru', class: 'baru' },
     'bestseller': { icon: '🔥', label: 'Best Seller', class: 'bestseller' },
     'populer': { icon: '📈', label: 'Populer', class: 'populer' }
   };
   
   // Slug generation for image paths
   function generateSlug(name) {
     return name
       .toLowerCase()
       .replace(/[^a-z0-9\s-]/g, '')
       .replace(/\s+/g, '-')
       .replace(/-+/g, '-')
       .replace(/^-|-$/g, '');
   }
   
   // Price formatting
   function formatPriceK(price) {
     return Math.round(Number(price) / 1000) + 'k';
   }
   
   function formatPrice(price) {
     return Number(price).toLocaleString('id-ID');
   }
   
   // HTML escaping (already exists in packages-renderer, move here)
   function escapeHtml(str) {
     const div = document.createElement('div');
     div.appendChild(document.createTextNode(str));
     return div.innerHTML;
   }
   
   export { 
     getStatusText, BADGE_CONFIG, generateSlug, 
     formatPriceK, formatPrice, escapeHtml 
   };
   
   // Backward compatibility
   window.AppUtils = { 
     getStatusText, BADGE_CONFIG, generateSlug, 
     formatPriceK, formatPrice, escapeHtml 
   };
   ```

2. Update main.js to import from utils:
   ```javascript
   import { getStatusText, BADGE_CONFIG, formatPriceK } from './utils.js';
   // Remove local definitions
   ```

3. Update admin-dashboard.js to import from utils:
   ```javascript
   import { getStatusText, BADGE_CONFIG, formatPriceK, formatPrice, generateSlug } from './utils.js';
   // Remove local definitions
   ```

4. Update packages-renderer.js to import from utils:
   ```javascript
   import { escapeHtml, formatPriceK } from './utils.js';
   // Remove local escapeHtml function
   ```

5. Add script tag to index.html:
   ```html
   <script defer src="js/utils.js"></script>
   <script defer src="js/main.js"></script>
   ```

6. Test:
   - All menu items render correctly
   - Admin dashboard shows correct badges
   - Packages render with correct formatting

7. Commit:
   `git add js/utils.js js/main.js js/admin-dashboard.js js/packages-renderer.js index.html admin/index.html`
   `git commit -m "refactor(utils): centralize duplicated functions into shared module"`

## DELIVERABLE
- getStatusText, BADGE_CONFIG, slug generation in one place
- All modules import from shared utils
- No duplicated code across files

---

### Task 3: Image Optimization [depends: T2]

## OBJECTIVE
Add explicit width/height attributes to all images to prevent layout shift (CLS). Add loading attributes for performance.

Files:
- Modify: `index.html`
- Modify: `admin/index.html`
- Modify: `js/main.js` (for dynamically created images)

Steps:
1. Audit all <img> tags in index.html:
   ```bash
   grep -n "<img" index.html
   ```

2. Add width/height to static images:
   ```html
   <!-- Before -->
   <img src="images/hero-mie-ayam.jpg" alt="Mie Ayam Lariska" class="hero__image-main">
   
   <!-- After -->
   <img src="images/hero-mie-ayam.jpg" alt="Mie Ayam Lariska" class="hero__image-main" 
        width="800" height="600" loading="eager">
   ```

3. Update dynamic image creation in main.js:
   ```javascript
   // In renderMenu function
   const img = document.createElement('img');
   img.src = '../images/' + slug + '.jpg';
   img.alt = item.name;
   img.loading = 'lazy';
   img.width = 300;  // Add
   img.height = 200; // Add
   img.onerror = function() { /* existing fallback */ };
   ```

4. Update admin-dashboard.js image creation similarly

5. Add CSS to handle responsive images:
   ```css
   img {
     max-width: 100%;
     height: auto;
   }
   ```

6. Test with Lighthouse:
   - CLS score < 0.1
   - No "missing image dimensions" warnings

7. Commit:
   `git add index.html admin/index.html js/main.js js/admin-dashboard.js css/style.css`
   `git commit -m "perf(images): add dimensions and loading attributes to prevent layout shift"`

## DELIVERABLE
- All images have explicit width/height
- CLS score < 0.1
- Hero image: loading="eager"
- Menu images: loading="lazy"

---

### Task 4: Input Sanitization Utility [depends: T2]

## OBJECTIVE
Create centralized sanitizeHtml utility to prevent XSS from Firebase data. Apply to all dynamic content rendering.

Files:
- Modify: `js/utils.js` (add sanitizeHtml)
- Modify: `js/main.js`
- Modify: `js/admin-dashboard.js`
- Modify: `js/packages-renderer.js`

Steps:
1. Add sanitizeHtml to utils.js:
   ```javascript
   function sanitizeHtml(str) {
     if (typeof str !== 'string') return '';
     const div = document.createElement('div');
     div.textContent = str;
     return div.innerHTML;
   }
   
   // For cases where some HTML is allowed (bold, italic)
   function sanitizeWithAllowedTags(str, allowedTags = ['b', 'i', 'strong', 'em']) {
     if (typeof str !== 'string') return '';
     
     // First escape everything
     let sanitized = sanitizeHtml(str);
     
     // Then unescape allowed tags
     allowedTags.forEach(tag => {
       const openRegex = new RegExp(`&lt;${tag}&gt;`, 'gi');
       const closeRegex = new RegExp(`&lt;/${tag}&gt;`, 'gi');
       sanitized = sanitized.replace(openRegex, `<${tag}>`);
       sanitized = sanitized.replace(closeRegex, `</${tag}>`);
     });
     
     return sanitized;
   }
   
   export { sanitizeHtml, sanitizeWithAllowedTags };
   ```

2. Apply sanitizeHtml to menu item rendering:
   ```javascript
   // In main.js renderMenu
   nameEl.textContent = sanitizeHtml(item.name);
   descEl.textContent = sanitizeHtml(item.description);
   ```

3. Apply to packages rendering:
   ```javascript
   // In packages-renderer.js
   cardHtml += '<h3 class="packages__card-name">' + sanitizeHtml(pkg.name) + '</h3>';
   ```

4. Apply to admin dashboard:
   ```javascript
   // In admin-dashboard.js
   cell.textContent = sanitizeHtml(item.name);
   ```

5. Test with XSS payloads:
   - `<script>alert('xss')</script>` → escaped
   - `<img onerror=alert(1)>` → escaped
   - `<b>Bold text</b>` → preserved (if using sanitizeWithAllowedTags)

6. Commit:
   `git add js/utils.js js/main.js js/admin-dashboard.js js/packages-renderer.js`
   `git commit -m "security(sanitize): add input sanitization utility for XSS prevention"`

## DELIVERABLE
- Centralized sanitizeHtml function
- All Firebase data sanitized before rendering
- XSS payloads properly escaped
- Legitimate HTML (bold/italic) preserved where needed

---

### Task 5: PWA Manifest Completion [depends: T3]

## OBJECTIVE
Complete PWA manifest with required icon sizes for installability.

Files:
- Modify: `manifest.json`
- Create: `images/icon-192.png`
- Create: `images/icon-512.png`
- Create: `images/icon-maskable-512.png`

Steps:
1. Generate PNG icons from existing favicon.svg:
   - Use online tool or CLI to convert SVG to PNG
   - Required sizes: 192x192, 512x512
   - Maskable icon: 512x512 with safe zone

2. Update manifest.json:
   ```json
   {
     "name": "Mie Ayam Lariska",
     "short_name": "Lariska",
     "description": "Mie Ayam Rumahan dengan Topping Lengkap",
     "start_url": "/",
     "display": "standalone",
     "background_color": "#FFF1D6",
     "theme_color": "#C40000",
     "icons": [
       {
         "src": "favicon.svg",
         "sizes": "any",
         "type": "image/svg+xml",
         "purpose": "any"
       },
       {
         "src": "images/icon-192.png",
         "sizes": "192x192",
         "type": "image/png"
       },
       {
         "src": "images/icon-512.png",
         "sizes": "512x512",
         "type": "image/png"
       },
       {
         "src": "images/icon-maskable-512.png",
         "sizes": "512x512",
         "type": "image/png",
         "purpose": "maskable"
       }
     ]
   }
   ```

3. Test with Lighthouse PWA audit:
   - "Installable" check passes
   - "Maskable icon" check passes

4. Commit:
   `git add manifest.json images/icon-*.png`
   `git commit -m "feat(pwa): add PNG icons for app installability"`

## DELIVERABLE
- manifest.json has 192x192 and 512x512 icons
- Maskable icon present
- Lighthouse PWA audit passes

---

### Task 6: Admin Auth Hardening [depends: T1]

## OBJECTIVE
Obfuscate hardcoded admin credentials to prevent casual discovery.

Files:
- Modify: `js/admin-auth.js`

Steps:
1. Encode credentials with base64 + salt:
   ```javascript
   // Before
   const ADMIN_USERNAME = 'lariska';
   const ADMIN_PASSWORD = 'lariska123';
   
   // After (simple obfuscation)
   const _0x1a2b = ['bGFyaXNrYQ==', 'bGFyaXNrYTEyMw==']; // base64 encoded
   
   function _decode(idx) {
     return atob(_0x1a2b[idx]);
   }
   
   const ADMIN_USERNAME = _decode(0);
   const ADMIN_PASSWORD = _decode(1);
   ```

2. Verify login still works

3. Test:
   - View source → password not visible as plaintext
   - Login with correct credentials → success
   - Login with wrong credentials → failure

4. Commit:
   `git add js/admin-auth.js`
   `git commit -m "security(auth): obfuscate hardcoded admin credentials"`

## DELIVERABLE
- Credentials not visible as plaintext in source
- Login functionality preserved
- Session expiry still works

---

## Execution Order

```
T1 (Console.log) ──→ T2 (Centralize Code) ──→ T3 (Images)
                                                    ↓
                                               T4 (Sanitize)
                                                    ↓
                                               T5 (PWA Manifest)
                                                    ↓
                                               T6 (Auth Hardening)
```

---

## Summary

| Task | Impact | Effort | Dependencies |
|------|--------|--------|--------------|
| T1: Console.log Cleanup | MEDIUM | LOW | None |
| T2: Centralize Code | MEDIUM | MEDIUM | T1 |
| T3: Image Optimization | HIGH | MEDIUM | T2 |
| T4: Input Sanitization | HIGH | LOW | T2 |
| T5: PWA Manifest | MEDIUM | LOW | T3 |
| T6: Auth Hardening | MEDIUM | LOW | T1 |

**Total estimated time:** 4-6 hours
**Expected impact:** Code quality +++, Performance ++, Security ++

---

*Plan created: 2026-06-19*
*6 tasks, quick-win focused*
