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

  const response = await axios.get(userInfoUrl, { headers });
  const userInfo = response.data;

  if (!userInfo.data || !userInfo.data.user) {
    throw new Error('Failed to fetch user information');
  }

  const userId = userInfo.data.user.id;
  console.log('Found user ID:', userId);
  return userId;
}

/**
 * Fetches user profile information from Instagram API
 * @param {string} username - Instagram username
 * @param {Object} headers - Request headers
 * @returns {Promise<Object>} User profile information
 */
async function getUserInfo(username, headers) {
  const userInfoUrl = `${ENDPOINTS.USER_INFO}?username=${username}`;
  logger.info('Fetching user info from:', userInfoUrl);

  const response = await axios.get(userInfoUrl, { headers });
  const userInfo = response.data;

  if (!userInfo.data || !userInfo.data.user) {
    throw new Error('Failed to fetch user information');
  }

  const user = userInfo.data.user;
  return {
    id: user.id,
    username: user.username,
    fullName: user.full_name,
    biography: user.biography,
    followersCount: user.edge_followed_by.count,
    followingCount: user.edge_follow.count,
    isPrivate: user.is_private,
    isVerified: user.is_verified,
    profilePicUrl: user.profile_pic_url_hd
  };
}

/**
 * Fetches user posts from Instagram API
 * @param {string} userId - Instagram user ID
 * @param {Object} headers - Request headers
 * @param {number} count - Number of posts to fetch (default: 12)
 * @returns {Promise<string[]>} Array of image URLs
 */
async function fetchUserPosts(userId, headers, count) {
  if (typeof count === 'undefined') {
    count = DEFAULTS.POST_COUNT;
  }

  const feedUrl = `${ENDPOINTS.USER_FEED}${userId}/`;
  logger.info('Fetching user feed from:', feedUrl);

  const response = await axios.get(feedUrl, { headers });
  const feed = response.data;

  if (!feed.items) {
    throw new Error('Failed to fetch user feed');
  }

  const posts = feed.items.slice(0, count);
  const imageUrls = [];

  for (const post of posts) {
    const urls = extractImageUrl(post);
    imageUrls.push.apply(imageUrls, urls);
  }

  return imageUrls;
}

/**
 * Extracts image URLs from a post object
 * @param {Object} post - Instagram post object
 * @returns {string[]} Array of image URLs
 */
function extractImageUrl(post) {
  const urls = [];

  // Handle carousel posts
  if (post.carousel_media) {
    for (const media of post.carousel_media) {
      if (media.image_versions2 && media.image_versions2.candidates && media.image_versions2.candidates.length > 0) {
        urls.push(media.image_versions2.candidates[0].url);
      }
    }
  }
  // Handle single image posts
  else if (post.image_versions2 && post.image_versions2.candidates && post.image_versions2.candidates.length > 0) {
    urls.push(post.image_versions2.candidates[0].url);
  }

  return urls;
}

module.exports = {
  createHeaders,
  getUserId,
  getUserInfo,
  fetchUserPosts,
  extractImageUrl
};