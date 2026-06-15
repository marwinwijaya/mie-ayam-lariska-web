/**
 * Firebase Configuration for Mie Ayam Lariska
 *
 * Initializes Firebase Realtime Database connection.
 * Provides stock data management functions.
 *
 * SECURITY NOTE:
 *   Firebase Realtime Database security rules allow unauthenticated
 *   reads and writes. This is because the architecture constraint
 *   is "static files only, no server-side functions" and Firebase
 *   Authentication is not used for customers (per spec must-not-have).
 *   Admin-only write protection is enforced at the application level
 *   via client-side authentication (hardcoded credentials + localStorage).
 *   The admin page is the only entry point with write functionality.
 *
 * Architecture: Firebase client-side SDK only, no server-side functions.
 */

(function () {
  'use strict';

  // ---------------------------------------------------------------------------
  // Firebase configuration — credentials from firebase.txt
  // ---------------------------------------------------------------------------
  var firebaseConfig = {
    apiKey: 'AIzaSyCXXhBLtrRlGH-exUdEui4DPCDejKwMkzE',
    authDomain: 'mie-ayam-lariska-web.firebaseapp.com',
    projectId: 'mie-ayam-lariska-web',
    storageBucket: 'mie-ayam-lariska-web.firebasestorage.app',
    messagingSenderId: '451301198230',
    appId: '1:451301198230:web:9e8203bac802544d0875b7',
    measurementId: 'G-FPJFV1HMVD'
  };

  // ---------------------------------------------------------------------------
  // Guard: ensure Firebase compat SDK is loaded before this script
  // ---------------------------------------------------------------------------
  if (typeof firebase === 'undefined') {
    console.error(
      '[FirebaseService] Firebase SDK not loaded. ' +
      'Include firebase-app-compat.js and firebase-database-compat.js ' +
      'before firebase-config.js.'
    );
    return;
  }

  // ---------------------------------------------------------------------------
  // Initialize Firebase & get Realtime Database reference
  // ---------------------------------------------------------------------------
  firebase.initializeApp(firebaseConfig);
  var db = firebase.database();
  var stockRef = db.ref('stock');

  // ---------------------------------------------------------------------------
  // Initial stock data — all menu items default to "available"
  // Item IDs follow slug format: lowercase, underscores for spaces
  // ---------------------------------------------------------------------------
  var INITIAL_STOCK_DATA = {
    // Mie Ayam (11 items)
    'mie_ayam_mini':       { status: 'available' },
    'mie_ayam_biasa':      { status: 'available' },
    'mie_ayam_pangsit':    { status: 'available' },
    'mie_ayam_ceker':      { status: 'available' },
    'mie_ayam_bakso':      { status: 'available' },
    'mie_ayam_komplit':    { status: 'available' },
    'mie_ayam_sayap':      { status: 'available' },
    'mie_ayam_telur_puyuh':{ status: 'available' },
    'mie_ayam_tulangan':   { status: 'available' },
    'mie_ayam_kepala':     { status: 'available' },
    'pangsit_kuah':        { status: 'available' },
    // Minuman (5 items)
    'teh_anget':           { status: 'available' },
    'es_teh_manis':        { status: 'available' },
    'es_jeruk_peras':      { status: 'available' },
    'es_nutrisari':        { status: 'available' },
    'es_tawar':            { status: 'available' },
    // Topping Tambahan (8 items)
    'ceker':               { status: 'available' },
    'pangsit_rebus':       { status: 'available' },
    'bakso':               { status: 'available' },
    'telur_puyuh':         { status: 'available' },
    'kepala_ayam':         { status: 'available' },
    'sayap':               { status: 'available' },
    'tulangan':            { status: 'available' },
    'pangsit_goreng':      { status: 'available' }
  };

  // ---------------------------------------------------------------------------
  // Stock management functions
  // ---------------------------------------------------------------------------

  /**
   * Seed initial stock data to Firebase.
   * Only creates entries that do not already exist — safe to call repeatedly.
   * @returns {Promise<void>}
   */
  function seedInitialStock() {
    return stockRef.once('value').then(function (snapshot) {
      var existingData = snapshot.val();
      var updates = {};
      var hasNewEntries = false;

      Object.keys(INITIAL_STOCK_DATA).forEach(function (itemId) {
        if (!existingData || !existingData[itemId]) {
          updates[itemId] = INITIAL_STOCK_DATA[itemId];
          hasNewEntries = true;
        }
      });

      if (hasNewEntries) {
        return stockRef.update(updates);
      }
    });
  }

  /**
   * Listen to stock changes for a single menu item.
   * @param {string} itemId   - The menu item ID (slug)
   * @param {function} callback - Called with the status string
   * @returns {function} Unsubscribe function
   */
  function onStockChange(itemId, callback) {
    var itemRef = stockRef.child(itemId);

    function handler(snapshot) {
      var data = snapshot.val();
      // Per spec: null/undefined/missing status => treat as "sold_out"
      var status = (data && data.status) ? data.status : 'sold_out';
      callback(status);
    }

    itemRef.on('value', handler);

    return function unsubscribe() {
      itemRef.off('value', handler);
    };
  }

  /**
   * Listen to all stock changes at once.
   * @param {function} callback - Called with the full stock data object
   * @returns {function} Unsubscribe function
   */
  function onAllStockChange(callback) {
    function handler(snapshot) {
      var data = snapshot.val() || {};
      callback(data);
    }

    stockRef.on('value', handler);

    return function unsubscribe() {
      stockRef.off('value', handler);
    };
  }

  /**
   * Update stock status for a menu item.
   * @param {string} itemId - The menu item ID
   * @param {string} status - "available" | "limited" | "sold_out"
   * @returns {Promise<void>}
   */
  function updateStock(itemId, status) {
    return stockRef.child(itemId).set({ status: status });
  }

  /**
   * Update stock status with automatic retry on failure.
   * Retries up to maxRetries times with retryDelay ms between attempts.
   * @param {string}  itemId      - The menu item ID
   * @param {string}  status      - "available" | "limited" | "sold_out"
   * @param {number}  [maxRetries=5]   - Maximum retry attempts
   * @param {number}  [retryDelay=2000] - Delay between retries (ms)
   * @returns {Promise<void>}
   */
  function updateStockWithRetry(itemId, status, maxRetries, retryDelay) {
    maxRetries = maxRetries || 5;
    retryDelay = retryDelay || 2000;

    function attempt(retriesLeft) {
      return updateStock(itemId, status).catch(function (error) {
        if (retriesLeft > 0) {
          return new Promise(function (resolve) {
            setTimeout(resolve, retryDelay);
          }).then(function () {
            return attempt(retriesLeft - 1);
          });
        }
        throw error;
      });
    }

    return attempt(maxRetries);
  }

  /**
   * Get current stock status for a single menu item.
   * @param {string} itemId - The menu item ID
   * @returns {Promise<string>} Stock status string
   */
  function getStockStatus(itemId) {
    return stockRef.child(itemId).once('value').then(function (snapshot) {
      var data = snapshot.val();
      return (data && data.status) ? data.status : 'sold_out';
    });
  }

  /**
   * Get all stock data.
   * @returns {Promise<Object>} Full stock data object
   */
  function getAllStock() {
    return stockRef.once('value').then(function (snapshot) {
      return snapshot.val() || {};
    });
  }

  /**
   * Convert a menu item name to a stock ID (slug format).
   * "Mie Ayam Komplit" => "mie_ayam_komplit"
   * @param {string} name - Menu item display name
   * @returns {string} Slugified ID
   */
  function nameToStockId(name) {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '_');
  }

  /**
   * Validate a stock status string.
   * @param {string} status - Status to validate
   * @returns {boolean} True if status is one of: available, limited, sold_out
   */
  function isValidStockStatus(status) {
    return ['available', 'limited', 'sold_out'].indexOf(status) !== -1;
  }

  // ---------------------------------------------------------------------------
  // Expose public API via global namespace
  // ---------------------------------------------------------------------------
  window.FirebaseService = {
    config:               firebaseConfig,
    db:                   db,
    stockRef:             stockRef,
    INITIAL_STOCK_DATA:   INITIAL_STOCK_DATA,
    seedInitialStock:     seedInitialStock,
    onStockChange:        onStockChange,
    onAllStockChange:     onAllStockChange,
    updateStock:          updateStock,
    updateStockWithRetry: updateStockWithRetry,
    getStockStatus:       getStockStatus,
    getAllStock:           getAllStock,
    nameToStockId:        nameToStockId,
    isValidStockStatus:   isValidStockStatus
  };

})();
