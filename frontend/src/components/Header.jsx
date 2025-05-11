import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { useUserProfile } from '../context/UserProfileContext'; // Import the UserProfile context

const Headers = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();
  const { profileData } = useUserProfile(); // Access the profile data

  // Get user's first initial or fallback to person emoji
  const getUserInitial = () => {
    if (!profileData || !profileData.name) {
      return '👤'; // Person emoji fallback
    }
    return profileData.name.charAt(0).toUpperCase();
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  const isActive = (path) => location.pathname === path;

  return (
    <header className="bg-gradient-to-r from-slate-800 to-gray-900 backdrop-blur-md border-b border-slate-700 shadow-md relative z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo and Title */}
        <motion.div
          className="flex items-center space-x-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l3 3-3 3m5 0h3m-11 4h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300">
            CPier
          </h1>
        </motion.div>

        {/* Navigation Menu */}
        <nav className="hidden md:flex space-x-6 relative z-50 text-white">
          <Link
            to="/dashboard"
            className={`hover:text-blue-400 font-medium transition-colors duration-300 ${isActive('/dashboard') ? 'text-blue-400' : ''}`}
          >
            Dashboard
          </Link>

          {/* Enhanced Coding Profiles Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <span
              onMouseEnter={() => setIsDropdownOpen(true)}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className={`hover:text-blue-400 font-medium transition-colors duration-300 cursor-pointer ${
                isActive('/leetcode') || isActive('/codeforces') || isActive('/codechef') ? 'text-blue-400' : ''
              }`}
            >
              Coding Profiles
            </span>

            {isDropdownOpen && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute left-0 mt-2 w-52 bg-gray-800 text-white rounded-md shadow-lg z-50 border border-slate-700 overflow-hidden"
              >
                {/* Display connected profiles if available */}
                {profileData?.profiles ? (
                  <>
                    {profileData.profiles.leetcode && (
                      <Link
                        to="/leetcode"
                        className="px-4 py-2 text-sm hover:bg-blue-600 hover:text-white flex items-center space-x-2"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                        <span>LeetCode</span>
                      </Link>
                    )}
                    {!profileData.profiles.leetcode && (
                      <Link
                        to="/leetcode"
                        className="px-4 py-2 text-sm hover:bg-blue-600 hover:text-white flex items-center space-x-2"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                        <span>LeetCode</span>
                      </Link>
                    )}
                    
                    {profileData.profiles.codeforces && (
                      <Link
                        to="/codeforces"
                        className="px-4 py-2 text-sm hover:bg-blue-600 hover:text-white flex items-center space-x-2"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                        <span>Codeforces</span>
                      </Link>
                    )}
                    {!profileData.profiles.codeforces && (
                      <Link
                        to="/codeforces"
                        className="px-4 py-2 text-sm hover:bg-blue-600 hover:text-white flex items-center space-x-2"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                        <span>Codeforces</span>
                      </Link>
                    )}
                    
                    {profileData.profiles.codechef && (
                      <Link
                        to="/codechef"
                        className="px-4 py-2 text-sm hover:bg-blue-600 hover:text-white flex items-center space-x-2"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                        <span>CodeChef</span>
                      </Link>
                    )}
                    {!profileData.profiles.codechef && (
                      <Link
                        to="/codechef"
                        className="px-4 py-2 text-sm hover:bg-blue-600 hover:text-white flex items-center space-x-2"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                        <span>CodeChef</span>
                      </Link>
                    )}
                  </>
                ) : (
                  <>
                    <Link
                      to="/leetcode"
                      className="block px-4 py-2 text-sm hover:bg-blue-600 hover:text-white"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      LeetCode
                    </Link>
                    <Link
                      to="/codeforces"
                      className="block px-4 py-2 text-sm hover:bg-blue-600 hover:text-white"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Codeforces
                    </Link>
                    <Link
                      to="/codechef"
                      className="block px-4 py-2 text-sm hover:bg-blue-600 hover:text-white"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      CodeChef
                    </Link>
                  </>
                )}
              </motion.div>
            )}
          </div>

          <Link
            to="/contest"
            className={`hover:text-blue-400 font-medium transition-colors duration-300 ${isActive('/contest') ? 'text-blue-400' : ''}`}
          >
            Contests
          </Link>
        </nav>

        {/* Right Icons */}
        <motion.div
          className="flex items-center space-x-4"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.button
            className="p-2 rounded-full hover:bg-slate-700 transition-colors duration-300"
            whileHover={{ rotate: 15 }}
          >
            <svg className="w-5 h-5 text-cyan-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </motion.button>

          <motion.div
            className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg text-white"
            whileHover={{ scale: 1.1 }}
          >
            <Link to="/profile" className="text-white text-sm font-semibold">
              {getUserInitial()}
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </header>
  );
};

export default Headers;