const express = require('express');
const leetcodeController = require('../controllers/leetcodeController');

const router = express.Router();

// Existing user stats route
router.get('/stats/:username', leetcodeController.getUserStats);

// New contest-related routes
router.get('/contests/upcoming', leetcodeController.getUpcomingContests);
router.get('/stats/:username/registered-contests', leetcodeController.getUserRegisteredContests);
router.get('/stats/:username/is-registered/:contestSlug', leetcodeController.checkUserRegistration);

module.exports = router;