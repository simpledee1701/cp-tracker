const supabase = require('./supabase');

class StatsRepository {
  async storeUserStats(userData) {
    try {
      const username = userData.profile.username;
      
      const { data: existingUser, error: fetchError } = await supabase
        .from('leetcode_data')
        .select('id')
        .eq('username', username)
        .maybeSingle();
      
      if (fetchError) throw fetchError;
      
      const streakCount = userData.calendar?.streak || 0;

      const leetcodeData = {
        username: username,
        profile: userData.profile || {},
        language_stats: userData.languageStats || null,
        tag_problem_counts: userData.tagProblemCounts || null,
        contest_ranking: userData.contestRanking || null,
        contest_history: userData.contestHistory || [],
        all_questions_count: userData.allQuestionsCount || null,
        solved_stats: {
          totalSolved: this.extractTotalSolved(userData),
          easySolved: this.extractDifficultySolved(userData, 'Easy'),
          mediumSolved: this.extractDifficultySolved(userData, 'Medium'),
          hardSolved: this.extractDifficultySolved(userData, 'Hard'),
          acceptanceRate: this.calculateAcceptanceRate(userData)
        },
        badges: userData.badges || null,
        calendar: userData.calendar || null,
        submission_calendar: userData.submissionCalendar 
          ? (typeof userData.submissionCalendar === 'string' 
              ? JSON.parse(userData.submissionCalendar) 
              : userData.submissionCalendar)
          : null,
        streak_count: streakCount,
        recent_submissions: userData.recentSubmissions || null,
        last_updated: new Date().toISOString()
      };
    
      let result;
      
      if (existingUser) {
        const { data, error: updateError } = await supabase
          .from('leetcode_data')
          .update(leetcodeData)
          .eq('username', username)
          .select();
        
        if (updateError) throw updateError;
        result = data[0];
      } else {
        const { data, error: insertError } = await supabase
          .from('leetcode_data')
          .insert([leetcodeData])
          .select();
        
        if (insertError) throw insertError;
        result = data[0];
      }
      return result;
    } catch (error) {
      console.error('Error storing user stats:', error);
      throw error;
    }
  }
  
  extractTotalSolved(userData) {
    if (userData.problemsSolved?.solvedStats?.submitStatsGlobal?.acSubmissionNum) {
      const allData = userData.problemsSolved.solvedStats.submitStatsGlobal.acSubmissionNum;
      return allData.find(item => item.difficulty === 'All')?.count || 0;
    }
    return 0;
  }

  extractDifficultySolved(userData, difficulty) {
    if (userData.problemsSolved?.solvedStats?.submitStatsGlobal?.acSubmissionNum) {
      const allData = userData.problemsSolved.solvedStats.submitStatsGlobal.acSubmissionNum;
      return allData.find(item => item.difficulty === difficulty)?.count || 0;
    }
    return 0;
  }

  calculateAcceptanceRate(userData) {
    if (userData.problemsSolved?.solvedStats?.submitStatsGlobal?.acSubmissionNum) {
      const allData = userData.problemsSolved.solvedStats.submitStatsGlobal.acSubmissionNum;
      const allSubmissions = allData.find(item => item.difficulty === 'All');
      if (allSubmissions && allSubmissions.submissions > 0) {
        return (allSubmissions.count / allSubmissions.submissions * 100).toFixed(1);
      }
    }
    return '0.0';
  }
}

module.exports = new StatsRepository();