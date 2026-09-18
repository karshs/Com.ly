const express = require('express');
const router = express.Router();
const {
  createLink,
  getUserLinks,
  getLinkById,
  deleteLink,
} = require('../controllers/link.controller');

const { protect } = require('../middleware/auth.middleware');

router.use(protect);

router.post('/', createLink);
router.get('/', getUserLinks);
router.get('/:id', getLinkById);
router.delete('/:id', deleteLink);

module.exports = router;
