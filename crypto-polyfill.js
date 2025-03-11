if (typeof window === 'undefined') {
    global.crypto = require('crypto').webcrypto;
  }