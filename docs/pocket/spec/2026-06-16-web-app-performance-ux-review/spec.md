# Spec: Web App Performance & UX Quick Wins
Date: 2026-06-16 | Project: Mie Ayam Lariska Web | Scope confirmed: yes

---

## Problem Statement
Web app Mie Ayam Lariska memiliki fitur lengkap tapi loading performance dan first paint experience belum optimal — user di koneksi 3G mengalami blank screen 2-5 detik sebelum konten muncul, dan stok item tidak terlihat sampai Firebase terkoneksi.

## Root Tension
Site ini tidak punya build step (vanilla JS, no bundler) sehingga optimasi loading harus dilakukan tanpa mengubah arsitektur — hanya HTML attribute, CSS, dan struktur file.

## Design Decision
Option B: Complete Quick Wins — pindah script ke bawah, tambah CSS shimmer skeleton, tambah image fallback system, tampilkan "Tersedia" default, hapus error indicator, fix admin grid.

---

## Acceptance Criteria

### Story 1: Fast First Paint
Rule: All JS must load after HTML content renders
  ✓ Given HTML has scripts at bottom before `</body>`, When user opens page on 3G, Then HTML structure visible within 1 second

Rule: Menu and Packages sections show gray shimmer skeleton while loading
  ✓ Given Firebase not yet connected, When user sees menu section, Then gray shimmer skeleton placeholders appear
  ✓ Given skeleton is showing and Firebase takes 8+ seconds, When data arrives, Then skeleton swaps to real cards with "Tersedia" badges

### Story 2: Optimistic Stock Display
Rule: All items show as "Tersedia" on initial load (cache ignored)
  ✓ Given user opens page (first or repeat visit), When menu renders, Then all items show "Tersedia" badge

Rule: Stock badges update automatically when Firebase connects
  ✓ Given Firebase connects after 3 seconds, When stock data received, Then badges update to reflect actual stock
  ✓ Given Firebase reconnects after failure, When data arrives, Then badges update in place without layout shift

Rule: No error indicator shown on connection failure
  ✓ Given Firebase connection fails, When user browses menu, Then all items remain "Tersedia" with no error banner

### Story 3: Image Fallback
Rule: Missing images show cream background with noodle bowl icon
  ✓ Given menu image doesn't exist, When menu loads, Then card shows cream placeholder with 🍜 icon and menu name
  ✓ Given hero image doesn't exist, When page loads, Then hero shows cream placeholder with 🍜 icon
  ✓ Given image loads then returns 404, When error occurs, Then card shows cream placeholder (not broken image icon)

### Story 4: Admin Responsive Grid
Rule: Admin grid shows 3 columns at 768px+ breakpoint
  ✓ Given admin opens dashboard on tablet (768px+), When menu loads, Then cards display in 3 columns

### Cleanup
Rule: Remove stock error indicator entirely
  ✓ Given stock-error-indicator exists in HTML and JS, When refactoring, Then remove HTML element and JS functions entirely

---

## Key Constraints
- No build process: direct HTML/CSS/JS files
- Firebase client-side SDK only
- Mobile-first market (Indonesia, koneksi lambat)
- Static hosting (Firebase Hosting)
- Follow existing patterns: IIFE 'use strict', BEM naming

## Out-of-Scope
- Service worker / offline support
- Security audit (hardcoded credentials)
- SEO structured data (JSON-LD)
- Build tool / bundler setup
- Perubahan Firebase rules atau backend

---

## Files to Modify
| File | Changes |
|------|---------|
| `index.html` | Pindah scripts ke bawah sebelum `</body>`, tambah skeleton HTML untuk menu & packages, hapus `#stock-error-indicator` |
| `css/style.css` | Tambah shimmer skeleton styles, image fallback styles |
| `js/main.js` | Tambah skeleton-to-content transition logic, image fallback handler, hapus error indicator functions, tampilkan "Tersedia" sebagai default |
| `css/admin.css` | Fix responsive grid breakpoint ke 3 kolom di 768px+ |
| `js/stock-service.js` | Hapus `showErrorIndicator()` dan `hideErrorIndicator()` functions |

---

## Open Questions / Assumptions
- Skeleton card count harus match hard-coded HTML card count (11 Mie Ayam, 8 Topping, 5 Minuman)
- Jika menu ditambah di admin, skeleton count tidak otomatis update (trade-off diterima)

## Recommended Direction
Direction A: Quick Wins — semua perubahan CSS/HTML/JS tanpa arsitektur baru.
