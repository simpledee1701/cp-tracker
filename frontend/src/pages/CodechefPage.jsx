import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import CodeChefStats from '../components/CodechefStats';
import Header from '../components/Header';

const CodechefPage = ({ username = 'suveerprasad10' }) => {
  const [responseData, setResponseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`/api/codechef/profile/${username}/`);
        if (!res.ok) {
          throw new Error('Failed to fetch CodeChef stats');
        }
        const data = await res.json();
        setResponseData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [username]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 text-gray-100">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <motion.div
          layout
          className="mb-8 max-w-4xl mx-auto p-6 bg-white/5 backdrop-blur-md rounded-2xl shadow-lg border border-purple-500/30"
        >
          {loading && <p className="text-center text-purple-300">Loading stats...</p>}
          {error && <p className="text-center text-red-400">Error: {error}</p>}
          {!loading && !error && responseData && (
            <CodeChefStats data={responseData} />
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default CodechefPage;
