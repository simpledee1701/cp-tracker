const codechefService = require('../services/codechefService');

const codechefController = {
  async getProfileData(req, res) {
    try {
      const { username } = req.params;
      if (!username) {
        return res.status(400).json({ error: 'Username is required' });
      }
      const profileData = await codechefService.extractProfileData(username);
      return res.status(200).json(profileData);
    } catch (error) {
      console.error('Error in getProfileData:', error);
      return res.status(500).json({ error: error.message || 'Failed to extract profile data' });
    }
  },
  
  async getAnalysis(req, res) {
    try {
      const { username } = req.params;
      
      if (!username) {
        return res.status(400).json({ error: 'Username is required' });
      }
      
      const analysis = await codechefService.analyzeProfile(username);
      return res.status(200).json(analysis);
    } catch (error) {
      console.error('Error in getAnalysis:', error);
      return res.status(500).json({ error: error.message || 'Failed to analyze profile' });
    }
  },
  
  async getSubmissionHeatmap(req, res) {
    try {
      const { username } = req.params;
      
      if (!username) {
        return res.status(400).json({ error: 'Username is required' });
      }
      
      const heatmapData = await codechefService.extractSubmissionHeatmap(username);
      return res.status(200).json(heatmapData);
    } catch (error) {
      console.error('Error in getSubmissionHeatmap:', error);
      return res.status(500).json({ error: error.message || 'Failed to extract submission heatmap' });
    }
  },
  
  async getContestGraph(req, res) {
    try {
      const { username } = req.params;
      
      if (!username) {
        return res.status(400).json({ error: 'Username is required' });
      }
      
      const contestData = await codechefService.extractContestGraph(username);
      return res.status(200).json(contestData);
    } catch (error) {
      console.error('Error in getContestGraph:', error);
      return res.status(500).json({ error: error.message || 'Failed to extract contest graph' });
    }
  }
};

module.exports = codechefController;