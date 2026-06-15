/**
 * FirebaseConnectionService Module — Connection monitoring and reconnect
 *
 * Provides Firebase connection status monitoring and manual reconnect functionality.
 * Includes debounce protection and visual feedback.
 *
 * Architecture: IIFE module, exposes window.FirebaseConnectionService
 */

(function () {
  'use strict';

  // ---------------------------------------------------------------------------
  // State
  // ---------------------------------------------------------------------------
  var isConnected = false;
  var isReconnecting = false;
  var statusElement = null;
  var reconnectButton = null;
  var connectionListener = null;
  var onStatusChangeCallback = null;

  // ---------------------------------------------------------------------------
  // Helper functions
  // ---------------------------------------------------------------------------

  /**
   * Update the status display element.
   * @param {boolean} connected - Connection status
   */
  function updateStatusDisplay(connected) {
    isConnected = connected;

    if (statusElement) {
      if (connected) {
        statusElement.textContent = 'Terhubung';
        statusElement.style.color = '#2E7D32';
        statusElement.style.fontWeight = '600';
      } else {
        statusElement.textContent = 'Terputus';
        statusElement.style.color = '#C40000';
        statusElement.style.fontWeight = '600';
      }
    }

    if (reconnectButton) {
      if (connected) {
        reconnectButton.style.display = 'none';
      } else {
        reconnectButton.style.display = 'inline-flex';
        reconnectButton.disabled = isReconnecting;
        reconnectButton.textContent = isReconnecting ? 'Menghubungkan...' : 'Hubungkan';
      }
    }

    // Callback
    if (onStatusChangeCallback) {
      onStatusChangeCallback(connected);
    }
  }

  /**
   * Handle connection status change from Firebase.
   * @param {boolean} connected - Connection status
   */
  function handleConnectionChange(connected) {
    isReconnecting = false;
    updateStatusDisplay(connected);
    
    if (connected) {
      console.log('[FirebaseConnection] Connected to Firebase');
    } else {
      console.log('[FirebaseConnection] Disconnected from Firebase');
    }
  }

  // ---------------------------------------------------------------------------
  // Main functions
  // ---------------------------------------------------------------------------

  /**
   * Initialize connection monitoring.
   * @param {Object} options - Configuration options
   * @param {HTMLElement} options.statusElement - Element to display status
   * @param {HTMLElement} options.reconnectButton - Button to trigger reconnect
   * @param {Function} options.onStatusChange - Callback when status changes
   */
  function init(options) {
    options = options || {};

    statusElement = options.statusElement || document.getElementById('connection-status');
    reconnectButton = options.reconnectButton || document.getElementById('reconnect-button');
    onStatusChangeCallback = options.onStatusChange;

    var FirebaseService = window.FirebaseService;
    if (!FirebaseService || !FirebaseService.db) {
      console.error('[FirebaseConnection] FirebaseService not available');
      updateStatusDisplay(false);
      return;
    }

    // Remove existing listener if any
    if (connectionListener) {
      FirebaseService.db.ref('.info/connected').off('value', connectionListener);
    }

    // Listen to connection status
    connectionListener = FirebaseService.db.ref('.info/connected').on('value', function (snapshot) {
      var connected = snapshot.val() === true;
      handleConnectionChange(connected);
    });

    // Setup reconnect button
    if (reconnectButton) {
      reconnectButton.addEventListener('click', function () {
        reconnect();
      });
    }

    console.log('[FirebaseConnection] Initialized connection monitoring');
  }

  /**
   * Manually attempt to reconnect to Firebase.
   * Includes debounce protection to prevent rapid reconnection attempts.
   */
  function reconnect() {
    if (isReconnecting) {
      console.log('[FirebaseConnection] Reconnect already in progress');
      return;
    }

    isReconnecting = true;
    updateStatusDisplay(false);

    var FirebaseService = window.FirebaseService;
    if (!FirebaseService || !FirebaseService.db) {
      console.error('[FirebaseConnection] FirebaseService not available');
      isReconnecting = false;
      return;
    }

    console.log('[FirebaseConnection] Attempting to reconnect...');

    // Force Firebase to go online
    FirebaseService.db.goOnline();

    // Wait a moment for connection to establish
    setTimeout(function () {
      // Check connection status
      FirebaseService.db.ref('.info/connected').once('value', function (snapshot) {
        var connected = snapshot.val() === true;
        isReconnecting = false;
        updateStatusDisplay(connected);

        if (connected) {
          console.log('[FirebaseConnection] Reconnected successfully');
        } else {
          console.log('[FirebaseConnection] Reconnect failed');
        }
      });
    }, 2000);
  }

  /**
   * Get current connection status.
   * @returns {boolean} Connection status
   */
  function getConnectionStatus() {
    return isConnected;
  }

  /**
   * Check if currently reconnecting.
   * @returns {boolean} Reconnecting status
   */
  function getIsReconnecting() {
    return isReconnecting;
  }

  /**
   * Destroy the connection listener.
   */
  function destroy() {
    var FirebaseService = window.FirebaseService;
    if (FirebaseService && FirebaseService.db && connectionListener) {
      FirebaseService.db.ref('.info/connected').off('value', connectionListener);
      connectionListener = null;
    }
    
    statusElement = null;
    reconnectButton = null;
    onStatusChangeCallback = null;
  }

  // ---------------------------------------------------------------------------
  // Expose public API via global namespace
  // ---------------------------------------------------------------------------
  window.FirebaseConnectionService = {
    init:                   init,
    reconnect:              reconnect,
    getConnectionStatus:    getConnectionStatus,
    getIsReconnecting:      getIsReconnecting,
    destroy:                destroy
  };

})();
