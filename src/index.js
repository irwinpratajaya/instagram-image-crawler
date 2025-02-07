require('dotenv').config();
const { createHeaders, getUserId, fetchUserPosts } = require('./api/instagram');
const { handleError } = require('./utils/errorHandler');
const { validateUsername, validateCookie } = require('./utils/validator');
const logger = require('./utils/logger');

/**
 * Fetches image URLs from a public Instagram profile
 * @param {string} username - The Instagram username to fetch images from
 * @returns {Promise<string[]>} Array of image URLs
 */
async function getInstagramImages(username) {
  try {
    validateUsername(username);
    validateCookie(process.env.INSTAGRAM_COOKIE);

    const headers = createHeaders(username, process.env.INSTAGRAM_COOKIE);
    const userId = await getUserId(username, headers);
    return await fetchUserPosts(userId, headers);

  } catch (error) {
    handleError(error);
    return [];
  }
}

// Export the main function
module.exports = { getInstagramImages };
