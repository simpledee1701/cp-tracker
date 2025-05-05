import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import LeetCodeStats from '../components/LeetCodeStats';
import Header from '../components/Header';
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 text-gray-100">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <motion.div
          layout
          className="mb-8 max-w-4xl mx-auto p-6 bg-white/5 backdrop-blur-md rounded-2xl shadow-lg border border-purple-500/30"
        >
          <h2 className="text-2xl font-bold text-purple-300 mb-4">LeetCode Stats</h2>
          {username ? <LeetCodeStats username={username} /> : null}
        </motion.div>
      </main>
    </div>
  );
};

export default LeetcodePage;
