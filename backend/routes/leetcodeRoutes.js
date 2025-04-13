const express = require('express');
const leetcodeController = require('../controllers/leetcodeController');

const router = express.Router();

router.get('/user/:username', leetcodeController.getUserProfile);
router.get('/user/:username/submissions', leetcodeController.getUserSubmissions);

module.exports = router;