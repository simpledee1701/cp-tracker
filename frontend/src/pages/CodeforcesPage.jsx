import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
  }, []); // Empty dependency array to run only once on mount

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark  bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 text-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-400"></div>
      </div>
    );
  }
  

  if (error) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="text-red-500 text-xl">{error}</div>
      </div>
    );
  }

  return (

    <div className="min-h-screen bg-dark  bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 text-gray-100">
        <Header />
      <div className="max-w-6xl mx-auto space-y-8 my-5">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          <ProfileCard user={userData} />
          
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="space-y-8"
          >
            <CalendarHeatmap submissionCalendar={userData.submissionCalendar} />
            <RecentContests contests={userData.recentContests} />
          </motion.div>
        </motion.div>
  
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <RatingChart ratingHistory={userData.ratingHistory} />
        </motion.div>
      </div>
    </div>
  );
}

export default CodeforcesPage;