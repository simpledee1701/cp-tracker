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

  async getUpcomingContests(req, res, next) {
    try {
      const contests = await leetcodeService.getUpcomingContests();
      res.json({
        success: true,
        data: contests.upcomingContests || []
      });
    } catch (error) {
      next(error);
    }
  }

  async getUserRegisteredContests(req, res, next) {
    try {
      const { username } = req.params;
      const contests = await leetcodeService.getUserRegisteredUpcomingContests(username);
      res.json({
        success: true,
        data: contests
      });
    } catch (error) {
      next(error);
    }
  }

  async checkUserRegistration(req, res, next) {
    try {
      const { username, contestSlug } = req.params;
      const contests = await leetcodeService.getUserRegisteredUpcomingContests(username);
      const isRegistered = contests.some(contest => contest.titleSlug === contestSlug);
      
      res.json({
        success: true,
        data: {
          isRegistered,
          contestSlug,
          username
        }
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new LeetcodeController();