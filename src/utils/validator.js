/**
 * Validation utilities for Instagram API requests
 */

/**
 * Validates Instagram username
 * @param {string} username - Instagram username to validate
 * @throws {Error} If username is invalid
 */
function validateUsername(username) {
  if (!username) {
    throw new Error('Username is required');
  }

  if (typeof username !== 'string') {
    throw new Error('Username must be a string');
  }

  if (username.length > 30) {
    throw new Error('Username is too long');
  }
}

/**
 * Validates Instagram cookie
 * @param {string} cookie - Instagram cookie string to validate
 * @throws {Error} If cookie is invalid
 */
function validateCookie(cookie) {
  if (!cookie) {
    throw new Error('INSTAGRAM_COOKIE environment variable is not set');
  }

  const requiredCookies = ['sessionid', 'ds_user_id', 'csrftoken'];
  const missingCookies = requiredCookies.filter(name => !cookie.includes(`${name}=`));

  if (missingCookies.length > 0) {
    throw new Error(`Missing required cookies: ${missingCookies.join(', ')}`);
  }
}

module.exports = {
  validateUsername,
  validateCookie
};