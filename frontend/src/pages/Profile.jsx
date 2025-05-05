import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Code, Cpu, HardDrive, User, Mail, Check, X, Save, Edit, LogOut } from 'lucide-react';
import { UserAuth } from '../context/AuthContext';
import Header from '../components/Header';

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

export default function Profile() {
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    codeforces_username: '',
    codechef_username: '',
    leetcode_username: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [editableFields, setEditableFields] = useState({
    name: false,
    email: false,
    codeforces_username: false,
    codechef_username: false,
    leetcode_username: false,
  });
  const { session, signOut } = UserAuth();

  useEffect(() => {
    const fetchProfile = async () => {
      if (!session?.user) return;

      try {
        setIsLoading(true);
        const response = await fetch(`/api/users/${session.user.id}`, {
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
          },
        });

        if (!response.ok) throw new Error('Failed to fetch profile');

        const responseData = await response.json();
        const data = Array.isArray(responseData) ? responseData[0] : responseData;
        setProfileData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [session]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const toggleEdit = (field) => {
    setEditableFields(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(`/api/users/${session.user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(profileData),
      });

      if (!response.ok) throw new Error('Failed to update profile');

      setSuccess('Profile updated successfully!');
      // Disable all edit modes after save
      setEditableFields({
        name: false,
        email: false,
        codeforces_username: false,
        codechef_username: false,
        leetcode_username: false,
      });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <Header/>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex flex-col py- sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="text-center">
            <motion.h2
              className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              My Profile
            </motion.h2>
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
                  <div className="flex items-center">
                    <X className="h-5 w-5 mr-2" />
                    {error}
                  </div>
                </motion.div>
              )}
              {success && (
                <motion.div
                  className="mb-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 px-4 py-3 rounded-md"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="flex items-center">
                    <Check className="h-5 w-5 mr-2" />
                    {success}
                  </div>
                </motion.div>
              )}

              <motion.form className="space-y-6" onSubmit={handleSave} variants={containerVariants}>
                {/* Full Name */}
                <motion.div variants={itemVariants}>
                  <div className="flex justify-between items-center">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Full Name
                    </label>
                    <button
                      type="button"
                      onClick={() => toggleEdit('name')}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={profileData.name}
                      onChange={handleChange}
                      readOnly={!editableFields.name}
                      className={`block w-full pl-10 pr-3 py-2 border rounded-md ${editableFields.name ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'} sm:text-sm`}
                    />
                  </div>
                </motion.div>

                {/* Email */}
                <motion.div variants={itemVariants}>
                  <div className="flex justify-between items-center">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Email
                    </label>
                    <button
                      type="button"
                      onClick={() => toggleEdit('email')}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={profileData.email}
                      onChange={handleChange}
                      readOnly={!editableFields.email}
                      className={`block w-full pl-10 pr-3 py-2 border rounded-md ${editableFields.email ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'} sm:text-sm`}
                    />
                  </div>
                </motion.div>

                {/* CP Handles */}
                <motion.div variants={itemVariants}>
                  {[
                    { id: 'codeforces_username', icon: Code, label: 'Codeforces Username' },
                    { id: 'codechef_username', icon: Cpu, label: 'CodeChef Username' },
                    { id: 'leetcode_username', icon: HardDrive, label: 'LeetCode Username' },
                  ].map(({ id, icon: Icon, label }) => (
                    <div className="mb-4" key={id}>
                      <div className="flex justify-between items-center">
                        <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          {label}
                        </label>
                        <button
                          type="button"
                          onClick={() => toggleEdit(id)}
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Icon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          id={id}
                          name={id}
                          type="text"
                          value={profileData[id]}
                          onChange={handleChange}
                          readOnly={!editableFields[id]}
                          className={`block w-full pl-10 pr-3 py-2 border rounded-md ${editableFields[id] ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'} sm:text-sm`}
                          placeholder={`${label} username`}
                        />
                      </div>
                    </div>
                  ))}
                </motion.div>

                {/* Action Buttons */}
                <motion.div 
                  variants={itemVariants} 
                  className="flex justify-between items-center pt-4"
                >
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </button>
                </motion.div>
              </motion.form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}