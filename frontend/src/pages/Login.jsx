import { useState } from 'react';
import { supabase } from '../components/supabase';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, LogIn } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { delayChildren: 0.3, staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setMessage('');

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      window.location.href = '/dashboard'; // Or use React Router
    }

    setIsLoading(false);
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError('');
    setMessage('');

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });

    if (error) {
      setError(error.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5 }}>
            <a href="/" className="inline-flex items-center">
              <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">CPier</span>
            </a>
          </motion.div>
          <motion.h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
            Sign in to your account
          </motion.h2>
          <motion.p className="mt-2 text-sm text-gray-600 dark:text-gray-400" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
            Or{' '}
            <a href="/signup" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
              create a new account
            </a>
          </motion.p>
        </div>

        <motion.div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md" variants={containerVariants} initial="hidden" animate="visible">
          <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow-lg sm:rounded-lg sm:px-10">
            {error && (
              <motion.div className="mb-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-md" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                {error}
              </motion.div>
            )}
            {message && (
              <motion.div className="mb-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 px-4 py-3 rounded-md" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                {message}
              </motion.div>
            )}

            <motion.form className="space-y-6" onSubmit={handleLogin} variants={containerVariants}>
              <motion.div variants={itemVariants}>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email address</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:text-white sm:text-sm transition-colors duration-200"
                    placeholder="you@example.com"
                  />
                </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:text-white sm:text-sm transition-colors duration-200"
                    placeholder="••••••••"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-gray-400 hover:text-gray-500 focus:outline-none">
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
              </motion.div>

              <motion.div className="flex items-center justify-between" variants={itemVariants}>
                <div className="flex items-center">
                  <input id="remember-me" type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded" />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">Remember me</label>
                </div>
                <div className="text-sm">
                  <a href="#" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">Forgot your password?</a>
                </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  {isLoading ? (
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                    </svg>
                  ) : (
                    <LogIn className="h-4 w-4 mr-2" />
                  )}
                  {isLoading ? 'Signing in...' : 'Sign in'}
                </button>
              </motion.div>
            </motion.form>

            <motion.div variants={itemVariants} className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">Or continue with</span>
                </div>
              </div>

              <div className="mt-6">
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                  className="w-full flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M21.35 11.1h-9v2.7h5.4c-.25 1.5-1.3 2.75-2.9 3.3v2.75h4.7c2.75-2.5 3.9-6.2 3.4-10.75z" />
                    <path fill="#34A853" d="M12.35 21c2.6 0 4.75-.9 6.3-2.5l-3-2.5c-.8.55-1.85.9-3.3.9-2.5 0-4.65-1.7-5.4-4H3.35v2.55C4.95 19.55 8.3 21 12.35 21z" />
                    <path fill="#FBBC05" d="M6.95 12.25c-.2-.55-.3-1.15-.3-1.75s.1-1.2.3-1.75V6.2H3.35c-.7 1.4-1 2.9-1 4.3s.3 2.9 1 4.3l3.6-2.55z" />
                    <path fill="#EA4335" d="M12.35 4.5c1.4 0 2.65.45 3.6 1.3l2.7-2.7C17.1 1.6 14.95.5 12.35.5 8.3.5 4.95 2.1 3.35 5.2l3.6 2.55c.75-2.25 2.9-3.9 5.4-3.9z" />
                  </svg>
                  Continue with Google
                </button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
