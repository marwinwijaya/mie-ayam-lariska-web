/**
 * Packages Renderer — Dynamic package cards for customer page
 *
 * Fetches packages from Firebase and renders them as cards.
 * Falls back to hardcoded data if Firebase is unavailable.
 *
 * Architecture: Regular script (window globals)
 */

const FALLBACK_PACKAGES = {
  'paket_favorit': {
    name: 'Paket Favorit',
    description: 'Mie Ayam + Es Nutri Sari / Es Teh Manis',
    icon: '🔥',
    items: ['mie_ayam_biasa', 'es_nutrisari'],
    itemNames: ['Mie Ayam', 'Es Nutri Sari / Es Teh Manis'],
    price: 18000,
    tag: 'Best Seller',
    isFeatured: true,
    isActive: true,
    whatsappMessage: 'Halo Mie Ayam Lariska, saya mau pesan Paket Favorit',
    order: 1
  },
  'paket_mini': {
    name: 'Paket Mini',
    description: 'Mie Ayam Mini + Es Nutri Sari / Es Teh Manis',
    icon: '🍜',
    items: ['mie_ayam_mini', 'es_nutrisari'],
    itemNames: ['Mie Ayam Mini', 'Es Nutri Sari / Es Teh Manis'],
    price: 8000,
    tag: 'Hemat',
    isFeatured: false,
    isActive: true,
    whatsappMessage: 'Halo Mie Ayam Lariska, saya mau pesan Paket Mini',
    order: 2
  },
  'paket_nikmat': {
    name: 'Paket Nikmat',
    description: 'Pangsit Kuah + Es Nutri Sari / Es Teh Manis',
    icon: '😋',
    items: ['pangsit_kuah', 'es_nutrisari'],
    itemNames: ['Pangsit Kuah', 'Es Nutri Sari / Es Teh Manis'],
    price: 13000,
    tag: 'Nikmat',
    isFeatured: false,
    isActive: true,
    whatsappMessage: 'Halo Mie Ayam Lariska, saya mau pesan Paket Nikmat',
    order: 3
  },
  'paket_lengkap': {
    name: 'Paket Lengkap',
    description: 'Mie Ayam Komplit + Es Nutri Sari / Es Teh Manis',
    icon: '🎁',
    items: ['mie_ayam_komplit', 'es_nutrisari'],
    itemNames: ['Mie Ayam Komplit', 'Es Nutri Sari / Es Teh Manis'],
    price: 18000,
    tag: 'Lengkap',
    isFeatured: false,
    isActive: true,
    whatsappMessage: 'Halo Mie Ayam Lariska, saya mau pesan Paket Lengkap',
    order: 4
  }
};

function resolveItemNames(pkg, menuData) {
  if (pkg.itemNames && pkg.itemNames.length > 0) return pkg.itemNames;
  if (!menuData || !pkg.items) return [];
  return pkg.items.map(function(id) {
    return (menuData[id] && menuData[id].name) ? menuData[id].name : id;
  });
}

function buildWhatsAppLink(pkg) {
  const msg = pkg.whatsappMessage || 'Halo Mie Ayam Lariska, saya mau pesan ' + pkg.name;
  return 'https://wa.me/6281364856560?text=' + encodeURIComponent(msg);
}

