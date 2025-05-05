import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import LeetCodeStats from '../components/LeetCodeStats';
import Headers from '../components/Headers';
import { useUserProfile } from '../context/UserProfileContext';

const LeetcodePage = () => {
  const { profileData, error: profileError } = useUserProfile();
  const [username, setUsername] = useState(null);

  useEffect(() => {
    if (profileData?.leetcode_username) {
      setUsername(profileData.leetcode_username);
    }
  }, [profileData]);

  if (profileError) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-400">
        <p>Error loading profile: {profileError}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <Headers />
      <main className="container mx-auto px-4 py-8">
        <motion.div
          layout
          className="mb-8 max-w-4xl mx-auto p-6 bg-gray-800 rounded-2xl shadow-lg border border-gray-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold text-blue-400 mb-4">LeetCode Stats</h2>
          {username ? <LeetCodeStats username={username} /> : (
            <div className="text-center py-8 text-gray-400">
              <p>No LeetCode username configured in your profile</p>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default LeetcodePage;