import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const LeetcodeStats = ({ username = 'SaiSuveer' }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/leetcode/stats/${username}/`);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`User "${username}" not found on LeetCode`);
        } else if (response.status === 429) {
          throw new Error('Too many requests. Please try again later.');
        } else {
          throw new Error(`Failed to fetch LeetCode stats (${response.status})`);
        }
      }

      const responseData = await response.json();

      if (!responseData || !responseData.data || Object.keys(responseData.data).length === 0) {
        throw new Error('No data available for this user');
      }

      // Map the response data to match the component's expected structure
      const data = responseData.data;

      const formattedStats = {
        // Basic profile info
        username: data.username,
        avatar: data.profile?.profile?.userAvatar,
        realName: data.profile?.profile?.realName,
        aboutMe: data.profile?.profile?.aboutMe,
        company: data.profile?.profile?.company,
        school: data.profile?.profile?.school,
        countryName: data.profile?.profile?.countryName,

        // Problem solving stats
        totalSolved: data.solved_stats?.totalSolved || 0,
        totalProblems: data.solved_stats?.easySolved + data.solved_stats?.mediumSolved + data.solved_stats?.hardSolved + 0,
        easySolved: data.solved_stats?.easySolved || 0,
        mediumSolved: data.solved_stats?.mediumSolved || 0,
        hardSolved: data.solved_stats?.hardSolved || 0,
        totalEasy: 740, // Approximate from LeetCode
        totalMedium: 1560, // Approximate from LeetCode
        totalHard: 700,

        ranking: data.profile?.profile?.ranking,
        rating: data.contest_ranking?.rating?.toFixed(2) || 'N/A',
        totalContestsAttended: data.contest_ranking?.attendedContestsCount || 0,

        // Language stats
        languages: data.language_stats || [],

        // Streak info
        streak: data.streak_count || 0,
        totalActiveDays: data.calendar?.totalActiveDays || 0,

        // Recent submissions
        recentSubmissions: data.recent_submissions?.map(submission => ({
          problemName: submission.title,
          timestamp: submission.timestamp * 1000, // Convert to milliseconds
          status: 'Accepted', // Assuming these are accepted submissions
          problemSlug: submission.titleSlug
        })) || [],

        // Last updated timestamp
        lastUpdated: data.last_updated
      };

      setStats(formattedStats);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching LeetCode stats:', err);
      setError(err.message || 'An unknown error occurred');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [username]);

  // Function to retry loading the stats
  const retryFetch = () => {
    fetchStats();
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-gray-900 to-purple-900 rounded-xl p-8 shadow-lg text-white">
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-purple-300">Loading LeetCode stats for {username}...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <motion.div
        className="bg-gradient-to-br from-gray-900 to-red-900 rounded-xl p-8 shadow-lg text-white"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col items-center justify-center text-center p-6">
          <div className="w-20 h-20 mb-6 bg-red-500/20 rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>

          <h2 className="text-2xl font-bold mb-2">Error Loading Stats</h2>
          <p className="text-red-300 mb-6">{error}</p>

          <div className="space-y-3">
            <button
              className="px-6 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors w-full"
              onClick={retryFetch}
            >
              Try Again
            </button>

            <div className="text-sm text-red-200 mt-4">
              <p className="mb-2">Possible solutions:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Check if the username "{username}" is correct</li>
                <li>Verify your internet connection</li>
                <li>The LeetCode API might be temporarily unavailable</li>
                <li>Try again in a few moments</li>
              </ul>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  if (!stats) return null;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { duration: 0.5 } }
  };

  const progressVariants = {
    hidden: { width: 0 },
    show: { width: '100%', transition: { duration: 1.5, ease: "easeOut" } }
  };

  const skillTags = stats.languages?.map(lang => ({
    name: lang.languageName,
    count: lang.problemsSolved
  })) || [];

  return (
    <motion.div
      className="bg-gradient-to-br from-gray-900 to-purple-900 rounded-xl p-8 shadow-lg text-white"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >

      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={itemVariants} className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
          <h3 className="text-purple-300 text-sm">Ranking</h3>
          <p className="text-3xl font-bold">{stats.ranking || 'N/A'}</p>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
          <h3 className="text-purple-300 text-sm">Rating</h3>
          <p className="text-3xl font-bold">{stats.rating || 'N/A'}</p>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
          <h3 className="text-purple-300 text-sm">Contest Attended</h3>
          <p className="text-3xl font-bold">{stats.totalContestsAttended || 0}</p>
        </motion.div>
      </motion.div>

      <motion.div
        className="mb-8"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <motion.h2 variants={itemVariants} className="text-xl font-bold mb-4">Problem Solving Stats</motion.h2>
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-purple-300">Easy</span>
                <span className="text-sm text-green-400">
                  {stats.easySolved || 0}/{stats.totalEasy || 0}
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2.5">
                <motion.div
                  className="bg-green-400 h-2.5 rounded-full"
                  style={{ width: `${stats.easySolved && stats.totalEasy ? (stats.easySolved / stats.totalEasy) * 100 : 0}%` }}
                  variants={progressVariants}
                ></motion.div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-purple-300">Medium</span>
                <span className="text-sm text-yellow-400">
                  {stats.mediumSolved || 0}/{stats.totalMedium || 0}
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2.5">
                <motion.div
                  className="bg-yellow-400 h-2.5 rounded-full"
                  style={{ width: `${stats.mediumSolved && stats.totalMedium ? (stats.mediumSolved / stats.totalMedium) * 100 : 0}%` }}
                  variants={progressVariants}
                ></motion.div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-purple-300">Hard</span>
                <span className="text-sm text-red-400">
                  {stats.hardSolved || 0}/{stats.totalHard || 0}
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2.5">
                <motion.div
                  className="bg-red-400 h-2.5 rounded-full"
                  style={{ width: `${stats.hardSolved && stats.totalHard ? (stats.hardSolved / stats.totalHard) * 100 : 0}%` }}
                  variants={progressVariants}
                ></motion.div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <motion.div
              className="relative w-40 h-40"
              initial={{ rotate: -90 }}
              animate={{ rotate: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              <svg viewBox="0 0 100 100" className="w-full h-full">
                {/* Background circles */}
                <circle cx="50" cy="50" r="45" fill="none" stroke="#374151" strokeWidth="8" />

                {/* Progress circles - we'll animate their stroke-dashoffset */}
                <motion.circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#4ADE80"
                  strokeWidth="8"
                  strokeDasharray="283"
                  initial={{ strokeDashoffset: 283 }}
                  animate={{
                    strokeDashoffset: stats.totalSolved && stats.totalProblems
                      ? 283 - (283 * stats.totalSolved / 3000) // Approx total problems on LeetCode 
                      : 283
                  }}
                  transition={{ duration: 1.5, delay: 0.7 }}
                  strokeLinecap="round"
                  transform="rotate(-90 50 50)"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.span
                  className="text-3xl font-bold"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 1 }}
                >
                  {stats.totalSolved || 0}
                </motion.span>
                <span className="text-sm text-purple-300">solved</span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>

      {/* Programming Languages Section */}
      <motion.div
        className="mb-8"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <motion.h2 variants={itemVariants} className="text-xl font-bold mb-4">Programming Languages</motion.h2>
        <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {skillTags.map((lang, index) => (
            <div key={index} className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
              <h3 className="text-purple-300 text-sm">{lang.name}</h3>
              <p className="text-xl font-bold">{lang.count}</p>
            </div>
          ))}
        </motion.div>
      </motion.div>

      <motion.div
        className="mb-8"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <motion.h2 variants={itemVariants} className="text-xl font-bold mb-4">Activity Stats</motion.h2>
        <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
            <h3 className="text-purple-300 text-sm">Current Streak</h3>
            <p className="text-xl font-bold">{stats.streak || 0} days</p>
          </div>

          <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
            <h3 className="text-purple-300 text-sm">Total Active Days</h3>
            <p className="text-xl font-bold">{stats.totalActiveDays || 0}</p>
          </div>

          <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
            <h3 className="text-purple-300 text-sm">Recent Contest Rating</h3>
            <p className="text-xl font-bold">{stats.rating || 'N/A'}</p>
          </div>

          <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
            <h3 className="text-purple-300 text-sm">Global Ranking</h3>
            <p className="text-xl font-bold">{stats.ranking || 'N/A'}</p>
          </div>
        </motion.div>
      </motion.div>

      {stats.recentSubmissions && stats.recentSubmissions.length > 0 && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="w-full max-w-3xl mx-auto"
        >
          <motion.h2
            variants={itemVariants}
            className="text-2xl font-semibold mb-4 text-white"
          >
            Recent Activity
          </motion.h2>

          <motion.ul
            variants={itemVariants}
            className="bg-white/10 rounded-xl backdrop-blur-md divide-y divide-gray-700 overflow-hidden shadow-lg"
          >
            {stats.recentSubmissions.slice(0, 5).map((submission, index) => (
              <motion.li
                key={index}
                className="p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 * index }}
              >
                <div className="text-white">
                  <p className="font-medium text-base">{submission.problemName}</p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-500/20 text-green-400 border border-green-400/40">
                  Accepted
                </span>
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>
      )}

      <motion.div
        className="mt-8 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <button
          onClick={retryFetch}
          className="mt-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
        >
          Refresh Stats
        </button>
      </motion.div>
    </motion.div>
  );
};

export default LeetcodeStats;