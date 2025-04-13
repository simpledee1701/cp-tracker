const fetch = require('node-fetch');

class LeetcodeService {
  constructor() {
    this.apiUrl = 'https://leetcode.com/graphql';
  }

  /**
   * Make a GraphQL request to LeetCode API
   * @param {string} query - GraphQL query
   * @param {Object} variables - Query variables
   * @returns {Promise<Object>} Response data
   */
  async makeGraphQLRequest(query, variables) {
    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Referer': 'https://leetcode.com'
        },
        body: JSON.stringify({
          query,
          variables
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.errors) {
        throw new Error(`GraphQL errors: ${JSON.stringify(data.errors)}`);
      }
      
      return data.data;
    } catch (error) {
      console.error('Error making GraphQL request:', error);
      throw error;
    }
  }

  /**
   * Fetch comprehensive data for a LeetCode user
   * @param {string} username - LeetCode username
   * @returns {Promise<Object>} User data
   */
  async fetchUserComprehensiveData(username) {
    // Profile query - basic user info and problem counts
    const profileQuery = `
      query userProfile($username: String!) {
        matchedUser(username: $username) {
          username
          submitStats: submitStatsGlobal {
            acSubmissionNum {
              difficulty
              count
              submissions
            }
          }
          profile {
            realName
            userAvatar
            ranking
            reputation
            starRating
            aboutMe
            school
            websites
            countryName
            company
            jobTitle
            skillTags
            postViewCount
            postViewCountDiff
          }
          badges {
            id
            displayName
            icon
            creationDate
          }
        }
        userContestRanking(username: $username) {
          attendedContestsCount
          rating
          globalRanking
          totalParticipants
          topPercentage
          badge {
            name
          }
        }
      }
    `;

    // Calendar activity query
    const calendarQuery = `
      query userProfileCalendar($username: String!) {
        matchedUser(username: $username) {
          userCalendar {
            activeYears
            streak
            totalActiveDays
            submissionCalendar
          }
        }
      }
    `;
    const skillsQuery = `
      query skillStats($username: String!) {
        matchedUser(username: $username) {
          tagProblemCounts {
            advanced {
              tagName
              tagSlug
              problemsSolved
            }
            intermediate {
              tagName
              tagSlug
              problemsSolved
            }
            fundamental {
              tagName
              tagSlug
              problemsSolved
            }
          }
        }
      }
    `;

    try {
      const [profileData, calendarData, skillsData] = await Promise.all([
        this.makeGraphQLRequest(profileQuery, { username }),
        this.makeGraphQLRequest(calendarQuery, { username }),
        this.makeGraphQLRequest(skillsQuery, { username })
      ]);
      
      const userData = {
        ...profileData.matchedUser,
        userContestRanking: profileData.userContestRanking,
        ...calendarData.matchedUser,
        tagProblemCounts: skillsData.matchedUser.tagProblemCounts
      };
      
      if (userData.userCalendar && userData.userCalendar.submissionCalendar) {
        try {
          userData.submissionCalendar = JSON.parse(userData.userCalendar.submissionCalendar);
          userData.streakCount = userData.userCalendar.streak || 0;
        } catch (e) {
          console.error('Error parsing submission calendar:', e);
          userData.submissionCalendar = {};
          userData.streakCount = 0;
        }
      }

      return userData;
    } catch (error) {
      console.error(`Failed to fetch data for user ${username}:`, error);
      throw error;
    }
  }
}

module.exports = new LeetcodeService();