const axios = require('axios');
const cheerio = require('cheerio');

const codechefService = {
  async extractProfileData(username) {
    try {
      const response = await axios.get(`https://www.codechef.com/users/${username}`);
      const $ = cheerio.load(response.data);
      
      const rating = $('.rating-number').text().trim();
      const fullName = $('.h2-style').text().trim();
      const profileImage = $('.user-details-container img').attr('src');
      
      const badges = [];
      $('.badge-details .badge-star').each((i, el) => {
        const badgeName = $(el).find('.badge-title').text().trim();
        const badgeDescription = $(el).find('.badge-description').text().trim();
        badges.push({
          name: badgeName,
          description: badgeDescription
        });
      });
      
      const problemsSolved = {
        total: $('.rating-data-section:contains("Problems Solved")').find('.content').text().trim(),
        breakdown: {}
      };
      
      // Extract problem difficulty breakdown
      $('.problems-solved-container .problems-solved-medium').each((i, el) => {
        const category = $(el).find('h5').text().trim();
        const count = $(el).find('.content').text().trim();
        problemsSolved.breakdown[category] = count;
      });
      
      return {
        username,
        fullName,
        profileImage,
        rating,
        badges,
        problemsSolved
      };
    } catch (error) {
      console.error('Error extracting profile data:', error);
      throw new Error('Failed to extract profile data');
    }
  },
  
  async extractSubmissionHeatmap(username) {
    try {
      const apiUrl = `https://codechef-api.vercel.app/handle/${username}`;
      console.log(`Fetching heatmap data from API: ${apiUrl}`);
      
      const response = await axios.get(apiUrl);
      
      if (!response.data || !response.data.success) {
        console.error('API returned error:', response.data);
        throw new Error('Failed to fetch heatmap data from API');
      }
      
      const heatmapData = response.data.heatMap || [];
      
      const activeDays = heatmapData.length;
      
      // Calculate total submissions
      let totalSubmissions = 0;
      heatmapData.forEach(day => {
        totalSubmissions += parseInt(day.value || 0);
      });
      
      const formattedData = heatmapData.map(day => ({
        date: day.date,
        count: parseInt(day.value || 0)
      }));
      
      // Return the formatted data
      return {
        activeDays,
        totalSubmissions,
        heatmapData: formattedData
      };
    } catch (error) {
      console.error('Error extracting submission heatmap:', error);
      throw new Error(`Failed to extract submission heatmap: ${error.message}`);
    }
  },
  
  async extractContestGraph(username) {
    try {
      // Fetch the contest data
      const response = await axios.get(`https://www.codechef.com/users/${username}`);
      const $ = cheerio.load(response.data);
      
      const contestData = [];
      
      // Extract contest data from the rating graph
      const scripts = $('script').toArray();
      for (const script of scripts) {
        const content = $(script).html() || '';
        if (content.includes('all_rating')) {
          const match = content.match(/all_rating\s*=\s*(\[.*?\]);/s);
          if (match && match[1]) {
            try {
              const ratingData = new Function(`return ${match[1]}`)();
              
              // Format contest data
              contestData.push(...ratingData.map(contest => ({
                contestCode: contest.code,
                contestName: contest.name,
                rating: contest.rating,
                rank: contest.rank,
                date: new Date(contest.end_date).toISOString().split('T')[0]
              })));
            } catch (e) {
              console.error('Error parsing contest data:', e);
            }
          }
        }
      }
      
      // Calculate statistics
      const contestsParticipated = contestData.length;
      let highestRating = 0;
      let bestRank = Infinity;
      
      if (contestData.length > 0) {
        highestRating = Math.max(...contestData.map(c => c.rating));
        bestRank = Math.min(...contestData.map(c => c.rank));
      }
      
      return {
        contestsParticipated,
        highestRating,
        bestRank,
        contestHistory: contestData
      };
    } catch (error) {
      console.error('Error extracting contest graph:', error);
      throw new Error('Failed to extract contest graph');
    }
  },
  
  async analyzeProfile(username) {
    try {
      // Get all the data first
      const profileData = await this.extractProfileData(username);
      const heatmapData = await this.extractSubmissionHeatmap(username);
      const contestData = await this.extractContestGraph(username);
      
      // Parse badge information for numerical values
      const totalBadges = profileData.badges.length;
      
      // Parse problems solved
      let totalProblemsSolved = 0;
      try {
        totalProblemsSolved = parseInt(profileData.problemsSolved.total, 10);
      } catch (e) {
        console.error('Error parsing total problems solved:', e);
      }
      
      // Analyze activity patterns
      const activeDays = heatmapData.activeDays;
      const activityRate = activeDays / 365; // Activity as percentage of the year
      
      // Calculate contest performance metrics
      const contestsParticipated = contestData.contestsParticipated;
      const ratingTrend = contestData.contestHistory.length >= 2 ? 
        contestData.contestHistory[contestData.contestHistory.length - 1].rating - contestData.contestHistory[0].rating : 0;
      
      // Identify strengths based on problem categories
      const problemBreakdown = profileData.problemsSolved.breakdown;
      let strongestCategory = '';
      let highestCount = 0;
      
      Object.entries(problemBreakdown).forEach(([category, countStr]) => {
        const count = parseInt(countStr, 10);
        if (count > highestCount) {
          highestCount = count;
          strongestCategory = category;
        }
      });
      
      return {
        username: profileData.username,
        summary: {
          totalBadges,
          totalProblemsSolved,
          activeDays,
          activityRate: activityRate.toFixed(2),
          contestsParticipated,
          highestRating: contestData.highestRating,
          bestRank: contestData.bestRank,
          ratingTrend
        },
        strengths: {
          strongestCategory,
          problemsSolvedInCategory: highestCount
        },
        recommendations: [
          activityRate < 0.3 ? "Increase coding frequency for better skill development" : "Good activity rate, keep it up!",
          totalProblemsSolved < 100 ? "Focus on solving more problems across categories" : "Good problem-solving volume",
          ratingTrend < 0 ? "Work on contest strategy to improve rating trend" : "Positive rating trend, continue the progress"
        ]
      };
    } catch (error) {
      console.error('Error analyzing profile:', error);
      throw new Error('Failed to analyze profile');
    }
  }
};

module.exports = codechefService;