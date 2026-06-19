import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock DOM elements
const mockContainer = {
  querySelectorAll: vi.fn(() => []),
  querySelector: vi.fn(),
  addEventListener: vi.fn(),
};

describe('DragDropService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Module structure', () => {
    it('should export DragDropService object', async () => {
      const module = await import('../../js/drag-drop-service.js');
      expect(module).toHaveProperty('DragDropService');
      expect(typeof module.DragDropService).toBe('object');
    });

    it('should have initDragDrop method', async () => {
      const { DragDropService } = await import('../../js/drag-drop-service.js');
      expect(DragDropService).toHaveProperty('initDragDrop');
      expect(typeof DragDropService.initDragDrop).toBe('function');
    });

    it('should have initArrowButtons method', async () => {
      const { DragDropService } = await import('../../js/drag-drop-service.js');
      expect(DragDropService).toHaveProperty('initArrowButtons');
      expect(typeof DragDropService.initArrowButtons).toBe('function');
    });

    it('should have isMobile method', async () => {
      const { DragDropService } = await import('../../js/drag-drop-service.js');
      expect(DragDropService).toHaveProperty('isMobile');
      expect(typeof DragDropService.isMobile).toBe('function');
    });

    it('should set window.DragDropService for backward compat', async () => {
      await import('../../js/drag-drop-service.js');
      expect(window.DragDropService).toBeDefined();
      expect(window.DragDropService).toHaveProperty('initDragDrop');
    });
  });

  describe('initDragDrop', () => {
    it('should accept callbacks object', async () => {
      const { DragDropService } = await import('../../js/drag-drop-service.js');
      const callbacks = {
        onReorder: vi.fn(),
        getItems: vi.fn(() => []),
      };
      expect(() => {
        DragDropService.initDragDrop(callbacks);
      }).not.toThrow();
    });

    it('should handle missing callbacks gracefully', async () => {
      const { DragDropService } = await import('../../js/drag-drop-service.js');
      expect(() => {
        DragDropService.initDragDrop({});
      }).not.toThrow();
    });
  });

});
