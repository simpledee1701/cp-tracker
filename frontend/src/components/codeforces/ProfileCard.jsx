import { motion } from 'framer-motion';
import { FiStar, FiTrendingUp, FiAward, FiUsers, FiActivity } from 'react-icons/fi';

const ProfileCard = ({ user }) => {
  // Generate initial avatar
  const getInitial = (handle) => handle?.charAt(0)?.toUpperCase() || '?';
  const colorVariants = [
    'from-purple-500 to-pink-500',
    'from-blue-500 to-cyan-500',
    'from-green-500 to-emerald-500',
    'from-orange-500 to-red-500'
  ];
  const randomColor = colorVariants[Math.floor(Math.random() * colorVariants.length)];

  const stats = [
    { icon: <FiTrendingUp />, label: 'Current Rating', value: user.rating },
    { icon: <FiStar />, label: 'Max Rating', value: user.maxRating },
    { icon: <FiUsers />, label: 'Friends', value: user.friendOfCount || 0 },
    { icon: <FiActivity />, label: 'Contribution', value: user.contribution || 0 }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative bg-slate-900/60 backdrop-blur-2xl rounded-3xl p-6 shadow-xl"
    >
      <div className="flex flex-col items-center gap-6 mb-6">
        {/* Initial Avatar */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className={`flex items-center justify-center w-32 h-32 rounded-full text-5xl font-bold text-white bg-gradient-to-br ${randomColor}`}
        >
          {getInitial(user.handle)}
        </motion.div>

        {/* Username */}
        <div className="text-center">
          <motion.h2 
            className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
          >
            {user.handle}
          </motion.h2>
          <motion.p 
            className="text-lg text-purple-300 mt-1 capitalize"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {user.rank || 'Unranked'}
          </motion.p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 + index * 0.1 }}
            className="bg-slate-800/40 p-4 rounded-xl"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400">
                {stat.icon}
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">{stat.label}</p>
                <p className="text-xl font-semibold text-gray-100">
                  {stat.value}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Rating Comparison */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mt-6 grid grid-cols-2 gap-4"
      >
        <div className="bg-slate-800/40 p-4 rounded-xl">
          <div className="flex items-center gap-2 text-green-400">
            <FiTrendingUp className="text-xl" />
            <h3 className="font-semibold">Rating Change</h3>
          </div>
          <div className="mt-2">
            <span className={`text-xl font-bold ${user.rating >= user.maxRating ? 'text-green-400' : 'text-red-400'}`}>
              {user.rating - user.maxRating >= 0 ? '+' : ''}
              {user.rating - user.maxRating}
            </span>
            <span className="ml-2 text-sm text-gray-400">
              from peak
            </span>
          </div>
        </div>

        <div className="bg-slate-800/40 p-4 rounded-xl">
          <div className="flex items-center gap-2 text-yellow-400">
            <FiAward className="text-xl" />
            <h3 className="font-semibold">Achievements</h3>
          </div>
          <div className="mt-2">
            <span className="text-xl font-bold text-gray-100">
              {user.contests || 0}
            </span>
            <span className="ml-2 text-sm text-gray-400">
              contests attended
            </span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
export default ProfileCard;