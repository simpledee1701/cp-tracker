const express = require('express');
const leetcodeController = require('../controllers/leetcodeController');

const router = express.Router();

router.get('/stats', leetcodeController.getAllStats);
router.get('/stats/:username', leetcodeController.getUserStats);
router.post('/stats/:username/update', leetcodeController.updateUserStats);
router.delete('/stats/:username', leetcodeController.deleteUserStats);

module.exports = router;