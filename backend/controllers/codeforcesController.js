const { getUserInfo, getUserRating,getUserSubmissions } = require('../services/codeforcesService');

const getProfile = async (req, res) => {
    try {
      const { handle } = req.params;
      const [userInfo, ratingHistory, submissions] = await Promise.all([
        getUserInfo(handle),
        getUserRating(handle),
        getUserSubmissions(handle)
      ]);
  
      // Process submissions for calendar
      const sixMonthsAgo = Date.now() - 15552000000; // 6 months in milliseconds
      const submissionCalendar = submissions.reduce((acc, submission) => {
        const date = new Date(submission.creationTimeSeconds * 1000);
        if (date > sixMonthsAgo) {
          const key = date.toISOString().split('T')[0];
          acc[key] = (acc[key] || 0) + 1;
        }
        return acc;
      }, {});

      res.json({
        handle: userInfo.handle,
        rating: userInfo.rating,
        maxRating: userInfo.maxRating,
        rank: userInfo.rank,
        contribution: userInfo.contribution,
        friendOfCount: userInfo.friendOfCount,
        contests: ratingHistory.length,
        ratingHistory,
        submissionCalendar,
        recentContests: ratingHistory.slice(-5).reverse()
      });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

module.exports = { getProfile };
