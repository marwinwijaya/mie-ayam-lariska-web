(function() {
  'use strict';

  /**
   * ImageUploadService
   * Handles menu image upload, rename, preview, and download
   */
  window.ImageUploadService = {
    /**
     * Generate slug from menu name
     * @param {string} name - Menu name
     * @returns {string} - Slugified name
     */
    generateSlug: function(name) {
      return name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')  // Remove special chars
        .replace(/\s+/g, '-')           // Replace spaces with dash
        .replace(/-+/g, '-')            // Remove multiple dashes
        .replace(/^-|-$/g, '');         // Remove leading/trailing dashes
    },

    /**
     * Get file extension from file
     * @param {File} file - File object
     * @returns {string} - File extension
     */
    getFileExtension: function(file) {
      var name = file.name;
      var lastDot = name.lastIndexOf('.');
      return lastDot > 0 ? name.substring(lastDot + 1).toLowerCase() : 'jpg';
    },

    /**
     * Validate image file
     * @param {File} file - File to validate
     * @returns {Object} - { valid: boolean, error: string }
     */
    validateImage: function(file) {
      var allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      var maxSize = 2 * 1024 * 1024; // 2MB

      if (!file) {
        return { valid: false, error: 'Pilih file gambar terlebih dahulu' };
      }

      if (allowedTypes.indexOf(file.type) === -1) {
        return { valid: false, error: 'Format file harus JPG, PNG, atau WebP' };
      }

      if (file.size > maxSize) {
        return { valid: false, error: 'Ukuran file maksimal 2MB' };
      }

      return { valid: true, error: null };
    },

    /**
     * Create image preview
     * @param {File} file - Image file
     * @param {HTMLImageElement} imgElement - Image element for preview
     * @returns {Promise} - Resolves when preview is loaded
     */
    createPreview: function(file, imgElement) {
      return new Promise(function(resolve, reject) {
        var reader = new FileReader();
        reader.onload = function(e) {
          imgElement.src = e.target.result;
          imgElement.style.display = 'block';
          resolve(e.target.result);
        };
        reader.onerror = function() {
          reject(new Error('Gagal membaca file'));
        };
        reader.readAsDataURL(file);
      });
    },

    /**
     * Generate renamed file for download
     * @param {File} file - Original file
     * @param {string} menuName - Menu name for renaming
     * @returns {Object} - { blob: Blob, filename: string, url: string }
     */
    generateRenamedFile: function(file, menuName) {
      var slug = this.generateSlug(menuName);
      var ext = this.getFileExtension(file);
      var filename = slug + '.' + ext;
      var blob = new Blob([file], { type: file.type });
      var url = URL.createObjectURL(blob);

      return {
        blob: blob,
        filename: filename,
        url: url
      };
    },

    /**
     * Trigger file download
     * @param {string} url - Object URL
     * @param {string} filename - Download filename
     */
    downloadFile: function(url, filename) {
      var link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Cleanup object URL after short delay
      setTimeout(function() {
        URL.revokeObjectURL(url);
      }, 1000);
    },

    /**
     * Get image path for menu item
     * @param {string} menuName - Menu name
     * @returns {string} - Image path
     */
    getImagePath: function(menuName) {
      var slug = this.generateSlug(menuName);
      return 'images/' + slug + '.jpg';
    },

    /**
     * Initialize image upload on a form
     * @param {Object} config - Configuration
     */
    init: function(config) {
      var fileInput = config.fileInput;
      var preview = config.preview;
      var previewContainer = config.previewContainer;
      var downloadBtn = config.downloadBtn;
      var filenameDisplay = config.filenameDisplay;
      var menuNameInput = config.menuNameInput;

      var currentFile = null;
      var self = this;

      // Handle file selection
      fileInput.addEventListener('change', function(e) {
        var file = e.target.files[0];
        if (!file) return;

        var validation = self.validateImage(file);
        if (!validation.valid) {
          alert(validation.error);
          fileInput.value = '';
          return;
        }

        currentFile = file;

        // Show preview
        self.createPreview(file, preview).then(function() {
          previewContainer.style.display = 'block';
        });

        // Generate preview filename
        var menuName = menuNameInput.value || 'menu-item';
        var renamed = self.generateRenamedFile(file, menuName);
        filenameDisplay.textContent = 'File akan di-rename: ' + renamed.filename;
        downloadBtn.style.display = 'inline-flex';
        
        // Cleanup
        URL.revokeObjectURL(renamed.url);
      });

      // Handle download
      downloadBtn.addEventListener('click', function() {
        if (!currentFile) {
          alert('Pilih file gambar terlebih dahulu');
          return;
        }

        var menuName = menuNameInput.value;
        if (!menuName) {
          alert('Isi nama menu terlebih dahulu untuk generate nama file');
          return;
        }

        var renamed = self.generateRenamedFile(currentFile, menuName);
        self.downloadFile(renamed.url, renamed.filename);
      });

      // Update filename when menu name changes
      menuNameInput.addEventListener('input', function() {
        if (currentFile && this.value) {
          var renamed = self.generateRenamedFile(currentFile, this.value);
          filenameDisplay.textContent = 'File akan di-rename: ' + renamed.filename;
          URL.revokeObjectURL(renamed.url);
        }
      });

      // Reset function
      return {
        reset: function() {
          currentFile = null;
          fileInput.value = '';
          preview.src = '';
          preview.style.display = 'none';
          previewContainer.style.display = 'none';
          downloadBtn.style.display = 'none';
          filenameDisplay.textContent = '';
        },
        getCurrentFile: function() {
          return currentFile;
        }
      };
    }
  };
})();