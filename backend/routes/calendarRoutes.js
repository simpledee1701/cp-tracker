const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
  checkContestAdded,
  addToCalendar,
  removeFromCalendar,
  handleGoogleCallback,
  cleanupPastContests,
  refreshTokens
} = require('../controllers/calendarController');

// Check if contest is added to user's calendar
router.get('/check', authMiddleware, checkContestAdded);

// Add contest to calendar (initial step)
router.post('/add', authMiddleware, addToCalendar);

// Remove contest from calendar
router.post('/remove', authMiddleware, removeFromCalendar);

// Handle Google OAuth callback
router.get('/auth/google/callback', handleGoogleCallback);

// Cleanup past contests (admin-only route)
router.post('/cleanup', authMiddleware, (req, res, next) => {
  // Add admin check if needed
  if (!req.user.isAdmin) {
    return res.status(403).json({ error: 'Unauthorized' });
  }
  next();
}, cleanupPastContests);

// Refresh tokens endpoint
router.post('/refresh-tokens', authMiddleware, async (req, res) => {
  try {
    const newTokens = await refreshTokens(req.user.id);
    if (newTokens) {
      res.json({ success: true, tokens: newTokens });
    } else {
      res.status(400).json({ error: 'Failed to refresh tokens' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;