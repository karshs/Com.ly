const express = require('express');
const router = express.Router();
const {
  getMyBioProfile,
  updateMyBioProfile,
  getPublicBioProfile,
} = require('../controllers/bio.controller');
const { protect } = require('../middleware/auth.middleware');

router.get('/public/:username', getPublicBioProfile);

// Protected routes 
router.get('/me', protect, getMyBioProfile);
router.put('/me', protect, updateMyBioProfile);

module.exports = router;
