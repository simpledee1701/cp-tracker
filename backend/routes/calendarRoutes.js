const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
  checkContestAdded,
  addToCalendar,
  removeFromCalendar,
  initiateGoogleAuth,
  handleGoogleCallback
} = require('../controllers/calendarController');

router.get('/check', authMiddleware, checkContestAdded);
router.post('/add', authMiddleware, addToCalendar);
router.post('/remove', authMiddleware, removeFromCalendar); // New route
router.get('/auth/google', initiateGoogleAuth);
router.get('/auth/google/callback', handleGoogleCallback);

module.exports = router;