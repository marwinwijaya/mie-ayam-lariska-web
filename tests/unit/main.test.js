import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock DOM elements
const mockNavToggle = {
  classList: { toggle: vi.fn(), contains: vi.fn() },
  setAttribute: vi.fn(),
  addEventListener: vi.fn(),
};

const mockNavMenu = {
  classList: { toggle: vi.fn(), contains: vi.fn() },
  querySelectorAll: vi.fn(() => []),
  addEventListener: vi.fn(),
};

const mockFaqButtons = [
  { addEventListener: vi.fn(), getAttribute: vi.fn(() => 'faq-answer-1'), classList: { toggle: vi.fn() } },
  { addEventListener: vi.fn(), getAttribute: vi.fn(() => 'faq-answer-2'), classList: { toggle: vi.fn() } },
];

const mockFaqAnswers = [
  { classList: { toggle: vi.fn(), contains: vi.fn(() => false) }, style: { maxHeight: '' } },
  { classList: { toggle: vi.fn(), contains: vi.fn(() => false) }, style: { maxHeight: '' } },
];

document.getElementById = vi.fn((id) => {
  if (id === 'nav-toggle') return mockNavToggle;
  if (id === 'nav-menu') return mockNavMenu;
  return null;
});

document.querySelectorAll = vi.fn((selector) => {
  if (selector === '.faq__question') return mockFaqButtons;
  if (selector === '.faq__answer') return mockFaqAnswers;
  if (selector === '.nav__link') return [];
  if (selector === 'a[href^="#"]') return [];
  if (selector === 'section[data-section]') return [];
  return [];
});

// Mock FirebaseService
window.FirebaseService = {
  onMenuChange: vi.fn(),
  onStockChange: vi.fn(),
  onAllStockChange: vi.fn(),
  getAllMenu: vi.fn(() => Promise.resolve({})),
  getStockStatus: vi.fn(() => Promise.resolve({})),
  seedInitialMenu: vi.fn(() => Promise.resolve()),
  seedInitialStock: vi.fn(() => Promise.resolve()),
  getMenu: vi.fn(() => Promise.resolve({})),
};

window.StockService = {
  getCachedStockData: vi.fn(() => ({})),
  saveStockData: vi.fn(),
  normalizeStockStatus: vi.fn((status) => status),
  mergeStockData: vi.fn((menu, stock) => menu),
};

describe('Main', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Module structure', () => {
    it('should export initApp function', async () => {
      const module = await import('../../js/main.js');
      expect(module).toHaveProperty('initApp');
      expect(typeof module.initApp).toBe('function');
    });
  });

  describe('initApp', () => {
    it('should initialize without errors', async () => {
      const { initApp } = await import('../../js/main.js');
      expect(() => initApp()).not.toThrow();
    });
  });
});
