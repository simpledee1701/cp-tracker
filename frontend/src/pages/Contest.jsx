import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarIcon, ChartPieIcon, ClockIcon, FireIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import ContestCard from '../components/ContestCard';
import PlatformFilter from '../components/PlatformFilter';
import Header from '../components/Header';
import ContestCalendar from '../components/ContestCalendar';

const Contest = () => {
  const [contests, setContests] = useState([]);
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const parseDuration = (duration) => {
    const [time, unit] = duration.split(' ');
    const timeValue = parseFloat(time);
    return unit.includes('hour') ? Math.round(timeValue * 60) : timeValue;
  };

  useEffect(() => {
    const fetchContests = async () => {
      try {
        const response = await fetch('/api/contests/upcoming');
        const data = await response.json();
        
        if (data.success) {
          const transformedContests = data.contests.map(contest => ({
            id: `${contest.name}-${contest.startTime}`,
            title: contest.name,
            platform: contest.platform.toLowerCase(),
            startTime: contest.startTime,
            endTime: contest.endTime,
            duration: parseDuration(contest.duration),
            url: contest.url,
            
          }));
          setContests(transformedContests);
        }
      } catch (error) {
        console.error('Error fetching contests:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContests();
  }, []);

  const filteredContests = contests.filter(contest => {
    const matchesPlatform = selectedPlatform === 'all' || contest.platform === selectedPlatform;
    const matchesSearch = contest.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesPlatform && matchesSearch;
  });

  return (
    <div className="min-h-screen  bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-black/30 backdrop-blur-md rounded-2xl p-6 mb-8 border border-white/10 shadow-xl"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-pink-200">
                Coding Contests
              </h1>
              <p className="text-gray-400 mt-2">Track upcoming competitions across platforms</p>
            </div>
            
            <div className="w-full md:w-64 relative">
              <input
                type="text"
                placeholder="Search contests..."
                className="w-full pl-10 pr-4 py-2 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Platform Filter */}
            <PlatformFilter selectedPlatform={selectedPlatform} setSelectedPlatform={setSelectedPlatform} />

            {/* Contest List */}
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
              <AnimatePresence>
                {filteredContests.length > 0 ? (
                  filteredContests.map((contest) => (
                    <ContestCard key={contest.id} contest={contest} />
                  ))
                ) : (
                  <motion.div
                    className="text-center py-12 bg-white/5 rounded-xl backdrop-blur-sm border border-white/10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <p className="text-gray-400">No contests found matching your criteria</p>
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Stats Cards */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-black/30 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-xl space-y-4"
            >
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <ChartPieIcon className="w-6 h-6 text-purple-400" />
                Contest Stats
              </h2>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Total Contests</span>
                  <span className="font-medium">{contests.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Upcoming</span>
                  <span className="text-green-400">
                    {contests.filter(c => new Date(c.startTime) > new Date()).length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Ongoing</span>
                  <span className="text-yellow-400">
                    {contests.filter(c => 
                      new Date() > new Date(c.startTime) && 
                      new Date() < new Date(c.endTime)
                    ).length}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Calendar Widget */}
            <ContestCalendar contests={filteredContests} />

            {/* Quick Links */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-black/30 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-xl"
            >
              <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
                <FireIcon className="w-6 h-6 text-purple-400" />
                Hot Contests
              </h2>
              
              <div className="space-y-3">
                {contests
                  .filter(c => c.participants > 5000)
                  .slice(0, 3)
                  .map(contest => (
                    <div
                      key={contest.id}
                      className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                    >
                      <span className="truncate">{contest.title}</span>
                      <span className="text-purple-400 text-sm whitespace-nowrap">
                        <div className="mt-4 flex justify-end">
                          <motion.a
                            href={contest.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-purple-300 hover:text-white text-sm font-medium flex items-center"
                            whileHover={{ x: 3 }}
                          >
                            Visit
                            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </motion.a>
                        </div>
                      </span>
                    </div>
                  ))}
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Contest;