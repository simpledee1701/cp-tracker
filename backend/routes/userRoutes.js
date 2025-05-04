const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/:id', authMiddleware, userController.getProfile);
router.put('/:id', authMiddleware, userController.updateProfile);

module.exports = router;