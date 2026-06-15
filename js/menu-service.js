/**
 * MenuService Module — CRUD operations for menu items
 *
 * Provides centralized menu management with duplicate detection,
 * input validation, and Firebase integration.
 *
 * Architecture: IIFE module, exposes window.MenuService
 */

(function () {
  'use strict';

  // ---------------------------------------------------------------------------
  // Constants
  // ---------------------------------------------------------------------------
  var MAX_NAME_LENGTH = 100;
  var MAX_DESCRIPTION_LENGTH = 200;
  var MIN_PRICE = 0;
  var MAX_PRICE = 999999;

  // ---------------------------------------------------------------------------
  // Validation functions
  // ---------------------------------------------------------------------------

  /**
   * Validate menu item name.
   * @param {string} name - Menu item name
   * @returns {Object} {valid: boolean, error: string|null}
   */
  function validateName(name) {
    if (!name || name.trim().length === 0) {
      return { valid: false, error: 'Nama menu wajib diisi' };
    }
    if (name.trim().length > MAX_NAME_LENGTH) {
      return { valid: false, error: 'Nama menu terlalu panjang (maksimal ' + MAX_NAME_LENGTH + ' karakter)' };
    }
    return { valid: true, error: null };
  }

  /**
   * Validate menu item price.
   * @param {number|string} price - Menu item price
   * @returns {Object} {valid: boolean, error: string|null}
   */
  function validatePrice(price) {
    var numPrice = Number(price);
    if (isNaN(numPrice)) {
      return { valid: false, error: 'Harga harus berupa angka' };
    }
    if (numPrice < MIN_PRICE) {
      return { valid: false, error: 'Harga tidak boleh negatif' };
    }
    if (numPrice > MAX_PRICE) {
      return { valid: false, error: 'Harga terlalu besar' };
    }
    return { valid: true, error: null };
  }

  /**
   * Validate menu item description.
   * @param {string} description - Menu item description
   * @returns {Object} {valid: boolean, error: string|null}
   */
  function validateDescription(description) {
    if (description && description.length > MAX_DESCRIPTION_LENGTH) {
      return { valid: false, error: 'Deskripsi terlalu panjang (maksimal ' + MAX_DESCRIPTION_LENGTH + ' karakter)' };
    }
    return { valid: true, error: null };
  }

  /**
   * Validate menu item category.
   * @param {string} category - Menu item category
   * @returns {Object} {valid: boolean, error: string|null}
   */
  function validateCategory(category) {
    if (!category || category.trim().length === 0) {
      return { valid: false, error: 'Kategori wajib diisi' };
    }
    return { valid: true, error: null };
  }

  /**
   * Validate all menu item data.
   * @param {Object} data - Menu item data
   * @returns {Object} {valid: boolean, errors: Array}
   */
  function validateMenuItem(data) {
    var errors = [];

    var nameResult = validateName(data.name);
    if (!nameResult.valid) errors.push(nameResult.error);

    var priceResult = validatePrice(data.price);
    if (!priceResult.valid) errors.push(priceResult.error);

    var descResult = validateDescription(data.description);
    if (!descResult.valid) errors.push(descResult.error);

    var catResult = validateCategory(data.category);
    if (!catResult.valid) errors.push(catResult.error);

    return {
      valid: errors.length === 0,
      errors: errors
    };
  }

  // ---------------------------------------------------------------------------
  // CRUD Operations
  // ---------------------------------------------------------------------------

  /**
   * Create a new menu item.
   * @param {Object} data - Menu item data {name, category, price, description, status}
   * @returns {Promise<Object>} {success: boolean, itemId: string|null, error: string|null}
   */
  function createMenuItem(data) {
    // Validate data
    var validation = validateMenuItem(data);
    if (!validation.valid) {
      return Promise.resolve({
        success: false,
        itemId: null,
        error: validation.errors[0]
      });
    }

    var FirebaseService = window.FirebaseService;
    if (!FirebaseService) {
      return Promise.resolve({
        success: false,
        itemId: null,
        error: 'FirebaseService not available'
      });
    }

    // Generate slug from name
    var itemId = FirebaseService.nameToSlug(data.name);

    // Check for duplicate
    return FirebaseService.getMenuItem(itemId).then(function (existing) {
      if (existing) {
        return {
          success: false,
          itemId: null,
          error: 'Menu dengan nama ini sudah ada'
        };
      }

      // Get next order number
      return FirebaseService.getAllMenu().then(function (allMenu) {
        var maxOrder = 0;
        Object.keys(allMenu).forEach(function (key) {
          if (allMenu[key].order && allMenu[key].order > maxOrder) {
            maxOrder = allMenu[key].order;
          }
        });

        // Create menu item
        var menuItem = {
          name: data.name.trim(),
          category: data.category.trim(),
          price: Number(data.price),
          description: data.description ? data.description.trim() : '',
          status: data.status || 'available',
          order: maxOrder + 1
        };

        return FirebaseService.menuRef.child(itemId).set(menuItem).then(function () {
          return {
            success: true,
            itemId: itemId,
            error: null
          };
        });
      });
    }).catch(function (error) {
      return {
        success: false,
        itemId: null,
        error: 'Gagal menyimpan menu: ' + error.message
      };
    });
  }

  /**
   * Update an existing menu item.
   * @param {string} itemId - Menu item ID
   * @param {Object} updates - Fields to update
   * @returns {Promise<Object>} {success: boolean, error: string|null}
   */
  function updateMenuItem(itemId, updates) {
    var FirebaseService = window.FirebaseService;
    if (!FirebaseService) {
      return Promise.resolve({
        success: false,
        error: 'FirebaseService not available'
      });
    }

    // Validate updates
    if (updates.name !== undefined) {
      var nameResult = validateName(updates.name);
      if (!nameResult.valid) {
        return Promise.resolve({ success: false, error: nameResult.error });
      }
    }

    if (updates.price !== undefined) {
      var priceResult = validatePrice(updates.price);
      if (!priceResult.valid) {
        return Promise.resolve({ success: false, error: priceResult.error });
      }
    }

    if (updates.description !== undefined) {
      var descResult = validateDescription(updates.description);
      if (!descResult.valid) {
        return Promise.resolve({ success: false, error: descResult.error });
      }
    }

    // Check for duplicate name if name is being changed
    if (updates.name) {
      var newId = FirebaseService.nameToSlug(updates.name);
      if (newId !== itemId) {
        return FirebaseService.getMenuItem(newId).then(function (existing) {
          if (existing) {
            return { success: false, error: 'Menu dengan nama ini sudah ada' };
          }

          // Need to create new entry and delete old one
          return FirebaseService.getMenuItem(itemId).then(function (oldData) {
            var newData = Object.assign({}, oldData, updates, { name: updates.name.trim() });
            return FirebaseService.menuRef.child(newId).set(newData).then(function () {
              return FirebaseService.deleteMenuItem(itemId).then(function () {
                return { success: true, error: null, newId: newId };
              });
            });
          });
        }).catch(function (error) {
          return { success: false, error: 'Gagal mengupdate menu: ' + error.message };
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

    return FirebaseService.updateMenuItem(itemId, cleanUpdates).then(function () {
      return { success: true, error: null };
    }).catch(function (error) {
      return { success: false, error: 'Gagal mengupdate menu: ' + error.message };
    });
  }

  /**
   * Delete a menu item.
   * @param {string} itemId - Menu item ID
   * @returns {Promise<Object>} {success: boolean, error: string|null}
   */
  function deleteMenuItem(itemId) {
    var FirebaseService = window.FirebaseService;
    if (!FirebaseService) {
      return Promise.resolve({
        success: false,
        error: 'FirebaseService not available'
      });
    }

    return FirebaseService.deleteMenuItem(itemId).then(function () {
      return { success: true, error: null };
    }).catch(function (error) {
      return { success: false, error: 'Gagal menghapus menu: ' + error.message };
    });
  }

  /**
   * Get a single menu item.
   * @param {string} itemId - Menu item ID
   * @returns {Promise<Object|null>} Menu item data or null
   */
  function getMenuItem(itemId) {
    var FirebaseService = window.FirebaseService;
    if (!FirebaseService) {
      return Promise.resolve(null);
    }

    return FirebaseService.getMenuItem(itemId);
  }

  /**
   * Get all menu items grouped by category.
   * @returns {Promise<Object>} Menu items grouped by category
   */
  function getMenuByCategory() {
    var FirebaseService = window.FirebaseService;
    if (!FirebaseService) {
      return Promise.resolve({});
    }

    return FirebaseService.getAllMenu().then(function (allMenu) {
      var grouped = {};

      Object.keys(allMenu).forEach(function (itemId) {
        var item = allMenu[itemId];
        var category = item.category || 'Lainnya';

        if (!grouped[category]) {
          grouped[category] = [];
        }

        grouped[category].push({
          id: itemId,
          name: item.name,
          price: item.price,
          description: item.description,
          status: item.status,
          order: item.order || 0
        });
      });

      // Sort by order within each category
      Object.keys(grouped).forEach(function (category) {
        grouped[category].sort(function (a, b) {
          return a.order - b.order;
        });
      });

      return grouped;
    });
  }

  /**
   * Get all menu items as a flat array.
   * @returns {Promise<Array>} Array of menu items
   */
  function getAllMenuItems() {
    var FirebaseService = window.FirebaseService;
    if (!FirebaseService) {
      return Promise.resolve([]);
    }

    return FirebaseService.getAllMenu().then(function (allMenu) {
      var items = [];

      Object.keys(allMenu).forEach(function (itemId) {
        var item = allMenu[itemId];
        items.push({
          id: itemId,
          name: item.name,
          category: item.category,
          price: item.price,
          description: item.description,
          status: item.status,
          order: item.order || 0
        });
      });

      // Sort by order
      items.sort(function (a, b) {
        return a.order - b.order;
      });

      return items;
    });
  }

  /**
   * Update the order of multiple menu items.
   * @param {Array} orderedIds - Array of menu item IDs in new order
   * @returns {Promise<Object>} {success: boolean, error: string|null}
   */
  function updateMenuOrder(orderedIds) {
    var FirebaseService = window.FirebaseService;
    if (!FirebaseService) {
      return Promise.resolve({
        success: false,
        error: 'FirebaseService not available'
      });
    }

    var updates = {};
    orderedIds.forEach(function (itemId, index) {
      updates[itemId + '/order'] = index + 1;
    });

    return FirebaseService.menuRef.update(updates).then(function () {
      return { success: true, error: null };
    }).catch(function (error) {
      return { success: false, error: 'Gagal mengupdate urutan: ' + error.message };
    });
  }

  // ---------------------------------------------------------------------------
  // Expose public API via global namespace
  // ---------------------------------------------------------------------------
  window.MenuService = {
    // Validation
    validateName:           validateName,
    validatePrice:          validatePrice,
    validateDescription:    validateDescription,
    validateCategory:       validateCategory,
    validateMenuItem:       validateMenuItem,

    // CRUD
    createMenuItem:         createMenuItem,
    updateMenuItem:         updateMenuItem,
    deleteMenuItem:         deleteMenuItem,
    getMenuItem:            getMenuItem,
    getMenuByCategory:      getMenuByCategory,
    getAllMenuItems:         getAllMenuItems,
    updateMenuOrder:        updateMenuOrder,

    // Constants
    MAX_NAME_LENGTH:        MAX_NAME_LENGTH,
    MAX_DESCRIPTION_LENGTH: MAX_DESCRIPTION_LENGTH,
    MIN_PRICE:              MIN_PRICE,
    MAX_PRICE:              MAX_PRICE
  };

})();
