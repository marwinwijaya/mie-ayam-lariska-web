// ============================================
// RESET PACKAGES TO DEFAULT
// ============================================
// Cara pakai:
// 1. Buka https://mie-ayam-lariska.web.app (atau localhost)
// 2. Buka Browser Console (F12 → Console)
// 3. Paste script ini dan tekan Enter
// 4. Tunggu sampai muncul "Packages reset complete!"
// ============================================

(function() {
  'use strict';
  
  console.log('🔄 Starting packages reset...');
  
  // Check if FirebaseService is available
  if (typeof window.FirebaseService === 'undefined') {
    console.error('❌ FirebaseService not found. Make sure you are on the Mie Ayam Lariska website.');
    return;
  }
  
  var FS = window.FirebaseService;
  
  // Step 1: Delete all existing packages
  console.log('🗑️  Deleting all existing packages...');
  
  FS.getPackages().then(function(existingPackages) {
    var deletePromises = [];
    
    Object.keys(existingPackages).forEach(function(packageId) {
      console.log('   Deleting:', packageId);
      deletePromises.push(FS.deletePackage(packageId));
    });
    
    return Promise.all(deletePromises);
  }).then(function() {
    console.log('✅ All packages deleted.');
    
    // Step 2: Re-seed with initial data
    console.log('🌱 Seeding default packages...');
    
    // Force seed by temporarily clearing the reference
    return FS.packagesRef.set(FS.INITIAL_PACKAGES_DATA);
  }).then(function() {
    console.log('✅ Packages reset complete!');
    console.log('');
    console.log('Default packages restored:');
    console.log('  - Paket Lengkap (13k)');
    console.log('  - Paket Favorit (15k) ⭐ Featured');
    console.log('  - Paket Kenyang (18k)');
    console.log('  - Topping Suka-Suka (+2k)');
    console.log('');
    console.log('🔄 Refresh the page to see changes.');
  }).catch(function(error) {
    console.error('❌ Error resetting packages:', error);
  });
})();
