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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 text-gray-100">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <motion.div
          layout
          className="mb-8 max-w-4xl mx-auto p-6 bg-white/5 backdrop-blur-md rounded-2xl shadow-lg border border-purple-500/30"
        >
          <h2 className="text-2xl font-bold text-purple-300 mb-4">CodeChef Stats</h2>
          {loading && <p className="text-center text-purple-300">Loading stats...</p>}
          {error && <p className="text-center text-red-400">Error: {error}</p>}
          {!loading && !error && statsData && (
            <CodeChefStats data={statsData} />
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default CodechefPage;