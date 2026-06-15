# API Reference

Base URL: `https://mie-ayam-lariska-web.web.app` (Firebase Hosting)
Authentication: None required for customer pages; Admin authentication via hardcoded credentials

---

## Overview

Mie Ayam Lariska Web is a static website with no server-side API endpoints. All data operations are performed client-side using Firebase Realtime Database SDK.

---

## Firebase Realtime Database

### Stock Data

**Path:** `/stock`

**Data Structure:**
```json
{
  "mie_ayam_mini": { "status": "available" },
  "mie_ayam_biasa": { "status": "available" },
  "mie_ayam_pangsit": { "status": "available" },
  "mie_ayam_ceker": { "status": "available" },
  "mie_ayam_bakso": { "status": "available" },
  "mie_ayam_komplit": { "status": "available" },
  "mie_ayam_sayap": { "status": "available" },
  "mie_ayam_telur_puyuh": { "status": "available" },
  "mie_ayam_tulangan": { "status": "available" },
  "mie_ayam_kepala": { "status": "available" },
  "pangsit_kuah": { "status": "available" },
  "teh_anget": { "status": "available" },
  "es_teh_manis": { "status": "available" },
  "es_jeruk_peras": { "status": "available" },
  "es_nutrisari": { "status": "available" },
  "es_tawar": { "status": "available" },
  "ceker": { "status": "available" },
  "pangsit_rebus": { "status": "available" },
  "bakso": { "status": "available" },
  "telur_puyuh": { "status": "available" },
  "kepala_ayam": { "status": "available" },
  "sayap": { "status": "available" },
  "tulangan": { "status": "available" },
  "pangsit_goreng": { "status": "available" }
}
```

**Status Values:**
| Status | Description |
|--------|-------------|
| `available` | Item is in stock |
| `limited` | Item has limited stock |
| `sold_out` | Item is out of stock |

---

## JavaScript Services

### FirebaseService

**File:** `js/firebase-config.js`

**Methods:**

| Method | Parameters | Returns | Description |
|--------|-----------|---------|-------------|
| `seedInitialStock()` | none | `Promise<void>` | Seed initial stock data to Firebase |
| `onStockChange(itemId, callback)` | `string, function` | `function` | Listen to single item stock changes |
| `onAllStockChange(callback)` | `function` | `function` | Listen to all stock changes |
| `updateStock(itemId, status)` | `string, string` | `Promise<void>` | Update stock status for a menu item |
| `updateStockWithRetry(itemId, status, maxRetries, retryDelay)` | `string, string, number, number` | `Promise<void>` | Update stock with automatic retry |
| `getStockStatus(itemId)` | `string` | `Promise<string>` | Get current stock status for a single item |
| `getAllStock()` | none | `Promise<Object>` | Get all stock data |
| `nameToStockId(name)` | `string` | `string` | Convert menu item name to stock ID |
| `isValidStockStatus(status)` | `string` | `boolean` | Validate a stock status string |

**Example:**
```javascript
// Get stock status for a menu item
FirebaseService.getStockStatus('mie_ayam_biasa').then(status => {
  console.log(status); // 'available', 'limited', or 'sold_out'
});

// Update stock status
FirebaseService.updateStock('mie_ayam_biasa', 'limited');
```

### StockService

**File:** `js/stock-service.js`

**Methods:**

| Method | Parameters | Returns | Description |
|--------|-----------|---------|-------------|
| `normalizeStockStatus(status)` | `string` | `string` | Normalize stock status string |
| `saveStockData(data)` | `Object` | `void` | Save stock data to localStorage |
| `getCachedStockData()` | none | `Object\|null` | Read cached stock data from localStorage |
| `clearStockCache()` | none | `void` | Clear all cached stock data |
| `getStockStatus(itemId, firebaseStatus)` | `string, string` | `string` | Get stock status with fallback |
| `mergeStockData(firebaseData)` | `Object` | `Object` | Merge Firebase data with cached data |
| `processFirebaseData(firebaseData)` | `Object` | `Object` | Normalize Firebase data |
| `processAndCacheFirebaseData(firebaseData)` | `Object` | `void` | Process and save to cache |
| `showErrorIndicator()` | none | `void` | Show error indicator banner |
| `hideErrorIndicator()` | none | `void` | Hide error indicator banner |
| `isUsingCachedData()` | none | `boolean` | Check if using cached data |
| `setUsingCachedData(value)` | `boolean` | `void` | Set cached data usage state |

**Example:**
```javascript
// Save stock data to localStorage
StockService.saveStockData({
  'mie_ayam_biasa': { status: 'available' },
  'mie_ayam_pangsit': { status: 'limited' }
});

// Get cached stock data
const cached = StockService.getCachedStockData();
console.log(cached);
```

### AdminAuth

**File:** `js/admin-auth.js`

**Methods:**

| Method | Parameters | Returns | Description |
|--------|-----------|---------|-------------|
| `isLoggedIn()` | none | `boolean` | Check if admin is currently logged in |
| `login(username, password)` | `string, string` | `Object` | Attempt to login with credentials |
| `logout()` | none | `void` | Logout and clear session |
| `requireAuth()` | none | `void` | Protect a page - redirect if not authenticated |
| `initLoginForm()` | none | `void` | Initialize login form handlers |

**Example:**
```javascript
// Check if admin is logged in
if (AdminAuth.isLoggedIn()) {
  console.log('Admin is logged in');
}

// Login with credentials
const result = AdminAuth.login('lariska', 'lariska123');
console.log(result); // { success: true, message: 'Login berhasil' }
```

---

## External Links

### WhatsApp Ordering

**URL Pattern:** `https://wa.me/6281364856560`

**Pre-filled Messages:**
- Paket Hemat: `Halo Mie Ayam Lariska, saya mau pesan Paket Hemat`
- Paket Favorit: `Halo Mie Ayam Lariska, saya mau pesan Paket Favorit`
- Paket Kenyang: `Halo Mie Ayam Lariska, saya mau pesan Paket Kenyang`
- Event Catering: `Halo Mie Ayam Lariska, saya mau pesan untuk acara.`

### Google Maps

**URL:** `https://maps.app.goo.gl/YjTAt7H2YGtyGfvN7`

### Instagram

**URL:** `https://www.instagram.com/mieayamlariska`

---

*Generated by vibe-document on 2026-06-15*
*Source: vibe/CODEBASE.md*
