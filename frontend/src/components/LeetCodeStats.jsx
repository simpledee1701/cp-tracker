import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const LeetCodeStats = ({ username = 'SaiSuveer' }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);
      
      const response = await fetch(`/api/leetcode/stats/${username}/`, {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        }
      });
      
      clearTimeout(timeoutId);
      
      // Check for errors in the response
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`User "${username}" not found on LeetCode`);
        } else if (response.status === 429) {
          throw new Error('Too many requests. Please try again later.');
        } else {
          throw new Error(`Server error: ${response.status} ${response.statusText}`);
        }
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server returned a non-JSON response. The API endpoint might be misconfigured or experiencing issues.');
      }
      
      const data = await response.json();
      
      // Validate the response data
      if (!data || Object.keys(data).length === 0) {
        throw new Error('No data available for this user');
      }
      
      setStats(data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching LeetCode stats:', err);
      
      // Handle specific error for invalid JSON (HTML response)
      if (err instanceof SyntaxError && err.message.includes('Unexpected token')) {
        setError('The server returned an HTML page instead of JSON data. This typically happens when the server encounters an error. Please check your API endpoint configuration.');
      } else if (err.name === 'AbortError') {
        setError('Request timed out. The server took too long to respond.');
      } else {
        setError(err.message || 'An unknown error occurred');
      }
      
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [username]);

  const handleDebugClick = async () => {
    try {
      const response = await fetch(`/api/leetcode/stats/update/${username}/`);
      const text = await response.text();
      console.log('Raw API Response:', text);
      alert('Check your browser console for the raw API response');
    } catch (err) {
      console.error('Error fetching raw response:', err);
    }
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
              onClick={fetchStats}
            >
              Try Again
            </button>
            
            <button 
              className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors w-full mt-2"
              onClick={handleDebugClick}
            >
              Debug Response
            </button>
            
            <div className="text-sm text-red-200 mt-4">
              <p className="mb-2">Possible solutions:</p>
              <ul className="list-disc list-inside space-y-1 text-left">
                <li>Check if your backend API is running correctly</li>
                <li>Ensure the API route <code className="bg-red-900/30 px-1 rounded">/api/leetcode/stats/update/{username}/</code> is properly configured</li>
                <li>Verify the API is returning JSON data and not HTML</li>
                <li>Check your server logs for potential errors</li>
                <li>The LeetCode API might be temporarily unavailable</li>
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

  return (
    <motion.div 
      className="bg-gradient-to-br from-gray-900 to-purple-900 rounded-xl p-8 shadow-lg text-white"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        className="flex items-center mb-6"
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <img 
          src={stats.avatar || "/api/placeholder/100/100"} 
          alt={`${username}'s profile`} 
          className="w-16 h-16 rounded-full border-2 border-purple-400 mr-4"
        />
        <div>
          <h1 className="text-2xl font-bold">{username}</h1>
          <p className="text-purple-300">LeetCode Profile Stats</p>
        </div>
      </motion.div>

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
                      ? 283 - (283 * stats.totalSolved / stats.totalProblems) 
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

      <motion.div 
        className="mb-8"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <motion.h2 variants={itemVariants} className="text-xl font-bold mb-4">Submission Stats</motion.h2>
        <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
            <h3 className="text-purple-300 text-sm">Acceptance Rate</h3>
            <p className="text-xl font-bold">{stats.acceptanceRate ? `${stats.acceptanceRate}%` : 'N/A'}</p>
          </div>
          
          <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
            <h3 className="text-purple-300 text-sm">Total Submissions</h3>
            <p className="text-xl font-bold">{stats.totalSubmissions || 0}</p>
          </div>
          
          <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
            <h3 className="text-purple-300 text-sm">Accepted</h3>
            <p className="text-xl font-bold">{stats.acceptedSubmissions || 0}</p>
          </div>
          
          <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
            <h3 className="text-purple-300 text-sm">Streak</h3>
            <p className="text-xl font-bold">{stats.streak || 0} days</p>
          </div>
        </motion.div>
      </motion.div>

      {stats.recentSubmissions && stats.recentSubmissions.length > 0 && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          <motion.h2 variants={itemVariants} className="text-xl font-bold mb-4">Recent Activity</motion.h2>
          <motion.ul variants={itemVariants} className="bg-white/10 rounded-lg backdrop-blur-sm divide-y divide-gray-700">
            {stats.recentSubmissions.slice(0, 5).map((submission, index) => (
              <motion.li 
                key={index}
                className="p-4 flex justify-between items-center"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 * index }}
              >
                <div>
                  <p className="font-medium">{submission.problemName}</p>
                  <p className="text-sm text-purple-300">{new Date(submission.timestamp).toLocaleString()}</p>
                </div>
                <span className={`px-2 py-1 rounded text-xs ${
                  submission.status === 'Accepted' ? 'bg-green-500/20 text-green-400' : 
                  'bg-red-500/20 text-red-400'
                }`}>
                  {submission.status}
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
        <p className="text-purple-300 text-sm">
          Last updated: {stats.lastUpdated ? new Date(stats.lastUpdated).toLocaleString() : 'Unknown'}
        </p>
        <button 
          onClick={fetchStats} 
          className="mt-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
        >
          Refresh Stats
        </button>
      </motion.div>
    </motion.div>
  );
};

export default LeetCodeStats;