import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-black/30 backdrop-blur-md border-b border-white/10 shadow-xl">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <motion.div 
          className="flex items-center space-x-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l3 3-3 3m5 0h3m-11 4h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
</svg>



          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-300">
            CPier
          </h1>
        </motion.div>
        
        <nav className="hidden md:flex space-x-6">
          <Link to="#" className="hover:text-purple-300 font-medium transition-colors duration-300">
            Dashboard
          </Link>
          <Link to="/contest" className="hover:text-purple-300 font-medium transition-colors duration-300">
            Contests
          </Link>
          <Link to="/profile" className="hover:text-purple-300 font-medium transition-colors duration-300">
            Profile
          </Link>

        </nav>
        
        <motion.div 
          className="flex items-center space-x-4"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.button 
            className="p-2 rounded-full hover:bg-white/10 transition-colors duration-300"
            whileHover={{ rotate: 15 }}
          >
            <svg className="w-5 h-5 text-pink-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </motion.button>
          <motion.div 
            className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-400 flex items-center justify-center shadow-lg"
            whileHover={{ scale: 1.1 }}
          >
            <span className="text-sm font-medium">CP</span>
          </motion.div>
        </motion.div>
      </div>
    </header>
  );
};

export default Header;