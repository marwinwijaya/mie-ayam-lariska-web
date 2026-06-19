import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock DOM elements
const mockStatusElement = {
  classList: { add: vi.fn(), remove: vi.fn() },
  textContent: '',
};

const mockReconnectButton = {
  addEventListener: vi.fn(),
  style: { display: '' },
};

describe('FirebaseConnectionService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockStatusElement.textContent = '';
    mockReconnectButton.style.display = '';
  });

  describe('Module structure', () => {
    it('should export FirebaseConnectionService object', async () => {
      const module = await import('../../js/firebase-connection-service.js');
      expect(module).toHaveProperty('FirebaseConnectionService');
      expect(typeof module.FirebaseConnectionService).toBe('object');
    });

    it('should have init method', async () => {
      const { FirebaseConnectionService } = await import('../../js/firebase-connection-service.js');
      expect(FirebaseConnectionService).toHaveProperty('init');
      expect(typeof FirebaseConnectionService.init).toBe('function');
    });

    it('should have getConnectionStatus method', async () => {
      const { FirebaseConnectionService } = await import('../../js/firebase-connection-service.js');
      expect(FirebaseConnectionService).toHaveProperty('getConnectionStatus');
      expect(typeof FirebaseConnectionService.getConnectionStatus).toBe('function');
    });

    it('should have reconnect method', async () => {
      const { FirebaseConnectionService } = await import('../../js/firebase-connection-service.js');
      expect(FirebaseConnectionService).toHaveProperty('reconnect');
      expect(typeof FirebaseConnectionService.reconnect).toBe('function');
    });

    it('should set window.FirebaseConnectionService for backward compat', async () => {
      await import('../../js/firebase-connection-service.js');
      expect(window.FirebaseConnectionService).toBeDefined();
      expect(window.FirebaseConnectionService).toHaveProperty('init');
    });
  });

  describe('init', () => {
    it('should accept config object with DOM elements', async () => {
      const { FirebaseConnectionService } = await import('../../js/firebase-connection-service.js');
      expect(() => {
        FirebaseConnectionService.init({
          statusElement: mockStatusElement,
          reconnectButton: mockReconnectButton,
        });
      }).not.toThrow();
    });

    it('should handle missing DOM elements gracefully', async () => {
      const { FirebaseConnectionService } = await import('../../js/firebase-connection-service.js');
      expect(() => {
        FirebaseConnectionService.init({
          statusElement: null,
          reconnectButton: null,
        });
      }).not.toThrow();
    });
  });

  describe('getConnectionStatus', () => {
    it('should return connection status', async () => {
      const { FirebaseConnectionService } = await import('../../js/firebase-connection-service.js');
      const status = FirebaseConnectionService.getConnectionStatus();
      expect(typeof status).toBe('object');
      expect(status).toHaveProperty('connected');
    });
  });
});
