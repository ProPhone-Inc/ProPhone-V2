const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const { 
  createAdFreeSubscription, 
  cancelAdFreeSubscription,
  createSubUserSubscription,
  cancelSubUserSubscription
} = require('../controllers/subscription');

router.post('/ad-free/create', auth, createAdFreeSubscription);
router.post('/ad-free/cancel', auth, cancelAdFreeSubscription);
router.post('/sub-user/create', auth, createSubUserSubscription);
router.post('/sub-user/cancel', auth, cancelSubUserSubscription);

module.exports = router;