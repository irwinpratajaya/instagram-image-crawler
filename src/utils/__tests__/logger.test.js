const logger = require('../logger');

describe('Logger Module', () => {
  let consoleLogSpy;
  let consoleErrorSpy;
  let consoleWarnSpy;

  beforeEach(() => {
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
    consoleErrorSpy.mockRestore();
    consoleWarnSpy.mockRestore();
  });

  describe('info', () => {
    it('should log info message with arguments', () => {
      logger.info('Test message', 'arg1', 'arg2');
      expect(consoleLogSpy).toHaveBeenCalledWith('Test message', 'arg1', 'arg2');
    });
  });

  describe('error', () => {
    it('should log error message with Error object', () => {
      const error = new Error('Test error');
      logger.error('Error occurred', error);
      
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error:', 'Error occurred');
      expect(consoleErrorSpy).toHaveBeenCalledWith('Message:', 'Test error');
    });

    it('should log error message with response data', () => {
      const error = new Error('API error');
      const response = {
        status: 404,
        headers: { 'content-type': 'application/json' },
        data: { message: 'Not found' }
      };

      logger.error('API error occurred', error, response);
      
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error:', 'API error occurred');
      expect(consoleErrorSpy).toHaveBeenCalledWith('Message:', 'API error');
      expect(consoleErrorSpy).toHaveBeenCalledWith('Status:', 404);
      expect(consoleErrorSpy).toHaveBeenCalledWith('Headers:', JSON.stringify(response.headers, null, 2));
      expect(consoleErrorSpy).toHaveBeenCalledWith('Response data:', JSON.stringify(response.data, null, 2));
    });

    it('should handle error without Error object', () => {
      logger.error('Simple error message', 'Not an error object');
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error:', 'Simple error message');
    });

    it('should handle response without data', () => {
      const response = {
        status: 500,
        headers: { 'content-type': 'application/json' }
      };

      logger.error('API error', null, response);
      
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error:', 'API error');
      expect(consoleErrorSpy).toHaveBeenCalledWith('Status:', 500);
      expect(consoleErrorSpy).toHaveBeenCalledWith('Headers:', JSON.stringify(response.headers, null, 2));
    });
  });

  describe('warn', () => {
    it('should log warning message with arguments', () => {
      logger.warn('Warning message', 'detail1', 'detail2');
      expect(consoleWarnSpy).toHaveBeenCalledWith('Warning message', 'detail1', 'detail2');
    });
  });
});