import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '../components/Header';
import ContestCard from '../components/ContestCard';
import PlatformStats from '../components/PlatformStats';
import UpcomingContests from '../components/UpcomingContests';
import ContestCalendar from '../components/ContestCalendar';

const Home = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [contests, setContests] = useState([]);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API fetch
    setTimeout(() => {
      setContests(mockContests);
      setProfileData(mockProfile);
      setLoading(false);
    }, 1500);
  }, []);

  const filteredContests = activeTab === 'all' 
    ? contests 
    : contests.filter(contest => contest.platform === activeTab);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 text-gray-100">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Profile Summary Section */}
        <AnimatePresence>
          {profileData && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <ProfileSummary data={profileData} />
            </motion.div>
          )}
        </AnimatePresence>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Platform Tabs */}
            <motion.div 
              className="flex space-x-4 overflow-x-auto pb-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {['all', 'leetcode', 'codeforces', 'codechef', 'gfg'].map((platform) => (
                <button
                  key={platform}
                  onClick={() => setActiveTab(platform)}
                  className={`px-4 py-2 rounded-full capitalize text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                    activeTab === platform
                      ? 'bg-white/20 backdrop-blur-md text-white shadow-lg'
                      : 'bg-black/20 hover:bg-white/10 backdrop-blur-sm'
                  }`}
                >
                  {platform === 'all' ? 'All Platforms' : platform}
                </button>
              ))}
            </motion.div>
            
            {/* Contests List */}
            {loading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="h-24 bg-white/5 rounded-xl backdrop-blur-sm animate-pulse"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.1 }}
                  />
                ))}
              </div>
            ) : (
              <motion.div 
                className="space-y-4"
                layout
              >
                <AnimatePresence>
                  {filteredContests.length > 0 ? (
                    filteredContests.map((contest) => (
                      <ContestCard key={contest.id} contest={contest} />
                    ))
                  ) : (
                    <motion.div 
                      className="text-center py-12 bg-white/5 rounded-xl backdrop-blur-sm shadow-lg"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <p className="text-gray-400">No contests found for this platform</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
          
          <div className="space-y-8">
            {/* Platform Stats */}
            <PlatformStats contests={contests} loading={loading} />
            
            {/* Upcoming Contests */}
            <UpcomingContests contests={contests} loading={loading} />
            
            {/* Contest Calendar */}
            <ContestCalendar contests={contests} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;

// Mock data remains the same as previous implementation

// Mock data - replace with your actual API data
const mockContests = [
  {
    id: 1,
    title: 'Weekly Contest 345',
    platform: 'leetcode',
    startTime: '2023-05-14T06:30:00Z',
    endTime: '2023-05-14T08:00:00Z',
    duration: 90,
    url: 'https://leetcode.com/contest/weekly-contest-345',
    registered: true,
  },
  {
    id: 2,
    title: 'Codeforces Round 867 (Div. 3)',
    platform: 'codeforces',
    startTime: '2023-05-15T11:05:00Z',
    endTime: '2023-05-15T13:05:00Z',
    duration: 120,
    url: 'https://codeforces.com/contest/1811',
    registered: false,
  },
  // Add more mock contests...
];

const mockProfile = {
  username: 'coding_pro',
  totalContests: 42,
  rating: {
    leetcode: 1850,
    codeforces: 1600,
    codechef: 2100,
  },
  problemsSolved: {
    leetcode: 450,
    codeforces: 320,
    codechef: 280,
    gfg: 150,
  },
  recentPerformance: [
    { platform: 'leetcode', change: '+25' },
    { platform: 'codeforces', change: '-15' },
    { platform: 'codechef', change: '+40' },
  ],
};