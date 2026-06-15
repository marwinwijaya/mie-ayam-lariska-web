/**
 * Admin Authentication Module
 * Hardcoded authentication for Mie Ayam Lariska admin dashboard
 * Credentials: lariska / lariska123
 */

/** @constant {string} ADMIN_USERNAME - Admin username for authentication */
const ADMIN_USERNAME = 'lariska';

/** @constant {string} ADMIN_PASSWORD - Admin password for authentication */
const ADMIN_PASSWORD = 'lariska123';

/** @constant {string} SESSION_KEY - localStorage key for admin session */
const SESSION_KEY = 'admin_logged_in';

/**
 * AdminAuth - handles login, logout, and session management
 */
const AdminAuth = {
  /**
   * Check if admin is currently logged in
   * @returns {boolean} true if logged in
   */
  isLoggedIn() {
    return localStorage.getItem(SESSION_KEY) === 'true';
  },

  /**
   * Attempt to login with provided credentials
   * @param {string} username - username input
   * @param {string} password - password input
   * @returns {Object} { success: boolean, message: string }
   */
  login(username, password) {
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      localStorage.setItem(SESSION_KEY, 'true');
      return { success: true, message: 'Login berhasil' };
    }
    return { success: false, message: 'Username atau password salah' };
  },

  /**
   * Logout and clear session
   * Redirects to login page after logout
   */
  logout() {
    localStorage.removeItem(SESSION_KEY);
    window.location.href = 'login.html';
  },

  /**
   * Protect a page - redirect to login if not authenticated
   * Should be called on admin pages that require auth
   */
  requireAuth() {
    if (!this.isLoggedIn()) {
      window.location.href = 'login.html';
    }
  },

  /**
   * Initialize login form handlers
   * Should be called on login page
   */
  initLoginForm() {
    const form = document.getElementById('login-form');
    const errorElement = document.getElementById('error-message');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const loginButton = document.getElementById('login-button');

    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const username = usernameInput.value.trim();
      const password = passwordInput.value.trim();

      // Hide previous error
      if (errorElement) {
        errorElement.style.display = 'none';
      }

      const result = this.login(username, password);

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

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // If we're on the login page, initialize the form
  if (document.getElementById('login-form')) {
    AdminAuth.initLoginForm();
  }
});