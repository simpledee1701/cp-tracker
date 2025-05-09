import { useState, useEffect } from 'react';
import { useUserProfile } from '../context/UserProfileContext';
import { UserAuth } from '../context/AuthContext';
import {
  CalendarDaysIcon,
  ArrowPathIcon,
  CheckIcon,
  TrashIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const getContestId = (contest) => {
  return `${contest.title}-${contest.startTime}-${contest.platform}`;
};

export default function GoogleCalendarButton({ contest }) {
  const [loading, setLoading] = useState(false);
  const [removeLoading, setRemoveLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [isAdded, setIsAdded] = useState(false);
  const [googleEventId, setGoogleEventId] = useState(null);
  const { profileData } = useUserProfile();
  const { session } = UserAuth();
  const contestId = getContestId(contest);

  const checkAddedStatus = async () => {
    if (!session?.access_token) {
      setIsAdded(false);
      return;
    }

    try {
      const response = await fetch(`/api/calendar/check?contestId=${encodeURIComponent(contestId)}`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });

      if (!response.ok) throw new Error('Failed to check status');

      const data = await response.json();
      setIsAdded(data.isAdded);
      setGoogleEventId(data.googleEventId || null);
    } catch (error) {
      console.error('Error checking contest status:', error);
      setIsAdded(false);
    }
  };

  useEffect(() => {
    checkAddedStatus();

    const handleMessage = (event) => {
      if (event.data.type === 'CALENDAR_SUCCESS' && event.data.contestId === contestId) {
        setIsAdded(true);
        setGoogleEventId(event.data.googleEventId);
        setStatus({ type: 'success', message: 'Successfully added to Google Calendar' });
        setLoading(false);
      } else if (event.data.type === 'CALENDAR_ERROR' && event.data.contestId === contestId) {
        setStatus({ 
          type: 'error', 
          message: event.data.error || 'Failed to add to calendar' 
        });
        setLoading(false);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [contestId, session?.access_token]);

  const validateContest = () => {
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
  };

  const handleAddToCalendar = async () => {
    if (isAdded) return;

    if (!profileData?.email) {
      setStatus({ type: 'error', message: 'Please login to set reminders' });
      return;
    }

    const validationError = validateContest();
    if (validationError) {
      setStatus({ type: 'error', message: validationError });
      return;
    }

    setLoading(true);
    setStatus(null);

    try {
      const response = await fetch('/api/calendar/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          contest: {
            title: contest.title,
            startTime: new Date(contest.startTime).toISOString(),
            endTime: new Date(contest.endTime).toISOString(),
            platform: contest.platform,
            url: contest.url,
            duration: contest.duration,
            contestId
          }
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to add to calendar');
      }

      if (data.authUrl) {
        // Open auth window centered on screen
        const width = 500;
        const height = 600;
        const left = (window.innerWidth - width) / 2;
        const top = (window.innerHeight - height) / 2;
        
        window.open(
          data.authUrl,
          'GoogleAuth',
          `width=${width},height=${height},left=${left},top=${top}`
        );
      } else if (data.eventId) {
        // Direct addition was successful
        setIsAdded(true);
        setGoogleEventId(data.eventId);
        setStatus({ type: 'success', message: 'Added to calendar' });
      }
    } catch (error) {
      setStatus({ 
        type: 'error', 
        message: error.message,
        showRetry: true 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromCalendar = async () => {
    if (!isAdded || !googleEventId) return;

    setRemoveLoading(true);
    setStatus(null);

    try {
      const response = await fetch('/api/calendar/remove', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          contestId,
          googleEventId
        })
      });

      if (!response.ok) {
        throw new Error('Failed to remove from calendar');
      }

      setIsAdded(false);
      setGoogleEventId(null);
      setStatus({ type: 'success', message: 'Removed from calendar' });
    } catch (error) {
      setStatus({ 
        type: 'error', 
        message: error.message,
        showRetry: true 
      });
    } finally {
      setRemoveLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        {isAdded ? (
          <button
            onClick={handleRemoveFromCalendar}
            disabled={removeLoading}
            className={`mt-2 flex items-center gap-2 px-3 py-1.5 text-sm rounded-md transition-colors ${
              removeLoading ? 'bg-red-700' : 'bg-red-600 hover:bg-red-700'
            } text-white`}
            aria-label="Remove from Google Calendar"
          >
            {removeLoading ? (
              <ArrowPathIcon className="w-4 h-4 animate-spin" />
            ) : (
              <TrashIcon className="w-4 h-4" />
            )}
            {removeLoading ? 'Removing...' : 'Remove'}
          </button>
        ) : (
          <button
            onClick={handleAddToCalendar}
            disabled={loading}
            className={`mt-2 flex items-center gap-2 px-3 py-1.5 text-sm rounded-md transition-colors ${
              loading ? 'bg-blue-700' : 'bg-blue-600 hover:bg-blue-700'
            } text-white`}
            aria-label="Add to Google Calendar"
          >
            {loading ? (
              <ArrowPathIcon className="w-4 h-4 animate-spin" />
            ) : (
              <CalendarDaysIcon className="w-4 h-4" />
            )}
            {loading ? 'Adding...' : 'Add to Calendar'}
          </button>
        )}
      </div>

      {status && (
        <div className={`flex items-start gap-1 text-sm ${
          status.type === 'success' ? 'text-green-600' : 'text-red-600'
        }`}>
          {status.type === 'error' && (
            <ExclamationTriangleIcon className="w-4 h-4 mt-0.5 flex-shrink-0" />
          )}
          <div>
            {status.message}
            {status.showRetry && (
              <button 
                onClick={isAdded ? handleRemoveFromCalendar : handleAddToCalendar}
                className="ml-2 underline hover:no-underline"
              >
                Try again
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}