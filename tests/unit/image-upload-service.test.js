import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('ImageUploadService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Module structure', () => {
    it('should export ImageUploadService object', async () => {
      const module = await import('../../js/image-upload-service.js');
      expect(module).toHaveProperty('ImageUploadService');
      expect(typeof module.ImageUploadService).toBe('object');
    });

    it('should have init method', async () => {
      const { ImageUploadService } = await import('../../js/image-upload-service.js');
      expect(ImageUploadService).toHaveProperty('init');
      expect(typeof ImageUploadService.init).toBe('function');
    });

    it('should export getImagePath function', async () => {
      const module = await import('../../js/image-upload-service.js');
      expect(module).toHaveProperty('getImagePath');
      expect(typeof module.getImagePath).toBe('function');
    });

    it('should export validateImage function', async () => {
      const module = await import('../../js/image-upload-service.js');
      expect(module).toHaveProperty('validateImage');
      expect(typeof module.validateImage).toBe('function');
    });

    it('should set window.ImageUploadService for backward compat', async () => {
      await import('../../js/image-upload-service.js');
      expect(window.ImageUploadService).toBeDefined();
      expect(window.ImageUploadService).toHaveProperty('init');
    });
  });

  describe('getImagePath', () => {
    it('should generate slug from item name', async () => {
      const { getImagePath } = await import('../../js/image-upload-service.js');
      const path = getImagePath('Mie Ayam Biasa');
      expect(path).toContain('mie-ayam-biasa');
    });

    it('should handle special characters', async () => {
      const { getImagePath } = await import('../../js/image-upload-service.js');
      const path = getImagePath('Es Teh Manis (Dingin)');
      expect(path).not.toContain('(');
      expect(path).not.toContain(')');
    });

    it('should handle multiple spaces', async () => {
      const { getImagePath } = await import('../../js/image-upload-service.js');
      const path = getImagePath('Mie   Ayam   Komplit');
      expect(path).not.toContain('   ');
    });
  });

  describe('validateImage', () => {
    it('should accept valid image types', async () => {
      const { validateImage } = await import('../../js/image-upload-service.js');
      const validFile = { type: 'image/jpeg', size: 1024 * 100 }; // 100KB
      const result = validateImage(validFile);
      expect(result.valid).toBe(true);
    });

    it('should accept PNG images', async () => {
      const { validateImage } = await import('../../js/image-upload-service.js');
      const validFile = { type: 'image/png', size: 1024 * 100 };
      const result = validateImage(validFile);
      expect(result.valid).toBe(true);
    });

    it('should accept WebP images', async () => {
      const { validateImage } = await import('../../js/image-upload-service.js');
      const validFile = { type: 'image/webp', size: 1024 * 100 };
      const result = validateImage(validFile);
      expect(result.valid).toBe(true);
    });

    it('should reject non-image files', async () => {
      const { validateImage } = await import('../../js/image-upload-service.js');
      const invalidFile = { type: 'application/pdf', size: 1024 * 100 };
      const result = validateImage(invalidFile);
      expect(result.valid).toBe(false);
    });

    it('should reject files larger than 2MB', async () => {
      const { validateImage } = await import('../../js/image-upload-service.js');
      const largeFile = { type: 'image/jpeg', size: 1024 * 1024 * 3 }; // 3MB
      const result = validateImage(largeFile);
      expect(result.valid).toBe(false);
    });

    it('should accept files under 2MB', async () => {
      const { validateImage } = await import('../../js/image-upload-service.js');
      const validFile = { type: 'image/jpeg', size: 1024 * 1024 * 1.5 }; // 1.5MB
      const result = validateImage(validFile);
      expect(result.valid).toBe(true);
    });
  });

  describe('init', () => {
    it('should return service instance', async () => {
      const { ImageUploadService } = await import('../../js/image-upload-service.js');
      const mockConfig = {
        fileInput: { addEventListener: vi.fn() },
        preview: { src: '', style: { display: '' } },
        uploadArea: { classList: { add: vi.fn(), remove: vi.fn() }, addEventListener: vi.fn() },
        storagePath: 'images/menu',
      };
      const instance = ImageUploadService.init(mockConfig);
      expect(instance).toBeDefined();
      expect(instance).toHaveProperty('showImagePreview');
      expect(instance).toHaveProperty('uploadImage');
    });
  });
});
