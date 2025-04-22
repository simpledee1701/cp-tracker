import { motion } from 'framer-motion';

const platformColors = {
  leetcode: 'bg-orange-500',
  codeforces: 'bg-blue-500',
  codechef: 'bg-yellow-500',
  gfg: 'bg-green-500',
};

const ProfileSummary = ({ data }) => {
  return (
    <motion.div
      className="rounded-xl overflow-hidden shadow-2xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="bg-gradient-to-r from-purple-900/80 to-violet-800/80 p-5 text-white backdrop-blur-md">
        <div className="flex items-center justify-between">
          <div>
            <motion.h2 
              className="text-2xl font-bold"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Welcome back, <span className="text-pink-300">{data.username}</span>!
            </motion.h2>
            <motion.p 
              className="mt-1 opacity-90"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Keep up the good work on your coding journey
            </motion.p>
          </div>
          <motion.div 
            className="hidden md:block"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4, type: 'spring' }}
          >
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-2xl font-bold shadow-lg">
              {data.username.substring(0, 2).toUpperCase()}
            </div>
          </motion.div>
        </div>
      </div>
      
      <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-6 bg-black/30 backdrop-blur-md">
        {/* Total Contests */}
        <motion.div 
          className="bg-white/5 p-4 rounded-xl backdrop-blur-sm border border-white/10 hover:border-purple-400/30 transition-all"
          whileHover={{ y: -5 }}
        >
          <div className="flex items-center justify-between">
            <h4 className="text-gray-300 font-medium">Total Contests</h4>
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <svg className="w-5 h-5 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
          <p className="mt-3 text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-pink-300">
            {data.totalContests}
          </p>
          <p className="text-sm text-gray-400 mt-1">All time contests participated</p>
        </motion.div>
        
        {/* Ratings */}
        <motion.div 
          className="bg-white/5 p-4 rounded-xl backdrop-blur-sm border border-white/10 hover:border-blue-400/30 transition-all"
          whileHover={{ y: -5 }}
        >
          <h4 className="text-gray-300 font-medium mb-3">Ratings</h4>
          <div className="space-y-2">
            {Object.entries(data.rating).map(([platform, rating]) => (
              <div key={platform} className="flex items-center justify-between">
                <span className="capitalize text-gray-300">{platform}</span>
                <span className="font-medium text-white">{rating}</span>
              </div>
            ))}
          </div>
        </motion.div>
        
        {/* Recent Performance */}
        <motion.div 
          className="bg-white/5 p-4 rounded-xl backdrop-blur-sm border border-white/10 hover:border-yellow-400/30 transition-all"
          whileHover={{ y: -5 }}
        >
          <h4 className="text-gray-300 font-medium mb-3">Recent Performance</h4>
          <div className="space-y-2">
            {data.recentPerformance.map((item, index) => (
              <motion.div 
                key={index} 
                className="flex items-center space-x-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 * index }}
              >
                <div className={`w-3 h-3 rounded-full ${platformColors[item.platform]}`}></div>
                <span className="capitalize flex-1 text-gray-300">{item.platform}</span>
                <span className={`font-medium ${
                  item.change.startsWith('+') ? 'text-green-300' : 'text-red-300'
                }`}>
                  {item.change}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ProfileSummary;