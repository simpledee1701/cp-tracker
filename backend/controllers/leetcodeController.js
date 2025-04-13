
const leetcodeService = require('../services/leetcodeService');


exports.getUserProfile = async (req, res) => {
  try {
    const { username } = req.params;
    const profile = await leetcodeService.fetchUserProfile(username);
    console.log('User profile retrieved for:', username);
    res.status(200).json({ success: true, data: profile });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getUserSubmissions = async (req, res) => {
  try {
    const { username } = req.params;
    const submissions = await leetcodeService.fetchUserSubmissions(username);
    console.log('User submissions retrieved for:', username, submissions ? submissions.length : 0);
    res.status(200).json({ success: true, data: submissions });
  } catch (error) {
    console.error('Error fetching user submissions:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};