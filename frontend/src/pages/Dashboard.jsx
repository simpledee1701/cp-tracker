import { motion } from "framer-motion";
import Header from "../components/Header";
import { useUserProfile } from "../context/UserProfileContext";
import { UserAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { FiMail, FiMapPin, FiExternalLink } from "react-icons/fi";
import { SiLeetcode, SiCodechef, SiCodeforces } from "react-icons/si";
import { MdVerified } from "react-icons/md";
import { FaGraduationCap } from "react-icons/fa6";
import { FaLinkedin, FaGithub } from "react-icons/fa";
import CombinedHeatmap from "../components/CombinedHeatmap";
import { useEffect, useState } from "react";
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const Dashboard = () => {
  const { profileData } = useUserProfile();
  const { session } = UserAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const API_BASE = import.meta.env.VITE_BACKEND_URL;

  const user = {
    name: profileData?.name || "",
    email: profileData?.email || "",
    emailVerified: profileData?.emailVerified || true,
    linkedin: profileData?.linkedin || "",
    github: profileData?.github || "",
    organization: profileData?.education || "",
    location: profileData?.location || "",
    codeforces_username: profileData?.codeforces_username || "",
    leetcode_username: profileData?.leetcode_username || "",
    codechef_username: profileData?.codechef_username || "",
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!session?.user?.id) return;

      try {
        setLoading(true);
        const response = await fetch(`${API_BASE}/api/dashboard/${session.user.id}`, {
          headers: {
            'Authorization': `Bearer ${session.access_token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch dashboard data');
        }

        const data = await response.json();
        setDashboardData(data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [session]);

  const getAvatar = (name) => {
    if (!name) return "👤";
    return name.charAt(0).toUpperCase();
  };

  // Calculate total questions solved across all platforms
  const getTotalQuestionsSolved = () => {
    if (!dashboardData?.total_questions?.length) return 0;

    const totals = dashboardData.total_questions[0]
    return (totals.leetcode_total || 0) +
      (totals.codechef_total || 0) +
      (totals.codeforces_total || 0);
  };

  // Get contest rating for a specific platform
  const getContestRating = (platform) => {
    if (!dashboardData?.contest_ranking_info?.length) return null;
    return dashboardData.contest_ranking_info[0][`${platform}_rating`];
  };

  // Get questions solved for a specific platform
  const getPlatformQuestions = (platform) => {
    if (!dashboardData?.total_questions?.length) return 0;
    return dashboardData.total_questions[0][`${platform}_total`] || 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      <Header />

      <div className="min-h-screen flex bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        {/* Enhanced Sidebar */}
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-72 bg-black/30 backdrop-blur-md p-6 border-r border-white/10 shadow-xl space-y-6 py-6 flex flex-col"
        >
          {/* Avatar Section */}
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-3xl font-bold mb-3 text-white shadow-lg">
              {getAvatar(user.name)}
            </div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white text-center">
              {user.name}
            </h2>
            <div className="flex items-center mt-2 space-x-1">
              <FiMail className="text-gray-500 dark:text-gray-300" />
              <span className="text-gray-700 dark:text-gray-300 text-sm">{user.email}</span>
              {user.emailVerified && (
                <MdVerified className="text-green-500" size={16} />
              )}
            </div>
          </div>

          {/* Social Links */}
          <div className="bg-white/10 p-2 rounded-xl border border-white/20">
            <h3 className="text-sm font-semibold text-white mb-3">Connect</h3>
            <div className="flex justify-center space-x-4">
              {user.linkedin && (
                <a
                  href={user.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-blue-600 rounded-full hover:bg-blue-700 transition transform hover:scale-110"
                >
                  <FaLinkedin className="text-white" size={18} />
                </a>
              )}
              {user.github && (
                <a
                  href={user.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-gray-800 rounded-full hover:bg-gray-700 transition transform hover:scale-110"
                >
                  <FaGithub className="text-white" size={18} />
                </a>
              )}
            </div>
          </div>

          {/* Coding Platforms */}
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-white mb-3">Coding Profiles</h3>
            <div className="space-y-2">
              {user.leetcode_username && (
                <a
                  href={`https://leetcode.com/u/${user.leetcode_username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition group"
                >
                  <div className="flex items-center space-x-3">
                    <SiLeetcode className="text-yellow-500" size={18} />
                    <span className="text-white">LeetCode</span>
                  </div>
                  <FiExternalLink className="text-gray-400 group-hover:text-white transition" />
                </a>
              )}
              {user.codechef_username && (
                <a
                  href={`https://www.codechef.com/users/${user.codechef_username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition group"
                >
                  <div className="flex items-center space-x-3">
                    <SiCodechef className="text-red-500" size={18} />
                    <span className="text-white">CodeChef</span>
                  </div>
                  <FiExternalLink className="text-gray-400 group-hover:text-white transition" />
                </a>
              )}
              {user.codeforces_username && (
                <a
                  href={`https://codeforces.com/profile/${user.codeforces_username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition group"
                >
                  <div className="flex items-center space-x-3">
                    <SiCodeforces className="text-blue-400" size={18} />
                    <span className="text-white">CodeForces</span>
                  </div>
                  <FiExternalLink className="text-gray-400 group-hover:text-white transition" />
                </a>
              )}
            </div>
          </div>

          {/* User Info */}
          <div className="space-y-3">
            {user.location && (
              <div className="flex items-center p-3 bg-white/5 rounded-lg border border-white/10">
                <div className="p-2 bg-blue-500/20 rounded-full mr-3">
                  <FiMapPin className="text-blue-400" size={16} />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Location</p>
                  <p className="text-sm font-medium text-white">{user.location}</p>
                </div>
              </div>
            )}
            {user.organization && (
              <div className="flex items-center p-3 bg-white/5 rounded-lg border border-white/10">
                <div className="p-2 bg-purple-500/20 rounded-full mr-3">
                  <FaGraduationCap className="text-purple-400" size={16} />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Education</p>
                  <p className="text-sm font-medium text-white">{user.organization}</p>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          <div>
            {/* Other profile components */}
            <CombinedHeatmap profileData={profileData} />
        <div className="flex-1 p-6 overflow-y-auto">
          {/* First Row - Two Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Total Count Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 flex flex-col items-center justify-center">
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center">Total Questions Solved</h1>
              <div className="text-5xl font-bold text-yellow-500 flex items-center justify-center h-full -mt-4">
                {getTotalQuestionsSolved()}
              </div>
            </div>

            {/* Platform Distribution Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 flex flex-col items-center">
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">
                Platform Distribution
              </h3>
              <div className="flex flex-col md:flex-row items-center justify-center gap-8">
                {/* Circular Graph with Center Text */}
                <div className="w-40 h-40 relative">
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    {/* Graph segments remain the same */}
                    <circle cx="50" cy="50" r="45" fill="transparent" stroke="#f59e0b" strokeWidth="10"
                      strokeDasharray={`${(getPlatformQuestions('leetcode') / getTotalQuestionsSolved()) * 283} 283`}
                      transform="rotate(-90 50 50)" />
                    <circle cx="50" cy="50" r="45" fill="transparent" stroke="#ef4444" strokeWidth="10"
                      strokeDasharray={`${(getPlatformQuestions('codechef') / getTotalQuestionsSolved()) * 283} 283`}
                      strokeDashoffset={`-${(getPlatformQuestions('leetcode') / getTotalQuestionsSolved()) * 283}`}
                      transform="rotate(-90 50 50)" />
                    <circle cx="50" cy="50" r="45" fill="transparent" stroke="#3b82f6" strokeWidth="10"
                      strokeDasharray={`${(getPlatformQuestions('codeforces') / getTotalQuestionsSolved()) * 283} 283`}
                      strokeDashoffset={`-${((getPlatformQuestions('leetcode') + getPlatformQuestions('codechef')) / getTotalQuestionsSolved()) * 283}`}
                      transform="rotate(-90 50 50)" />
                    <text x="50" y="50" textAnchor="middle" dominantBaseline="middle"
                      className="text-sm font-medium fill-gray-600 dark:fill-gray-300">
                      Questions
                    </text>
                  </svg>
                </div>
                {/* Color Legend remains the same */}
                <div className="space-y-3">
                  {user.leetcode_username && (
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-yellow-500 rounded-full mr-2"></div>
                      <span className="text-gray-700 dark:text-gray-300">LeetCode</span>
                    </div>
                  )}
                  {user.codechef_username && (
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-red-500 rounded-full mr-2"></div>
                      <span className="text-gray-700 dark:text-gray-300">CodeChef</span>
                    </div>
                  )}
                  {user.codeforces_username && (
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-blue-500 rounded-full mr-2"></div>
                      <span className="text-gray-700 dark:text-gray-300">CodeForces</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Contest Ranking Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">
              Contest Rankings
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* LeetCode Card */}
              {user.leetcode_username && (
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <div className="w-4 h-4 bg-yellow-500 rounded-full mr-2"></div>
                    <h4 className="font-medium text-gray-700 dark:text-gray-300">LeetCode</h4>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Current Rating:</span>
                      <span className="font-medium">{user.leetcode_rating || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Max Rating:</span>
                      <span className="font-medium">{user.leetcode_max_rating || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* CodeChef Card - With Stars */}
              {user.codechef_username && (
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <div className="w-4 h-4 bg-red-500 rounded-full mr-2"></div>
                    <h4 className="font-medium text-gray-700 dark:text-gray-300">CodeChef</h4>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Current Rating:</span>
                      <span className="font-medium">{user.codechef_rating || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Max Rating:</span>
                      <span className="font-medium">{user.codechef_max_rating || 'N/A'}</span>
                    </div>
                    {/* <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">Stars:</span>
                      <div className="flex">
                        {[...Array(getCodeChefStars(user.codechef_rating))].map((_, i) => (
                          <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div> */}
                  </div>
                </div>
              )}

              {/* CodeForces Card */}
              {user.codeforces_username && (
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <div className="w-4 h-4 bg-blue-500 rounded-full mr-2"></div>
                    <h4 className="font-medium text-gray-700 dark:text-gray-300">CodeForces</h4>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Current Rating:</span>
                      <span className="font-medium">{user.codeforces_rating || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Max Rating:</span>
                      <span className="font-medium">{user.codeforces_max_rating || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;