const express =  require('express');
const router =  express.Router();

const {

    getLinkOverview,
    getDeviceDistribution,
    getClicksOverTime,
    getTopReferrers,
} =  require('../controllers/analytics.controller');

const {protect} =  require('../middleware/auth.middleware');

router.use(protect);

router.get('/:linkId/overview', getLinkOverview);
router.get('/:linkId/timeseries', getClicksOverTime);
router.get('/:linkId/devices', getDeviceDistribution);
router.get('/:linkId/referrers', getTopReferrers);
module.exports = router;