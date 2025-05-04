const leetcodeService = require('../services/leetcodeService');

class LeetcodeController {
  async getUserStats(req, res, next) {
    try {
      const { username } = req.params;
      const userStats = await leetcodeService.fetchUserComprehensiveData(username);
      if (!userStats) {
        return res.status(404).json({
          success: false,
          message: `No stats found for user: ${username}`
        });
      }
      res.json({
        success: true,
        data: userStats
      });
    } catch (error) {
      next(error);
    }
  }
  
}

module.exports = new LeetcodeController();