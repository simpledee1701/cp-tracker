const express = require('express');
const router = express.Router();
const {
  initiateGoogleAuth,
  handleGoogleCallback
} = require('../controllers/calendarController');

router.get('/auth/google', initiateGoogleAuth);
router.get('/auth/google/callback', handleGoogleCallback);

module.exports = router;