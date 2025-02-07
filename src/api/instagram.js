const axios = require('axios');
const { DEFAULTS, ENDPOINTS, HEADERS } = require('../constants/instagram');
const logger = require('../utils/logger');

/**
 * Creates request headers for Instagram API calls
 * @param {string} username - Instagram username for the referer header
 * @param {string} cookie - Instagram cookie string
 * @returns {Object} Headers object
 */
function createHeaders(username, cookie) {
  const csrfMatch = cookie.match(/csrftoken=([^;]+)/);
  const csrfToken = csrfMatch ? csrfMatch[1] : '';

  return {
    'User-Agent': HEADERS.USER_AGENT,
    'Accept': HEADERS.ACCEPT,
    'Accept-Language': HEADERS.ACCEPT_LANGUAGE,
    'X-IG-App-ID': HEADERS.IG_APP_ID,
    'X-Requested-With': HEADERS.REQUESTED_WITH,
    'X-CSRFToken': csrfToken,
    'Origin': 'https://www.instagram.com',
    'Referer': `https://www.instagram.com/${username}/`,
    'Cookie': cookie
  };
}

/**
 * Fetches user ID from Instagram API
 * @param {string} username - Instagram username
 * @param {Object} headers - Request headers
 * @returns {Promise<string>} User ID
 */
async function getUserId(username, headers) {
  const userInfoUrl = `${ENDPOINTS.USER_INFO}?username=${username}`;
  logger.info('Fetching user info from:', userInfoUrl);

  const { data: userInfo } = await axios.get(userInfoUrl, { headers });

  if (!userInfo.data?.user) {
    throw new Error('Failed to fetch user information');
  }

  const userId = userInfo.data.user.id;
  console.log('Found user ID:', userId);
  return userId;
}

/**
 * Fetches user posts from Instagram API
 * @param {string} userId - Instagram user ID
 * @param {Object} headers - Request headers
 * @returns {Promise<string[]>} Array of image URLs
 */
async function fetchUserPosts(userId, headers) {
  const postsUrl = `${ENDPOINTS.USER_FEED}${userId}/?count=${DEFAULTS.POST_COUNT}`;
  logger.info('Fetching posts from:', postsUrl);

  const { data: postsData } = await axios.get(postsUrl, { headers });

  if (!postsData.items?.length) {
    throw new Error('Failed to fetch user posts');
  }

  return postsData.items
    .map(item => extractImageUrl(item))
    .filter(url => url !== null);
}

/**
 * Extracts image URL from a post item
 * @param {Object} item - Post item from Instagram API
 * @returns {string|null} Image URL or null if no image found
 */
function extractImageUrl(item) {
  if (item.carousel_media?.[0]?.image_versions2?.candidates?.[0]?.url) {
    return item.carousel_media[0].image_versions2.candidates[0].url;
  }
  if (item.image_versions2?.candidates?.[0]?.url) {
    return item.image_versions2.candidates[0].url;
  }
  return null;
}

module.exports = {
  createHeaders,
  getUserId,
  fetchUserPosts,
  extractImageUrl
};