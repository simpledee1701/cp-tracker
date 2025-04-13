const fetch = require('node-fetch');
const LEETCODE_API_URL = 'https://leetcode.com/graphql';

exports.fetchUserProfile = async (username) => {
    const query = `
      query userPublicProfile($username: String!) {
        matchedUser(username: $username) {
          username
          submitStats: submitStatsGlobal {
            acSubmissionNum {
              difficulty
              count
              submissions
            }
            totalSubmissionNum {
              difficulty
              count
              submissions
            }
          }
          profile {
            ranking
            reputation
            realName
            aboutMe
          }
        }
      }
    `;
  
    const variables = { username };
    const response = await makeGraphQLRequest(query, variables);
    return response.data.matchedUser;
};

exports.fetchUserSubmissions = async (username) => {
  const query = `
    query recentSubmissionList($username: String!, $limit: Int!) {
      recentSubmissionList(username: $username, limit: $limit) {
        id
        title
        titleSlug
        status
        statusDisplay
        lang
        timestamp
        url
      }
    }
  `;

  const variables = { 
    username, 
    limit: 20 
  };
  
  const response = await makeGraphQLRequest(query, variables);
  return response.data.recentSubmissionList;
};

async function makeGraphQLRequest(query, variables = {}) {
  try {
    const response = await fetch(LEETCODE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Referer': 'https://leetcode.com',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      body: JSON.stringify({ query, variables })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`GraphQL request failed: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    
    if (data.errors) {
      console.error('GraphQL Error Response:', JSON.stringify(data.errors, null, 2));
      throw new Error(`GraphQL errors: ${JSON.stringify(data.errors)}`);
    }
    
    return data;
  } catch (error) {
    console.error('Error in GraphQL request:', error);
    throw error;
  }
}