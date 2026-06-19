/**
 * Shared Utilities — Mie Ayam Lariska
 *
 * Centralized utility functions used across multiple modules.
 * Single source of truth for common functions.
 *
 * Architecture: ES Module, exposes via export and window.AppUtils
 */

// ---------------------------------------------------------------------------
// Status & Badge Configuration
// ---------------------------------------------------------------------------

/**
 * Get status display text in Indonesian
 * @param {string} status - Status key (available, limited, sold_out)
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

/**
 * Badge configuration for menu items
 */
const BADGE_CONFIG = {
  'favorit': { icon: '⭐', label: 'Favorit', class: 'favorit' },
  'baru': { icon: '🆕', label: 'Baru', class: 'baru' },
  'bestseller': { icon: '🔥', label: 'Best Seller', class: 'bestseller' },
  'populer': { icon: '📈', label: 'Populer', class: 'populer' }
};

// ---------------------------------------------------------------------------
// Price Formatting
// ---------------------------------------------------------------------------

/**
 * Format price in short "12k" format
 * @param {number} price - Price value
 * @returns {string} Formatted price
 */
function formatPriceK(price) {
  return Math.round(Number(price) / 1000) + 'k';
}

/**
 * Format price in locale format (e.g., "12.000")
 * @param {number} price - Price value
 * @returns {string} Formatted price
 */
function formatPrice(price) {
  return Number(price).toLocaleString('id-ID');
}

// ---------------------------------------------------------------------------
// String Utilities
// ---------------------------------------------------------------------------

/**
 * Generate URL-friendly slug from text
 * @param {string} text - Input text
 * @returns {string} URL-friendly slug
 */
function generateSlug(text) {
  if (typeof text !== 'string') return '';
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Escape HTML to prevent XSS
 * @param {string} str - Input string
 * @returns {string} Escaped HTML string
 */
function escapeHtml(str) {
  if (typeof str !== 'string') return '';
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

/**
 * Sanitize HTML content (alias for escapeHtml)
 * @param {string} str - Input string
 * @returns {string} Sanitized string
 */
function sanitizeHtml(str) {
  return escapeHtml(str);
}

/**
 * Generate WhatsApp message link
 * @param {string} phone - Phone number
 * @param {string} message - Message text
 * @returns {string} WhatsApp URL
 */
function buildWhatsAppLink(phone, message) {
  if (!phone || !message) return '#';
  var cleanPhone = phone.replace(/[^0-9+]/g, '');
  var encodedMessage = encodeURIComponent(message);
  return 'https://wa.me/' + cleanPhone + '?text=' + encodedMessage;
}

// ---------------------------------------------------------------------------
// Image Utilities
// ---------------------------------------------------------------------------

/**
 * Get image path for menu item
 * @param {string} itemName - Menu item name
 * @returns {string} Image path
 */
function getImagePath(itemName) {
  var slug = generateSlug(itemName);
  return 'images/' + slug + '.jpg';
}

/**
 * Get image path with base path for nested pages
 * @param {string} itemName - Menu item name
 * @param {string} basePath - Base path (e.g., '../')
 * @returns {string} Image path
 */
function getImagePathWithBase(itemName, basePath) {
  var slug = generateSlug(itemName);
  return (basePath || '') + 'images/' + slug + '.jpg';
}

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------

// Expose on window for non-module scripts
if (typeof window !== 'undefined') {
  window.AppUtils = {
    getStatusText: getStatusText,
    BADGE_CONFIG: BADGE_CONFIG,
    formatPriceK: formatPriceK,
    formatPrice: formatPrice,
    generateSlug: generateSlug,
    escapeHtml: escapeHtml,
    sanitizeHtml: sanitizeHtml,
    buildWhatsAppLink: buildWhatsAppLink,
    getImagePath: getImagePath,
    getImagePathWithBase: getImagePathWithBase
  };
}
