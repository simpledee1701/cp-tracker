import { motion } from "framer-motion";
import Header from "../components/Header";
import { useUserProfile } from "../context/UserProfileContext";
import { Link } from "react-router-dom";
import { FiMail, FiMapPin, FiExternalLink } from "react-icons/fi";
import { SiLeetcode, SiCodechef, SiCodeforces } from "react-icons/si";
import { MdVerified } from "react-icons/md";
import { FaGraduationCap } from "react-icons/fa6";
import { FaLinkedin, FaGithub } from "react-icons/fa";
import CombinedHeatmap from "../components/CombinedHeatmap";

const Dashboard = () => {
  const { profileData } = useUserProfile();

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

  const getAvatar = (name) => {
    if (!name) return "👤";
    return name.charAt(0).toUpperCase();
  };

  return (
    <div>
      <Header />

      <div className="min-h-screen p-4 flex bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        {/* Sidebar */}
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-72 bg-black/30 backdrop-blur-md p-6 rounded-xl border border-white/10 shadow-xl space-y-4 py-6"
        >
          {/* Avatar */}
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-blue-500 flex items-center justify-center text-3xl font-bold mb-2 text-white">
              {getAvatar(user.name)}
            </div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white text-center">
              {user.name}
            </h2>
          </div>

          {/* Email with verification */}
          <div className="flex items-center justify-center space-x-2">
            <FiMail className="text-gray-500 dark:text-gray-300" />
            <span className="text-gray-700 dark:text-gray-300">{user.email}</span>
            {user.emailVerified && (
              <MdVerified className="text-green-500" size={16} />
            )}
          </div>

          {/* Social Links Card */}
          <div className="bg-white/10 p-4 rounded-lg border border-white/20">
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm font-semibold text-white">Connect With Me</p>
            </div>
            <div className="flex justify-center space-x-4">
              <a
                href={user.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-blue-600 rounded-full hover:bg-blue-700 transition"
              >
                <FaLinkedin className="text-white" size={18} />
              </a>
              <a
                href={user.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gray-800 rounded-full hover:bg-gray-700 transition"
              >
                <FaGithub className="text-white" size={18} />
              </a>
            </div>
          </div>

          {/* Problem Solving Stats */}
          <div className="w-full mt-4">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
              Problem Solving Stats
            </h3>

            {/* LeetCode */}
            <Link
              to={`https://leetcode.com/u/${user.leetcode_username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block mb-2 group"
            >
              <div className="flex items-center justify-between bg-white/5 p-2 rounded hover:bg-white/10 transition">
                <div className="flex items-center space-x-2">
                  <SiLeetcode className="text-red-500" size={18} />
                  <span className="text-white">LeetCode</span>
                </div>
                <div className="flex items-center">
                  <FiExternalLink className="text-gray-400 group-hover:text-white transition" />
                </div>
              </div>
            </Link>

            {/* CodeChef */}
            <Link
              to={`https://www.codechef.com/users/${user.codechef_username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block mb-2 group"
            >
              <div className="flex items-center justify-between bg-white/5 p-2 rounded hover:bg-white/10 transition">
                <div className="flex items-center space-x-2">
                  <SiCodechef className="text-red-500" size={18} />
                  <span className="text-white">CodeChef</span>
                </div>
                <div className="flex items-center">
                  <FiExternalLink className="text-gray-400 group-hover:text-white transition" />
                </div>
              </div>
            </Link>

            {/* CodeForces */}
            <Link
              to={`https://codeforces.com/profile/${user.codeforces_username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block mb-2 group"
            >
              <div className="flex items-center justify-between bg-white/5 p-2 rounded hover:bg-white/10 transition">
                <div className="flex items-center space-x-2">
                  <SiCodeforces className="text-red-500" size={18} />
                  <span className="text-white">CodeForces</span>
                </div>
                <div className="flex items-center">
                  <FiExternalLink className="text-gray-400 group-hover:text-white transition" />
                </div>
              </div>
            </Link>
          </div>

          {/* Location and Education */}
          <div className="w-full mt-6 space-y-3">
            {/* Location Card */}
            <div className="flex items-center p-3 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 hover:bg-white/20 transition-colors duration-200">
              <div className="p-2 bg-blue-500/20 rounded-full mr-3">
                <FiMapPin className="text-red-500" size={18} />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-400 tracking-wider">Location</p>
                <p className="text-sm font-semibold text-white">{user.location || "Not specified"}</p>
              </div>
            </div>

            {/* Education Card */}
            <div className="flex items-center p-3 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 hover:bg-white/20 transition-colors duration-200">
              <div className="p-2 bg-purple-500/20 rounded-full mr-3">
                <FaGraduationCap className="text-purple-400" size={18} />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-400 tracking-wider">Education</p>
                <p className="text-sm font-semibold text-white">{user.organization || "Not specified"}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          <div>
            {/* Other profile components */}
            <CombinedHeatmap profileData={profileData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;