function renderPackages(packagesData, menuData, container) {
  if (!container) {
    container = document.getElementById('packages-container');
  }
  if (!container) return;

  const activePackages = [];
  Object.keys(packagesData).forEach(function(id) {
    const pkg = packagesData[id];
    if (pkg && pkg.isActive) {
      activePackages.push({ id: id, data: pkg });
    }
  });

  activePackages.sort(function(a, b) {
    return (a.data.order || 99) - (b.data.order || 99);
  });

  let featured = null;
  const regular = [];

  activePackages.forEach(function(entry) {
    if (entry.data.isFeatured) {
      featured = entry;
    } else {
      regular.push(entry);
    }
  });

  let html = '';

  function renderCard(entry) {
    const pkg = entry.data;
    const isFeatured = pkg.isFeatured;
    const cardClass = isFeatured ? 'packages__card packages__card--featured' : 'packages__card';
    const itemNames = resolveItemNames(pkg, menuData);
    const waLink = buildWhatsAppLink(pkg);
    const priceK = Math.round(pkg.price / 1000);

    let cardHtml = '<div class="' + cardClass + '">';

    if (isFeatured) {
      cardHtml += '<div class="packages__card-badge">⭐ Paling Laris</div>';
    }

    cardHtml += '<div class="packages__card-header">';
    cardHtml += '<span class="packages__card-icon">' + AppUtils.escapeHtml(pkg.icon || '') + '</span>';
    cardHtml += '<h3 class="packages__card-name">' + AppUtils.escapeHtml(pkg.name) + '</h3>';
    cardHtml += '<span class="packages__card-tag">' + AppUtils.escapeHtml(pkg.tag || '') + '</span>';
    cardHtml += '</div>';

    if (itemNames.length > 0) {
      cardHtml += '<ul class="packages__card-items">';
      itemNames.forEach(function(item) {
        cardHtml += '<li>' + AppUtils.escapeHtml(item) + '</li>';
      });
      cardHtml += '</ul>';
    } else if (pkg.description) {
      cardHtml += '<p class="packages__card-description">' + AppUtils.escapeHtml(pkg.description) + '</p>';
    }

    cardHtml += '<div class="packages__card-pricing">';
    cardHtml += '<p class="packages__card-price"><span class="price">' + priceK + 'k</span></p>';
    cardHtml += '<span class="packages__badge--lengkap">Lengkap</span>';
    cardHtml += '</div>';

    cardHtml += '<a href="' + waLink + '" class="btn btn--primary packages__card-btn" target="_blank" rel="noopener">';
    cardHtml += '<span>Pesan via WhatsApp</span>';
    cardHtml += '<span class="btn__icon">💬</span>';
    cardHtml += '</a>';
    cardHtml += '</div>';
    return cardHtml;
  }

  const featuredHtml = featured ? renderCard(featured) : '';
  let regularHtml = '';
  regular.forEach(function(entry) { regularHtml += renderCard(entry); });

  if (featuredHtml) {
    html += '<div class="packages__featured">' + featuredHtml + '</div>';
  }
  html += '<div class="packages__grid">' + regularHtml + '</div>';

  container.innerHTML = html;
}

function loadPackages() {
  const container = document.getElementById('packages-container');
  if (!container) return false;

  if (typeof window.FirebaseService === 'undefined') return false;

  const FS = window.FirebaseService;

  FS.seedInitialPackages().then(function() {
    return Promise.all([FS.getPackages(), FS.getAllMenu()]);
  }).then(function(results) {
    const packagesData = results[0];
    const menuData = results[1];
    renderPackages(packagesData, menuData, container);

    FS.onAllPackagesChange(function(updatedPackages) {
      FS.getAllMenu().then(function(md) {
        renderPackages(updatedPackages, md, container);
      });
    });
  }).catch(function(err) {
    DebugUtil.debugWarn('[packages] Firebase error, using fallback:', err);
    renderPackages(FALLBACK_PACKAGES, null, container);
  });

  return true;
}

function initPackagesRenderer() {
  let loaded = false;
  const fallbackTimer = setTimeout(function() {
    if (!loaded) {
      DebugUtil.debugWarn('[packages] FirebaseService timeout, rendering fallback');
      const container = document.getElementById('packages-container');
      renderPackages(FALLBACK_PACKAGES, null, container);
    }
  }, 5000);

  function attemptLoad() {
    if (loaded) return;
    loaded = loadPackages();
    if (loaded) clearTimeout(fallbackTimer);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', attemptLoad);
  } else {
    attemptLoad();
  }

  window.addEventListener('FirebaseServiceReady', attemptLoad);

  let pollCount = 0;
  const pollInterval = setInterval(function() {
    pollCount++;
    if (loaded || pollCount > 50) {
      clearInterval(pollInterval);
      return;
    }
    attemptLoad();
  }, 100);
}

// Expose on window for non-module scripts
window.PackagesRenderer = {
  FALLBACK_PACKAGES,
  resolveItemNames,
  buildWhatsAppLink,
  renderPackages,
  loadPackages,
  initPackagesRenderer
};

// Auto-initialize when loaded as script
initPackagesRenderer();
