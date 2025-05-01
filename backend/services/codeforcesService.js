const axios = require('axios');

const API_BASE = 'https://codeforces.com/api';

const getUserInfo = async (handle) => {
  try {
    const { data } = await axios.get(`${API_BASE}/user.info?handles=${handle}`);
    return data.result[0];
  } catch (error) {
    throw new Error('Failed to fetch user info from Codeforces');
  }
};

const getUserRating = async (handle) => {
  try {
    const { data } = await axios.get(`${API_BASE}/user.rating?handle=${handle}`);
    return data.result;
  } catch (error) {
    throw new Error('Failed to fetch rating history');
  }
};

const getUserSubmissions = async (handle) => {
    try {
      const { data } = await axios.get(
        `${API_BASE}/user.status?handle=${handle}&from=1&count=1000`
      );
      return data.result;
    } catch (error) {
      throw new Error('Failed to fetch submissions');
    }
  };

module.exports = {
  getUserInfo,
  getUserRating,
  getUserSubmissions
};


