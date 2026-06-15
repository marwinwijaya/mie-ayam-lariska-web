/**
 * DescriptionTemplates Module — Auto-generate marketing descriptions
 *
 * Provides template-based description generation for menu items.
 * Each category has multiple templates that can be customized.
 *
 * Architecture: IIFE module, exposes window.DescriptionTemplates
 */

(function () {
  'use strict';

  // ---------------------------------------------------------------------------
  // Description templates by category
  // ---------------------------------------------------------------------------
  var TEMPLATES = {
    'Mie Ayam': [
      '{name} dengan topping {topping} yang lezat. Porsi pas, harga ramah kantong.',
      'Nikmati {name} dengan bumbu khas yang gurih dan topping melimpah.',
      '{name} pilihan terbaik untuk pecinta mie ayam. Cocok untuk makan siang atau malam.',
      'Coba {name} kami! Dibuat dengan bahan segar dan bumbu rahasia yang lezat.',
      '{name} favorit pelanggan. Porsi kenyang, harga terjangkau.'
    ],
    'Minuman': [
      '{name} segar untuk menemani makan mie ayam Anda.',
      'Nikmati kesegaran {name} yang pas untuk cuaca panas.',
      '{name} pilihan tepat untuk menghilangkan dahaga.',
      'Segarkan hari Anda dengan {name} yang dingin dan manis.',
      '{name} pendamping sempurna untuk hidangan mie ayam.'
    ],
    'Topping Tambahan': [
      'Tambahkan {name} untuk pengalaman makan yang lebih nikmat.',
      '{name} sebagai pelengkap sempurna untuk mie ayam Anda.',
      'Nikmati {name} yang empuk dan gurih sebagai topping.',
      '{name} pilihan topping favorit pelanggan kami.',
      'Upgrade mie ayam Anda dengan {name} yang lezat.'
    ]
  };

  // ---------------------------------------------------------------------------
  // Topping mapping for Mie Ayam descriptions
  // ---------------------------------------------------------------------------
  var TOPPING_MAP = {
    'mie_ayam_mini': 'ayam suwir',
    'mie_ayam_biasa': 'ayam suwir dan pangsit',
    'mie_ayam_pangsit': 'pangsit goreng dan rebus',
    'mie_ayam_ceker': 'ceker ayam empuk',
    'mie_ayam_bakso': 'bakso sapi kenyal',
    'mie_ayam_komplit': 'ceker, pangsit, dan bakso',
    'mie_ayam_sayap': 'sayap ayam goreng',
    'mie_ayam_telur_puyuh': 'telur puyuh lembut',
    'mie_ayam_tulangan': 'tulangan ayam empuk',
    'mie_ayam_kepala': 'kepala ayam gurih',
    'pangsit_kuah': 'pangsit rebus dalam kuah kaldu'
  };

  // ---------------------------------------------------------------------------
  // Helper functions
  // ---------------------------------------------------------------------------

  /**
   * Get a random item from an array.
   * @param {Array} arr - Input array
   * @returns {*} Random item
   */
  function getRandomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  /**
   * Truncate text to max length without breaking words.
   * @param {string} text - Input text
   * @param {number} maxLength - Maximum length
   * @returns {string} Truncated text
   */
  function truncateToLength(text, maxLength) {
    if (text.length <= maxLength) return text;

    var truncated = text.substring(0, maxLength);
    var lastSpace = truncated.lastIndexOf(' ');

    if (lastSpace > 0) {
      truncated = truncated.substring(0, lastSpace);
    }

    return truncated + '...';
  }

  // ---------------------------------------------------------------------------
  // Main generation function
  // ---------------------------------------------------------------------------

  /**
   * Generate a marketing description for a menu item.
   * @param {string} name - Menu item name
   * @param {string} category - Menu category
   * @param {Object} [options] - Optional parameters
   * @param {number} [options.maxLength=200] - Maximum description length
   * @param {string} [options.itemId] - Item ID for topping lookup
   * @returns {string} Generated description
   */
  function generateDescription(name, category, options) {
    options = options || {};
    var maxLength = options.maxLength || 200;

    // Get templates for category
    var templates = TEMPLATES[category] || TEMPLATES['Mie Ayam'];

    // Get random template
    var template = getRandomItem(templates);

    // Get topping info for Mie Ayam
    var topping = 'ayam suwir';
    if (options.itemId && TOPPING_MAP[options.itemId]) {
      topping = TOPPING_MAP[options.itemId];
    }

    // Replace placeholders
    var description = template
      .replace(/\{name\}/g, name)
      .replace(/\{topping\}/g, topping);

    // Truncate to max length
    return truncateToLength(description, maxLength);
  }

  /**
   * Generate descriptions for multiple menu items.
   * @param {Array} items - Array of {name, category, itemId}
   * @param {Object} [options] - Optional parameters
   * @returns {Array} Array of {itemId, description}
   */
  function generateBulkDescriptions(items, options) {
    return items.map(function (item) {
      return {
        itemId: item.itemId,
        description: generateDescription(item.name, item.category, {
          maxLength: options ? options.maxLength : 200,
          itemId: item.itemId
        })
      };
    });
  }

  /**
   * Get available templates for a category.
   * @param {string} category - Category name
   * @returns {Array} Array of template strings
   */
  function getTemplatesForCategory(category) {
    return TEMPLATES[category] || [];
  }

  /**
   * Add a custom template for a category.
   * @param {string} category - Category name
   * @param {string} template - Template string with {name} and {topping} placeholders
   */
  function addTemplate(category, template) {
    if (!TEMPLATES[category]) {
      TEMPLATES[category] = [];
    }
    TEMPLATES[category].push(template);
  }

  // ---------------------------------------------------------------------------
  // Expose public API via global namespace
  // ---------------------------------------------------------------------------
  window.DescriptionTemplates = {
    generateDescription:      generateDescription,
    generateBulkDescriptions: generateBulkDescriptions,
    getTemplatesForCategory:  getTemplatesForCategory,
    addTemplate:              addTemplate,
    TEMPLATES:                TEMPLATES
  };

})();
