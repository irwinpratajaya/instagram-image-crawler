const {
  handleError,
  InstagramAPIError,
  RateLimitError,
  AuthenticationError,
  ProfileNotFoundError
} = require('../errorHandler');

describe('Error Handler Module', () => {
  // Spy on console.error before each test
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  // Clear all mocks after each test
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('InstagramAPIError', () => {
    it('should create a basic Instagram API error', () => {
      const message = 'Test error';
      const status = 500;
      const response = { data: { message: 'Server error' } };
      
      const error = new InstagramAPIError(message, status, response);
      
      expect(error.message).toBe(message);
      expect(error.status).toBe(status);
      expect(error.response).toBe(response);
      expect(error.name).toBe('InstagramAPIError');
    });
  });

  describe('RateLimitError', () => {
    it('should create a rate limit error', () => {
      const response = { data: { message: 'Rate limited' } };
      const error = new RateLimitError(response);
      
      expect(error.message).toBe('Rate limited by Instagram. Please wait before trying again.');
      expect(error.status).toBe(429);
      expect(error.response).toBe(response);
      expect(error.name).toBe('RateLimitError');
    });
  });

  describe('AuthenticationError', () => {
    it('should create an authentication error', () => {
      const response = { data: { message: 'Unauthorized' } };
      const error = new AuthenticationError(response);
      
      expect(error.message).toBe('Authentication required. Please provide valid Instagram cookies.');
      expect(error.status).toBe(401);
      expect(error.response).toBe(response);
      expect(error.name).toBe('AuthenticationError');
    });
  });

  describe('ProfileNotFoundError', () => {
    it('should create a profile not found error', () => {
      const response = { data: { message: 'Not found' } };
      const error = new ProfileNotFoundError(response);
      
      expect(error.message).toBe('Profile not found. Please check the username.');
      expect(error.status).toBe(404);
      expect(error.response).toBe(response);
      expect(error.name).toBe('ProfileNotFoundError');
    });
  });

  describe('handleError', () => {
    it('should handle network errors', () => {
      const networkError = new Error('Network Error');
      
      handleError(networkError);
      
      expect(console.error).toHaveBeenCalledWith('Error:', 'Network Error');
      expect(console.error).toHaveBeenCalledWith('Network error or invalid request');
    });

    it('should handle errors with response but no data', () => {
      const error = {
        response: {
          status: 500,
          headers: {}
        }
      };

      expect(() => handleError(error)).toThrow(InstagramAPIError);
      expect(console.error).toHaveBeenCalledWith('Error:', undefined);
      expect(console.error).toHaveBeenCalledWith('Status:', 500);
      expect(console.error).toHaveBeenCalledWith('Headers:', '{}');
    });

    it('should handle rate limit errors', () => {
      const response = {
        status: 429,
        headers: { 'retry-after': '3600' },
        data: { message: 'Rate limited' }
      };
      const error = { response, message: 'Rate limit exceeded' };

      expect(() => handleError(error)).toThrow(RateLimitError);
      expect(console.error).toHaveBeenCalledWith('Error:', 'Rate limit exceeded');
      expect(console.error).toHaveBeenCalledWith('Status:', 429);
    });

    it('should handle authentication errors', () => {
      const response = {
        status: 401,
        headers: {},
        data: { message: 'Unauthorized' }
      };
      const error = { response };

      expect(() => handleError(error)).toThrow(AuthenticationError);
      expect(console.error).toHaveBeenCalledWith('Error:', undefined);
      expect(console.error).toHaveBeenCalledWith('Status:', 401);
    });

    it('should handle profile not found errors', () => {
      const response = {
        status: 404,
        headers: {},
        data: { message: 'Not found' }
      };
      const error = { response };

      expect(() => handleError(error)).toThrow(ProfileNotFoundError);
      expect(console.error).toHaveBeenCalledWith('Error:', undefined);
      expect(console.error).toHaveBeenCalledWith('Status:', 404);
    });

    it('should handle generic API errors', () => {
      const response = {
        status: 500,
        headers: {},
        data: { message: 'Server error' }
      };
      const error = { response };

      expect(() => handleError(error)).toThrow(InstagramAPIError);
      expect(console.error).toHaveBeenCalledWith('Error:', undefined);
      expect(console.error).toHaveBeenCalledWith('Status:', 500);
    });
  });
});