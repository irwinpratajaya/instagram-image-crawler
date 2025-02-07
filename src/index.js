require('dotenv').config();
const { createHeaders, getUserInfo, fetchUserPosts } = require('./api/instagram');
const { handleError } = require('./utils/errorHandler');
const { validateUsername, validateCookie } = require('./utils/validator');
const logger = require('./utils/logger');

/**
 * Fetches profile information and image URLs from a public Instagram profile
 * @param {string} username - The Instagram username to fetch data from
 * @returns {Promise<Object>} Object containing profile info and image URLs
 */
async function getInstagramData(username) {
  try {
    validateUsername(username);
    validateCookie(process.env.INSTAGRAM_COOKIE);

    const headers = createHeaders(username, process.env.INSTAGRAM_COOKIE);
    const profileInfo = await getUserInfo(username, headers);
    const images = await fetchUserPosts(profileInfo.id, headers);

    return {
      profile: profileInfo,
      images: images
    };

  } catch (error) {
    handleError(error);
    return { profile: null, images: [] };
  }
}

// Export the main function
module.exports = { getInstagramData };
