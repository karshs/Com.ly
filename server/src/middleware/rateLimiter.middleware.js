const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Max 20 attempts per IP
  message: {
    error: {
      message: 'Too many authentication attempts from this IP. Please try again after 15 minutes.',
      code: 'RATE_LIMIT_EXCEEDED',
    },
  },
  standardHeaders: true, // Return standard RateLimit headers
  legacyHeaders: false,
});

// 2. Link Creation Rate Limiter
const linkCreateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 30, 
  message: {
    error: {
      message: 'Link creation limit reached. Please slow down and try again later.',
      code: 'CREATE_LIMIT_EXCEEDED',
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// 3. Redirection Route Limiter
const redirectLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 120, 
  message: {
    error: {
      message: 'High traffic detected on this short link. Please wait a moment.',
      code: 'REDIRECT_LIMIT_EXCEEDED',
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  authLimiter,
  linkCreateLimiter,
  redirectLimiter,
};
