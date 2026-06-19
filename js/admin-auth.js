/**
 * Admin Authentication Module
 * Hardcoded authentication for Mie Ayam Lariska admin dashboard
 * Credentials: lariska / lariska123
 *
 * Firebase Integration:
 *   - Uses Firebase Anonymous Auth to generate auth.uid
 *   - Creates admin_sessions/{uid} entry in Firebase after login
 *   - 24-hour session expiry with timestamp
 *   - Hardcoded credentials are the primary auth mechanism (fallback-safe)
 *
 * Architecture: ES Module, exposes AdminAuth via export and window.AdminAuth
 */

import { debugLog, debugWarn } from './debug.js';

/** @constant {string} SESSION_KEY - localStorage key for admin session */
const SESSION_KEY = 'admin_session';

/** @constant {number} SESSION_DURATION - Session duration in milliseconds (24 hours) */
const SESSION_DURATION = 24 * 60 * 60 * 1000;

// Obfuscated credentials (base64 encoded)
const _creds = ['bGFyaXNrYQ==', 'bGFyaXNrYTEyMw=='];
function _decode(idx) { return atob(_creds[idx]); }

/** @constant {string} ADMIN_USERNAME - Admin username for authentication */
const ADMIN_USERNAME = _decode(0);

/** @constant {string} ADMIN_PASSWORD - Admin password for authentication */
const ADMIN_PASSWORD = _decode(1);

/**
 * AdminAuth - handles login, logout, and session management
 */
