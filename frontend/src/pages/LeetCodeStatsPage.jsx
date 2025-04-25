import { useState } from 'react';
import { motion } from 'framer-motion';
import LeetCodeStats from '../components/LeetCodeStats';
import Header from '../components/Header';

const LeetCodeStatsPage = () => {
  const [username, setUsername] = useState('SaiSuveer');
  const [searchInput, setSearchInput] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setUsername(searchInput.trim());
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 text-gray-100">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 text-center"
        >
          <h1 className="text-4xl font-bold mb-2">LeetCode Stats Dashboard</h1>
          <p className="text-xl text-purple-300">Track your coding progress and achievements</p>
        </motion.div>
        
        <motion.div 
          className="max-w-md mx-auto mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <form onSubmit={handleSearch} className="flex">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Enter LeetCode username"
              className="flex-grow px-4 py-2 bg-white/10 backdrop-blur-sm rounded-l-lg border border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-r-lg transition-colors"
            >
              Search
            </button>
          </form>
        </motion.div>
        
        <motion.div
          layout
          className="mb-8"
        >
          <LeetCodeStats username={username} />
        </motion.div>
        
        <motion.div 
          className="text-center mt-12 text-purple-300"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <p>Want to see more features? Let us know!</p>
        </motion.div>
      </main>
    </div>
  );
};

export default LeetCodeStatsPage;