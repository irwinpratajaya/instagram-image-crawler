/**
 * Instagram API constants
 */

module.exports = {
  // API endpoints
  ENDPOINTS: {
    USER_INFO: 'https://i.instagram.com/api/v1/users/web_profile_info/',
    USER_FEED: 'https://i.instagram.com/api/v1/feed/user/'
  },

  // Request headers
  HEADERS: {
    USER_AGENT: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    ACCEPT: '*/*',
    ACCEPT_LANGUAGE: 'en-US,en;q=0.9',
    IG_APP_ID: '936619743392459',
    REQUESTED_WITH: 'XMLHttpRequest'
  },

  // Default values
  DEFAULTS: {
    POST_COUNT: 12
  }
};