const AdminAuth = {

  /**
   * Check if a session has expired (older than 24 hours)
   * @param {Object} session - Session object with timestamp
   * @returns {boolean} true if expired
   */
  isSessionExpired: function (session) {
    if (!session || !session.timestamp) {
      return true;
    }
    var age = Date.now() - session.timestamp;
    return age > SESSION_DURATION;
  },

  /**
   * Check if admin is currently logged in (with expiry check)
   * @returns {boolean} true if logged in and session is valid
   */
  isLoggedIn: function () {
    var raw = localStorage.getItem(SESSION_KEY);
    if (!raw) {
      return false;
    }

    try {
      var session = JSON.parse(raw);
      if (this.isSessionExpired(session)) {
        // Session expired — clear it silently
        localStorage.removeItem(SESSION_KEY);
        return false;
      }
      return session.value === true;
    } catch (e) {
      // Legacy format: plain string 'true' — treat as expired (needs re-login for Firebase session)
      if (raw === 'true') {
        localStorage.removeItem(SESSION_KEY);
        return false;
      }
      return false;
    }
  },

  /**
   * Get the current session object
   * @returns {Object|null} Session object or null if not logged in
   */
  getSession: function () {
    var raw = localStorage.getItem(SESSION_KEY);
    if (!raw) {
      return null;
    }

    try {
      var session = JSON.parse(raw);
      if (this.isSessionExpired(session)) {
        return null;
      }
      return session;
    } catch (e) {
      return null;
    }
  },

  /**
   * Attempt to login with provided credentials.
   * Step 1: Validate hardcoded credentials (always works — fallback-safe)
   * Step 2: Store session in localStorage with timestamp
   * Step 3: If Firebase Auth is available, sign in anonymously and create admin_sessions entry
   *
   * @param {string} username - username input
   * @param {string} password - password input
   * @returns {Object} { success: boolean, message: string }
   */
  login: function (username, password) {
    // Step 1: Validate hardcoded credentials (primary auth — always works)
    if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
      return { success: false, message: 'Username atau password salah' };
    }

    // Step 2: Create session object with timestamp
    var session = {
      value: true,
      timestamp: Date.now(),
      uid: null // Will be populated if Firebase Auth is available
    };

    // Step 3: Try Firebase Anonymous Auth (non-blocking — best effort)
    var self = this;
    if (typeof firebase !== 'undefined' && firebase.auth) {
      try {
        firebase.auth().signInAnonymously()
          .then(function (userCredential) {
            var uid = userCredential.user.uid;
            session.uid = uid;

            // Update localStorage with uid
            localStorage.setItem(SESSION_KEY, JSON.stringify(session));

            // Create admin_sessions entry in Firebase
            return self._createAdminSession(uid);
          })
          .catch(function (error) {
            // Firebase auth failed — login still works with hardcoded credentials
            console.warn('[AdminAuth] Firebase Anonymous Auth failed:', error.message);
            console.warn('[AdminAuth] Admin session will work without Firebase uid.');
            // Store session without uid (still functional)
            localStorage.setItem(SESSION_KEY, JSON.stringify(session));
          });
      } catch (e) {
        // firebase.auth() not available — store session without uid
        console.warn('[AdminAuth] Firebase Auth not available:', e.message);
        localStorage.setItem(SESSION_KEY, JSON.stringify(session));
      }
    } else {
      // Firebase not loaded (e.g., login.html) — store session without uid
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    }

    return { success: true, message: 'Login berhasil' };
  },

  /**
   * Complete Firebase anonymous auth for sessions created without uid.
   * Called on index.html where Firebase is fully loaded.
   * This handles the case where login happened on login.html (no Firebase).
   */
  completeFirebaseAuth: function () {
    var session = this.getSession();
    if (!session || session.uid) {
      // No session or already has uid — nothing to do
      return;
    }

    var self = this;
    if (typeof firebase !== 'undefined' && firebase.auth) {
      try {
        firebase.auth().signInAnonymously()
          .then(function (userCredential) {
            var uid = userCredential.user.uid;
            session.uid = uid;

            // Update localStorage with uid
            localStorage.setItem(SESSION_KEY, JSON.stringify(session));

            // Create admin_sessions entry in Firebase
            return self._createAdminSession(uid);
          })
          .catch(function (error) {
            console.warn('[AdminAuth] Firebase Anonymous Auth failed during completion:', error.message);
          });
      } catch (e) {
        console.warn('[AdminAuth] Firebase Auth not available during completion:', e.message);
      }
    }
  },

  /**
   * Create or update admin_sessions/{uid} entry in Firebase
   * @param {string} uid - Firebase anonymous auth uid
   * @returns {Promise<void>}
   * @private
   */
  _createAdminSession: function (uid) {
    if (typeof firebase === 'undefined' || !firebase.database) {
      return Promise.resolve();
    }

    var db = firebase.database();
    var sessionRef = db.ref('admin_sessions/' + uid);

    var sessionData = {
      uid: uid,
      loginAt: firebase.database.ServerValue.TIMESTAMP,
      expiresAt: Date.now() + SESSION_DURATION,
      active: true
    };

    return sessionRef.set(sessionData)
      .then(function () {
        debugLog('[AdminAuth] Admin session created in Firebase for uid:', uid);
      })
      .catch(function (error) {
        debugWarn('[AdminAuth] Failed to create admin session in Firebase:', error.message);
      });
  },

  /**
   * Logout and clear session.
   * Removes admin_sessions/{uid} from Firebase if uid is available.
   * Redirects to login page after logout.
   */
  logout: function () {
    var session = this.getSession();

    // Try to remove Firebase session entry
    if (session && session.uid && typeof firebase !== 'undefined' && firebase.database) {
      try {
        var db = firebase.database();
        var sessionRef = db.ref('admin_sessions/' + session.uid);
        sessionRef.remove().catch(function (error) {
          debugWarn('[AdminAuth] Failed to remove Firebase session:', error.message);
        });
      } catch (e) {
        debugWarn('[AdminAuth] Firebase database not available for cleanup:', e.message);
      }
    }

    // Sign out from Firebase Auth
    if (typeof firebase !== 'undefined' && firebase.auth) {
      try {
        firebase.auth().signOut().catch(function (error) {
          debugWarn('[AdminAuth] Firebase sign out failed:', error.message);
        });
      } catch (e) {
        // Ignore
      }
    }

    // Clear localStorage session
    localStorage.removeItem(SESSION_KEY);

    // Redirect to login page
    window.location.href = 'login.html';
  },

  /**
   * Protect a page — redirect to login if not authenticated.
   * Should be called on admin pages that require auth.
   * If session exists but has no uid, attempts to complete Firebase auth.
   */
  requireAuth: function () {
    if (!this.isLoggedIn()) {
      window.location.href = 'login.html';
      return;
    }

    // Session is valid — try to complete Firebase auth if needed
    this.completeFirebaseAuth();
  },

  /**
   * Initialize login form handlers.
   * Should be called on login page.
   */
  initLoginForm: function () {
    var form = document.getElementById('login-form');
    var errorElement = document.getElementById('error-message');
    var usernameInput = document.getElementById('username');
    var passwordInput = document.getElementById('password');

    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var username = usernameInput.value.trim();
      var password = passwordInput.value.trim();

      // Hide previous error
      if (errorElement) {
        errorElement.style.display = 'none';
      }

      var result = AdminAuth.login(username, password);

      if (result.success) {
        // Redirect to admin dashboard
        window.location.href = 'index.html';
      } else {
        // Show error message
        if (errorElement) {
          errorElement.textContent = result.message;
          errorElement.style.display = 'block';
        }
      }
    });
  }
};

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------
export { AdminAuth, ADMIN_USERNAME, ADMIN_PASSWORD, SESSION_KEY, SESSION_DURATION };

// Backward compatibility: expose on window for non-module scripts
window.AdminAuth = AdminAuth;

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function () {
  // If we're on the login page, initialize the form
  if (document.getElementById('login-form')) {
    AdminAuth.initLoginForm();
  }
});
