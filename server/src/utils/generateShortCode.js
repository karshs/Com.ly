const crypto = require('crypto');

// 1. Generates a cryptographically random 6-character alphanumeric slug
const generateShortCode = (length = 6) => {
  const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
  const bytes = crypto.randomBytes(length);
  let result = '';

  for (let i = 0; i < length; i++) {
    result += characters[bytes[i] % characters.length];
  }

  return result;
};

// 2. To validate that destination URL is a valid HTTP/HTTPS web address
const isValidUrl = (urlString) => {
  try {
    const parsed = new URL(urlString);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch (err) {
    return false;
  }
};

module.exports = {
  generateShortCode,
  isValidUrl,
};
