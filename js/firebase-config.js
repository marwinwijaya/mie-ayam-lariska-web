/**
 * Firebase Configuration for Mie Ayam Lariska
 *
 * Initializes Firebase Realtime Database connection.
 * Provides menu data management functions.
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
    databaseURL: 'https://mie-ayam-lariska-web-default-rtdb.asia-southeast1.firebasedatabase.app',
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
  var menuRef = db.ref('menu');
  var packagesRef = db.ref('packages');

  // ---------------------------------------------------------------------------
  // Initial menu data — all menu items with full data structure
  // Item IDs follow slug format: lowercase, underscores for spaces
  // ---------------------------------------------------------------------------
  var INITIAL_MENU_DATA = {
    // Mie Ayam (11 items)
    'mie_ayam_mini': {
      name: 'Mie Ayam Mini',
      category: 'Mie Ayam',
      price: 5000,
      description: 'Porsi kecil, pas untuk cemilan. Mie ayam dengan topping ayam suwir yang gurih.',
      status: 'available',
      order: 1
    },
    'mie_ayam_biasa': {
      name: 'Mie Ayam Biasa',
      category: 'Mie Ayam',
      price: 10000,
      description: 'Mie ayam klasik dengan topping ayam suwir, pangsit rebus, dan sayuran segar.',
      status: 'available',
      order: 2
    },
    'mie_ayam_pangsit': {
      name: 'Mie Ayam Pangsit',
      category: 'Mie Ayam',
      price: 12000,
      description: 'Mie ayam dengan pangsit goreng renyah dan pangsit rebus yang lembut.',
      status: 'available',
      order: 3
    },
    'mie_ayam_ceker': {
      name: 'Mie Ayam Ceker',
      category: 'Mie Ayam',
      price: 12000,
      description: 'Mie ayam dengan ceker ayam yang empuk dan bumbu meresap.',
      status: 'available',
      order: 4
    },
    'mie_ayam_bakso': {
      name: 'Mie Ayam Bakso',
      category: 'Mie Ayam',
      price: 12000,
      description: 'Mie ayam dengan bakso sapi yang kenyal dan gurih.',
      status: 'available',
      order: 5
    },
    'mie_ayam_komplit': {
      name: 'Mie Ayam Komplit',
      category: 'Mie Ayam',
      price: 15000,
      description: 'Mie ayam komplit dengan ceker, pangsit, dan bakso. Porsi kenyang!',
      status: 'available',
      order: 6
    },
    'mie_ayam_sayap': {
      name: 'Mie Ayam Sayap',
      category: 'Mie Ayam',
      price: 13000,
      description: 'Mie ayam dengan sayap ayam goreng yang renyah dan gurih.',
      status: 'available',
      order: 7
    },
    'mie_ayam_telur_puyuh': {
      name: 'Mie Ayam Telur Puyuh',
      category: 'Mie Ayam',
      price: 12000,
      description: 'Mie ayam dengan telur puyuh yang lembut dan bergizi.',
      status: 'available',
      order: 8
    },
    'mie_ayam_tulangan': {
      name: 'Mie Ayam Tulangan',
      category: 'Mie Ayam',
      price: 13000,
      description: 'Mie ayam dengan tulangan ayam yang empuk dan bumbu meresap.',
      status: 'available',
      order: 9
    },
    'mie_ayam_kepala': {
      name: 'Mie Ayam Kepala',
      category: 'Mie Ayam',
      price: 12000,
      description: 'Mie ayam dengan kepala ayam yang gurih dan lezat.',
      status: 'available',
      order: 10
    },
    'pangsit_kuah': {
      name: 'Pangsit Kuah',
      category: 'Mie Ayam',
      price: 10000,
      description: 'Pangsit rebus dalam kuah kaldu ayam yang hangat dan gurih.',
      status: 'available',
      order: 11
    },
    // Minuman (5 items)
    'teh_anget': {
      name: 'Teh Anget',
      category: 'Minuman',
      price: 2000,
      description: 'Teh hangat manis, pas untuk menemani makan mie ayam.',
      status: 'available',
      order: 12
    },
    'es_teh_manis': {
      name: 'Es Teh Manis',
      category: 'Minuman',
      price: 3000,
      description: 'Es teh manis segar, cocok untuk cuaca panas.',
      status: 'available',
      order: 13
    },
    'es_jeruk_peras': {
      name: 'Es Jeruk Peras',
      category: 'Minuman',
      price: 4000,
      description: 'Es jeruk peras segar dengan rasa manis asam yang menyegarkan.',
      status: 'available',
      order: 14
    },
    'es_nutrisari': {
      name: 'Es Nutrisari',
      category: 'Minuman',
      price: 3000,
      description: 'Es Nutrisari dengan berbagai rasa buah yang menyegarkan.',
      status: 'available',
      order: 15
    },
    'es_tawar': {
      name: 'Es Tawar',
      category: 'Minuman',
      price: 1000,
      description: 'Es tawar segar untuk yang tidak suka manis.',
      status: 'available',
      order: 16
    },
    // Topping Tambahan (8 items)
    'ceker': {
      name: 'Ceker',
      category: 'Topping Tambahan',
      price: 2000,
      description: 'Ceker ayam empuk dengan bumbu yang meresap.',
      status: 'available',
      order: 17
    },
    'pangsit_rebus': {
      name: 'Pangsit Rebus',
      category: 'Topping Tambahan',
      price: 2000,
      description: 'Pangsit rebus dengan isian ayam yang lembut.',
      status: 'available',
      order: 18
    },
    'bakso': {
      name: 'Bakso',
      category: 'Topping Tambahan',
      price: 2000,
      description: 'Bakso sapi kenyal dan gurih.',
      status: 'available',
      order: 19
    },
    'telur_puyuh': {
      name: 'Telur Puyuh',
      category: 'Topping Tambahan',
      price: 2000,
      description: 'Telur puyuh rebus yang lembut dan bergizi.',
      status: 'available',
      order: 20
    },
    'kepala_ayam': {
      name: 'Kepala Ayam',
      category: 'Topping Tambahan',
      price: 2000,
      description: 'Kepala ayam goreng yang gurih dan renyah.',
      status: 'available',
      order: 21
    },
    'sayap': {
      name: 'Sayap',
      category: 'Topping Tambahan',
      price: 3000,
      description: 'Sayap ayam goreng yang renyah dan gurih.',
      status: 'available',
      order: 22
    },
    'tulangan': {
      name: 'Tulangan',
      category: 'Topping Tambahan',
      price: 3000,
      description: 'Tulangan ayam yang empuk dan bumbu meresap.',
      status: 'available',
      order: 23
    },
    'pangsit_goreng': {
      name: 'Pangsit Goreng',
      category: 'Topping Tambahan',
      price: 2000,
      description: 'Pangsit goreng renyah dengan isian ayam.',
      status: 'available',
      order: 24
    }
  };

  // ---------------------------------------------------------------------------
  // Menu management functions
  // ---------------------------------------------------------------------------

  /**
   * Seed initial menu data to Firebase.
   * Only creates entries that do not already exist — safe to call repeatedly.
   * @returns {Promise<void>}
   */
  function seedInitialMenu() {
    return menuRef.once('value').then(function (snapshot) {
      var existingData = snapshot.val();
      var updates = {};
      var hasNewEntries = false;

      Object.keys(INITIAL_MENU_DATA).forEach(function (itemId) {
        if (!existingData || !existingData[itemId]) {
          updates[itemId] = INITIAL_MENU_DATA[itemId];
          hasNewEntries = true;
        }
      });

      if (hasNewEntries) {
        return menuRef.update(updates);
      }
    });
  }

  /**
   * Listen to menu changes for a single menu item.
   * @param {string} itemId   - The menu item ID (slug)
   * @param {function} callback - Called with the full item data
   * @returns {function} Unsubscribe function
   */
  function onMenuItemChange(itemId, callback) {
    var itemRef = menuRef.child(itemId);

    function handler(snapshot) {
      var data = snapshot.val();
      callback(data);
    }

    itemRef.on('value', handler);

    return function unsubscribe() {
      itemRef.off('value', handler);
    };
  }

  /**
   * Listen to all menu changes at once.
   * @param {function} callback - Called with the full menu data object
   * @returns {function} Unsubscribe function
   */
  function onAllMenuChange(callback) {
    function handler(snapshot) {
      var data = snapshot.val() || {};
      callback(data);
    }

    menuRef.on('value', handler);

    return function unsubscribe() {
      menuRef.off('value', handler);
    };
  }

  /**
   * Update a menu item.
   * @param {string} itemId - The menu item ID
   * @param {Object} updates - Object with fields to update
   * @returns {Promise<void>}
   */
  function updateMenuItem(itemId, updates) {
    return menuRef.child(itemId).update(updates);
  }

  /**
   * Delete a menu item.
   * @param {string} itemId - The menu item ID
   * @returns {Promise<void>}
   */
  function deleteMenuItem(itemId) {
    return menuRef.child(itemId).remove();
  }

  /**
   * Get a single menu item.
   * @param {string} itemId - The menu item ID
   * @returns {Promise<Object>} Menu item data
   */
  function getMenuItem(itemId) {
    return menuRef.child(itemId).once('value').then(function (snapshot) {
      return snapshot.val();
    });
  }

  /**
   * Get all menu data.
   * @returns {Promise<Object>} Full menu data object
   */
  function getAllMenu() {
    return menuRef.once('value').then(function (snapshot) {
      return snapshot.val() || {};
    });
  }

  /**
   * Convert a menu item name to a slug ID.
   * "Mie Ayam Komplit" => "mie_ayam_komplit"
   * @param {string} name - Menu item display name
   * @returns {string} Slugified ID
   */
  function nameToSlug(name) {
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
  function isValidStatus(status) {
    return ['available', 'limited', 'sold_out'].indexOf(status) !== -1;
  }

  /**
   * Get status display text in Indonesian.
   * @param {string} status - Status string
   * @returns {string} Display text
   */
  function getStatusText(status) {
    switch (status) {
      case 'available': return 'Tersedia';
      case 'limited': return 'Terbatas';
      case 'sold_out': return 'Habis';
      default: return 'Tersedia';
    }
  }

  // ---------------------------------------------------------------------------
  // Initial packages data — recommendation packages with full data structure
  // Package IDs follow slug format: lowercase, underscores for spaces
  // ---------------------------------------------------------------------------
  var INITIAL_PACKAGES_DATA = {
    'paket_hemat': {
      name: 'Paket Lengkap',
      description: 'Mie Ayam Biasa + Es Teh Manis',
      icon: '🍜',
      items: ['mie_ayam_biasa', 'es_teh_manis'],
      price: 13000,
      tag: 'Basic',
      isFeatured: false,
      isActive: true,
      whatsappMessage: 'Halo Mie Ayam Lariska, saya mau pesan Paket Lengkap',
      order: 1
    },
    'paket_favorit': {
      name: 'Paket Favorit',
      description: 'Mie Ayam Pangsit + Es Teh Manis',
      icon: '🔥',
      items: ['mie_ayam_pangsit', 'es_teh_manis'],
      price: 15000,
      tag: 'Best Seller',
      isFeatured: true,
      isActive: true,
      whatsappMessage: 'Halo Mie Ayam Lariska, saya mau pesan Paket Favorit',
      order: 2
    },
    'paket_kenyang': {
      name: 'Paket Kenyang',
      description: 'Mie Ayam Komplit + Es Teh Manis',
      icon: '😋',
      items: ['mie_ayam_komplit', 'es_teh_manis'],
      price: 18000,
      tag: 'Puas',
      isFeatured: false,
      isActive: true,
      whatsappMessage: 'Halo Mie Ayam Lariska, saya mau pesan Paket Kenyang',
      order: 3
    },
    'topping_suka_suka': {
      name: 'Topping Suka-Suka',
      description: 'Pilih mie ayam favoritmu, lalu tambah topping sesuai selera!',
      icon: '✨',
      items: [],
      price: 2000,
      tag: 'Custom',
      isFeatured: false,
      isActive: true,
      whatsappMessage: 'Halo Mie Ayam Lariska, saya mau pesan Paket Topping Suka-Suka',
      order: 4
    }
  };

  // ---------------------------------------------------------------------------
  // Packages management functions
  // ---------------------------------------------------------------------------

  /**
   * Seed initial packages data to Firebase.
   * Only creates entries that do not already exist — safe to call repeatedly.
   * @returns {Promise<void>}
   */
  function seedInitialPackages() {
    return packagesRef.once('value').then(function (snapshot) {
      var existingData = snapshot.val();
      var updates = {};
      var hasNewEntries = false;

      Object.keys(INITIAL_PACKAGES_DATA).forEach(function (packageId) {
        if (!existingData || !existingData[packageId]) {
          updates[packageId] = INITIAL_PACKAGES_DATA[packageId];
          hasNewEntries = true;
        }
      });

      if (hasNewEntries) {
        return packagesRef.update(updates);
      }
    });
  }

  /**
   * Add a new package.
   * @param {Object} data - Package data
   * @returns {Promise<void>}
   */
  function addPackage(data) {
    var packageId = data.name
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '_');
    return packagesRef.child(packageId).set(data);
  }

  /**
   * Get all packages.
   * @returns {Promise<Object>} Full packages data object
   */
  function getPackages() {
    return packagesRef.once('value').then(function (snapshot) {
      return snapshot.val() || {};
    });
  }

  /**
   * Update a package.
   * @param {string} packageId - The package ID
   * @param {Object} data - Object with fields to update
   * @returns {Promise<void>}
   */
  function updatePackage(packageId, data) {
    return packagesRef.child(packageId).update(data);
  }

  /**
   * Delete a package.
   * @param {string} packageId - The package ID
   * @returns {Promise<void>}
   */
  function deletePackage(packageId) {
    return packagesRef.child(packageId).remove();
  }

  /**
   * Listen to all packages changes at once.
   * @param {function} callback - Called with the full packages data object
   * @returns {function} Unsubscribe function
   */
  function onAllPackagesChange(callback) {
    function handler(snapshot) {
      var data = snapshot.val() || {};
      callback(data);
    }

    packagesRef.on('value', handler);

    return function unsubscribe() {
      packagesRef.off('value', handler);
    };
  }

  // ---------------------------------------------------------------------------
  // Backward compatibility aliases
  // ---------------------------------------------------------------------------
  var stockRef = menuRef; // Alias for backward compatibility
  var INITIAL_STOCK_DATA = INITIAL_MENU_DATA; // Alias for backward compatibility

  function seedInitialStock() {
    return seedInitialMenu();
  }

  function onStockChange(itemId, callback) {
    return onMenuItemChange(itemId, function (data) {
      var status = (data && data.status) ? data.status : 'sold_out';
      callback(status);
    });
  }

  function onAllStockChange(callback) {
    return onAllMenuChange(callback);
  }

  function updateStock(itemId, status) {
    return updateMenuItem(itemId, { status: status });
  }

  function getStockStatus(itemId) {
    return getMenuItem(itemId).then(function (data) {
      return (data && data.status) ? data.status : 'sold_out';
    });
  }

  function getAllStock() {
    return getAllMenu();
  }

  // ---------------------------------------------------------------------------
  // Expose public API via global namespace
  // ---------------------------------------------------------------------------
  window.FirebaseService = {
    // Config
    config:               firebaseConfig,
    db:                   db,
    menuRef:              menuRef,
    stockRef:             stockRef, // backward compat
    packagesRef:          packagesRef,

    // Data
    INITIAL_MENU_DATA:    INITIAL_MENU_DATA,
    INITIAL_STOCK_DATA:   INITIAL_STOCK_DATA, // backward compat
    INITIAL_PACKAGES_DATA: INITIAL_PACKAGES_DATA,

    // Menu functions
    seedInitialMenu:      seedInitialMenu,
    onMenuItemChange:     onMenuItemChange,
    onAllMenuChange:      onAllMenuChange,
    updateMenuItem:       updateMenuItem,
    deleteMenuItem:       deleteMenuItem,
    getMenuItem:          getMenuItem,
    getAllMenu:            getAllMenu,
    nameToSlug:           nameToSlug,
    isValidStatus:        isValidStatus,
    getStatusText:        getStatusText,

    // Packages functions
    seedInitialPackages:  seedInitialPackages,
    addPackage:           addPackage,
    getPackages:          getPackages,
    updatePackage:        updatePackage,
    deletePackage:        deletePackage,
    onAllPackagesChange:  onAllPackagesChange,

    // Backward compatibility
    seedInitialStock:     seedInitialStock,
    onStockChange:        onStockChange,
    onAllStockChange:     onAllStockChange,
    updateStock:          updateStock,
    getStockStatus:       getStockStatus,
    getAllStock:           getAllStock,
    nameToStockId:        nameToSlug, // alias
    isValidStockStatus:   isValidStatus // alias
  };

})();
