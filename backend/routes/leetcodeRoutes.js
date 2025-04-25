const express = require('express');
const leetcodeController = require('../controllers/leetcodeController');

const router = express.Router();
router.post('/stats/update/:username', leetcodeController.updateUserStats);
router.get('/stats/:username', leetcodeController.getUserStats);
module.exports = router;