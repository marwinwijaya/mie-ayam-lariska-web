/**
 * Stock Service — localStorage caching layer for menu stock data
 *
 * Provides offline resilience so customers can still see the menu if
 * Firebase fails.  Uses localStorage exclusively — no IndexedDB, no
 * sessionStorage, no other storage mechanism.
 *
 * Spec: docs/pocket/spec/2026-06-15-mie-ayam-lariska-web-app/
 * Architecture: Client-side only — no server-side caching
 */

'use strict';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** localStorage key for stock cache */
var CACHE_KEY = 'mie_ayam_lariska_stock';

/** Valid stock status values */
var VALID_STATUSES = ['available', 'limited', 'sold_out'];

/** Fallback status when data is missing or invalid */
var DEFAULT_STATUS = 'available';

// ---------------------------------------------------------------------------
// Normalization
// ---------------------------------------------------------------------------

/**
 * Normalize a stock status string.
 * Returns the original status if valid, otherwise "sold_out".
 *
 * Per spec:
 *   - null / undefined / missing / empty string => "sold_out"
 *   - Any string not in [available, limited, sold_out] => "sold_out"
 *
 * @param  {string|null|undefined} status - Raw status value
 * @return {string} Normalized status
 */
function normalizeStockStatus(status) {
  if (status === null || status === undefined || status === '') {
    return 'sold_out';
  }
  if (VALID_STATUSES.indexOf(status) === -1) {
    return 'sold_out';
  }
  return status;
}

// ---------------------------------------------------------------------------
// localStorage read / write
// ---------------------------------------------------------------------------

/**
 * Save stock data object to localStorage.
 * @param {Object} data - Map of item IDs to { status: string }
 */
function saveStockData(data) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
  } catch (e) {
    // localStorage may be full or disabled — fail silently
    console.warn('[StockService] Could not write to localStorage:', e);
  }
}

/**
 * Read cached stock data from localStorage.
 * @return {Object|null} Cached data or null if nothing stored
 */
function getCachedStockData() {
  try {
    var raw = localStorage.getItem(CACHE_KEY);
    if (raw === null) {
      return null;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.warn('[StockService] Could not read from localStorage:', e);
    return null;
  }
}

/**
 * Clear all cached stock data from localStorage.
 */
function clearStockCache() {
  try {
    localStorage.removeItem(CACHE_KEY);
  } catch (e) {
    console.warn('[StockService] Could not clear localStorage:', e);
  }
}

// ---------------------------------------------------------------------------
// Stock status lookup with fallback
// ---------------------------------------------------------------------------

/**
 * Get stock status for a single menu item.
 *
 * Priority:
 *   1. Firebase data (firebaseStatus parameter) — if non-null
 *   2. Normalized value from Firebase — handles typos/invalid values
 *   3. Fallback to DEFAULT_STATUS ("available") when Firebase has no entry
 *
 * Note: This function looks at Firebase data for a single item and
 * returns a normalized status.  It does NOT access the cache directly —
 * cache merging is handled by mergeStockData / processFirebaseData.
 *
 * @param  {string} itemId         - Menu item slug
 * @param  {string|null} firebaseStatus - Status from Firebase (or null if missing)
 * @return {string} Normalized stock status
 */
function getStockStatus(itemId, firebaseStatus) {
  if (firebaseStatus !== null && firebaseStatus !== undefined) {
    return normalizeStockStatus(firebaseStatus);
  }
  // No Firebase data for this item — fall back to default
  return DEFAULT_STATUS;
}

// ---------------------------------------------------------------------------
// Merge / process Firebase data with cache
// ---------------------------------------------------------------------------

/**
 * Merge Firebase data with cached data.
 *
 * For each item:
 *   - If Firebase has data, use it (normalized)
 *   - If Firebase is missing data for an item that exists in cache, keep cache
 *   - All statuses are normalized during merge
 *
 * @param  {Object} firebaseData - Data from Firebase (may be partial)
 * @return {Object} Merged stock data
 */
function mergeStockData(firebaseData) {
  var cached = getCachedStockData() || {};
  var merged = {};
  var key;

  // Start with cached data
  for (key in cached) {
    if (cached.hasOwnProperty(key)) {
      merged[key] = {
        status: normalizeStockStatus(cached[key].status)
      };
    }
  }

  // Override with Firebase data
  firebaseData = firebaseData || {};
  for (key in firebaseData) {
    if (firebaseData.hasOwnProperty(key)) {
      merged[key] = {
        status: normalizeStockStatus(
          firebaseData[key] ? firebaseData[key].status : null
        )
      };
    }
  }

  return merged;
}

/**
 * Process raw Firebase data: normalize all statuses.
 * @param  {Object} firebaseData - Raw data from Firebase
 * @return {Object} Processed data with normalized statuses
 */
function processFirebaseData(firebaseData) {
  var processed = {};
  firebaseData = firebaseData || {};

  for (var key in firebaseData) {
    if (firebaseData.hasOwnProperty(key)) {
      processed[key] = {
        status: normalizeStockStatus(
          firebaseData[key] ? firebaseData[key].status : null
        )
      };
    }
  }

  return processed;
}

/**
 * Process Firebase data, normalize, and save to cache.
 * Convenience function that combines processFirebaseData + saveStockData.
 * @param {Object} firebaseData - Raw data from Firebase
 */
function processAndCacheFirebaseData(firebaseData) {
  var processed = processFirebaseData(firebaseData);
  saveStockData(processed);
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------
var StockService = {
  // Normalization
  normalizeStockStatus:    normalizeStockStatus,

  // localStorage
  saveStockData:           saveStockData,
  getCachedStockData:      getCachedStockData,
  clearStockCache:         clearStockCache,

  // Status lookup
  getStockStatus:          getStockStatus,

  // Merge / process
  mergeStockData:          mergeStockData,
  processFirebaseData:     processFirebaseData,
  processAndCacheFirebaseData: processAndCacheFirebaseData,

  // Constants (exposed for testing)
  CACHE_KEY:               CACHE_KEY,
  DEFAULT_STATUS:          DEFAULT_STATUS
};

export { StockService };
window.StockService = StockService;
