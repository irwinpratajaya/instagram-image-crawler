// Jest setup file
require('dotenv').config();

// Add custom jest matchers
expect.extend({
  toBeValidUrl: (received) => {
    try {
      new URL(received);
      return {
        message: () => `expected ${received} not to be a valid URL`,
        pass: true
      };
    } catch (error) {
      return {
        message: () => `expected ${received} to be a valid URL`,
        pass: false
      };
    }
  }
});

// Global test timeout
jest.setTimeout(10000);