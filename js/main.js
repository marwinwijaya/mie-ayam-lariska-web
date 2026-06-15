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

      // Remove existing stock badge
      var existingStockBadge = card.querySelector('.menu__item-stock');
      if (existingStockBadge) {
        existingStockBadge.remove();
      }

      // Remove existing badge
      var existingBadge = card.querySelector('.badge');
      if (existingBadge) {
        existingBadge.remove();
      }

      // Create stock badge in image area
      var imageContainer = card.querySelector('.menu__item-image');
      if (imageContainer) {
        var stockBadge = document.createElement('span');
        stockBadge.className = 'menu__item-stock menu__item-stock--' + status;
        
        // Set icon based on status
        var icon = '';
        switch (status) {
          case 'available':
            icon = '✓';
            break;
          case 'limited':
            icon = '!';
            break;
          case 'sold_out':
            icon = '✕';
            break;
          default:
            icon = '✓';
        }
        
        stockBadge.innerHTML = '<span class="menu__item-stock-icon">' + icon + '</span> ' + getStatusText(status);
        imageContainer.appendChild(stockBadge);
      }

      // Create badge in info section
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
        card.style.pointerEvents = 'none';
        
        // Disable order button
        var orderBtn = card.querySelector('.menu__item-order');
        if (orderBtn) {
          orderBtn.disabled = true;
          orderBtn.textContent = 'Habis';
          orderBtn.style.backgroundColor = '#ccc';
        }
      } else {
        card.style.opacity = '1';
        card.style.pointerEvents = 'auto';
        
        // Enable order button
        var orderBtn = card.querySelector('.menu__item-order');
        if (orderBtn) {
          orderBtn.disabled = false;
          orderBtn.textContent = 'Pesan';
          orderBtn.style.backgroundColor = '';
        }
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
  // Menu Badges
  // ---------------------------------------------------------------------------

  /**
   * Badge configuration
   */
  var BADGE_CONFIG = {
    'favorit': { icon: '⭐', label: 'Favorit', class: 'favorit' },
    'baru': { icon: '🆕', label: 'Baru', class: 'baru' },
    'bestseller': { icon: '🔥', label: 'Best Seller', class: 'bestseller' },
    'populer': { icon: '📈', label: 'Populer', class: 'populer' }
  };

  /**
   * Update menu badge on visitor page
   */
  function updateMenuBadge(name, badge) {
    var cards = document.querySelectorAll('.menu__item-card');

    cards.forEach(function (card) {
      var nameEl = card.querySelector('.menu__item-name');
      if (!nameEl || nameEl.textContent.trim() !== name) return;

      // Remove existing menu badge
      var existingBadge = card.querySelector('.menu__item-badge');
      if (existingBadge) {
        existingBadge.remove();
      }

      // Add badge if exists
      if (badge && BADGE_CONFIG[badge]) {
        var imageContainer = card.querySelector('.menu__item-image');
        if (imageContainer) {
          var badgeEl = document.createElement('span');
          badgeEl.className = 'menu__item-badge menu__item-badge--' + BADGE_CONFIG[badge].class;
          badgeEl.textContent = BADGE_CONFIG[badge].icon + ' ' + BADGE_CONFIG[badge].label;
          imageContainer.appendChild(badgeEl);
        }
      }
    });
  }

  /**
   * Initialize menu badge updates from Firebase
   */
  function initBadgeUpdates() {
    if (typeof window.FirebaseService === 'undefined') {
      console.warn('[Main] FirebaseService not available. Badge updates disabled.');
      return;
    }

    var FirebaseService = window.FirebaseService;

    // Listen to all menu changes
    FirebaseService.menuRef.on('value', function (snapshot) {
      var menuData = snapshot.val();
      if (!menuData) return;

      console.log('[Main] Menu data updated for badges');

      // Update badges for each menu item
      Object.keys(menuData).forEach(function (itemId) {
        var item = menuData[itemId];
        if (item.name && item.badge) {
          updateMenuBadge(item.name, item.badge);
        }
      });
    });
  }

  // ---------------------------------------------------------------------------
  // Menu Images
  // ---------------------------------------------------------------------------

  /**
   * Generate slug from menu name
   */
  function generateSlug(name) {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }

  /**
   * Load menu images from images/ folder
   */
  function initMenuImages() {
    var imageContainers = document.querySelectorAll('.menu__item-image');
    
    imageContainers.forEach(function(container) {
      var card = container.closest('.menu__item-card');
      if (!card) return;
      
      var nameEl = card.querySelector('.menu__item-name');
      if (!nameEl) return;
      
      var menuName = nameEl.textContent.trim();
      var slug = generateSlug(menuName);
      var imagePath = 'images/' + slug + '.jpg';
      
      // Try to load the image
      var img = new Image();
      img.onload = function() {
        // Image exists, replace placeholder
        container.innerHTML = '';
        img.alt = menuName;
        img.className = 'menu__item-img';
        container.appendChild(img);
      };
      img.onerror = function() {
        // Image doesn't exist, keep placeholder
        console.log('[Main] No image found for: ' + menuName);
      };
      img.src = imagePath;
    });
  }

  // ---------------------------------------------------------------------------
  // Image Preview Popup
  // ---------------------------------------------------------------------------

  var imagePopup = null;
  var popupTimeout = null;

  /**
   * Create the image popup element
   */
  function createImagePopup() {
    if (imagePopup) return;

    imagePopup = document.createElement('div');
    imagePopup.className = 'image-popup';
    imagePopup.innerHTML = '
      <div class="image-popup__content">
        <img class="image-popup__image" src="" alt="">
        <div class="image-popup__info">
          <div class="image-popup__name"></div>
          <div class="image-popup__price"></div>
        </div>
      </div>
    ';
    document.body.appendChild(imagePopup);
  }

  /**
   * Show image popup near the cursor
   */
  function showImagePopup(card, event) {
    createImagePopup();

    var name = card.querySelector('.menu__item-name');
    var price = card.querySelector('.price');
    var img = card.querySelector('.menu__item-image img');

    if (!name) return;

    var popupImg = imagePopup.querySelector('.image-popup__image');
    var popupName = imagePopup.querySelector('.image-popup__name');
    var popupPrice = imagePopup.querySelector('.image-popup__price');

    popupName.textContent = name.textContent;
    popupPrice.textContent = price ? price.textContent : '';

    if (img && img.src) {
      popupImg.src = img.src;
      popupImg.alt = name.textContent;
    } else {
      // Try to load from slug
      var slug = generateSlug(name.textContent);
      popupImg.src = 'images/' + slug + '.jpg';
      popupImg.alt = name.textContent;
    }

    // Position popup
    var x = event.clientX + 20;
    var y = event.clientY - 100;

    // Keep popup within viewport
    var popupWidth = 300;
    var popupHeight = 350;

    if (x + popupWidth > window.innerWidth) {
      x = event.clientX - popupWidth - 20;
    }
    if (y < 10) {
      y = 10;
    }
    if (y + popupHeight > window.innerHeight) {
      y = window.innerHeight - popupHeight - 10;
    }

    imagePopup.style.left = x + 'px';
    imagePopup.style.top = y + 'px';
    imagePopup.classList.add('is-visible');
  }

  /**
   * Hide image popup
   */
  function hideImagePopup() {
    if (imagePopup) {
      imagePopup.classList.remove('is-visible');
    }
  }

  /**
   * Initialize image popup on menu cards
   */
  function initImagePopup() {
    // Only enable on non-touch devices
    if ('ontouchstart' in window) return;

    var cards = document.querySelectorAll('.menu__item-card');

    cards.forEach(function(card) {
      card.addEventListener('mouseenter', function(e) {
        clearTimeout(popupTimeout);
        popupTimeout = setTimeout(function() {
          showImagePopup(card, e);
        }, 300); // 300ms delay before showing
      });

      card.addEventListener('mousemove', function(e) {
        if (imagePopup && imagePopup.classList.contains('is-visible')) {
          // Update position as mouse moves
          var x = e.clientX + 20;
          var y = e.clientY - 100;

          if (x + 300 > window.innerWidth) {
            x = e.clientX - 320;
          }
          if (y < 10) {
            y = 10;
          }
          if (y + 350 > window.innerHeight) {
            y = window.innerHeight - 360;
          }

          imagePopup.style.left = x + 'px';
          imagePopup.style.top = y + 'px';
        }
      });

      card.addEventListener('mouseleave', function() {
        clearTimeout(popupTimeout);
        hideImagePopup();
      });
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
    initMenuImages();
    initImagePopup();

    // Delay Firebase initialization slightly to ensure SDK is loaded
    setTimeout(function () {
      initStockUpdates();
      initBadgeUpdates();
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
