// src/pages/Profile.jsx
import { motion } from 'framer-motion';
import { CodeBracketIcon, TrophyIcon, CalendarIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import ActivityHeatmap from '../components/ActivityHeatmap';
import Header from '../components/Header';

const Profile = () => {
  // Mock data - replace with your actual data
  const profileData = {
    username: 'Sai Suveer',
    avatar: 'SS',
    totalSolved: 1285,
    contestsParticipated: 42,
    currentRating: 1942,
    maxRating: 2100,
    platformStats: {
      leetcode: { solved: 450, contests: 15, rating: 1850 },
      codeforces: { solved: 320, contests: 20, rating: 1600 },
      codechef: { solved: 280, contests: 7, rating: 2100 },
      gfg: { solved: 235, contests: 0, rating: null }
    },
    activityHeatmap: Array(365).fill().map(() => Math.floor(Math.random() * 5)),
    recentAchievements: [
      { title: 'Codeforces Expert', platform: 'codeforces', date: '2023-05-01' },
      { title: 'LeetCode 400 Club', platform: 'leetcode', date: '2023-04-15' },
      { title: '5 Star Coder', platform: 'codechef', date: '2023-03-20' }
    ]
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 text-gray-100">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-black/30 backdrop-blur-md rounded-2xl p-6 mb-8 border border-white/10 shadow-xl"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-3xl font-bold shadow-lg">
                {profileData.avatar}
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-pink-200">
                  {profileData.username}
                </h1>
                <p className="text-gray-400 mt-1">Competitive Programmer</p>
              </div>
            </div>
            <button className="px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg transition-all">
              Edit Profile
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <StatCard
              icon={<TrophyIcon className="w-6 h-6" />}
              title="Current Rating"
              value={profileData.currentRating}
              delta={profileData.currentRating - profileData.maxRating + 158}
            />
            <StatCard
              icon={<CodeBracketIcon className="w-6 h-6" />}
              title="Problems Solved"
              value={profileData.totalSolved}
            />
            <StatCard
              icon={<CalendarIcon className="w-6 h-6" />}
              title="Contests"
              value={profileData.contestsParticipated}
            />
            <StatCard
              icon={<ChartBarIcon className="w-6 h-6" />}
              title="Max Rating"
              value={profileData.maxRating}
              isMax
            />
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Platform Stats */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-black/30 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-xl"
          >
            <h2 className="text-xl font-semibold mb-6">Platform Statistics</h2>
            <div className="space-y-4">
              {Object.entries(profileData.platformStats).map(([platform, stats]) => (
                <PlatformProgress
                  key={platform}
                  platform={platform}
                  solved={stats.solved}
                  contests={stats.contests}
                  rating={stats.rating}
                />
              ))}
            </div>
          </motion.div>

          {/* Activity Heatmap */}
          <ActivityHeatmap />

          {/* Achievements */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 bg-black/30 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-xl"
          >
            <h2 className="text-xl font-semibold mb-6">Recent Achievements</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {profileData.recentAchievements.map((achievement, index) => (
                <AchievementCard key={index} achievement={achievement} delay={index * 0.1} />
              ))}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

// Helper Components
const StatCard = ({ icon, title, value, delta, isMax }) => (
  <div className="bg-white/5 p-4 rounded-xl backdrop-blur-sm border border-white/10 hover:border-purple-400/30 transition-all">
    <div className="flex items-center space-x-3">
      <div className="p-2 bg-purple-500/20 rounded-lg">{icon}</div>
      <div>
        <p className="text-gray-400 text-sm">{title}</p>
        <p className="text-2xl font-bold">
          {value}
          {delta && (
            <span className={`text-sm ml-2 ${delta > 0 ? 'text-green-400' : 'text-red-400'}`}>
              ({delta > 0 ? '+' : ''}{delta})
            </span>
          )}
          {isMax && <span className="text-yellow-400 text-sm ml-2">🌟</span>}
        </p>
      </div>
    </div>
  </div>
);

const PlatformProgress = ({ platform, solved, contests, rating }) => {
  const platformColors = {
    leetcode: 'from-orange-500/30 to-orange-600/20',
    codeforces: 'from-blue-500/30 to-blue-600/20',
    codechef: 'from-yellow-500/30 to-yellow-600/20',
    gfg: 'from-green-500/30 to-green-600/20'
  };

  return (
    <div className="bg-white/5 p-4 rounded-xl backdrop-blur-sm border border-white/10 hover:border-purple-400/30 transition-all">
      <div className="flex justify-between items-center mb-2">
        <span className="capitalize font-medium">{platform}</span>
        {rating && <span className="text-sm bg-black/30 px-2 py-1 rounded">{rating}</span>}
      </div>
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-gray-400">
          <span>{solved} Problems Solved</span>
          <span>{contests} Contests</span>
        </div>
        <div className={`h-2 rounded-full bg-gradient-to-r ${platformColors[platform]}`}>
          <div 
            className="h-full bg-white/30 rounded-full transition-all duration-500" 
            style={{ width: `${(solved / 500) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};

const AchievementCard = ({ achievement, delay }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay }}
    className="bg-gradient-to-br from-purple-900/40 to-violet-800/40 p-4 rounded-xl backdrop-blur-sm border border-white/10 hover:border-purple-400/30 transition-all"
  >
    <div className="flex items-center space-x-3">
      <div className="p-2 bg-purple-500/20 rounded-lg">
        <TrophyIcon className="w-6 h-6 text-yellow-400" />
      </div>
      <div>
        <h3 className="font-medium">{achievement.title}</h3>
        <p className="text-sm text-gray-400">{achievement.platform}</p>
        <p className="text-xs text-gray-500 mt-1">
          {new Date(achievement.date).toLocaleDateString()}
        </p>
      </div>
    </div>
  </motion.div>
);

const getHeatmapColor = (count) => {
  const colors = [
    'bg-gray-800',
    'bg-purple-900/60',
    'bg-purple-800/60',
    'bg-purple-700/60',
    'bg-purple-600/60'
  ];
  return colors[count] || colors[0];
};

export default Profile;