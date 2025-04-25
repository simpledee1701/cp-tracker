import { useState } from 'react';
import { motion } from 'framer-motion';
import LeetCodeStats from '../components/LeetcodeStats';
import Header from '../components/Header';

const LeetcodePage = () => {
  const [username, setUsername] = useState('SaiSuveer');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 text-gray-100">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <motion.div
          layout
          className="mb-8 max-w-4xl mx-auto p-6 bg-white/5 backdrop-blur-md rounded-2xl shadow-lg border border-purple-500/30"
        >
          <LeetCodeStats username={username} />
        </motion.div>
        
        <motion.div 
          className="text-center mt-12 text-purple-300"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
        </motion.div>
      </main>
    </div>
  );
};

export default LeetcodePage;
