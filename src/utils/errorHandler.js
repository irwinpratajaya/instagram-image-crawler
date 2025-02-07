/**
 * Error handler utilities for Instagram API requests
 */

class InstagramAPIError extends Error {
  constructor(message, status, response) {
    super(message);
    this.name = 'InstagramAPIError';
    this.status = status;
    this.response = response;
  }
}

class RateLimitError extends InstagramAPIError {
  constructor(response) {
    super('Rate limited by Instagram. Please wait before trying again.', 429, response);
    this.name = 'RateLimitError';
  }
}

class AuthenticationError extends InstagramAPIError {
  constructor(response) {
    super('Authentication required. Please provide valid Instagram cookies.', 401, response);
    this.name = 'AuthenticationError';
  }
}

class ProfileNotFoundError extends InstagramAPIError {
  constructor(response) {
    super('Profile not found. Please check the username.', 404, response);
    this.name = 'ProfileNotFoundError';
  }
}

/**
 * Handles and logs errors from API requests
 * @param {Error} error - Error object
 * @throws {InstagramAPIError} Throws specific Instagram API errors
 */
function handleError(error) {
  console.error('Error:', error.message);

  if (!error.response) {
    console.error('Network error or invalid request');
    return;
  }

  const { status, headers, data } = error.response;
  console.error('Status:', status);
  console.error('Headers:', JSON.stringify(headers, null, 2));

  if (data) {
    console.error('Response data:', JSON.stringify(data, null, 2));
  }

  let customError;
  switch (status) {
    case 429:
      customError = new RateLimitError(error.response);
      break;
    case 404:
      customError = new ProfileNotFoundError(error.response);
      break;
    case 401:
      customError = new AuthenticationError(error.response);
      break;
    default:
      customError = new InstagramAPIError(
        'An error occurred while accessing Instagram API',
        status,
        error.response
      );
  }

  throw customError;
}

module.exports = {
  handleError,
  InstagramAPIError,
  RateLimitError,
  AuthenticationError,
  ProfileNotFoundError
};