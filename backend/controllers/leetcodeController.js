const leetcodeService = require('../services/leetcodeService');
const statsRepository = require('../db/statsRepository');

/**
 * Controller for LeetCode stats API endpoints
 */
class LeetcodeController {
  /**
   * Get stats for a specific user
   * @param {Object} req - Express request
   * @param {Object} res - Express response
   * @param {Function} next - Express next function
   */
  async getUserStats(req, res, next) {
    try {
      const { username } = req.params;
      
      const userData = await statsRepository.getUserStats(username);
      
      if (!userData) {
        return res.status(404).json({
          success: false,
          message: `No stats found for user: ${username}`
        });
      }
      
      // Add rank information
      const rankInfo = await statsRepository.getUserRank(username);
      
      res.json({
        success: true,
        data: {
          ...userData,
          rank_info: rankInfo
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get stats for all users with pagination
   * @param {Object} req - Express request
   * @param {Object} res - Express response
   * @param {Function} next - Express next function
   */
  async getAllStats(req, res, next) {
    try {
      const limit = parseInt(req.query.limit) || 50;
      const offset = parseInt(req.query.offset) || 0;
      const orderBy = req.query.orderBy || 'total_solved';
      const direction = req.query.direction || 'desc';
      
      const stats = await statsRepository.getAllStats({
        limit,
        offset,
        orderBy,
        direction
      });
      
      res.json({
        success: true,
        data: stats,
        pagination: {
          limit,
          offset,
          orderBy,
          direction
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update stats for a specific user
   * @param {Object} req - Express request
   * @param {Object} res - Express response
   * @param {Function} next - Express next function
   */
  async updateUserStats(req, res, next) {
    try {
      const { username } = req.params;
      
      // Fetch the latest data from LeetCode
      const userData = await leetcodeService.fetchUserComprehensiveData(username);
      
      // Store the data in Supabase
      const storedData = await statsRepository.storeUserStats(userData);
      
      // Add rank information
      const rankInfo = await statsRepository.getUserRank(username);
      
      res.json({
        success: true,
        message: `Stats updated for user: ${username}`,
        data: {
          ...storedData,
          rank_info: rankInfo
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete stats for a specific user
   * @param {Object} req - Express request
   * @param {Object} res - Express response
   * @param {Function} next - Express next function
   */
  async deleteUserStats(req, res, next) {
    try {
      const { username } = req.params;
      
      await statsRepository.deleteUserStats(username);
      
      res.json({
        success: true,
        message: `Stats deleted for user: ${username}`
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new LeetcodeController();