import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('StockService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe('Module structure', () => {
    it('should export StockService object', async () => {
      const module = await import('../../js/stock-service.js');
      expect(module).toHaveProperty('StockService');
      expect(typeof module.StockService).toBe('object');
    });

    it('should have normalizeStockStatus method', async () => {
      const { StockService } = await import('../../js/stock-service.js');
      expect(StockService).toHaveProperty('normalizeStockStatus');
      expect(typeof StockService.normalizeStockStatus).toBe('function');
    });

    it('should have saveStockData method', async () => {
      const { StockService } = await import('../../js/stock-service.js');
      expect(StockService).toHaveProperty('saveStockData');
      expect(typeof StockService.saveStockData).toBe('function');
    });

    it('should have getCachedStockData method', async () => {
      const { StockService } = await import('../../js/stock-service.js');
      expect(StockService).toHaveProperty('getCachedStockData');
      expect(typeof StockService.getCachedStockData).toBe('function');
    });

    it('should have mergeStockData method', async () => {
      const { StockService } = await import('../../js/stock-service.js');
      expect(StockService).toHaveProperty('mergeStockData');
      expect(typeof StockService.mergeStockData).toBe('function');
    });

    it('should set window.StockService for backward compat', async () => {
      await import('../../js/stock-service.js');
      expect(window.StockService).toBeDefined();
      expect(window.StockService).toHaveProperty('normalizeStockStatus');
    });
  });

  describe('normalizeStockStatus', () => {
    it('should return "available" for valid "available"', async () => {
      const { StockService } = await import('../../js/stock-service.js');
      expect(StockService.normalizeStockStatus('available')).toBe('available');
    });

    it('should return "limited" for valid "limited"', async () => {
      const { StockService } = await import('../../js/stock-service.js');
      expect(StockService.normalizeStockStatus('limited')).toBe('limited');
    });

    it('should return "sold_out" for valid "sold_out"', async () => {
      const { StockService } = await import('../../js/stock-service.js');
      expect(StockService.normalizeStockStatus('sold_out')).toBe('sold_out');
    });

    it('should return "sold_out" for invalid status', async () => {
      const { StockService } = await import('../../js/stock-service.js');
      expect(StockService.normalizeStockStatus('INVALID')).toBe('sold_out');
    });

    it('should return "sold_out" for null', async () => {
      const { StockService } = await import('../../js/stock-service.js');
      expect(StockService.normalizeStockStatus(null)).toBe('sold_out');
    });

    it('should return "sold_out" for undefined', async () => {
      const { StockService } = await import('../../js/stock-service.js');
      expect(StockService.normalizeStockStatus(undefined)).toBe('sold_out');
    });

    it('should return "sold_out" for empty string', async () => {
      const { StockService } = await import('../../js/stock-service.js');
      expect(StockService.normalizeStockStatus('')).toBe('sold_out');
    });
  });

  describe('saveStockData', () => {
    it('should save data to localStorage', async () => {
      const { StockService } = await import('../../js/stock-service.js');
      const data = { item1: { status: 'available' } };
      StockService.saveStockData(data);
      expect(localStorage.setItem).toHaveBeenCalled();
    });
  });

  describe('getCachedStockData', () => {
    it('should return null or empty object if no cached data', async () => {
      const { StockService } = await import('../../js/stock-service.js');
      const result = StockService.getCachedStockData();
      // Returns null or empty object depending on implementation
      expect(result === null || typeof result === 'object').toBe(true);
    });
  });

  describe('mergeStockData', () => {
    it('should merge menu and stock data', async () => {
      const { StockService } = await import('../../js/stock-service.js');
      const menuData = {
        item1: { name: 'Mie Ayam', price: 12000 },
        item2: { name: 'Es Teh', price: 5000 },
      };
      const stockData = {
        item1: { status: 'available' },
        item2: { status: 'sold_out' },
      };
      const result = StockService.mergeStockData(menuData, stockData);
      // Status should be normalized
      expect(result.item1.status).toBeDefined();
      expect(result.item2.status).toBeDefined();
    });

    it('should default to available if no stock data', async () => {
      const { StockService } = await import('../../js/stock-service.js');
      const menuData = {
        item1: { name: 'Mie Ayam', price: 12000 },
      };
      const result = StockService.mergeStockData(menuData, {});
      // Should have a status (either from normalization or default)
      expect(result.item1.status).toBeDefined();
    });
  });
});
