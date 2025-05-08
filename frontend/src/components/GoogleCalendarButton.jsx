import { useState, useEffect } from 'react';
import { useUserProfile } from '../context/UserProfileContext';
import { CalendarDaysIcon, ArrowPathIcon, CheckIcon, TrashIcon } from '@heroicons/react/24/outline';
import { UserAuth } from '../context/AuthContext';

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
  }, [contestId, session?.access_token]);

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
        const authWindow = window.open(
          data.authUrl,
          'GoogleAuth',
          'width=500,height=600'
        );

        const checkAuth = setInterval(() => {
          if (authWindow?.closed) {
            clearInterval(checkAuth);
            checkAddedStatus();
            setLoading(false);
          }
        }, 500);

        setIsAdded(true);
        setGoogleEventId(data.eventId);
        setStatus({ type: 'success', message: 'Added to calendar' });
        setLoading(false);
      }
    } catch (error) {
      setStatus({ type: 'error', message: error.message });
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
      setStatus({ type: 'error', message: error.message });
    } finally {
      setRemoveLoading(false);
    }
  };

  return (
    <div className="mt-2 flex gap-2">
      {isAdded ? (
        <button
          onClick={handleRemoveFromCalendar}
          disabled={removeLoading}
          className={`flex items-center gap-2 px-3 py-1.5 text-sm rounded-md transition-colors bg-red-600 hover:bg-red-700 text-white ${removeLoading ? 'opacity-50' : ''
            }`}
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
          className={`flex items-center gap-2 px-3 py-1.5 text-sm rounded-md transition-colors ${loading ? 'opacity-50' : ''
            } ${isAdded
              ? 'bg-green-600 text-white cursor-default'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
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
      )}

      {status && (
        <div className={`mt-1 text-xs ${status.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
          {status.message}
        </div>
      )}
    </div>
  );
}

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