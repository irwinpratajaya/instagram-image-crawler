/**
 * Logger utility for consistent logging across the application
 */

const logger = {
  info: (message, ...args) => {
    console.log(message, ...args);
  },

  error: (message, error, response = null) => {
    console.error('Error:', message);
    
    if (error instanceof Error) {
      console.error('Message:', error.message);
    }

    if (response) {
      const { status, headers, data } = response;
      console.error('Status:', status);
      console.error('Headers:', JSON.stringify(headers, null, 2));
      
      if (data) {
        console.error('Response data:', JSON.stringify(data, null, 2));
      }
    }
  },

  warn: (message, ...args) => {
    console.warn(message, ...args);
  }
};

module.exports = logger;