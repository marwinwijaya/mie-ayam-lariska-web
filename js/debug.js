/**
 * Debug utility - Toggle debug logging via localStorage
 * 
 * Usage:
 *   Enable:  localStorage.setItem('mie_ayam_lariska_debug', 'true')
 *   Disable: localStorage.removeItem('mie_ayam_lariska_debug')
 *   Check:   DebugUtil.isDebugMode()
 */

const DEBUG_KEY = 'mie_ayam_lariska_debug';

function isDebugMode() {
  try {
    return localStorage.getItem(DEBUG_KEY) === 'true';
  } catch (e) {
    return false;
  }
}

function debugLog(...args) {
  if (isDebugMode()) {
    console.log(...args);
  }
}

function debugWarn(...args) {
  if (isDebugMode()) {
    console.warn(...args);
  }
}

function debugError(...args) {
  // Always show errors regardless of debug mode
  console.error(...args);
}

// Expose on window for non-module scripts
if (typeof window !== 'undefined') {
  window.DebugUtil = { isDebugMode, debugLog, debugWarn, debugError };
}
