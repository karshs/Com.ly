const express = require('express');
const router = express.Router();
const {
  createLink,
  getUserLinks,
  getLinkById,
  deleteLink,
} = require('../controllers/link.controller');

const { linkCreateLimiter } = require('../middleware/rateLimiter.middleware');

const { protect } = require('../middleware/auth.middleware');

router.use(protect);

router.post('/', linkCreateLimiter, createLink);

router.get('/', getUserLinks);
router.get('/:id', getLinkById);
router.delete('/:id', deleteLink);

module.exports = router;
