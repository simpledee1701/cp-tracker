import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import CodeChefStats from '../components/CodechefStats';
import Header from '../components/Header';
import { useUserProfile } from '../context/UserProfileContext';

const CodechefPage = () => {
  const { profileData, error: profileError } = useUserProfile();
  const [username, setUsername] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statsData, setStatsData] = useState(null);

  useEffect(() => {
    if (profileData?.codechef_username) {
      setUsername(profileData.codechef_username);
    }
  }, [profileData]);

  useEffect(() => {
    const fetchStats = async () => {
      if (!username) return;
      
      try {
        setLoading(true);
        const res = await fetch(`/api/codechef/profile/${username}/`);
        if (!res.ok) {
          throw new Error('Failed to fetch CodeChef stats');
        }
        const data = await res.json();
        setStatsData(data);
        setError(null);
      } catch (err) {
        setError(err.message);
        setStatsData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [username]);

  if (profileError) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-400">
        <p>Error loading profile: {profileError}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <motion.div
          layout
          className="mb-8 max-w-4xl mx-auto p-6 bg-gray-800 rounded-2xl shadow-lg border border-gray-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold text-blue-400 mb-4">CodeChef Stats</h2>
          {loading && (
            <div className="flex justify-center items-center h-64">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 text-blue-300">Loading CodeChef stats...</p>
              </div>
            </div>
          )}
          {error && (
            <div className="flex justify-center items-center h-64">
              <div className="text-center">
                <p className="text-red-400 mb-4">Error: {error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}
          {!loading && !error && statsData && (
            <CodeChefStats data={statsData} />
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default CodechefPage;