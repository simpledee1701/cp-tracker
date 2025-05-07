import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CodeChefStats from '../components/CodechefStats';
import Header from '../components/Header';
import { useUserProfile } from '../context/UserProfileContext';

const CodechefPage = () => {
  // State management
  const { profileData, loading: profileLoading, error: profileError } = useUserProfile();
  const [username, setUsername] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statsData, setStatsData] = useState(null);
  const [initialLoad, setInitialLoad] = useState(true);

  // Handle username from profile data
  useEffect(() => {
    if (profileLoading) {
      return; // Still loading profile data
    }
    
    if (profileData?.codechef_username) {
      setUsername(profileData.codechef_username);
    } else {
      // No username found, stop loading
      setLoading(false);
      setInitialLoad(false);
    }
  }, [profileData, profileLoading]);

  // Fetch CodeChef stats when username is available
  useEffect(() => {
    if (!username) return;

    const fetchStats = async () => {
      try {
        setLoading(true);
        // Add cache-busting parameter
        const res = await fetch(`/api/codechef/profile/${username}/?t=${Date.now()}`);
        
        if (!res.ok) {
          if (res.status === 404) {
            throw new Error('User not found on CodeChef');
          } else if (res.status >= 500) {
            throw new Error('Server is currently busy. Please try again later.');
          } else {
            throw new Error(`Failed to fetch CodeChef stats (${res.status})`);
          }
        }
        
        const data = await res.json();
        
        if (!data || Object.keys(data).length === 0) {
          throw new Error('No data found for this user');
        }
        
        setStatsData(data);
        setError(null);
      } catch (err) {
        setError(err.message);
        setStatsData(null);
      } finally {
        setLoading(false);
        setInitialLoad(false);
      }
    };

    // Add small delay to prevent rapid consecutive requests
    const timer = setTimeout(fetchStats, 300);
    return () => clearTimeout(timer);
  }, [username]);

  // Page loading state (initial load)
  if ((initialLoad && profileLoading) || (initialLoad && loading)) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
        <Header />
        <div className="container mx-auto px-4 py-16 flex justify-center items-center">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-blue-300">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  // Profile error state
  if (profileError) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
        <Header />
        <div className="container mx-auto px-4 py-16 flex justify-center items-center">
          <div className="max-w-lg w-full bg-gray-800 border border-gray-700 rounded-xl p-8 shadow-lg">
            <h2 className="text-xl font-bold text-red-300 mb-2">Error Loading Profile</h2>
            <p className="text-gray-300 mb-6">We couldn't load your profile information.</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors w-full"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {/* No username state */}
          {!username && !loading && (
            <motion.div
              key="no-username"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="max-w-2xl mx-auto p-8 bg-gray-800 rounded-2xl shadow-lg border border-gray-700 text-center"
            >
              <div className="w-20 h-20 mb-6 mx-auto bg-gray-700 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold mb-3">No CodeChef Username Found</h2>
              <p className="text-gray-300 mb-6">Please add your CodeChef username to your profile to view your statistics.</p>
              <button
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors w-full max-w-xs mx-auto"
                onClick={() => window.location.href = '/profile'}
              >
                Go to Profile
              </button>
            </motion.div>
          )}

          {/* Username found but loading or has data or has error */}
          {username && (
            <motion.div
              key="content"
              layout
              className="max-w-4xl mx-auto p-6 bg-gray-800 rounded-2xl shadow-lg border border-gray-700"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <h2 className="text-2xl font-bold text-blue-400 mb-4">CodeChef Stats</h2>
              
              {/* Loading state */}
              <AnimatePresence>
                {loading && (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex justify-center items-center h-64"
                  >
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                      <p className="mt-4 text-blue-300">Loading CodeChef stats...</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              
              {/* Error state */}
              <AnimatePresence>
                {!loading && error && (
                  <motion.div
                    key="error"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex justify-center items-center py-16"
                  >
                    <div className="text-center max-w-md">
                      <div className="w-16 h-16 mx-auto mb-4 bg-orange-900/30 rounded-full flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-semibold mb-2">We encountered an issue</h3>
                      <p className="text-gray-300 mb-6">{error.includes('Server is currently busy') ? 'Server is currently busy. Please try again later.' : error}</p>
                      <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors w-full"
                      >
                        Try Again
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              
              {/* Success state with data */}
              <AnimatePresence>
                {!loading && !error && statsData && (
                  <motion.div
                    key="stats"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <CodeChefStats data={statsData} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default CodechefPage;