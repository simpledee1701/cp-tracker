import { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, CheckCircle, X, LogIn } from 'lucide-react';
import axios from 'axios';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.3,
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1
  }
};

const API_URL = 'http://localhost:3000/api/auth';

export default function SignUp() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordFeedback, setPasswordFeedback] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (name === 'password') {
      checkPasswordStrength(value);
    }
  };

  const checkPasswordStrength = (password) => {
    let strength = 0;
    const feedback = [];
    
    if (password.length >= 8) {
      strength += 1;
      feedback.push({ passed: true, text: 'At least 8 characters' });
    } else {
      feedback.push({ passed: false, text: 'At least 8 characters' });
    }
    
    if (/[A-Z]/.test(password)) {
      strength += 1;
      feedback.push({ passed: true, text: 'At least one uppercase letter' });
    } else {
      feedback.push({ passed: false, text: 'At least one uppercase letter' });
    }
    
    if (/[a-z]/.test(password)) {
      strength += 1;
      feedback.push({ passed: true, text: 'At least one lowercase letter' });
    } else {
      feedback.push({ passed: false, text: 'At least one lowercase letter' });
    }
    
    if (/[0-9]/.test(password)) {
      strength += 1;
      feedback.push({ passed: true, text: 'At least one number' });
    } else {
      feedback.push({ passed: false, text: 'At least one number' });
    }
    
    if (/[^A-Za-z0-9]/.test(password)) {
      strength += 1;
      feedback.push({ passed: true, text: 'At least one special character' });
    } else {
      feedback.push({ passed: false, text: 'At least one special character' });
    }
    
    setPasswordStrength(strength);
    setPasswordFeedback(feedback);
  };

  const getStrengthColor = () => {
    if (passwordStrength === 0) return 'bg-gray-200 dark:bg-gray-700';
    if (passwordStrength <= 2) return 'bg-red-500';
    if (passwordStrength <= 4) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getStrengthText = () => {
    if (passwordStrength === 0) return '';
    if (passwordStrength <= 2) return 'Weak';
    if (passwordStrength <= 4) return 'Medium';
    return 'Strong';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');
    
    // Simple validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      setIsLoading(false);
      return;
    }
    
    if (passwordStrength < 3) {
      setError("Please create a stronger password");
      setIsLoading(false);
      return;
    }
    
    try {
      // Call the backend API
      const response = await axios.post(`${API_URL}/signup`, {
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      
      // Store token in localStorage
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      setSuccess('Account created successfully! Redirecting...');
      
      // Redirect after successful signup
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 1500);
    } catch (err) {
      console.error('Signup error:', err);
      setError(
        err.response?.data?.error || 
        'Failed to create account. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setIsLoading(true);
    setError('');
    setSuccess('');
    
    // In a real implementation, you would use a library like react-google-login
    // For this example, we'll just simulate the post-auth flow
    try {

      const mockGoogleToken = "google-token-example";
      
      // Call your backend API endpoint for Google authentication
      const response = await axios.post(`${API_URL}/google-auth`, {
        token: mockGoogleToken
      });
      
      // Store token and user info
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      setSuccess('Google authentication successful! Redirecting...');
      
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 1500);
    } catch (err) {
      console.error('Google auth error:', err);
      setError(
        err.response?.data?.error || 
        'Google authentication failed. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <a href="/" className="inline-flex items-center">
              <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">CPier</span>
            </a>
          </motion.div>
          <motion.h2 
            className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Create your account
          </motion.h2>
          <motion.p 
            className="mt-2 text-sm text-gray-600 dark:text-gray-400"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Already have an account?{' '}
            <a href="/login" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
              Sign in instead
            </a>
          </motion.p>
        </div>

        <motion.div 
          className="mt-8 sm:mx-auto sm:w-full sm:max-w-md"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow-lg sm:rounded-lg sm:px-10">
            {error && (
              <motion.div 
                className="mb-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-md"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {error}
              </motion.div>
            )}
            
            {success && (
              <motion.div 
                className="mb-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 px-4 py-3 rounded-md"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {success}
              </motion.div>
            )}
            
            <motion.form className="space-y-6" onSubmit={handleSubmit} variants={containerVariants}>
              <motion.div variants={itemVariants}>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Full Name
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:text-white sm:text-sm transition-colors duration-200"
                    placeholder="John Doe"
                  />
                </div>
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email address
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:text-white sm:text-sm transition-colors duration-200"
                    placeholder="you@example.com"
                  />
                </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Password
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:text-white sm:text-sm transition-colors duration-200"
                    placeholder="••••••••"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-gray-400 hover:text-gray-500 focus:outline-none"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
                
                {/* Password strength indicator */}
                {formData.password && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between mb-1">
                      <div className="text-xs font-medium text-gray-500 dark:text-gray-400">Password strength:</div>
                      <div className="text-xs font-medium text-gray-700 dark:text-gray-300">{getStrengthText()}</div>
                    </div>
                    <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${getStrengthColor()} transition-all duration-300`} 
                        style={{ width: `${(passwordStrength / 5) * 100}%` }}
                      ></div>
                    </div>
                    
                    <div className="mt-2 space-y-1">
                      {passwordFeedback.map((item, index) => (
                        <div key={index} className="flex items-center text-xs">
                          {item.passed ? (
                            <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                          ) : (
                            <X className="h-4 w-4 text-gray-400 mr-1" />
                          )}
                          <span className={item.passed ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}>
                            {item.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>

              <motion.div variants={itemVariants}>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Confirm Password
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`block w-full pl-10 pr-10 py-2 border rounded-md leading-5 bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:text-white sm:text-sm transition-colors duration-200 ${
                      formData.confirmPassword && formData.password !== formData.confirmPassword
                        ? 'border-red-300 dark:border-red-700 text-red-900 dark:text-red-300 placeholder-red-300 dark:placeholder-red-700 focus:border-red-500 focus:ring-red-500'
                        : 'border-gray-300 dark:border-gray-600'
                    }`}
                    placeholder="••••••••"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="text-gray-400 hover:text-gray-500 focus:outline-none"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
                {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                    Passwords do not match
                  </p>
                )}
              </motion.div>

              <motion.div variants={itemVariants}>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating account...
                    </>
                  ) : (
                    <>
                      <LogIn className="w-5 h-5 mr-2" />
                      Sign up
                    </>
                  )}
                </button>
              </motion.div>
            </motion.form>

            <motion.div className="mt-6" variants={itemVariants}>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-3">
                <motion.div variants={itemVariants}>
                  <button
                    type="button"
                    onClick={handleGoogleSignup}
                    disabled={isLoading}
                    className="w-full inline-flex justify-center items-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12.545 10.239v3.821h5.445c-0.712 2.315-2.647 3.972-5.445 3.972-3.332 0-6.033-2.701-6.033-6.032s2.701-6.032 6.033-6.032c1.498 0 2.866 0.549 3.921 1.453l2.814-2.814c-1.784-1.664-4.13-2.676-6.735-2.676-5.522 0-10 4.477-10 10s4.478 10 10 10c8.396 0 10-7.524 10-10 0-0.67-0.069-1.325-0.189-1.961h-9.811z" />
                    </svg>
                    Google
                  </button>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}