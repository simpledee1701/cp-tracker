const express = require('express');
const leetcodeController = require('../controllers/leetcodeController');

const router = express.Router();

// Existing user stats route
router.get('/stats/:username', leetcodeController.getUserStats);


module.exports = router;