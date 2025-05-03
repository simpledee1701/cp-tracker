import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, Shield, Users, Database, Code, Settings, ExternalLink, Calendar, AlertCircle, BarChart2, TrendingUp } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.3,
      staggerChildren: 0.2
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

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll event for navbar effects
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: <BarChart2 className="h-6 w-6 text-blue-500" />,
      title: "Unified Coding Profiles Dashboard",
      description: "Analyze all your coding profiles (LeetCode, CodeChef, CodeForces) in one comprehensive dashboard with performance metrics and insights."
    },
    {
      icon: <Calendar className="h-6 w-6 text-blue-500" />,
      title: "Contest Reminders & Calendar",
      description: "Never miss a coding contest with automated reminders and a unified calendar showing all upcoming contests across platforms."
    },
    {
      icon: <TrendingUp className="h-6 w-6 text-blue-500" />,
      title: "Performance Analytics",
      description: "Track your progress over time with detailed analytics and visualizations of your problem-solving patterns and contest performance."
    },
    {
      icon: <Code className="h-6 w-6 text-blue-500" />,
      title: "Multi-Platform Integration",
      description: "Connect your CodeChef, LeetCode, and CodeForces accounts for centralized tracking and analysis."
    },
    {
      icon: <AlertCircle className="h-6 w-6 text-blue-500" />,
      title: "Contest Preparation",
      description: "Get personalized recommendations for problems to solve based on your skill level and upcoming contests."
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Navigation */}
      <nav className={`fixed w-full z-10 transition-all duration-300 ${isScrolled ? 'bg-white dark:bg-gray-900 shadow-md' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">CPier</span>
              </div>
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-4">
                  <a href="#" className="text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md font-medium">Home</a>
                  <a href="#features" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md font-medium">Features</a>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <a href="/login" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium">Login</a>
              <a href="/signup" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors duration-300">Sign Up</a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <motion.div
        className="pt-32 pb-12 md:pt-40 md:pb-20"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.h1
              className="text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white sm:text-5xl md:text-6xl"
              variants={itemVariants}
            >
              <span className="block">Elevate Your</span>
              <span className="block text-blue-600 dark:text-blue-400">Competitive Coding</span>
            </motion.h1>
            <motion.p
              className="mt-3 max-w-md mx-auto text-base text-gray-500 dark:text-gray-400 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl"
              variants={itemVariants}
            >
              CPier unifies your competitive coding profiles, tracks your progress, and keeps you updated on all upcoming contests across platforms - all in one place.
            </motion.p>
            <motion.div
              className="mt-8 sm:flex sm:justify-center"
              variants={itemVariants}
            >
              <div className="rounded-md shadow">
                <a href="/signup" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10 transition-colors duration-300">
                  Get Started Free
                </a>
              </div>
              <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
                <a href="#features" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-gray-50 dark:text-blue-400 dark:bg-gray-800 dark:hover:bg-gray-700 md:py-4 md:text-lg md:px-10 transition-colors duration-300">
                  Explore Features
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Features Section */}
      <section id="features" className="py-12 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
              Your Complete Competitive Coding Companion
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-400">
              All the tools you need to excel in coding competitions and track your progress.
            </p>
          </div>

          <div className="mt-16 justify-items-center">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className="relative p-6 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 w-full max-w-sm"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="absolute -top-3 -left-3 p-3 bg-white dark:bg-gray-800 rounded-full shadow-md justify-center items-center flex">
                    {feature.icon}
                  </div>
                  <h3 className="mt-8 text-lg font-medium text-gray-900 dark:text-white">{feature.title}</h3>
                  <p className="mt-2 text-base text-gray-500 dark:text-gray-400">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="bg-blue-700 rounded-lg shadow-xl overflow-hidden"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <div className="px-6 py-12 md:py-16 md:px-12 lg:flex lg:items-center lg:justify-between">
              <div>
                <h2 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                  Ready to supercharge your competitive coding journey?
                </h2>
                <p className="mt-4 max-w-3xl text-lg text-blue-100">
                  Join thousands of coders who use CPier to track their progress, prepare for contests, and improve their skills.
                </p>
              </div>
              <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
                <div className="inline-flex rounded-md shadow">
                  <a href="/signup" className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 transition-colors duration-300">
                    Start Free Trial
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Product</h3>
              <ul className="space-y-2">
                <li><a href="#features" className="hover:text-blue-400 transition-colors duration-300">Features</a></li>
                <li><a href="#contests" className="hover:text-blue-400 transition-colors duration-300">Contests</a></li>
                <li><a href="#dashboard" className="hover:text-blue-400 transition-colors duration-300">Dashboard</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors duration-300">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-blue-400 transition-colors duration-300">Documentation</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors duration-300">Tutorials</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors duration-300">API Reference</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors duration-300">Community</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-blue-400 transition-colors duration-300">About Us</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors duration-300">Blog</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors duration-300">Careers</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors duration-300">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-blue-400 transition-colors duration-300">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors duration-300">Terms of Service</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors duration-300">Security</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-700 flex flex-col md:flex-row items-center justify-between">
            <p>© 2025 CPier. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-300">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-300">
                <span className="sr-only">GitHub</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-300">
                <span className="sr-only">Discord</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}