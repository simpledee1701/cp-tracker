import React from "react";
import { motion } from "framer-motion";
import Header from "../components/Header";

const Dashboard = () => {
  const user = {
    name: "Suveer Prasad",
    username: "suveer_01",
    rating: 1920,
    organization: "NIT XYZ",
    avatar: "https://avatars.githubusercontent.com/u/0000000?v=4", // Change to real avatar
  };

  return (
    <div>
        <Header />
    <div className="min-h-screen flex bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Sidebar */}
      
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-72 bg-black/30 backdrop-blur-md p-6  border border-white/10 shadow-xl space-y-4 py-6"
      >
        <img
          src={user.avatar}
          alt="User Avatar"
          className="w-24 h-24 rounded-full object-cover border-4 border-blue-500"
        />
        <h2 className="text-xl font-bold text-gray-800">{user.name}</h2>
        <p className="text-gray-500">@{user.username}</p>
        <div className="w-full">
          <div className="text-sm text-gray-600 mb-2">Organization:</div>
          <div className="bg-blue-100 text-blue-700 p-2 rounded">
            {user.organization}
          </div>
        </div>
        <div className="w-full">
          <div className="text-sm text-gray-600 mb-2">Rating:</div>
          <div className="bg-green-100 text-green-700 p-2 rounded">
            {user.rating}
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-semibold text-gray-700 mb-4">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Add any cards, charts, etc. here */}
          <div className="p-4 bg-white rounded-xl shadow">Analysis</div>
          <div className="p-4 bg-white rounded-xl shadow">Performance Stats</div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Dashboard;
