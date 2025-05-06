import { useState, useEffect } from 'react';
import { useUserProfile } from '../context/UserProfileContext';
import { CalendarDaysIcon, ArrowPathIcon, CheckIcon } from '@heroicons/react/24/outline';

// Helper function to generate unique contest ID
const getContestId = (contest) => {
  return `${contest.title}-${contest.startTime}-${contest.platform}`;
};

// Local storage helper functions
const getStoredContests = () => {
  try {
    const stored = localStorage.getItem('addedContests');
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
};

const storeContests = (contests) => {
  localStorage.setItem('addedContests', JSON.stringify(contests));
};

export default function GoogleCalendarButton({ contest }) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const { profileData } = useUserProfile();
  
  // Use object with contest IDs as keys for better performance
  const [addedContests, setAddedContests] = useState(getStoredContests);
  
  const contestId = getContestId(contest);
  const isAdded = addedContests[contestId] || false;

  // Sync with localStorage
  useEffect(() => {
    storeContests(addedContests);
  }, [addedContests]);

  useEffect(() => {
    const handleMessage = ({ data }) => {
      if (data.type === 'CALENDAR_SUCCESS' && data.contestId === contestId) {
        setAddedContests(prev => ({ ...prev, [contestId]: true }));
        setStatus({ type: 'success', message: 'Added to Google Calendar!' });
        setLoading(false);
      }
      if (data.type === 'CALENDAR_ERROR' && data.contestId === contestId) {
        setStatus({ type: 'error', message: data.error || 'Failed to add event' });
        setLoading(false);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [contestId]);

  const handleAddToCalendar = async () => {
    if (isAdded) return;

    if (!profileData?.email) {
      setStatus({ type: 'error', message: 'Please login to set reminders' });
      return;
    }

    const validationError = validateContestTimes(contest);
    if (validationError) {
      setStatus({ type: 'error', message: validationError });
      return;
    }

    setLoading(true);
    setStatus(null);

    try {
      const contestData = btoa(JSON.stringify({
        title: contest.title,
        startTime: new Date(contest.startTime).toISOString(),
        endTime: new Date(contest.endTime).toISOString(),
        platform: contest.platform,
        url: contest.url,
        duration: contest.duration,
        contestId // Include contest ID in the data
      }));

      const authWindow = window.open(
        `/api/calendar/auth/google?contest=${contestData}`,
        'GoogleAuth',
        'width=500,height=600'
      );

      const checkAuth = setInterval(() => {
        if (authWindow?.closed) {
          clearInterval(checkAuth);
          setLoading(false);
        }
      }, 500);
    } catch (error) {
      setStatus({ type: 'error', message: 'Connection failed' });
      setLoading(false);
    }
  };

  return (
    <div className="mt-2">
      <button
        onClick={handleAddToCalendar}
        disabled={loading || isAdded}
        className={`flex items-center gap-2 px-3 py-1.5 text-sm rounded-md transition-colors ${
          isAdded 
            ? 'bg-green-600 text-white cursor-default'
            : 'bg-blue-600 hover:bg-blue-700 text-white'
        } ${loading ? 'opacity-50' : ''}`}
      >
        {loading ? (
          <ArrowPathIcon className="w-4 h-4 animate-spin" />
        ) : isAdded ? (
          <CheckIcon className="w-4 h-4" />
        ) : (
          <CalendarDaysIcon className="w-4 h-4" />
        )}
        {loading ? 'Adding...' : isAdded ? 'Added' : 'Add to Calendar'}
      </button>

      {status && !isAdded && (
        <div className={`mt-1 text-xs ${status.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
          {status.message}
        </div>
      )}
    </div>
  );
}

// Validation helper
function validateContestTimes(contest) {
  if (!contest.startTime || !contest.endTime) {
    return 'Invalid contest times';
  }
  
  const start = new Date(contest.startTime);
  const end = new Date(contest.endTime);
  
  if (isNaN(start) || isNaN(end)) {
    return 'Invalid date format';
  }
  
  if (start >= end) {
    return 'End time must be after start time';
  }
  
  return null;
}