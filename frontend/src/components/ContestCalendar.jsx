import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarIcon } from '@heroicons/react/24/outline'; // Optional, if you're using Heroicons


const ContestCalendar = ({ contests }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  // Process contests into calendar events
  const calendarEvents = useMemo(() => {
    const events = {};
    contests.forEach(contest => {
      const date = new Date(contest.startTime);
      const day = date.getDate();
      events[day] = events[day] || [];
      events[day].push(contest);
    });
    return events;
  }, [contests]);

  // Generate calendar days for current month
  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  ).getDate();

  const calendarDays = Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;
    const hasEvents = calendarEvents[day];
    const isToday = day === new Date().getDate() && 
                   currentMonth.getMonth() === new Date().getMonth();

    return (
      <motion.div
        key={day}
        className={`relative aspect-square p-1 text-sm cursor-pointer
          ${isToday ? 'bg-purple-500/20' : ''}
          ${hasEvents ? 'hover:bg-purple-500/20' : 'opacity-50'}`}
        whileHover={{ scale: 1.05 }}
        onClick={() => hasEvents && setSelectedDate(day)}
      >
        <div className={`text-center ${hasEvents ? 'text-white' : 'text-gray-400'}`}>
          {day}
        </div>
        {hasEvents && (
          <div className="absolute bottom-1 left-0 right-0 flex justify-center gap-1">
            {calendarEvents[day].map((_, i) => (
              <div key={i} className="w-1 h-1 bg-purple-500 rounded-full" />
            ))}
          </div>
        )}
      </motion.div>
    );
  });

  return (
    <motion.div className="bg-black/30 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-xl">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <CalendarIcon className="w-6 h-6 text-purple-400" />
          Contest Calendar
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentMonth(prev => new Date(prev.setMonth(prev.getMonth() - 1)))}
            className="p-1 hover:bg-white/10 rounded"
          >
            
          </button>
          <button
            onClick={() => setCurrentMonth(prev => new Date(prev.setMonth(prev.getMonth() + 1)))}
            className="p-1 hover:bg-white/10 rounded"
          >
            
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-xs text-gray-400 p-1">
            {day}
          </div>
        ))}
        {calendarDays}
      </div>

      {/* Date Detail Modal */}
      <AnimatePresence>
        {selectedDate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center"
            onClick={() => setSelectedDate(null)}
          >
            <motion.div
              className="bg-gray-800 p-6 rounded-xl w-3/4 "
              onClick={e => e.stopPropagation()}
              initial={{ y: 20 }}
              animate={{ y: 0 }}
            >
              <h3 className="text-xl font-semibold mb-4">
                Contests on {selectedDate} {currentMonth.toLocaleString('default', { month: 'long' })}
              </h3>
              <div className="space-y-2">
                {calendarEvents[selectedDate].map(contest => (
                  <div key={contest.id} className="p-3 bg-gray-700/50 rounded-lg">
                    <div className="font-medium">{contest.title}</div>
                    <div className="text-sm text-gray-400">
                      {new Date(contest.startTime).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
  
  export default ContestCalendar;