// ============================================
// RESET FIREBASE DATA - MIE AYAM LARISKA
// ============================================
// Script ini akan:
// 1. Hapus SEMUA data di Firebase (menu & packages)
// 2. Isi ulang dengan data yang konsisten dari codebase
// 3. Pastikan struktur data sesuai standar
//
// Cara pakai:
// 1. Buka https://mie-ayam-lariska-web.web.app
// 2. Buka Browser Console (F12 → Console)
// 3. Paste script ini dan tekan Enter
// 4. Tunggu sampai selesai
// ============================================

(function() {
  'use strict';
  
  console.log('🧹 FIREBASE DATA RESET - Mie Ayam Lariska');
  console.log('==========================================');
  console.log('');
  
  // Check if FirebaseService is available
  if (typeof window.FirebaseService === 'undefined') {
    console.error('❌ FirebaseService not found. Make sure you are on the Mie Ayam Lariska website.');
    return;
  }
  
  var FS = window.FirebaseService;
  var db = FS.db;
  
  // ============================================
  // DATA MENU YANG KONSISTEN
  // ============================================
  var CONSISTENT_MENU_DATA = {
    // Mie Ayam
    'mie_ayam_mini': {
      name: 'Mie Ayam Mini',
      category: 'mie_ayam',
      price: 5000,
      display_price: '5k',
      description: 'Porsi kecil, cocok untuk anak-anak',
      image: 'mie-ayam-mini.jpg',
      is_available: true,
      stock_status: 'available',
      updated_at: new Date().toISOString()
    },
    'mie_ayam_biasa': {
      name: 'Mie Ayam Biasa',
      category: 'mie_ayam',
      price: 10000,
      display_price: '10k',
      description: 'Mie ayam dengan topping standar',
      image: 'mie-ayam-biasa.jpg',
      is_available: true,
      stock_status: 'available',
      updated_at: new Date().toISOString()
    },
    'mie_ayam_pangsit': {
      name: 'Mie Ayam Pangsit',
      category: 'mie_ayam',
      price: 12000,
      display_price: '12k',
      description: 'Mie ayam dengan pangsit goreng',
      image: 'mie-ayam-pangsit.jpg',
      is_available: true,
      stock_status: 'available',
      updated_at: new Date().toISOString()
    },
    'mie_ayam_ceker': {
      name: 'Mie Ayam Ceker',
      category: 'mie_ayam',
      price: 12000,
      display_price: '12k',
      description: 'Mie ayam dengan ceker ayam',
      image: 'mie-ayam-ceker.jpg',
      is_available: true,
      stock_status: 'available',
      updated_at: new Date().toISOString()
    },
    'mie_ayam_bakso': {
      name: 'Mie Ayam Bakso',
      category: 'mie_ayam',
      price: 12000,
      display_price: '12k',
      description: 'Mie ayam dengan bakso',
      image: 'mie-ayam-bakso.jpg',
      is_available: true,
      stock_status: 'available',
      updated_at: new Date().toISOString()
    },
    'mie_ayam_komplit': {
      name: 'Mie Ayam Komplit',
      category: 'mie_ayam',
      price: 15000,
      display_price: '15k',
      description: 'Isi ceker, pangsit, dan bakso',
      image: 'mie-ayam-komplit.jpg',
      is_available: true,
      stock_status: 'available',
      updated_at: new Date().toISOString()
    },
    'mie_ayam_sayap': {
      name: 'Mie Ayam Sayap',
      category: 'mie_ayam',
      price: 13000,
      display_price: '13k',
      description: 'Mie ayam dengan sayap ayam',
      image: 'mie-ayam-sayap.jpg',
      is_available: true,
      stock_status: 'available',
      updated_at: new Date().toISOString()
    },
    'mie_ayam_telur_puyuh': {
      name: 'Mie Ayam Telur Puyuh',
      category: 'mie_ayam',
      price: 12000,
      display_price: '12k',
      description: 'Mie ayam dengan telur puyuh',
      image: 'mie-ayam-telur-puyuh.jpg',
      is_available: true,
      stock_status: 'available',
      updated_at: new Date().toISOString()
    },
    'mie_ayam_tulangan': {
      name: 'Mie Ayam Tulangan',
      category: 'mie_ayam',
      price: 13000,
      display_price: '13k',
      description: 'Mie ayam dengan tulangan ayam',
      image: 'mie-ayam-tulangan.jpg',
      is_available: true,
      stock_status: 'available',
      updated_at: new Date().toISOString()
    },
    'mie_ayam_kepala': {
      name: 'Mie Ayam Kepala',
      category: 'mie_ayam',
      price: 12000,
      display_price: '12k',
      description: 'Mie ayam dengan kepala ayam',
      image: 'mie-ayam-kepala.jpg',
      is_available: true,
      stock_status: 'available',
      updated_at: new Date().toISOString()
    },
    'pangsit_kuah': {
      name: 'Pangsit Kuah',
      category: 'mie_ayam',
      price: 10000,
      display_price: '10k',
      description: 'Pangsit dengan kuah gurih',
      image: 'pangsit-kuah.jpg',
      is_available: true,
      stock_status: 'available',
      updated_at: new Date().toISOString()
    },
    
    // Minuman
    'teh_anget': {
      name: 'Teh Anget',
      category: 'minuman',
      price: 2000,
      display_price: '2k',
      description: 'Teh hangat manis',
      image: 'teh-anget.jpg',
      is_available: true,
      stock_status: 'available',
      updated_at: new Date().toISOString()
    },
    'es_teh_manis': {
      name: 'Es Teh Manis',
      category: 'minuman',
      price: 3000,
      display_price: '3k',
      description: 'Es teh manis segar',
      image: 'es-teh-manis.jpg',
      is_available: true,
      stock_status: 'available',
      updated_at: new Date().toISOString()
    },
    'es_jeruk_peras': {
      name: 'Es Jeruk Peras',
      category: 'minuman',
      price: 4000,
      display_price: '4k',
      description: 'Es jeruk peras segar',
      image: 'es-jeruk-peras.jpg',
      is_available: true,
      stock_status: 'available',
      updated_at: new Date().toISOString()
    },
    'es_nutrisari': {
      name: 'Es Nutrisari',
      category: 'minuman',
      price: 3000,
      display_price: '3k',
      description: 'Es nutrisari segar',
      image: 'es-nutrisari.jpg',
      is_available: true,
      stock_status: 'available',
      updated_at: new Date().toISOString()
    },
    'es_tawar': {
      name: 'Es Tawar',
      category: 'minuman',
      price: 1000,
      display_price: '1k',
      description: 'Es air putih',
      image: 'es-tawar.jpg',
      is_available: true,
      stock_status: 'available',
      updated_at: new Date().toISOString()
    },
    
    // Topping Tambahan
    'topping_ceker': {
      name: 'Ceker',
      category: 'topping_tambahan',
      price: 2000,
      display_price: '2k',
      description: 'Topping ceker ayam',
      image: 'topping-ceker.jpg',
      is_available: true,
      stock_status: 'available',
      updated_at: new Date().toISOString()
    },
    'topping_pangsit_rebus': {
      name: 'Pangsit Rebus',
      category: 'topping_tambahan',
      price: 2000,
      display_price: '2k',
      description: 'Topping pangsit rebus',
      image: 'topping-pangsit-rebus.jpg',
      is_available: true,
      stock_status: 'available',
      updated_at: new Date().toISOString()
    },
    'topping_bakso': {
      name: 'Bakso',
      category: 'topping_tambahan',
      price: 2000,
      display_price: '2k',
      description: 'Topping bakso',
      image: 'topping-bakso.jpg',
      is_available: true,
      stock_status: 'available',
      updated_at: new Date().toISOString()
    },
    'topping_telur_puyuh': {
      name: 'Telur Puyuh',
      category: 'topping_tambahan',
      price: 2000,
      display_price: '2k',
      description: 'Topping telur puyuh',
      image: 'topping-telur-puyuh.jpg',
      is_available: true,
      stock_status: 'available',
      updated_at: new Date().toISOString()
    },
    'topping_kepala_ayam': {
      name: 'Kepala Ayam',
      category: 'topping_tambahan',
      price: 2000,
      display_price: '2k',
      description: 'Topping kepala ayam',
      image: 'topping-kepala-ayam.jpg',
      is_available: true,
      stock_status: 'available',
      updated_at: new Date().toISOString()
    },
    'topping_sayap': {
      name: 'Sayap',
      category: 'topping_tambahan',
      price: 3000,
      display_price: '3k',
      description: 'Topping sayap ayam',
      image: 'topping-sayap.jpg',
      is_available: true,
      stock_status: 'available',
      updated_at: new Date().toISOString()
    },
    'topping_tulangan': {
      name: 'Tulangan',
      category: 'topping_tambahan',
      price: 3000,
      display_price: '3k',
      description: 'Topping tulangan ayam',
      image: 'topping-tulangan.jpg',
      is_available: true,
      stock_status: 'available',
      updated_at: new Date().toISOString()
    },
    'topping_pangsit_goreng': {
      name: 'Pangsit Goreng',
      category: 'topping_tambahan',
      price: 2000,
      display_price: '2k',
      description: 'Topping pangsit goreng',
      image: 'topping-pangsit-goreng.jpg',
      is_available: true,
      stock_status: 'available',
      updated_at: new Date().toISOString()
    }
  };
  
  // ============================================
  // DATA PAKET YANG KONSISTEN
  // ============================================
  var CONSISTENT_PACKAGES_DATA = {
    'paket_lengkap': {
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
    'paket_spesial': {
      name: 'Paket Spesial',
      description: 'Mie Ayam Komplit + Es Nutrisari',
      icon: '🎁',
      items: ['mie_ayam_komplit', 'es_nutrisari'],
      price: 18000,
      tag: 'Spesial',
      isFeatured: false,
      isActive: true,
      whatsappMessage: 'Halo Mie Ayam Lariska, saya mau pesan Paket Spesial',
      order: 4
    }
  };
  
  // ============================================
  // PROSES RESET
  // ============================================
  
  console.log('📋 Data yang akan diisi:');
  console.log('   - Menu items:', Object.keys(CONSISTENT_MENU_DATA).length);
  console.log('   - Packages:', Object.keys(CONSISTENT_PACKAGES_DATA).length);
  console.log('');
  
  // Step 1: Delete all existing data
  console.log('🗑️  STEP 1: Menghapus semua data lama...');
  
  var menuRef = db.ref('menu');
  var packagesRef = db.ref('packages');
  
  Promise.all([
    menuRef.remove(),
    packagesRef.remove()
  ]).then(function() {
    console.log('✅ Semua data lama berhasil dihapus');
    console.log('');
    
    // Step 2: Seed menu data
    console.log('🍜 STEP 2: Mengisi data menu...');
    return menuRef.set(CONSISTENT_MENU_DATA);
  }).then(function() {
    console.log('✅ Data menu berhasil diisi (' + Object.keys(CONSISTENT_MENU_DATA).length + ' items)');
    console.log('');
    
    // Step 3: Seed packages data
    console.log('📦 STEP 3: Mengisi data paket...');
    return packagesRef.set(CONSISTENT_PACKAGES_DATA);
  }).then(function() {
    console.log('✅ Data paket berhasil diisi (' + Object.keys(CONSISTENT_PACKAGES_DATA).length + ' paket)');
    console.log('');
    
    // Step 4: Verify data
    console.log('🔍 STEP 4: Verifikasi data...');
    return Promise.all([
      menuRef.once('value'),
      packagesRef.once('value')
    ]);
  }).then(function(snapshots) {
    var menuSnapshot = snapshots[0];
    var packagesSnapshot = snapshots[1];
    
    var menuCount = menuSnapshot.numChildren();
    var packagesCount = packagesSnapshot.numChildren();
    
    console.log('✅ Verifikasi berhasil:');
    console.log('   - Menu items di Firebase: ' + menuCount);
    console.log('   - Packages di Firebase: ' + packagesCount);
    console.log('');
    
    // Summary
    console.log('==========================================');
    console.log('🎉 RESET FIREBASE DATA SELESAI!');
    console.log('==========================================');
    console.log('');
    console.log('📊 Data yang sudah diisi:');
    console.log('');
    console.log('🍜 MENU ITEMS:');
    console.log('   Mie Ayam (11 items):');
    console.log('   - Mie Ayam Mini (5k)');
    console.log('   - Mie Ayam Biasa (10k)');
    console.log('   - Mie Ayam Pangsit (12k)');
    console.log('   - Mie Ayam Ceker (12k)');
    console.log('   - Mie Ayam Bakso (12k)');
    console.log('   - Mie Ayam Komplit (15k)');
    console.log('   - Mie Ayam Sayap (13k)');
    console.log('   - Mie Ayam Telur Puyuh (12k)');
    console.log('   - Mie Ayam Tulangan (13k)');
    console.log('   - Mie Ayam Kepala (12k)');
    console.log('   - Pangsit Kuah (10k)');
    console.log('');
    console.log('   Minuman (5 items):');
    console.log('   - Teh Anget (2k)');
    console.log('   - Es Teh Manis (3k)');
    console.log('   - Es Jeruk Peras (4k)');
    console.log('   - Es Nutrisari (3k)');
    console.log('   - Es Tawar (1k)');
    console.log('');
    console.log('   Topping Tambahan (8 items):');
    console.log('   - Ceker (2k)');
    console.log('   - Pangsit Rebus (2k)');
    console.log('   - Bakso (2k)');
    console.log('   - Telur Puyuh (2k)');
    console.log('   - Kepala Ayam (2k)');
    console.log('   - Sayap (3k)');
    console.log('   - Tulangan (3k)');
    console.log('   - Pangsit Goreng (2k)');
    console.log('');
    console.log('📦 PAKET REKOMENDASI:');
    console.log('   - Paket Lengkap (13k) - Mie Ayam Biasa + Es Teh Manis');
    console.log('   - Paket Favorit (15k) ⭐ - Mie Ayam Pangsit + Es Teh Manis');
    console.log('   - Paket Kenyang (18k) - Mie Ayam Komplit + Es Teh Manis');
    console.log('   - Paket Spesial (18k) - Mie Ayam Komplit + Es Nutrisari');
    console.log('');
    console.log('🔄 Refresh halaman untuk melihat perubahan');
    console.log('');
    console.log('✅ Semua data sudah konsisten dan sesuai dengan codebase!');
    
  }).catch(function(error) {
    console.error('❌ Error saat reset Firebase:', error);
    console.log('');
    console.log('💡 Tips:');
    console.log('   - Pastikan Anda berada di website Mie Ayam Lariska');
    console.log('   - Pastikan koneksi internet stabil');
    console.log('   - Coba refresh halaman dan jalankan lagi');
  });
})();
