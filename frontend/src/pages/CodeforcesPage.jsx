import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProfileCard from '../components/codeforces/ProfileCard';
import RatingChart from '../components/codeforces/RatingChart';
import RecentContests from '../components/codeforces/RecentContests';
import CalendarHeatmap from '../components/codeforces/CalendarHeatmap';
import Header from '../components/Header';

const CodeforcesPage = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const handle = 'tourist'; // Hardcoded handle
        const response = await fetch(`/api/codeforces/profile/${handle}`);
        if (!response.ok) throw new Error('Failed to fetch data');
        const data = await response.json();
        setUserData(data);
        setError('');
      } catch (err) {
        setError('Failed to load profile data');
        setUserData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-blue-300">Loading Codeforces data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <motion.div
          className="bg-gray-800 rounded-xl p-8 shadow-lg text-white max-w-md mx-4 border border-gray-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col items-center justify-center text-center p-4">
            <div className="w-20 h-20 mb-6 bg-red-500/20 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-2">Error Loading Data</h2>
            <p className="text-red-300 mb-6">{error}</p>
            <button
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors w-full"
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          {/* Profile Card */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <ProfileCard user={userData} />
          </motion.div>

          {/* Stats Overview */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-6"
          >
            <h2 className="text-xl font-bold text-blue-400 mb-4">Performance Overview</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-700/50 p-4 rounded-lg">
                <h3 className="text-blue-300 text-sm">Current Rating</h3>
                <p className="text-2xl font-bold">{userData.rating}</p>
              </div>
              <div className="bg-gray-700/50 p-4 rounded-lg">
                <h3 className="text-blue-300 text-sm">Max Rating</h3>
                <p className="text-2xl font-bold">{userData.maxRating}</p>
              </div>
              <div className="bg-gray-700/50 p-4 rounded-lg">
                <h3 className="text-blue-300 text-sm">Contests</h3>
                <p className="text-2xl font-bold">{userData.contests || 0}</p>
              </div>
              <div className="bg-gray-700/50 p-4 rounded-lg">
                <h3 className="text-blue-300 text-sm">Friends</h3>
                <p className="text-2xl font-bold">{userData.friendOfCount || 0}</p>
              </div>
            </div>
          </motion.div>

          {/* Calendar Heatmap */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <CalendarHeatmap submissionCalendar={userData.submissionCalendar} />
          </motion.div>

          {/* Recent Contests */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <RecentContests contests={userData.recentContests} />
          </motion.div>

          {/* Rating Chart */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <RatingChart ratingHistory={userData.ratingHistory} />
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
};

export default CodeforcesPage;