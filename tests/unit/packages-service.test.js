import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock FirebaseService
window.FirebaseService = {
  addPackage: vi.fn(() => Promise.resolve('new-id')),
  updatePackage: vi.fn(() => Promise.resolve()),
  deletePackage: vi.fn(() => Promise.resolve()),
  getPackages: vi.fn(() => Promise.resolve({})),
  onAllPackagesChange: vi.fn(),
  packagesRef: {
    child: vi.fn(() => ({
      once: vi.fn(() => Promise.resolve({ exists: () => false })),
      set: vi.fn(() => Promise.resolve()),
      remove: vi.fn(() => Promise.resolve()),
    })),
  },
};

describe('PackagesService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Module structure', () => {
    it('should export PackagesService object', async () => {
      const module = await import('../../js/packages-service.js');
      expect(module).toHaveProperty('PackagesService');
      expect(typeof module.PackagesService).toBe('object');
    });

    it('should have add method', async () => {
      const { PackagesService } = await import('../../js/packages-service.js');
      expect(PackagesService).toHaveProperty('add');
      expect(typeof PackagesService.add).toBe('function');
    });

    it('should have update method', async () => {
      const { PackagesService } = await import('../../js/packages-service.js');
      expect(PackagesService).toHaveProperty('update');
      expect(typeof PackagesService.update).toBe('function');
    });

    it('should have delete method', async () => {
      const { PackagesService } = await import('../../js/packages-service.js');
      expect(PackagesService).toHaveProperty('delete');
      expect(typeof PackagesService.delete).toBe('function');
    });

    it('should export validatePackage function', async () => {
      const module = await import('../../js/packages-service.js');
      expect(module).toHaveProperty('validatePackage');
      expect(typeof module.validatePackage).toBe('function');
    });

    it('should set window.PackagesService for backward compat', async () => {
      await import('../../js/packages-service.js');
      expect(window.PackagesService).toBeDefined();
      expect(window.PackagesService).toHaveProperty('add');
    });
  });

  describe('validatePackage', () => {
    it('should reject package without name', async () => {
      const { validatePackage } = await import('../../js/packages-service.js');
      const result = validatePackage({ price: 15000, items: ['item1'] });
      expect(result.valid).toBe(false);
    });

    it('should reject package with empty name', async () => {
      const { validatePackage } = await import('../../js/packages-service.js');
      const result = validatePackage({ name: '', price: 15000, items: ['item1'] });
      expect(result.valid).toBe(false);
    });

    it('should reject package with whitespace-only name', async () => {
      const { validatePackage } = await import('../../js/packages-service.js');
      const result = validatePackage({ name: '   ', price: 15000, items: ['item1'] });
      expect(result.valid).toBe(false);
    });

    it('should reject package without price', async () => {
      const { validatePackage } = await import('../../js/packages-service.js');
      const result = validatePackage({ name: 'Test Package', items: ['item1'] });
      expect(result.valid).toBe(false);
    });

    it('should reject package with price 0', async () => {
      const { validatePackage } = await import('../../js/packages-service.js');
      const result = validatePackage({ name: 'Test Package', price: 0, items: ['item1'] });
      expect(result.valid).toBe(false);
    });

    it('should reject package with negative price', async () => {
      const { validatePackage } = await import('../../js/packages-service.js');
      const result = validatePackage({ name: 'Test Package', price: -1000, items: ['item1'] });
      expect(result.valid).toBe(false);
    });

    it('should accept valid package data', async () => {
      const { validatePackage } = await import('../../js/packages-service.js');
      const result = validatePackage({
        name: 'Test Package',
        price: 15000,
        items: ['item1', 'item2'],
      });
      expect(result.valid).toBe(true);
    });

    it('should accept package with price 1 (minimum)', async () => {
      const { validatePackage } = await import('../../js/packages-service.js');
      const result = validatePackage({
        name: 'Cheap Package',
        price: 1,
        items: ['item1'],
      });
      expect(result.valid).toBe(true);
    });
  });

  describe('add', () => {
    it('should call FirebaseService.addPackage with valid data', async () => {
      const { PackagesService } = await import('../../js/packages-service.js');
      const pkgData = {
        name: 'Test Package',
        price: 15000,
        items: ['item1'],
        description: 'Test description',
      };
      await PackagesService.add(pkgData);
      expect(window.FirebaseService.addPackage).toHaveBeenCalled();
    });

    it('should reject invalid package data', async () => {
      const { PackagesService } = await import('../../js/packages-service.js');
      await expect(PackagesService.add({ name: '', price: 0 })).rejects.toThrow();
    });
  });

  describe('update', () => {
    it('should call FirebaseService.updatePackage', async () => {
      const { PackagesService } = await import('../../js/packages-service.js');
      const pkgData = {
        name: 'Updated Package',
        price: 20000,
        items: ['item1'],
      };
      await PackagesService.update('pkg-1', pkgData);
      expect(window.FirebaseService.updatePackage).toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should call FirebaseService.deletePackage', async () => {
      const { PackagesService } = await import('../../js/packages-service.js');
      await PackagesService.delete('pkg-1');
      expect(window.FirebaseService.deletePackage).toHaveBeenCalled();
    });
  });
});
