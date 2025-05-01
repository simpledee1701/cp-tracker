const express = require('express');
const router = express.Router();
const codeforcesController = require('../controllers/codeforcesController');


router.get('/profile/:handle', codeforcesController.getProfile);

module.exports = router;