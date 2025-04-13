const supabase = require('./supabase');

class StatsRepository {
  /**
   * Get stats for a specific LeetCode user
   * @param {string} username - LeetCode username
   * @returns {Promise<Object>} User stats or null if not found
   */
  async getUserStats(username) {
    const { data, error } = await supabase
      .from('leetcode_stats')
      .select('*')
      .eq('username', username)
      .single();
      
    if (error) {
      if (error.code === 'PGRST116') { // Record not found
        return null;
      }
      throw error;
    }
    
    return data;
  }

  /**
   * Get stats for all users
   * @param {Object} options - Query options (limit, offset)
   * @returns {Promise<Array>} Array of user stats
   */
  async getAllStats({ limit = 50, offset = 0, orderBy = 'total_solved', direction = 'desc' } = {}) {
    const { data, error } = await supabase
      .from('leetcode_stats')
      .select('*')
      .order(orderBy, { ascending: direction === 'asc' })
      .range(offset, offset + limit - 1);
      
    if (error) throw error;
    return data || [];
  }

  /**
   * Store or update user stats
   * @param {Object} userData - User stats data
   * @returns {Promise<Object>} Stored user data
   */
  async storeUserStats(userData) {
    // First check if user exists
    const existing = await this.getUserStats(userData.username);
    
    // Prepare the data object
    const statsData = {
      username: userData.username,
      profile_name: userData.profile?.realName || userData.profile?.userAvatar || userData.username,
      total_solved: userData.submitStats?.acSubmissionNum?.[0]?.count || 0,
      easy_solved: userData.submitStats?.acSubmissionNum?.[1]?.count || 0,
      medium_solved: userData.submitStats?.acSubmissionNum?.[2]?.count || 0,
      hard_solved: userData.submitStats?.acSubmissionNum?.[3]?.count || 0,
      acceptance_rate: userData.submitStats?.acSubmissionNum?.[0]?.submissions > 0
        ? (userData.submitStats?.acSubmissionNum?.[0]?.count / userData.submitStats?.acSubmissionNum?.[0]?.submissions * 100).toFixed(1)
        : 0,
      ranking: userData.profile?.ranking || null,
      contribution_points: userData.contributions?.points || 0,
      reputation: userData.profile?.reputation || 0,
      streak: userData.streakCount || 0,
      website: userData.profile?.websites || null,
      company: userData.profile?.company || null,
      school: userData.profile?.school || null,
      location: userData.profile?.countryName || null,
      submission_calendar: userData.submissionCalendar || {},
      skills_tags: userData.tagProblemCounts?.advanced?.favoriteTags || [],
      contest_rating: userData.userContestRanking?.rating || null,
      contest_ranking: userData.userContestRanking?.ranking || null,
      contest_attended: userData.userContestRanking?.attendedContestsCount || 0,
      badges: userData.badges || [],
      solved_questions_list: userData.matchedUser?.submissionNum || [],
      updated_at: new Date().toISOString()
    };
    
    if (existing) {
      // Update existing record
      const { data, error } = await supabase
        .from('leetcode_stats')
        .update(statsData)
        .eq('username', userData.username)
        .select();
        
      if (error) throw error;
      return data[0];
    } else {
      // Insert new record
      statsData.created_at = new Date().toISOString();
      
      const { data, error } = await supabase
        .from('leetcode_stats')
        .insert([statsData])
        .select();
        
      if (error) throw error;
      return data[0];
    }
  }

  /**
   * Delete user stats
   * @param {string} username - LeetCode username
   * @returns {Promise<boolean>} Success indicator
   */
  async deleteUserStats(username) {
    const { error } = await supabase
      .from('leetcode_stats')
      .delete()
      .eq('username', username);
      
    if (error) throw error;
    return true;
  }

  /**
   * Get user rank among all users
   * @param {string} username - LeetCode username
   * @param {string} metric - Metric to rank by (total_solved, contest_rating, etc.)
   * @returns {Promise<Object>} Rank information
   */
  async getUserRank(username, metric = 'total_solved') {
    // First get all users ordered by the metric
    const { data, error } = await supabase
      .from('leetcode_stats')
      .select('username, ' + metric)
      .order(metric, { ascending: false });
      
    if (error) throw error;
    
    if (!data || data.length === 0) {
      return { rank: null, total: 0 };
    }
    
    // Find user's rank
    const userIndex = data.findIndex(user => user.username === username);
    if (userIndex === -1) {
      return { rank: null, total: data.length };
    }
    
    return { 
      rank: userIndex + 1, 
      total: data.length,
      percentile: ((data.length - userIndex) / data.length * 100).toFixed(1)
    };
  }
}

module.exports = new StatsRepository();