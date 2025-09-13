// Jest setup for jsdom environment
const { TextEncoder, TextDecoder } = require('util');

// Polyfill for Node.js environment
if (typeof global.TextEncoder === 'undefined') {
  global.TextEncoder = TextEncoder;
}

if (typeof global.TextDecoder === 'undefined') {
  global.TextDecoder = TextDecoder;
}

// Basic Jest-DOM setup if available
try {
  require('@testing-library/jest-dom');
} catch (e) {
  // jest-dom not available, skip
}
