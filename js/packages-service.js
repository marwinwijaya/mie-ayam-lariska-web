/**
 * PackagesService Module — CRUD operations for recommendation packages
 *
 * Provides centralized package management with input validation
 * and Firebase integration via FirebaseService.
 *
 * Architecture: ES module
 */

'use strict';

  // ---------------------------------------------------------------------------
  // Constants
  // ---------------------------------------------------------------------------
  var MAX_NAME_LENGTH = 100;
  var MAX_DESCRIPTION_LENGTH = 300;
  var MIN_PRICE = 1;
  var MAX_PRICE = 999999;
  var VALID_TAGS = ['Basic', 'Best Seller', 'Puas', 'Custom', 'Promo', 'Baru'];

  // ---------------------------------------------------------------------------
  // Validation functions
  // ---------------------------------------------------------------------------

  /**
   * Validate package name.
   * @param {string} name - Package name
   * @returns {Object} {valid: boolean, error: string|null}
   */
  function validateName(name) {
    if (!name || name.trim().length === 0) {
      return { valid: false, error: 'Nama paket wajib diisi' };
    }
    if (name.trim().length > MAX_NAME_LENGTH) {
      return { valid: false, error: 'Nama paket terlalu panjang (maksimal ' + MAX_NAME_LENGTH + ' karakter)' };
    }
    return { valid: true, error: null };
  }

  /**
   * Validate package price.
   * @param {number|string} price - Package price
   * @returns {Object} {valid: boolean, error: string|null}
   */
  function validatePrice(price) {
    var numPrice = Number(price);
    if (isNaN(numPrice)) {
      return { valid: false, error: 'Harga harus berupa angka' };
    }
    if (numPrice < MIN_PRICE) {
      return { valid: false, error: 'Harga harus lebih dari 0' };
    }
    if (numPrice > MAX_PRICE) {
      return { valid: false, error: 'Harga terlalu besar' };
    }
    return { valid: true, error: null };
  }

  /**
   * Validate package description.
   * @param {string} description - Package description
   * @returns {Object} {valid: boolean, error: string|null}
   */
  function validateDescription(description) {
    if (description && description.length > MAX_DESCRIPTION_LENGTH) {
      return { valid: false, error: 'Deskripsi terlalu panjang (maksimal ' + MAX_DESCRIPTION_LENGTH + ' karakter)' };
    }
    return { valid: true, error: null };
  }

  /**
   * Validate package items array.
   * @param {Array} items - Array of menu item IDs
   * @returns {Object} {valid: boolean, error: string|null}
   */
  function validateItems(items) {
    if (!Array.isArray(items)) {
      return { valid: false, error: 'Items harus berupa array' };
    }
    return { valid: true, error: null };
  }

  /**
   * Validate all package data.
   * @param {Object} data - Package data
   * @returns {Object} {valid: boolean, errors: Array}
   */
  function validatePackage(data) {
    var errors = [];

    var nameResult = validateName(data.name);
    if (!nameResult.valid) errors.push(nameResult.error);

    var priceResult = validatePrice(data.price);
    if (!priceResult.valid) errors.push(priceResult.error);

    var descResult = validateDescription(data.description);
    if (!descResult.valid) errors.push(descResult.error);

    var itemsResult = validateItems(data.items);
    if (!itemsResult.valid) errors.push(itemsResult.error);

    return {
      valid: errors.length === 0,
      errors: errors
    };
  }

  // ---------------------------------------------------------------------------
  // Helper functions
  // ---------------------------------------------------------------------------

  /**
   * Generate a slug from package name.
   * "Paket Lengkap" => "paket_lengkap"
   * @param {string} name - Package display name
   * @returns {string} Slugified ID
   */
  function nameToSlug(name) {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '_');
  }

  // ---------------------------------------------------------------------------
  // CRUD Operations
  // ---------------------------------------------------------------------------

  /**
   * Get all packages.
   * @returns {Promise<Object>} Full packages data object keyed by package ID
   */
  function getAll() {
    var FirebaseService = window.FirebaseService;
    if (!FirebaseService) {
      return Promise.resolve({});
    }

    return FirebaseService.getPackages();
  }

  /**
   * Get a single package by ID.
   * @param {string} packageId - Package ID
   * @returns {Promise<Object|null>} Package data or null
   */
  function getById(packageId) {
    var FirebaseService = window.FirebaseService;
    if (!FirebaseService) {
      return Promise.resolve(null);
    }

    return FirebaseService.packagesRef.child(packageId).once('value').then(function (snapshot) {
      return snapshot.val();
    });
  }

  /**
   * Add a new package.
   * @param {Object} data - Package data {name, description, icon, items, price, tag, isFeatured, isActive, whatsappMessage}
   * @returns {Promise<Object>} {success: boolean, packageId: string|null, error: string|null}
   */
  function add(data) {
    // Validate data
    var validation = validatePackage(data);
    if (!validation.valid) {
      return Promise.resolve({
        success: false,
        packageId: null,
        error: validation.errors[0]
      });
    }

    var FirebaseService = window.FirebaseService;
    if (!FirebaseService) {
      return Promise.resolve({
        success: false,
        packageId: null,
        error: 'FirebaseService not available'
      });
    }

    // Generate slug from name
    var packageId = nameToSlug(data.name);

    // Check for duplicate
    return FirebaseService.packagesRef.child(packageId).once('value').then(function (snapshot) {
      if (snapshot.exists()) {
        return {
          success: false,
          packageId: null,
          error: 'Paket dengan nama ini sudah ada'
        };
      }

      // Get next order number
      return FirebaseService.getPackages().then(function (allPackages) {
        var maxOrder = 0;
        Object.keys(allPackages).forEach(function (key) {
          if (allPackages[key].order && allPackages[key].order > maxOrder) {
            maxOrder = allPackages[key].order;
          }
        });

        // Create package object
        var packageData = {
          name: data.name.trim(),
          description: data.description ? data.description.trim() : '',
          icon: data.icon || '',
          items: Array.isArray(data.items) ? data.items : [],
          price: Number(data.price),
          tag: data.tag || '',
          isFeatured: Boolean(data.isFeatured),
          isActive: data.isActive !== false,
          whatsappMessage: data.whatsappMessage ? data.whatsappMessage.trim() : '',
          order: maxOrder + 1
        };

        return FirebaseService.packagesRef.child(packageId).set(packageData).then(function () {
          return {
            success: true,
            packageId: packageId,
            error: null
          };
        });
      });
    }).catch(function (error) {
      return {
        success: false,
        packageId: null,
        error: 'Gagal menyimpan paket: ' + error.message
      };
    });
  }

  /**
   * Update an existing package.
   * @param {string} packageId - Package ID
   * @param {Object} updates - Fields to update
   * @returns {Promise<Object>} {success: boolean, error: string|null, newId: string|null}
   */
  function update(packageId, updates) {
    var FirebaseService = window.FirebaseService;
    if (!FirebaseService) {
      return Promise.resolve({
        success: false,
        error: 'FirebaseService not available',
        newId: null
      });
    }

    // Validate updates
    if (updates.name !== undefined) {
      var nameResult = validateName(updates.name);
      if (!nameResult.valid) {
        return Promise.resolve({ success: false, error: nameResult.error, newId: null });
      }
    }

    if (updates.price !== undefined) {
      var priceResult = validatePrice(updates.price);
      if (!priceResult.valid) {
        return Promise.resolve({ success: false, error: priceResult.error, newId: null });
      }
    }

    if (updates.description !== undefined) {
      var descResult = validateDescription(updates.description);
      if (!descResult.valid) {
        return Promise.resolve({ success: false, error: descResult.error, newId: null });
      }
    }

    if (updates.items !== undefined) {
      var itemsResult = validateItems(updates.items);
      if (!itemsResult.valid) {
        return Promise.resolve({ success: false, error: itemsResult.error, newId: null });
      }
    }

    // Check for duplicate name if name is being changed
    if (updates.name) {
      var newId = nameToSlug(updates.name);
      if (newId !== packageId) {
        return FirebaseService.packagesRef.child(newId).once('value').then(function (snapshot) {
          if (snapshot.exists()) {
            return { success: false, error: 'Paket dengan nama ini sudah ada', newId: null };
          }

          // Need to create new entry and delete old one
          return FirebaseService.packagesRef.child(packageId).once('value').then(function (oldSnapshot) {
            var oldData = oldSnapshot.val();
            if (!oldData) {
              return { success: false, error: 'Paket tidak ditemukan', newId: null };
            }

            var newData = Object.assign({}, oldData, updates, { name: updates.name.trim() });
            return FirebaseService.packagesRef.child(newId).set(newData).then(function () {
              return FirebaseService.deletePackage(packageId).then(function () {
                return { success: true, error: null, newId: newId };
              });
            });
          });
        }).catch(function (error) {
          return { success: false, error: 'Gagal mengupdate paket: ' + error.message, newId: null };
        });
      }
    }

    // Simple update (no name change)
    var cleanUpdates = {};
    Object.keys(updates).forEach(function (key) {
      if (updates[key] !== undefined) {
        cleanUpdates[key] = typeof updates[key] === 'string' ? updates[key].trim() : updates[key];
      }
    });

    return FirebaseService.updatePackage(packageId, cleanUpdates).then(function () {
      return { success: true, error: null, newId: null };
    }).catch(function (error) {
      return { success: false, error: 'Gagal mengupdate paket: ' + error.message, newId: null };
    });
  }

  /**
   * Delete a package.
   * @param {string} packageId - Package ID
   * @returns {Promise<Object>} {success: boolean, error: string|null}
   */
  function deletePkg(packageId) {
    var FirebaseService = window.FirebaseService;
    if (!FirebaseService) {
      return Promise.resolve({
        success: false,
        error: 'FirebaseService not available'
      });
    }

    return FirebaseService.deletePackage(packageId).then(function () {
      return { success: true, error: null };
    }).catch(function (error) {
      return { success: false, error: 'Gagal menghapus paket: ' + error.message };
    });
  }

  /**
   * Listen to all packages changes.
   * @param {function} callback - Called with the full packages data object
   * @returns {function} Unsubscribe function
   */
  function onAllChange(callback) {
    var FirebaseService = window.FirebaseService;
    if (!FirebaseService) {
      return function unsubscribe() {};
    }

    return FirebaseService.onAllPackagesChange(callback);
  }

// ---------------------------------------------------------------------------
// Expose public API
// ---------------------------------------------------------------------------

const PackagesService = {
  // Validation
  validateName,
  validatePrice,
  validateDescription,
  validateItems,
  validatePackage,

  // Helper
  nameToSlug,

  // CRUD
  getAll,
  getById,
  add,
  update,
  delete: deletePkg,
  onAllChange,

  // Constants
  MAX_NAME_LENGTH,
  MAX_DESCRIPTION_LENGTH,
  MIN_PRICE,
  MAX_PRICE,
  VALID_TAGS
};

export { PackagesService, validatePackage };
window.PackagesService = PackagesService;
