import { Tooltip } from 'react-tooltip';
import { format, eachDayOfInterval, subMonths, startOfMonth } from 'date-fns';
import { motion } from 'framer-motion';

const CalendarHeatmap = ({ submissionCalendar }) => {
  const startDate = subMonths(new Date(), 6);
  const endDate = new Date();
  const allDays = eachDayOfInterval({ start: startDate, end: endDate });
  
  // Group days by month for labels
  const months = [];
  let currentMonth = null;
  
  allDays.forEach(day => {
    const monthStart = startOfMonth(day);
    if (!currentMonth || monthStart.getTime() !== currentMonth.date.getTime()) {
      currentMonth = {
        date: monthStart,
        label: format(monthStart, 'MMM yyyy'),
        position: months.length
      };
      months.push(currentMonth);
    }
  });

  // Get week numbers for alignment
  const weeks = [];
  for (let i = 0; i < allDays.length; i += 7) {
    weeks.push(allDays.slice(i, i + 7));
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass p-6 rounded-2xl relative"
    >
      <h3 className="text-xl font-semibold mb-6 text-orange-400">6-Month Activity</h3>
      
      {/* Month labels */}
      <div className="flex gap-1 mb-2 ml-8">
        {months.map((month, idx) => (
          <div
            key={month.date}
            className="text-xs text-gray-400 font-medium"
            style={{ 
              width: `${(weeks.length / months.length) * 100}%`,
              minWidth: '60px'
            }}
          >
            {month.label}
          </div>
        ))}
      </div>

      <div className="overflow-x-auto pb-4">
        <div className="flex gap-1">
          {weeks.map((week, weekIndex) => {
            const weekStartMonth = startOfMonth(week[0]);
            const showMonthLabel = months.some(m => 
              m.date.getTime() === weekStartMonth.getTime() && 
              week.some(day => day.getDate() === 1)
            );

            return (
              <div key={weekIndex} className="flex flex-col gap-1 relative">
                {showMonthLabel && (
                  <div className="absolute -top-6 left-0 text-xs text-gray-400">
                    {format(weekStartMonth, 'MMM')}
                  </div>
                )}
                {week.map((day, dayIndex) => {
                  const dateString = format(day, 'yyyy-MM-dd');
                  const count = submissionCalendar[dateString] || 0;
                  
                  return (
                    <div
                      key={dateString}
                      data-tooltip-id="heatmap-tooltip"
                      data-tooltip-content={`${format(day, 'MMM dd, yyyy')} - ${count} submission${count !== 1 ? 's' : ''}`}
                      className={`h-4 w-4 rounded-sm transition-all ${
                        count === 0 ? 'bg-slate-800' : 
                        count < 3 ? 'bg-green-600' : 
                        count < 5 ? 'bg-green-400' : 'bg-green-300'
                      } hover:scale-110 cursor-pointer`}
                    />
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      <Tooltip
        id="heatmap-tooltip"
        className="!bg-slate-800 !text-white !rounded-lg !px-3 !py-2 !text-sm"
        place="top"
      />
      
      {/* Day labels */}
      <div className="absolute left-2 top-16 flex flex-col gap-1 text-xs text-gray-400">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, i) => (
          <div key={day} className="h-4 flex items-center">
            {i % 2 === 0 && day}
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default CalendarHeatmap;