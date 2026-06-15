/**
 * Main Application Module — Mie Ayam Lariska
 *
 * Handles all customer-facing interactivity:
 * - Navigation toggle (mobile hamburger menu)
 * - FAQ accordion
 * - Stock status updates from Firebase
 * - Smooth scrolling
 *
 * Architecture: IIFE with 'use strict', exposes initApp on window
 */

(function () {
  'use strict';

  // ---------------------------------------------------------------------------
  // Navigation Toggle
  // ---------------------------------------------------------------------------

  /**
   * Initialize mobile navigation toggle
   */
  function initNavigation() {
    var toggle = document.querySelector('.nav__toggle');
    var menu = document.querySelector('.nav__menu');

    if (!toggle || !menu) return;

    toggle.addEventListener('click', function () {
      var isOpen = menu.classList.contains('is-open');

      if (isOpen) {
        menu.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Buka menu');
      } else {
        menu.classList.add('is-open');
        toggle.setAttribute('aria-expanded', 'true');
        toggle.setAttribute('aria-label', 'Tutup menu');
      }
    });

    // Close menu when clicking a link
    var menuLinks = menu.querySelectorAll('a');
    menuLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        menu.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Buka menu');
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function (e) {
      if (!menu.contains(e.target) && !toggle.contains(e.target)) {
        menu.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Buka menu');
      }
    });
  }

  // ---------------------------------------------------------------------------
  // FAQ Accordion
  // ---------------------------------------------------------------------------

  /**
   * Initialize FAQ accordion functionality
   */
  function initFAQ() {
    var faqItems = document.querySelectorAll('.faq__item');

    faqItems.forEach(function (item) {
      var question = item.querySelector('.faq__question');
      var answer = item.querySelector('.faq__answer');

      if (!question || !answer) return;

      question.addEventListener('click', function () {
        var isOpen = item.classList.contains('is-open');

        // Close all other items
        faqItems.forEach(function (otherItem) {
          if (otherItem !== item) {
            otherItem.classList.remove('is-open');
            var otherQuestion = otherItem.querySelector('.faq__question');
            if (otherQuestion) {
              otherQuestion.setAttribute('aria-expanded', 'false');
            }
          }
        });

        // Toggle current item
        if (isOpen) {
          item.classList.remove('is-open');
          question.setAttribute('aria-expanded', 'false');
        } else {
          item.classList.add('is-open');
          question.setAttribute('aria-expanded', 'true');
        }
      });
    });
  }

  // ---------------------------------------------------------------------------
  // Stock Status Updates
  // ---------------------------------------------------------------------------

  /**
   * Map menu item names to stock IDs
   */
  var MENU_STOCK_MAP = {
    'Mie Ayam Mini': 'mie_ayam_mini',
    'Mie Ayam Biasa': 'mie_ayam_biasa',
    'Mie Ayam Pangsit': 'mie_ayam_pangsit',
    'Mie Ayam Ceker': 'mie_ayam_ceker',
    'Mie Ayam Bakso': 'mie_ayam_bakso',
    'Mie Ayam Komplit': 'mie_ayam_komplit',
    'Mie Ayam Sayap': 'mie_ayam_sayap',
    'Mie Ayam Telur Puyuh': 'mie_ayam_telur_puyuh',
    'Mie Ayam Tulangan': 'mie_ayam_tulangan',
    'Mie Ayam Kepala': 'mie_ayam_kepala',
    'Pangsit Kuah': 'pangsit_kuah',
    'Teh Anget': 'teh_anget',
    'Es Teh Manis': 'es_teh_manis',
    'Es Jeruk Peras': 'es_jeruk_peras',
    'Es Nutrisari': 'es_nutrisari',
    'Es Tawar': 'es_tawar',
    'Ceker': 'ceker',
    'Pangsit Rebus': 'pangsit_rebus',
    'Bakso': 'bakso',
    'Telur Puyuh': 'telur_puyuh',
    'Kepala Ayam': 'kepala_ayam',
    'Sayap': 'sayap',
    'Tulangan': 'tulangan',
    'Pangsit Goreng': 'pangsit_goreng'
  };

  /**
   * Get status display text in Indonesian
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
   * Update a single menu item's stock badge
   */
  function updateMenuItemBadge(name, status) {
    var cards = document.querySelectorAll('.menu__item-card');

    cards.forEach(function (card) {
      var nameEl = card.querySelector('.menu__item-name');
      if (!nameEl || nameEl.textContent.trim() !== name) return;

      // Remove existing badge
      var existingBadge = card.querySelector('.badge');
      if (existingBadge) {
        existingBadge.remove();
      }

      // Create new badge
      var badge = document.createElement('span');
      badge.className = 'badge badge--' + status;
      badge.textContent = getStatusText(status);

      // Add badge to info section
      var info = card.querySelector('.menu__item-info');
      if (info) {
        var priceEl = info.querySelector('.menu__item-price');
        if (priceEl) {
          priceEl.parentNode.insertBefore(badge, priceEl.nextSibling);
        } else {
          info.appendChild(badge);
        }
      }

      // Update card styling for sold out items
      if (status === 'sold_out') {
        card.style.opacity = '0.6';
      } else {
        card.style.opacity = '1';
      }
    });
  }

  /**
   * Initialize stock status updates from Firebase
   */
  function initStockUpdates() {
    // Check if FirebaseService is available
    if (typeof window.FirebaseService === 'undefined') {
      console.warn('[Main] FirebaseService not available. Stock updates disabled.');
      return;
    }

    var FirebaseService = window.FirebaseService;

    // Seed initial stock data if needed
    FirebaseService.seedInitialStock().then(function () {
      console.log('[Main] Stock data initialized');
    }).catch(function (error) {
      console.error('[Main] Error initializing stock:', error);
    });

    // Listen to all stock changes
    FirebaseService.onAllStockChange(function (stockData) {
      console.log('[Main] Stock data updated:', stockData);

      // Update each menu item
      Object.keys(MENU_STOCK_MAP).forEach(function (name) {
        var stockId = MENU_STOCK_MAP[name];
        var itemData = stockData[stockId];
        var status = (itemData && itemData.status) ? itemData.status : 'available';
        updateMenuItemBadge(name, status);
      });

      // Save to localStorage cache
      if (window.StockService) {
        window.StockService.processAndCacheFirebaseData(stockData);
        window.StockService.hideErrorIndicator();
      }
    });

    // Handle connection errors
    FirebaseService.db.ref('.info/connected').on('value', function (snapshot) {
      var connected = snapshot.val();
      if (!connected && window.StockService) {
        window.StockService.showErrorIndicator();
      }
    });
  }

  // ---------------------------------------------------------------------------
  // Smooth Scrolling
  // ---------------------------------------------------------------------------

  /**
   * Initialize smooth scrolling for anchor links
   */
  function initSmoothScroll() {
    var links = document.querySelectorAll('a[href^="#"]');

    links.forEach(function (link) {
      link.addEventListener('click', function (e) {
        var targetId = this.getAttribute('href');
        if (targetId === '#') return;

        var target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }

  // ---------------------------------------------------------------------------
  // Main Initialization
  // ---------------------------------------------------------------------------

  /**
   * Initialize all application features
   * Call this when DOM is ready
   */
  function initApp() {
    console.log('[Main] Initializing Mie Ayam Lariska Web App...');

    initNavigation();
    initFAQ();
    initSmoothScroll();

    // Delay Firebase initialization slightly to ensure SDK is loaded
    setTimeout(function () {
      initStockUpdates();
    }, 100);

    console.log('[Main] App initialized successfully');
  }

  // Expose initApp globally
  window.initApp = initApp;

  // Auto-initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    // DOM is already ready
    initApp();
  }

})();
