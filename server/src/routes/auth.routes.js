const express =  require('express');
const router  =  express.Router();
const {
    signup,
    verifyEmail,
    login,
    refreshAccessToken,
    logout,
    forgotPassword,
    resetPassword,

} =  require('../controllers/auth.controller');


router.post('/signup', signup);
router.get('/verify/:token', verifyEmail);
router.post('/login', login);
router.post('/refresh', refreshAccessToken);
router.post('/logout', logout);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
module.exports = router;